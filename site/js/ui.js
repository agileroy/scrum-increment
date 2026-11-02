// Interface du jeu solo : écrans, listes et fenêtres.
// Aucune règle de jeu ici : tout vient de game-core.js, l'interface affiche ses comptes rendus.

import {
  MODES, feature, newRound, planStatus, toggleInPlan, canMove, moveFeature, validatePlan,
  workItems, featureState, buildCapacity, playSprint, finishRound, roundResults, truthTable,
  requestStatus, decideRequest, isRequest, periodLabel,
} from './game-core.js';
import { EURO_PER_POINT, LAST_SPRINT, DONE_COST, AVENANT, SPRINT_WEEKS, HORIZON_WEEKS } from './scenario.js';
import { chartSvg, legendHtml, formatEuro } from './chart.js';

const $ = (id) => document.getElementById(id);
const SCREENS = ['home', 'plan', 'board', 'transition', 'results'];
const ROUND_LABEL = { [MODES.cascade]: 'Manche 1', [MODES.increment]: 'Manche 2' };

const app = { cut: true, round: null, results: {}, afterDialog: null, remove: [] };
const compactQuery = window.matchMedia('(max-width: 560px)');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
const requestChip = (id) => (isRequest(id) ? '<span class="chip request">Demande de Mme Lefèvre</span>' : '');
const stars = (n) => `<span class="stars" aria-label="Intuition de Mme Lefèvre : ${n} sur 5">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>`;

function show(name) {
  for (const s of SCREENS) $(`screen-${s}`).hidden = s !== name;
  const chip = $('round-chip');
  const inRound = ['plan', 'board'].includes(name) && app.round;
  chip.hidden = !inRound;
  if (inRound) chip.textContent = ROUND_LABEL[app.round.mode];
  window.scrollTo(0, 0);
}

/* ---------------------------------------------------------------- Fonctionnalités */

const STATE_BADGE = {
  live: () => '<span class="chip live">En ligne</span>',
  awaiting: () => '<span class="chip">Terminée, en attente de recette</span>',
  'in-progress': () => '<span class="chip">En cours</span>',
  blocked: (f) => `<span class="chip warn">Nécessite : ${esc(feature(f.req).name)}</span>`,
  todo: () => '',
};

function moveButtons(state, id, index, count) {
  const name = esc(feature(id).name);
  return `<div class="move">
    <button type="button" data-move="${id}" data-dir="-1" aria-label="Monter « ${name} »" ${index === 0 ? 'disabled' : ''}>↑</button>
    <button type="button" data-move="${id}" data-dir="1" aria-label="Descendre « ${name} »" ${index === count - 1 ? 'disabled' : ''}>↓</button>
  </div>`;
}

function planItemHtml(state, id, index) {
  const f = feature(id);
  const inPlan = state.included.includes(id);
  return `<li class="item ${inPlan ? '' : 'is-out'}">
    <div class="rank">${index + 1}</div>
    <div>
      <div class="item-head"><span class="item-name">${esc(f.name)}</span></div>
      <div class="item-desc">${esc(f.desc)}</div>
      <div class="item-meta"><span>${f.cost} pts</span><span>Intuition ${stars(f.stars)}</span>${f.req ? `<span>Nécessite : ${esc(feature(f.req).name)}</span>` : ''}</div>
    </div>
    <div class="item-controls">
      <label class="include"><input type="checkbox" data-toggle="${id}" ${inPlan ? 'checked' : ''}> Au plan</label>
      ${moveButtons(state, id, index, state.order.length)}
    </div>
  </li>`;
}

function boardItemHtml(state, id, index, count) {
  const f = feature(id);
  const st = featureState(state, id);
  const p = Math.min(state.progress[id], f.cost);
  const value = state.revealed.includes(id)
    ? `<span class="value-known">Ventes réelles : ${formatEuro(f.value * EURO_PER_POINT)} / Sprint</span>`
    : '<span>Ventes réelles : ?</span>';
  const controls = canMove(state, id) ? moveButtons(state, id, index, count) : '';
  return `<li class="item ${st === 'live' ? 'is-live' : ''}">
    <div class="rank">${index + 1}</div>
    <div>
      <div class="item-head"><span class="item-name">${esc(f.name)}</span>${requestChip(id)}${STATE_BADGE[st](f)}</div>
      <div class="item-desc">${esc(f.desc)}</div>
      <div class="item-meta"><span>${p} / ${f.cost} pts</span><span>Intuition ${stars(f.stars)}</span>${value}</div>
      <div class="bar"><span style="width:${(p / f.cost) * 100}%"></span></div>
    </div>
    <div class="item-controls">${controls}</div>
  </li>`;
}

function recetteHtml(state) {
  const ready = workItems(state).every((id) => state.done.includes(id));
  return `<li class="item is-recette ${state.launched ? 'is-live' : ''}">
    <div class="rank" aria-hidden="true">✓</div>
    <div>
      <div class="item-head"><span class="item-name">Recette et mise en production</span>${state.launched ? '<span class="chip live">Appli en ligne</span>' : ''}</div>
      <div class="item-desc">${ready ? 'Toutes les fonctionnalités du plan sont terminées.' : 'Commence quand tout le reste du plan est terminé.'}</div>
      <div class="item-meta"><span>${state.recette} / ${state.recetteCost} pts</span>${state.recetteCost > 8 ? `<span>dont ${state.recetteCost - 8} points d'avenant</span>` : ''}</div>
      <div class="bar"><span style="width:${(state.recette / state.recetteCost) * 100}%"></span></div>
    </div>
    <div class="item-controls"></div>
  </li>`;
}

/* ---------------------------------------------------------------- Plan (manche 1) */

function renderPlan() {
  const s = app.round;
  const st = planStatus(s);
  $('plan-total').textContent = `${st.total} / ${st.budget} points`;
  const meter = $('plan-meter');
  meter.classList.toggle('over', st.over > 0);
  meter.firstElementChild.style.width = `${Math.min(100, (st.total / st.budget) * 100)}%`;
  $('plan-message').textContent = st.message;
  $('plan-message').closest('.plan-gauge').classList.toggle('is-invalid', !st.valid);
  $('validate-plan').disabled = !st.valid;
  $('plan-list').innerHTML = s.order.map((id, i) => planItemHtml(s, id, i)).join('');
}

/* ---------------------------------------------------------------- Tableau de Sprint */

function logHtml(entry) {
  if (entry.kind === 'quote') return `<p class="quote-line">« ${esc(entry.text)} » — ${esc(entry.who)}</p>`;
  if (entry.kind === 'request') return `<p class="request-line"><strong>Demande de Mme Lefèvre :</strong> ${esc(entry.text)}</p>`;
  if (entry.kind === 'decision') return `<p class="decision-line">${esc(entry.text)}</p>`;
  if (entry.kind === 'event') return `<p class="event-line"><strong>Imprévu :</strong> ${esc(entry.text)}</p>`;
  if (entry.kind === 'sprint') return `<p><strong>Sprint ${entry.sprint}</strong> : ${esc(entry.text)} Ventes : ${formatEuro(entry.sales)}.</p>`;
  return `<p>${esc(entry.text)}</p>`;
}

function renderBoard() {
  const s = app.round;
  const cascade = s.mode === MODES.cascade;
  const next = s.sprint + 1;
  $('board-chip').textContent = ROUND_LABEL[s.mode];
  $('board-title').textContent = `Sprint ${next} sur ${s.lastBuildSprint}`;
  $('play-sprint').textContent = `Lancer le Sprint ${next}`;
  $('list-title').textContent = cascade ? 'Le plan' : 'Product Backlog';
  $('list-hint').textContent = cascade
    ? "Le plan est figé par contrat : l'ordre ne peut plus changer."
    : "Ordonnez le Product Backlog : l'équipe prend les éléments par le haut, et un élément non terminé continue au Sprint suivant.";
  const capacity = cascade ? `${buildCapacity(s)} pts` : `${buildCapacity(s)} pts + ${DONE_COST}`;
  $('board-stats').innerHTML = [
    [capacity, cascade ? 'Capacité du Sprint' : 'Pour construire + pour finir'],
    [s.live.length, 'Fonctionnalités en ligne'],
    [`${Math.round(s.clientele * 100)} %`, 'Clients potentiels'],
    [formatEuro(s.cumulative), 'Ventes cumulées'],
  ].map(([v, l]) => `<div class="stat"><strong>${v}</strong><span>${l}</span></div>`).join('');
  const items = workItems(s);
  $('board-list').innerHTML = items.map((id, i) => boardItemHtml(s, id, i, items.length)).join('') + (cascade ? recetteHtml(s) : '');
  $('journal').innerHTML = s.log.length ? s.log.slice().reverse().map(logHtml).join('') : '<p class="muted">Le projet démarre.</p>';
}

/* ---------------------------------------------------------------- Fenêtres */

function openDialog(html, afterClose) {
  app.afterDialog = afterClose ?? null;
  $('dialog-body').innerHTML = `<div class="dialog-content">${html}</div>`;
  const dialog = $('dialog');
  dialog.showModal();
  dialog.querySelector('.button')?.focus();
}

function reportHtml(state, report) {
  const cascade = state.mode === MODES.cascade;
  let h = `<h2 id="dialog-title">Sprint ${report.sprint} terminé</h2>`;
  if (cascade) {
    h += report.launched
      ? `<p class="good"><strong>L'appli est en ligne !</strong> Les ${state.live.length} fonctionnalités du plan sortent toutes en même temps.</p>`
      : `<p>Avancement du plan : <strong>${report.progress} %</strong></p><p class="good">Rapport au comité : tout se déroule comme prévu.</p>`;
    h += `<p>Ventes pendant ce Sprint : <strong>${formatEuro(report.sales)}</strong></p>`;
    h += '<h3>Retours clients</h3>';
    h += report.launched
      ? '<p class="muted">Les premiers clients découvrent l\'appli.</p>'
      : '<p class="muted">Aucun : l\'appli n\'est pas encore sortie.</p>';
  } else {
    h += report.completed.length
      ? `<p>Mis en ligne : <strong>${report.completed.map((id) => esc(feature(id).name)).join(', ')}</strong></p>`
      : '<p>Rien de nouveau en ligne ce Sprint : un élément est encore en cours.</p>';
    h += `<p>Ventes pendant ce Sprint : <strong>${formatEuro(report.sales)}</strong></p>`;
    h += '<h3>Sprint Review : ce que disent les clients</h3>';
    h += report.quotes.length
      ? report.quotes.map((q) => `<blockquote class="quote">« ${esc(q.text)} »<footer>${esc(q.who)}</footer></blockquote>`).join('')
      : '<p class="muted">Pas de nouveau retour.</p>';
    if (report.completed.length) h += '<p class="muted">La vraie valeur des fonctionnalités en ligne apparaît maintenant dans le Product Backlog.</p>';
  }
  for (const e of report.events) {
    const extra = cascade && e.lastBuildSprint ? ' Le comité maintient le plan signé.' : '';
    h += `<p class="news"><strong>${esc(e.title)} :</strong> ${esc(e.text)}${extra}</p>`;
  }
  if (report.request) {
    const r = report.request;
    h += `<div class="request-box"><p><strong>Mme Lefèvre a une demande :</strong> « ${esc(r.ask)} »</p>`;
    h += cascade
      ? `<p>${esc(r.name)} : ${r.cost} points, plus ${AVENANT} points d'avenant. Le comité doit trancher avant le Sprint suivant.</p></div>`
      : `<p><strong>${esc(r.name)}</strong> est ajoutée en bas du Product Backlog : à vous de l'ordonner.</p></div>`;
  }
  let next = report.developmentOver ? 'Fin du projet' : `Préparer le Sprint ${report.sprint + 1}`;
  if (cascade && report.request) next = 'Voir la demande de Mme Lefèvre';
  h += `<button type="button" class="button button-primary" data-close>${next}</button>`;
  return h;
}

function finishHtml(state, summary) {
  let h = `<h2 id="dialog-title">Fin du projet</h2><p>Le développement s'arrête après le Sprint ${summary.lastBuildSprint}.</p>`;
  if (state.mode === MODES.cascade && !summary.launched) {
    h += `<p class="bad"><strong>Le projet s'arrête après le Sprint ${summary.lastBuildSprint}.</strong> L'appli n'est jamais sortie : ${plural(summary.doneOffline, 'fonctionnalité terminée')} ne ${summary.doneOffline > 1 ? 'servent' : 'sert'} à aucun client.</p>`;
  } else {
    h += `<p class="good">L'appli tourne avec <strong>${plural(summary.liveCount, 'fonctionnalité')}</strong>.</p>`;
  }
  const weeks = (LAST_SPRINT - summary.lastBuildSprint) * SPRINT_WEEKS;
  h += `<p>Place à l'exploitation : ${weeks} semaines sans développement, jusqu'à ${HORIZON_WEEKS} semaines après le lancement du projet. La boulangerie vit avec ce qui est en ligne.</p>`;
  h += `<p>Ventes cumulées après ${HORIZON_WEEKS} semaines : <strong>${formatEuro(summary.cumulative)}</strong></p>`;
  h += `<button type="button" class="button button-primary" data-close>${state.mode === MODES.cascade ? 'Passer à la manche 2' : 'Voir les résultats'}</button>`;
  return h;
}

function finishCurrentRound() {
  const { state, summary } = finishRound(app.round);
  app.round = state;
  app.results[state.mode] = roundResults(state);
  renderBoard();
  openDialog(finishHtml(state, summary), () => {
    if (state.mode === MODES.cascade) show('transition');
    else renderResults();
  });
}

function onPlaySprint() {
  const { state, report } = playSprint(app.round);
  app.round = state;
  renderBoard();
  let after = report.developmentOver ? finishCurrentRound : null;
  if (state.pendingRequest) after = () => { app.remove = []; openRequestDialog(); };
  openDialog(reportHtml(state, report), after);
}

/* ---------------------------------------------------------------- Demande de changement (manche 1) */

function requestHtml() {
  const s = app.round;
  const r = feature(s.pendingRequest);
  const st = requestStatus(s, app.remove);
  let h = `<h2 id="dialog-title">Demande de changement</h2>`;
  h += `<blockquote class="quote">« ${esc(r.ask)} »<footer>Madame Lefèvre</footer></blockquote>`;
  h += `<p><strong>${esc(r.name)}</strong> (${esc(r.desc)}) : ${r.cost} points, intuition ${stars(r.stars)}.</p>`;
  h += `<p class="muted">Accepter, c'est signer un avenant : ${AVENANT} points de recette en plus, et le budget du projet ne bouge pas. Il faut donc retirer du plan des fonctionnalités pas encore commencées.</p>`;
  h += `<div class="panel-head"><strong>Plan avec la demande</strong><span class="count">${st.total} / ${st.budget} points</span></div>`;
  h += `<div class="meter ${st.over > 0 ? 'over' : ''}"><span style="width:${Math.min(100, (st.total / st.budget) * 100)}%"></span></div>`;
  h += `<p class="hint ${st.valid ? '' : 'is-error'}" role="status">${esc(st.message)}</p>`;
  h += st.removable.length
    ? `<fieldset class="removals"><legend>Retirer du plan</legend>${st.removable.map((id) => {
      const f = feature(id);
      return `<label class="include"><input type="checkbox" data-remove="${id}" ${app.remove.includes(id) ? 'checked' : ''}><span>${esc(f.name)} <span class="muted nowrap">· ${f.cost} pts · ${stars(f.stars)}</span></span></label>`;
    }).join('')}</fieldset>`
    : '<p class="muted">Toutes les fonctionnalités du plan sont commencées : plus rien ne peut être retiré.</p>';
  h += `<div class="actions"><button type="button" class="button button-primary" data-accept ${st.valid ? '' : 'disabled'}>Accepter (avenant)</button><button type="button" class="button button-ghost" data-refuse>Refuser</button></div>`;
  return h;
}

function openRequestDialog() {
  openDialog(requestHtml(), null);
}

function refreshRequestDialog() {
  const focused = document.activeElement?.dataset?.remove;
  $('dialog-body').innerHTML = `<div class="dialog-content">${requestHtml()}</div>`;
  if (focused) $('dialog-body').querySelector(`[data-remove="${focused}"]`)?.focus();
}

function decide(accept) {
  app.round = decideRequest(app.round, { accept, remove: accept ? app.remove : [] });
  app.remove = [];
  app.afterDialog = null;
  $('dialog').close();
  renderBoard();
}

/* ---------------------------------------------------------------- Résultats */

function renderResults() {
  const a = app.results[MODES.cascade];
  const b = app.results[MODES.increment];
  const series = [
    { kind: 1, label: 'Manche 1 : une seule livraison à la fin', values: a.curve },
    { kind: 2, label: 'Manche 2 : un incrément à chaque Sprint', values: b.curve },
  ];
  const frontier = a.lastBuildSprint;
  const periods = a.curve.map((_, i) => i + 1);
  app.chart = { series, frontier, periods };
  drawChart();
  $('legend').innerHTML = legendHtml(series);
  const first = (r) => (r.firstSale ? periodLabel(r.firstSale, r.lastBuildSprint) : 'Jamais');
  const invested = (r) => `${formatEuro(r.invested)}${r.neverSold ? ' (sans retour)' : ''}`;
  const low = (r) => (r.liveAtEnd.length ? `${r.lowUse.length} sur ${r.liveAtEnd.length}` : '—');
  const rows = [
    ['Premier euro encaissé', first(a), first(b)],
    ['Investi avant le premier euro', invested(a), invested(b)],
    ['Fonctionnalités en ligne à la fin du projet', a.liveAtEnd.length, b.liveAtEnd.length],
    ['Fonctionnalités en ligne peu utilisées', low(a), low(b)],
    ['Demandes de Mme Lefèvre mises en ligne', a.requestsLive.length, b.requestsLive.length],
    [`Ventes cumulées après ${HORIZON_WEEKS} semaines`, `<strong>${formatEuro(a.cumulative)}</strong>`, `<strong>${formatEuro(b.cumulative)}</strong>`],
  ];
  $('kpi').innerHTML = '<thead><tr><th scope="col"><span hidden>Indicateur</span></th><th scope="col">Manche 1</th><th scope="col">Manche 2</th></tr></thead><tbody>'
    + rows.map(([l, x, y]) => `<tr><th scope="row">${l}</th><td>${x}</td><td>${y}</td></tr>`).join('') + '</tbody>';
  $('truth').innerHTML = '<thead><tr><th scope="col">Fonctionnalité</th><th scope="col">Intuition</th><th scope="col" class="num">Ventes réelles / Sprint</th></tr></thead><tbody>'
    + truthTable().map((t) => `<tr><td>${esc(t.name)}${t.requested ? ' <span class="chip request">Demande</span>' : ''}</td><td>${stars(t.stars)}</td><td class="num">${formatEuro(t.sales)}</td></tr>`).join('') + '</tbody>';
  show('results');
}

function drawChart() {
  if (!app.chart) return;
  const { series, frontier, periods } = app.chart;
  $('chart').innerHTML = chartSvg(series, {
    axis: periods.map((p) => periodLabel(p, frontier, { short: true })),
    names: periods.map((p) => periodLabel(p, frontier)),
    frontier,
    compact: compactQuery.matches,
  });
}

/* ---------------------------------------------------------------- Démarrage */

export function init() {
  $('start').addEventListener('click', () => {
    app.cut = $('opt-cut').checked;
    app.results = {};
    app.round = newRound(MODES.cascade, { cut: app.cut });
    renderPlan();
    show('plan');
  });

  $('plan-list').addEventListener('change', (e) => {
    const id = e.target.dataset.toggle;
    if (!id) return;
    app.round = toggleInPlan(app.round, id);
    renderPlan();
  });

  for (const [list, render] of [['plan-list', renderPlan], ['board-list', renderBoard]]) {
    $(list).addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-move]');
      if (!btn || btn.disabled) return;
      const id = btn.dataset.move;
      const dir = Number(btn.dataset.dir);
      app.round = moveFeature(app.round, id, dir);
      render();
      // garder le focus sur le même bouton de la fonctionnalité déplacée
      $(list).querySelector(`button[data-move="${id}"][data-dir="${dir}"]:not(:disabled)`)?.focus();
    });
  }

  $('validate-plan').addEventListener('click', () => {
    app.round = validatePlan(app.round);
    renderBoard();
    show('board');
  });

  $('play-sprint').addEventListener('click', onPlaySprint);

  $('start-round-2').addEventListener('click', () => {
    app.round = newRound(MODES.increment, { cut: app.cut });
    renderBoard();
    show('board');
  });

  $('replay').addEventListener('click', () => {
    app.round = null;
    app.chart = null;
    show('home');
  });

  const dialog = $('dialog');
  dialog.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) dialog.close();
    else if (e.target.closest('[data-accept]:not(:disabled)')) decide(true);
    else if (e.target.closest('[data-refuse]')) decide(false);
  });
  dialog.addEventListener('change', (e) => {
    const id = e.target.dataset.remove;
    if (!id) return;
    app.remove = e.target.checked ? [...app.remove, id] : app.remove.filter((x) => x !== id);
    refreshRequestDialog();
  });
  // Échap ne doit pas trancher une demande de changement à la place du joueur.
  dialog.addEventListener('cancel', (e) => { if (app.round?.pendingRequest && !app.afterDialog) e.preventDefault(); });
  compactQuery.addEventListener('change', drawChart);
  // Fermer la fenêtre (bouton ou Échap) poursuit toujours la partie.
  dialog.addEventListener('close', () => {
    const next = app.afterDialog;
    app.afterDialog = null;
    if (next) next();
    // Si le navigateur ferme quand même la fenêtre d'une demande (Échap répété), on la rouvre.
    else if (app.round?.pendingRequest) openRequestDialog();
  });
}
