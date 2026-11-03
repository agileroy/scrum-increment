// Mode collectif : écran du formateur (projeté) et écrans des participants (téléphones).
// Chargé à la demande (création ou arrivée dans une salle) : le jeu seul ne charge ni la base ni le QR code.
// Le jeu d'une équipe réutilise les écrans du solo (ui.js) ; l'écran du formateur reste neutre :
// aucun mot propre à une approche, aucune donnée de jeu des équipes avant la révélation.

import { ui } from './ui.js?v=__VERSION__';
import { firebaseConfig } from './firebase-config.js?v=__VERSION__';
import { createRoomStore, teamState, teamsPreparing } from './room-store.js?v=__VERSION__';
import {
  MAX_TEAMS, MIN_TEAMS, TIMER_CHOICES, isValidCode, normalizeCode, teamName, teamMode, teamNumbers, teamMembers,
  isConnected, isReady, canBeReady, planReady, timeLeft, formatSeconds,
} from './room-core.js?v=__VERSION__';
import { MODES, reportFromState, finishSummary, roundResults, periodWeeks, decisionTrail } from './game-core.js?v=__VERSION__';
import { lexicon, trailText, trailPeriod, STORY } from './vocabulary.js?v=__VERSION__';
import { PLANNED_SPRINTS, HORIZON_WEEKS } from './scenario.js?v=__VERSION__';
import { formatEuro } from './chart.js?v=__VERSION__';

const { app, $, esc, plural } = ui;
const NAME_KEY = 'scrum-increment.name';
const SEEN_KEY = 'scrum-increment.seen';
const OFFLINE_MESSAGE = 'Service temps réel injoignable : vérifiez votre connexion et rechargez la page. Le jeu seul reste disponible.';
const APPROACH = {
  [MODES.cascade]: { short: 'projet', long: 'projet, une livraison à la fin' },
  [MODES.increment]: { short: 'Scrum', long: 'Scrum, un incrément à chaque Sprint' },
};

const DEBRIEF_TEAMS = [
  'À quel moment la boulangerie a-t-elle gagné son premier euro dans chaque équipe ? Qu\'est-ce qui l\'a permis ?',
  'Pourquoi le Scrum Guide demande-t-il qu\'un Increment soit utilisable ? Que se passe-t-il quand il ne l\'est pas ?',
  'Équipes Scrum : qu\'ont appris vos Sprint Reviews ? Comment ont-elles changé l\'ordre du Product Backlog ?',
  'Quand la banque a coupé le prêt, que restait-il entre les mains de chaque équipe ?',
  'Équipes projet : si la banque vous avait prévenus deux COPIL plus tôt, qu\'auriez-vous fait ? Équipes Scrum : qu\'est-ce que ça aurait changé pour vous ?',
  'Quelles fonctionnalités Madame Lefèvre jugeait-elle indispensables ? Qu\'en pensaient vraiment ses clients ?',
  'Face aux demandes de Mme Lefèvre, les équipes projet ont décidé sur des opinions, les équipes Scrum avec des retours clients. Qu\'est-ce que ça change ?',
  'Vous ne parliez pas la même langue : COPIL et cahier des charges d\'un côté, Sprint Review et Product Backlog de l\'autre. Qu\'est-ce que le vocabulaire a changé dans votre façon de décider ?',
  'Comment votre équipe a-t-elle décidé ensemble, à plusieurs téléphones ?',
];

/* ---------------------------------------------------------------- Outils */

function readStored(key, fallback = null) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function writeStored(key, value) {
  try { localStorage.setItem(key, value); } catch { /* stockage indisponible */ }
}

function loadScript(src) {
  return new Promise((resolve) => {
    if (window.qrcode) { resolve(); return; }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.append(script);
  });
}

function qrSvg(url, label) {
  try {
    const qr = window.qrcode(0, 'M');
    qr.addData(url);
    qr.make();
    return qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true, alt: `QR code : ${label}` });
  } catch {
    return '';
  }
}

async function createDb() {
  if (new URLSearchParams(location.search).has('demo')) {
    const { createDemoDb } = await import('./memory-db.js?v=__VERSION__');
    return createDemoDb();
  }
  const { createFirebaseDb } = await import('./firebase-db.js?v=__VERSION__');
  return createFirebaseDb(firebaseConfig);
}

/** Base injoignable (SDK Firebase non chargé) : le jeu seul reste disponible. */
const unreachableDb = {
  TIMESTAMP: null,
  uid: null,
  start: () => Promise.reject(new Error('Service temps réel injoignable')),
  serverNow: () => Date.now(),
  onConnection: () => () => {},
};

/** Boîte de confirmation ; renvoie true si l'utilisateur confirme. */
function confirmAction(title, message, okLabel) {
  const dialog = $('confirm-dialog');
  $('confirm-title').textContent = title;
  $('confirm-text').textContent = message;
  $('confirm-ok').textContent = okLabel;
  return new Promise((resolve) => {
    dialog.addEventListener('close', () => resolve(dialog.returnValue === 'ok'), { once: true });
    dialog.returnValue = 'cancel';
    dialog.showModal();
  });
}

const listNames = (names) => (names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} et ${names.at(-1)}`);

/* ---------------------------------------------------------------- Démarrage */

export async function startRoomMode() {
  const params = new URLSearchParams(location.search);
  const qrReady = loadScript(`vendor/qrcode-generator-1.4.4.js?v=__VERSION__`);
  const db = await createDb().catch((error) => { console.error(error); return unreachableDb; });
  const store = createRoomStore(db);
  let offline = false;
  try {
    await store.start();
  } catch (error) {
    console.error('Connexion refusée :', error?.code ?? error);
    offline = true;
  }
  const uid = store.uid;

  let code = null;
  let room = null;
  let roomLoaded = false;
  let stopWatching = null;
  let everConnected = false;
  let busy = false;
  let hostBusy = false;
  let deferredHost = false;
  let backstage = false;          // coulisses du formateur : fermées par défaut, à ne pas projeter
  let feed = [];                  // fil neutre de la salle : [{ at, text }]
  let seenRoom = null;            // dernier état observé, pour déduire le fil neutre
  const soloQuestions = $('debrief-questions').innerHTML;

  if (!offline) store.onConnection((connected) => {
    everConnected ||= connected;
    $('banner').hidden = connected || !everConnected;
    $('banner').textContent = 'Connexion perdue, reconnexion…';
  });

  function urlFor(roomCode) {
    const parts = [];
    if (params.has('demo')) parts.push('demo');
    if (roomCode) parts.push(`salle=${roomCode}`);
    return `${location.origin}${location.pathname}${parts.length ? `?${parts.join('&')}` : ''}`;
  }
  const baseLabel = (location.origin + location.pathname).replace(/^https?:\/\//, '').replace(/\/$/, '');

  /* ------------------------------------------------------------ Salle suivie */

  function watch(newCode) {
    stopWatching?.();
    code = newCode;
    room = null;
    roomLoaded = false;
    stopWatching = store.watchRoom(code, (value) => {
      room = value;
      roomLoaded = true;
      render();
    });
  }

  function leave(message = '') {
    stopWatching?.();
    stopWatching = null;
    store.closePresence();
    code = null;
    room = null;
    roomLoaded = false;
    resetSession();
    history.replaceState(null, '', urlFor(null));
    showHome(message);
  }

  function resetSession() {
    app.session = null;
    app.onIdle = null;
    ui.closeDialog();
    $('room-chip').hidden = true;
    $('me-name').hidden = true;
    $('timer-chip').hidden = true;
    $('replay').hidden = false;
    $('debrief-questions').innerHTML = soloQuestions;
    $('decisions').hidden = true;
    backstage = false;
    feed = [];
    seenRoom = null;
    document.body.dataset.mode = 'solo';
  }

  // « Jouer seul » quitte la salle suivie (sans la supprimer).
  $('start').addEventListener('click', () => { if (code) leave(); }, true);
  $('replay').addEventListener('click', () => { if (code) leave(); });

  /* ------------------------------------------------------------ Accueil */

  function showHome(error = '') {
    ui.show('home');
    const known = Boolean(code);
    $('code-field').hidden = known;
    $('join-room').hidden = !known;
    $('join-room').textContent = known ? `Salle ${code}` : '';
    if (known) $('code-input').value = code;
    $('join-error').textContent = error;
  }

  async function create() {
    if (offline) { $('create-error').textContent = OFFLINE_MESSAGE; return; }
    if (busy) return;
    busy = true;
    $('create-room').disabled = true;
    $('create-error').textContent = '';
    try {
      const newCode = await store.createRoom();
      history.replaceState(null, '', urlFor(newCode));
      watch(newCode);
    } catch (error) {
      console.error(error);
      $('create-error').textContent = 'Impossible de créer la partie. Réessayez.';
    } finally {
      busy = false;
      $('create-room').disabled = false;
    }
  }

  async function join() {
    if (offline) { $('join-error').textContent = OFFLINE_MESSAGE; return; }
    if (busy) return;
    const joinCode = code ?? normalizeCode($('code-input').value);
    const name = $('name-input').value;
    busy = true;
    $('join-submit').disabled = true;
    $('join-error').textContent = '';
    try {
      const error = await store.join(joinCode, name);
      if (error) {
        $('join-error').textContent = error;
        if (error.startsWith('Aucune partie') && code) leave(error);
        return;
      }
      writeStored(NAME_KEY, name.trim());
      if (joinCode !== code || !stopWatching) {
        history.replaceState(null, '', urlFor(joinCode));
        watch(joinCode);
      } else {
        render();
      }
    } finally {
      busy = false;
      $('join-submit').disabled = false;
    }
  }

  /* ------------------------------------------------------------ Rendu principal */

  function role() {
    if (!room?.meta) return 'none';
    if (room.meta.hostUid === uid) return 'host';
    const me = room.players?.[uid];
    if (me?.removed) return 'removed';
    if (me?.name) return 'player';
    return 'visitor';
  }

  function render() {
    if (!code || !roomLoaded) return;
    const who = role();
    document.body.dataset.mode = 'room';
    if (who === 'none') { leave('Aucune partie avec ce code. Elle a peut-être été supprimée.'); return; }
    $('room-chip').hidden = false;
    $('room-chip').textContent = `Salle ${code}`;
    $('me-name').hidden = who !== 'player';
    $('me-name').textContent = who === 'player' ? room.players[uid].name : '';
    $('replay').hidden = false;
    $('replay').textContent = 'Retour à l\'accueil';
    renderTimer();
    if (who === 'host') { renderHost(); return; }
    if (who === 'removed') {
      store.closePresence();
      app.session = null;
      ui.closeDialog();
      showWait({ title: 'Vous avez été retiré de la partie', text: 'Le formateur vous a retiré de cette partie.' });
      return;
    }
    if (who === 'visitor') { app.session = null; showHome(); return; }
    store.openPresence(code);
    renderPlayer();
  }

  function showWait({ chip = '', title, text, extra = '' }) {
    $('wait-chip').hidden = !chip;
    $('wait-chip').textContent = chip;
    $('wait-title').textContent = title;
    $('wait-text').textContent = text;
    $('wait-text').hidden = !text;
    $('wait-extra').innerHTML = extra;
    ui.show('wait', { keepScroll: true });
  }

  /* ------------------------------------------------------------ Chrono */

  function renderTimer() {
    const chip = $('timer-chip');
    const meta = room?.meta;
    const left = meta?.status === 'playing' ? timeLeft(meta, store.serverNow()) : null;
    chip.hidden = left === null;
    if (left === null) return;
    const text = left > 0 ? `Réflexion : ${formatSeconds(left)}` : 'Temps écoulé';
    if (chip.textContent !== text) chip.textContent = text;
    chip.classList.toggle('is-over', left === 0);
    const big = $('host-timer');
    if (big && big.textContent !== text) { big.textContent = text; big.classList.toggle('is-over', left === 0); }
  }
  setInterval(renderTimer, 250);

  /* ------------------------------------------------------------ Formateur */

  function memberHtml([memberUid, p], n, teamCount, controls) {
    const online = isConnected(p);
    const move = controls && teamCount > 1
      ? `<label class="sr-only" for="move-${memberUid}">Équipe de ${esc(p.name)}</label><select id="move-${memberUid}" data-move-player="${memberUid}">${teamNumbers(teamCount).map((t) => `<option value="${t}" ${t === n ? 'selected' : ''}>${esc(teamName(t))}</option>`).join('')}</select>`
      : '';
    const remove = controls ? `<button type="button" class="link-button" data-remove-player="${memberUid}" aria-label="Retirer ${esc(p.name)}">Retirer</button>` : '';
    return `<li class="member ${online ? '' : 'is-offline'}"><span class="dot" aria-hidden="true"></span><span class="member-name">${esc(p.name)}</span><span class="sr-only">${online ? 'connecté' : 'déconnecté'}</span>${move}${remove}</li>`;
  }

  function teamCardHtml(n, members, teamCount, status = '') {
    const list = members.length
      ? `<ul class="members">${members.map((m) => memberHtml(m, n, teamCount, true)).join('')}</ul>`
      : '<p class="muted">Personne pour l\'instant.</p>';
    return `<section class="panel team-card team-tone-${n}"><div class="team-card-head"><h3>${esc(teamName(n))}</h3>${status}</div>${list}</section>`;
  }

  function segmented(name, options, current) {
    return `<div class="segmented" role="group">${options.map(([value, label]) => `<button type="button" data-${name}="${value}" aria-pressed="${value === current}">${esc(label)}</button>`).join('')}</div>`;
  }

  function renderHost() {
    app.session = null;
    updateFeed();
    const meta = room.meta;
    if (meta.status === 'revealed') { renderCollectiveResults(); return; }
    ui.show('host', { keepScroll: true });
    // Ne pas reconstruire l'écran pendant que le formateur choisit une équipe dans une liste.
    const active = document.activeElement;
    if (active?.tagName === 'SELECT' && $('host-body').contains(active)) { deferredHost = true; return; }
    deferredHost = false;
    const members = teamMembers(room);
    const count = meta.teamCount;
    const total = Object.values(members).reduce((sum, list) => sum + list.length, 0);
    const timerOptions = TIMER_CHOICES.map((s) => [s, s ? `${s / 60} min` : 'Sans']);
    let h = '';
    if (meta.status === 'lobby') {
      const url = urlFor(code);
      h += `<div class="host-join">
        <div><p class="muted">Pour rejoindre, ouvrez</p><p class="join-url">${esc(baseLabel)}</p><p class="muted">avec le code</p><p class="room-code">${esc(code)}</p></div>
        <div class="qr" id="host-qr">${qrSvg(url, `${baseLabel}, salle ${code}`)}</div>
      </div>`;
      h += `<section class="panel host-settings"><div class="setting"><span class="setting-label">Équipes</span>${segmented('teams', Array.from({ length: MAX_TEAMS - MIN_TEAMS + 1 }, (_, i) => [i + MIN_TEAMS, String(i + MIN_TEAMS)]), count)}</div>
        <div class="setting"><span class="setting-label">Chrono de réflexion</span>${segmented('timer', timerOptions, meta.timerSeconds ?? 0)}</div></section>`;
      h += `<div class="screen-head"><h2 class="title">${total ? plural(total, 'participant') : 'En attente des participants'}</h2></div>`;
      h += `<div class="team-grid">${teamNumbers(count).map((n) => teamCardHtml(n, members[n], count)).join('')}</div>`;
      const empty = teamNumbers(count).filter((n) => !members[n].length).map(teamName);
      h += `<div class="actions host-actions"><button type="button" class="button button-primary button-large" data-launch-game ${empty.length ? 'disabled' : ''}>Lancer la partie</button>`;
      h += `<button type="button" class="button button-ghost" data-delete-room>Supprimer la salle</button></div>`;
      if (empty.length) h += `<p class="hint">${empty.length > 1 ? `Les équipes ${esc(listNames(empty))} sont vides` : `L'équipe ${esc(empty[0])} est vide`} : attendez des participants ou réduisez le nombre d'équipes.</p>`;
    } else {
      const period = meta.period ?? 0;
      const ended = meta.status === 'ended';
      const next = period + 1;
      const [w1, w2] = periodWeeks(next);
      const preparing = teamsPreparing(room);
      h += '<div class="host-head">';
      h += ended
        ? '<div><h2 class="title">Fin du projet</h2><p class="lead">Les équipes découvrent la fin de leur projet sur leur téléphone.</p></div>'
        : `<div><h2 class="title">Période ${next} sur ${PLANNED_SPRINTS} · semaines ${w1} et ${w2}</h2></div>`;
      if (!ended) h += `<p class="host-timer" id="host-timer" ${meta.timerSeconds ? '' : 'hidden'}></p>`;
      h += '</div>';
      h += `<div class="team-grid">${teamNumbers(count).map((n) => {
        const team = room.teams?.[n];
        let status = '';
        if (!ended) {
          if (period === 0 && preparing.includes(n)) status = '<span class="chip">Prépare encore</span>';
          else status = isReady(team, period) ? '<span class="chip live">Prête</span>' : '<span class="chip">En réflexion</span>';
        }
        return teamCardHtml(n, members[n], count, status);
      }).join('')}</div>`;
      h += `<section class="panel room-feed" aria-labelledby="feed-title"><h3 id="feed-title">Fil de la salle</h3>${feed.length
        ? `<ul>${feed.slice(-5).reverse().map((f) => `<li><time>${esc(f.at)}</time> ${esc(f.text)}</li>`).join('')}</ul>`
        : '<p class="muted">Rien pour l\'instant.</p>'}</section>`;
      h += '<div class="actions host-actions">';
      if (ended) h += '<button type="button" class="button button-primary button-large" data-reveal>Révéler les résultats</button>';
      else h += `<button type="button" class="button button-primary button-large" data-launch-period ${preparing.length || hostBusy ? 'disabled' : ''}>Lancer la période ${next}</button>`;
      h += '<button type="button" class="button button-ghost" data-delete-room>Supprimer la salle</button></div>';
      if (!ended && preparing.length) h += `<p class="hint">${preparing.length > 1 ? `Les équipes ${esc(listNames(preparing.map(teamName)))} préparent encore.` : `L'équipe ${esc(teamName(preparing[0]))} prépare encore.`}</p>`;
      h += backstageHtml(count);
    }
    $('host-body').innerHTML = h;
    renderTimer();
    if (meta.status === 'lobby' && !$('host-qr').innerHTML) qrReady.then(() => { if ($('host-qr')) $('host-qr').innerHTML = qrSvg(urlFor(code), `${baseLabel}, salle ${code}`); });
  }

  /* Coulisses : le fil des décisions de chaque équipe, dans son vocabulaire (jamais de ventes). */
  function trailHtml(n) {
    const state = teamState(room, n);
    if (!state) return '<p class="muted">Pas encore de décision.</p>';
    const trail = decisionTrail(state).filter((p) => p.facts.length);
    if (!trail.length) return '<p class="muted">Pas encore de décision.</p>';
    return `<ol class="trail">${trail.slice().reverse().map((p) => `<li><strong>${esc(trailPeriod(state.mode, p.period))}</strong><ul>${p.facts.map((f) => `<li class="trail-${f.kind}">${esc(trailText(state.mode, f))}</li>`).join('')}</ul></li>`).join('')}</ol>`;
  }

  function backstageHtml(count) {
    let h = `<section class="backstage ${backstage ? 'is-open' : ''}">`;
    h += `<button type="button" class="button button-ghost backstage-toggle" data-backstage aria-expanded="${backstage}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.5"/>${backstage ? '' : '<path d="M4 4l16 16"/>'}</svg>
      ${backstage ? 'Fermer les coulisses' : 'Coulisses (à ne pas projeter)'}</button>`;
    if (backstage) {
      h += '<p class="hint backstage-warning">À ne pas projeter : les coulisses dévoilent la façon de travailler de chaque équipe. Elles se referment au lancement de la période.</p>';
      h += `<div class="team-grid">${teamNumbers(count).map((n) => `<section class="panel team-card team-tone-${n}"><div class="team-card-head"><h3>${esc(teamName(n))}</h3><span class="chip">${esc(APPROACH[teamMode(n)].short)}</span></div>${trailHtml(n)}</section>`).join('')}</div>`;
    }
    return `${h}</section>`;
  }

  /* Fil neutre de la salle, déduit des changements observés (aucun mot propre à une approche). */
  function updateFeed() {
    const prev = seenRoom;
    seenRoom = room;
    if (!prev?.meta || !room?.meta || prev.meta.status === 'lobby' && room.meta.status === 'lobby') return;
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const push = (text) => { feed.push({ at: now, text }); feed = feed.slice(-20); };
    if (prev.meta.status === 'lobby' && room.meta.status === 'playing') push('Partie lancée : réflexion de la période 1.');
    const period = room.meta.period ?? 0;
    if ((prev.meta.period ?? 0) < period) push(room.meta.status === 'ended' ? `Période ${period} lancée : fin du projet.` : `Période ${period} lancée pour toutes les équipes.`);
    else {
      for (const n of teamNumbers(room.meta.teamCount)) {
        const was = isReady(prev.teams?.[n], prev.meta.period ?? 0);
        const is = isReady(room.teams?.[n], period);
        if (!was && is) push(`${teamName(n)} est prête.`);
        if (was && !is && !room.teams?.[n]?.state?.pendingRequest) push(`${teamName(n)} n'est plus prête.`);
      }
    }
  }

  async function hostRun(task) {
    if (hostBusy) return;
    hostBusy = true;
    try { await task(); } catch (error) { console.error(error); } finally { hostBusy = false; render(); }
  }

  $('host-body').addEventListener('click', async (event) => {
    const t = event.target.closest('button');
    if (!t || t.disabled || !room) return;
    if (t.hasAttribute('data-backstage')) { backstage = !backstage; render(); return; }
    if (t.dataset.teams) hostRun(() => store.setTeamCount(code, room, Number(t.dataset.teams)));
    else if (t.dataset.timer !== undefined) hostRun(() => store.setTimer(code, Number(t.dataset.timer)));
    else if (t.dataset.removePlayer) {
      const name = room.players?.[t.dataset.removePlayer]?.name ?? 'ce participant';
      if (await confirmAction('Retirer un participant', `${name} ne pourra plus revenir dans la salle.`, 'Retirer')) {
        hostRun(() => store.removePlayer(code, t.dataset.removePlayer));
      }
    } else if (t.hasAttribute('data-launch-game')) hostRun(() => store.launchGame(code, room));
    else if (t.hasAttribute('data-launch-period')) {
      const period = room.meta.period ?? 0;
      const waiting = teamNumbers(room.meta.teamCount).filter((n) => !isReady(room.teams?.[n], period)).map(teamName);
      if (waiting.length) {
        const who = waiting.length > 1 ? `Les équipes ${listNames(waiting)} ne sont pas prêtes.` : `L'équipe ${waiting[0]} n'est pas prête.`;
        if (!await confirmAction(`Lancer la période ${period + 1} ?`, `${who} La période sera jouée pour toutes les équipes.`, 'Lancer quand même')) return;
      }
      backstage = false; // l'écran redevient neutre
      hostRun(() => store.launchPeriod(code, room));
    } else if (t.hasAttribute('data-reveal')) { backstage = false; hostRun(() => store.reveal(code)); }
    else if (t.hasAttribute('data-delete-room')) {
      if (await confirmAction('Supprimer la salle', 'La partie et ses résultats seront effacés pour tout le monde.', 'Supprimer')) {
        const old = code;
        leave();
        store.deleteRoom(old).catch((error) => console.error(error));
      }
    }
  });
  $('host-body').addEventListener('change', (event) => {
    const uidToMove = event.target.dataset.movePlayer;
    if (!uidToMove) return;
    event.target.blur();
    hostRun(() => store.movePlayer(code, uidToMove, Number(event.target.value)));
  });
  $('host-body').addEventListener('focusout', () => { if (deferredHost) setTimeout(render, 0); });

  /* ------------------------------------------------------------ Participant */

  // Ce que ce téléphone a déjà montré : dernier bilan, fin du projet, présentation du rôle.
  function seenFor(n) {
    try {
      const all = JSON.parse(readStored(SEEN_KEY, '{}'));
      const s = all[`${code}/${n}`];
      return { report: s?.report ?? 0, finish: Boolean(s?.finish), role: Boolean(s?.role) };
    } catch { return { report: 0, finish: false, role: false }; }
  }
  function markSeen(n, patch) {
    let all = {};
    try { all = JSON.parse(readStored(SEEN_KEY, '{}')); } catch { /* valeur illisible */ }
    for (const key of Object.keys(all)) if (!key.startsWith(`${code}/`)) delete all[key]; // une seule salle retenue
    all[`${code}/${n}`] = { ...seenFor(n), ...patch };
    writeStored(SEEN_KEY, JSON.stringify(all));
  }

  function myTeam() { return room.players[uid].team; }

  function teammatesHtml(n) {
    const members = teamMembers(room)[n] ?? [];
    return `<section class="panel team-card team-tone-${n}"><div class="team-card-head"><h3>Équipe ${esc(teamName(n))}</h3></div><ul class="members">${members.map(([memberUid, p]) => `<li class="member ${isConnected(p) ? '' : 'is-offline'}"><span class="dot" aria-hidden="true"></span><span class="member-name">${esc(p.name)}${memberUid === uid ? ' (vous)' : ''}</span></li>`).join('')}</ul></section>`;
  }

  function renderPlayer() {
    const meta = room.meta;
    const n = myTeam();
    const label = `Équipe ${teamName(n)}`;
    if (meta.status === 'revealed') { app.session = null; ui.closeDialog(); renderCollectiveResults(); return; }
    if (meta.status === 'lobby' || !room.teams?.[n]?.state) {
      app.session = null;
      // Le contexte, sans la façon de travailler : le formateur peut encore changer un participant d'équipe,
      // et la répartition des approches reste secrète jusqu'à la révélation.
      const story = `<div class="briefing wait-story"><p class="story">${esc(STORY)}</p>${ui.speechHtml('Ma seule question : quand est-ce que ça me rapporte ?')}<p class="muted">Le formateur va lancer la partie. Vous jouerez en équipe, chaque membre depuis son téléphone. Votre façon de travailler vous sera donnée au lancement.</p></div>`;
      showWait({ chip: label, title: `Bienvenue, ${room.players[uid].name}`, text: '', extra: story + teammatesHtml(n) });
      return;
    }
    // Un glisser-déposer en cours : la mise à jour attend la fin du geste.
    if (ui.isDragging()) { app.onIdle = render; return; }
    app.onIdle = null;
    const state = teamState(room, n);
    app.round = state;
    app.session = {
      label,
      commit: (fn) => store.teamAction(code, n, fn),
      renderBar: () => renderBar(n),
    };
    const seen = seenFor(n);

    // Écran de fond
    if (state.finished && seen.finish) {
      ui.closeDialog();
      const summary = finishSummary(state);
      showWait({
        chip: label,
        title: 'Le formateur va révéler les résultats',
        text: 'Votre projet est terminé. En attendant les autres équipes, voici où en est la boulangerie.',
        extra: `<div class="stats"><div class="stat"><strong>${formatEuro(summary.cumulative)}</strong><span>Ventes cumulées après ${HORIZON_WEEKS} semaines</span></div><div class="stat"><strong>${summary.liveCount}</strong><span>Fonctionnalités en ligne</span></div></div>`,
      });
      return;
    }
    if (state.mode === MODES.cascade && !state.planValidated) {
      ui.renderPlan();
      ui.show('plan', { keepScroll: true });
    } else if (state.mode === MODES.increment && !seen.role && state.sprint === 0) {
      $('role-chip').textContent = label;
      $('role-story').textContent = `${STORY} ${lexicon(MODES.increment).approach}`;
      ui.renderBoard();
      ui.show('role', { keepScroll: true });
    } else {
      ui.renderBoard();
      ui.show('board', { keepScroll: true });
    }

    // Fenêtres : bilan de la dernière période (une fois), fin du projet, demande de changement.
    // Après la fin du projet, l'état est avancé à la dernière période d'exploitation : le dernier bilan est celui de la coupure.
    const last = state.finished ? state.lastBuildSprint : state.sprint;
    const report = last > seen.report ? reportFromState(state, last) : null;
    if (report) {
      if (app.dialogKind !== 'report') {
        ui.closeDialog();
        ui.openDialog(ui.reportHtml(state, report, { team: true }), () => { markSeen(n, { report: last }); app.remove = []; render(); }, 'report');
      }
      return;
    }
    if (state.finished) {
      if (app.dialogKind !== 'finish') {
        ui.closeDialog();
        ui.openDialog(ui.finishHtml(state, finishSummary(state), 'Continuer'), () => { markSeen(n, { finish: true }); render(); }, 'finish');
      }
      return;
    }
    if (state.pendingRequest) {
      if (app.dialogKind === 'request') ui.refreshRequestDialog();
      else { ui.closeDialog(); app.remove = []; ui.openRequestDialog(); }
    } else if (app.dialogKind === 'request') {
      ui.closeDialog(); // tranchée par un autre membre
    }
  }

  function renderBar(n) {
    const meta = room.meta;
    const team = room.teams?.[n];
    const state = app.round;
    const period = meta.period ?? 0;
    const ready = isReady(team, period);
    const l = lexicon(state.mode);
    const button = $('team-ready');
    let status;
    if (state.finished || meta.status !== 'playing') {
      status = 'Fin du projet.';
      button.hidden = true;
    } else if (!planReady(state)) {
      status = 'Validez d\'abord le cahier des charges.';
      button.hidden = true;
    } else if (state.pendingRequest) {
      status = `Tranchez la demande de ${l.stakeholder}.`;
      button.hidden = true;
    } else {
      button.hidden = false;
      button.textContent = ready ? 'Nous ne sommes plus prêts' : 'Nous sommes prêts';
      button.classList.toggle('button-primary', !ready);
      button.classList.toggle('button-ghost', ready);
      button.dataset.ready = ready ? '1' : '';
      status = ready ? 'En attente du formateur.' : 'Préparez-vous, puis signalez que l\'équipe est prête.';
    }
    $('team-status').textContent = status;
    $('team-timer').hidden = true;
  }

  $('team-ready').addEventListener('click', () => {
    if (!room || !app.session) return;
    const n = myTeam();
    const ready = !$('team-ready').dataset.ready;
    if (ready && !canBeReady(app.round)) return;
    store.setReady(code, n, room, ready);
  });

  $('role-ok').addEventListener('click', () => {
    if (!room || !app.session) return;
    markSeen(myTeam(), { role: true });
    render();
  });

  /* ------------------------------------------------------------ Résultats collectifs */

  function renderCollectiveResults() {
    const columns = [];
    for (const n of teamNumbers(room.meta.teamCount)) {
      const state = teamState(room, n);
      if (!state?.finished) continue;
      const mode = teamMode(n);
      columns.push({
        kind: mode === MODES.cascade ? 1 : 2,
        team: n,
        label: `${teamName(n)} · ${APPROACH[mode].short}`,
        head: `${teamName(n)} · ${APPROACH[mode].short}`,
        results: roundResults(state),
      });
    }
    if (!columns.length) { showWait({ title: 'Résultats indisponibles', text: 'Aucune équipe n\'a terminé son projet.' }); return; }
    const intro = `<h3>Deux façons de travailler, sans que vous le sachiez</h3><ul class="approach-list">${columns.map((c) => `<li class="team-tone-${c.team}"><span class="swatch" aria-hidden="true"></span><strong>${esc(teamName(c.team))}</strong> : ${esc(APPROACH[teamMode(c.team)].long)}</li>`).join('')}</ul>`;
    // keepScroll : pas de retour en haut de page à chaque mise à jour de la salle
    ui.renderComparison(columns, { title: `Résultats : ${plural(columns.length, 'équipe')}, deux façons de travailler`, intro, keepScroll: true });
    $('debrief-questions').innerHTML = DEBRIEF_TEAMS.map((q) => `<li>${esc(q)}</li>`).join('');
    $('decisions').hidden = false;
    $('decisions-body').innerHTML = columns.map((c) => `<details class="panel team-card team-tone-${c.team}" open><summary><h4>${esc(teamName(c.team))} · ${esc(APPROACH[teamMode(c.team)].short)}</h4></summary>${trailHtml(c.team)}</details>`).join('');
  }

  /* ------------------------------------------------------------ Entrée */

  const startCode = normalizeCode(params.get('salle'));
  if (isValidCode(startCode)) {
    if (offline) showHome(OFFLINE_MESSAGE);
    else watch(startCode);
  }

  return { create, join, get offline() { return offline; } };
}
