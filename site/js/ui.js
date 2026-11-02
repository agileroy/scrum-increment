// Interface du jeu solo : écrans, listes et fenêtres.
// Aucune règle de jeu ici (tout vient de game-core.js), et aucun mot propre à une manche
// (tout vient de vocabulary.js) : l'interface met en page.

import {
  MODES, feature, newRound, planStatus, toggleInPlan, canMove, moveFeature, validatePlan,
  workItems, featureState, playSprint, finishRound, roundResults, truthTable,
  requestStatus, decideRequest, isRequest, periodWeeks, planProgress, projectWeather, dependencyState,
} from './game-core.js';
import { EURO_PER_POINT, AVENANT, SPRINT_WEEKS, HORIZON_WEEKS, RECETTE } from './scenario.js';
import { lexicon, logEntry, exploitationText } from './vocabulary.js';
import { chartSvg, legendHtml, formatEuro } from './chart.js';

const $ = (id) => document.getElementById(id);
const SCREENS = ['home', 'plan', 'board', 'transition', 'results'];

const app = { round: null, results: {}, afterDialog: null, remove: [] };
const compactQuery = window.matchMedia('(max-width: 560px)');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
const lex = () => lexicon(app.round.mode);
const stars = (n) => `<span class="stars" aria-label="Intuition de Mme Lefèvre : ${n} sur 5">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>`;

function show(name) {
  for (const s of SCREENS) $(`screen-${s}`).hidden = s !== name;
  const chip = $('round-chip');
  const inRound = ['plan', 'board'].includes(name) && app.round;
  chip.hidden = !inRound;
  if (inRound) chip.textContent = lex().round;
  window.scrollTo(0, 0);
}

/* ---------------------------------------------------------------- Lots et éléments */

function stateBadge(state, id) {
  const f = feature(id);
  switch (featureState(state, id)) {
    case 'live': return '<span class="chip live">En ligne</span>';
    case 'awaiting': return `<span class="chip">${esc(lexicon(state.mode).awaiting)}</span>`;
    case 'in-progress': return '<span class="chip">En cours</span>';
    default: return '';
  }
}

// Badge de dépendance : rouge si l'élément est placé avant son prérequis, neutre s'il est bien placé après.
function dependencyHtml(state, id, list) {
  const dep = dependencyState(state, id, list);
  if (!dep) return { cls: '', chip: '', note: '' };
  const req = feature(feature(id).req).name;
  if (dep === 'after') return { cls: '', chip: `<span class="chip dep">Après « ${esc(req)} »</span>`, note: '' };
  return {
    cls: 'is-misplaced',
    chip: `<span class="chip warn">Placé avant « ${esc(req)} »</span>`,
    note: `<div class="item-alert">${esc(lexicon(state.mode).skipText(req))}</div>`,
  };
}

function moveButtons(id, index, count) {
  const name = esc(feature(id).name);
  return `<div class="move">
    <button type="button" data-move="${id}" data-dir="-1" aria-label="Monter « ${name} »" ${index === 0 ? 'disabled' : ''}>↑</button>
    <button type="button" data-move="${id}" data-dir="1" aria-label="Descendre « ${name} »" ${index === count - 1 ? 'disabled' : ''}>↓</button>
  </div>`;
}

function planItemHtml(state, id, index, impossible) {
  const f = feature(id);
  const inPlan = state.included.includes(id);
  const retained = state.order.filter((x) => state.included.includes(x));
  let cls = inPlan ? '' : 'is-out';
  let chip = '';
  let note = '';
  if (inPlan && impossible[id]) {
    cls = 'is-impossible';
    chip = `<span class="chip warn">Impossible sans « ${esc(feature(impossible[id]).name)} »</span>`;
  } else if (inPlan) {
    ({ cls, chip, note } = dependencyHtml(state, id, retained));
  }
  return `<li class="item ${cls}">
    <div class="rank">${index + 1}</div>
    <div>
      <div class="item-head"><span class="item-name">${esc(f.name)}</span>${chip}</div>
      <div class="item-desc">${esc(f.desc)}</div>
      <div class="item-meta"><span>${f.cost} pts</span><span>Intuition ${stars(f.stars)}</span>${f.req ? `<span>Nécessite : ${esc(feature(f.req).name)}</span>` : ''}</div>
      ${note}
    </div>
    <div class="item-controls">
      <label class="include"><input type="checkbox" data-toggle="${id}" ${inPlan ? 'checked' : ''}> Retenu</label>
      ${moveButtons(id, index, state.order.length)}
    </div>
  </li>`;
}

function boardItemHtml(state, id, index, count) {
  const f = feature(id);
  const l = lexicon(state.mode);
  const p = Math.min(state.progress[id], f.cost);
  const value = state.revealed.includes(id)
    ? `<span class="value-known">Ventes réelles : ${formatEuro(f.value * EURO_PER_POINT)} ${l.valuePer}</span>`
    : '<span>Ventes réelles : ?</span>';
  const chip = isRequest(id) ? `<span class="chip request">${esc(l.requestChip)}</span>` : '';
  const controls = canMove(state, id) ? moveButtons(id, index, count) : '';
  const dep = dependencyHtml(state, id);
  const cls = featureState(state, id) === 'live' ? 'is-live' : dep.cls;
  return `<li class="item ${cls}">
    <div class="rank">${index + 1}</div>
    <div>
      <div class="item-head"><span class="item-name">${esc(f.name)}</span>${chip}${stateBadge(state, id)}${dep.chip}</div>
      <div class="item-desc">${esc(f.desc)}</div>
      <div class="item-meta"><span>${p} / ${f.cost} pts</span><span>Intuition ${stars(f.stars)}</span>${value}</div>
      ${dep.note}
      <div class="bar"><span style="width:${(p / f.cost) * 100}%"></span></div>
    </div>
    <div class="item-controls">${controls}</div>
  </li>`;
}

function recetteHtml(state) {
  const l = lexicon(state.mode);
  const ready = workItems(state).every((id) => state.done.includes(id));
  return `<li class="item is-recette ${state.launched ? 'is-live' : ''}">
    <div class="rank" aria-hidden="true">✓</div>
    <div>
      <div class="item-head"><span class="item-name">${esc(l.recetteName)}</span>${state.launched ? '<span class="chip live">Appli en ligne</span>' : ''}</div>
      <div class="item-desc">${esc(ready ? l.recetteReady : l.recetteWaiting)}</div>
      <div class="item-meta"><span>${state.recette} / ${state.recetteCost} pts</span>${state.recetteCost > RECETTE ? `<span>${esc(l.recetteAvenant(state.recetteCost - RECETTE))}</span>` : ''}</div>
      <div class="bar"><span style="width:${(state.recette / state.recetteCost) * 100}%"></span></div>
    </div>
    <div class="item-controls"></div>
  </li>`;
}

/* ---------------------------------------------------------------- Cahier des charges (manche 1) */

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
  $('plan-list').innerHTML = s.order.map((id, i) => planItemHtml(s, id, i, st.impossible)).join('');
}

/* ---------------------------------------------------------------- Tableau */

function logHtml(mode, fact) {
  const e = logEntry(mode, fact);
  if (!e.text) return '';
  const label = e.label ? `<strong>${esc(e.label)} :</strong> ` : '';
  if (e.kind === 'quote') return `<p class="quote-line">« ${esc(e.text)} » — ${esc(e.who)}</p>`;
  return `<p class="${e.kind}-line">${label}${esc(e.text)}</p>`;
}

function renderBoard() {
  const s = app.round;
  const l = lex();
  const cascade = s.mode === MODES.cascade;
  const next = Math.min(s.sprint + 1, s.lastBuildSprint);
  $('board-chip').textContent = l.round;
  $('board-title').textContent = `${l.deadline(next, s.lastBuildSprint)} · ${l.deadlineWeeks(next)}`;
  $('play-sprint').textContent = l.play(next);
  $('list-title').textContent = l.listTitle;
  $('list-hint').textContent = l.listHint;
  $('journal-title').textContent = l.journalTitle;
  $('board-stats').innerHTML = l.stats(s, {
    progress: cascade ? planProgress(s) : null,
    weather: cascade ? projectWeather(s) : null,
    live: s.live.length,
    clientele: Math.round(s.clientele * 100),
    cumulative: s.cumulative,
  }).map(([v, label]) => `<div class="stat"><strong>${esc(v)}</strong><span>${esc(label)}</span></div>`).join('');
  const items = workItems(s);
  $('board-list').innerHTML = items.map((id, i) => boardItemHtml(s, id, i, items.length)).join('') + (cascade ? recetteHtml(s) : '');
  const lines = s.log.slice().reverse().map((fact) => logHtml(s.mode, fact)).filter(Boolean);
  $('journal').innerHTML = lines.length ? lines.join('') : `<p class="muted">${esc(l.journalEmpty)}</p>`;
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
  const l = lexicon(state.mode);
  const cascade = state.mode === MODES.cascade;
  let h = `<h2 id="dialog-title">${esc(l.reportTitle(report.sprint))}</h2>`;
  if (cascade) {
    const w = l.weather(report.weather);
    h += `<p class="weather weather-${report.weather}"><span class="weather-icon" aria-hidden="true">${w.icon}</span><span><strong>Météo du projet : ${esc(w.label)}.</strong> ${esc(w.text)}</span></p>`;
    h += report.launched
      ? `<p class="good"><strong>L'appli est en ligne !</strong> Les ${state.live.length} lots du cahier des charges sortent tous en même temps.</p>`
      : `<p>Avancement du cahier des charges : <strong>${report.progress} %</strong></p>`;
    h += `<p>${esc(l.salesLine(report.sales))}</p>`;
    h += '<h3>Retours clients</h3>';
    h += report.launched
      ? '<p class="muted">Les premiers clients découvrent l\'appli.</p>'
      : '<p class="muted">Aucun : l\'appli n\'est pas encore sortie.</p>';
  } else {
    h += report.completed.length
      ? `<p>Mis en ligne : <strong>${report.completed.map((id) => esc(feature(id).name)).join(', ')}</strong></p>`
      : '<p>Rien de nouveau en ligne ce Sprint : un élément est encore en cours.</p>';
    h += `<p>${esc(l.salesLine(report.sales))}</p>`;
    h += '<h3>Ce que disent les clients</h3>';
    h += report.quotes.length
      ? report.quotes.map((q) => `<blockquote class="quote">« ${esc(q.text)} »<footer>${esc(q.who)}</footer></blockquote>`).join('')
      : '<p class="muted">Pas de nouveau retour.</p>';
    if (report.completed.length) h += '<p class="muted">La vraie valeur des fonctionnalités en ligne apparaît maintenant dans le Product Backlog.</p>';
  }
  for (const e of report.events) {
    h += `<p class="news"><strong>${esc(e.title)} :</strong> ${esc(l.eventText(e))}</p>`;
  }
  if (report.request) {
    const r = report.request;
    h += `<div class="request-box"><p><strong>Demande de ${esc(l.stakeholder)} :</strong> « ${esc(r.ask)} »</p><p>${esc(l.requestAnnounce(r))}</p></div>`;
  }
  let next = report.developmentOver ? 'Fin du projet' : l.next(report.sprint + 1);
  if (cascade && report.request) next = l.seeRequest;
  h += `<button type="button" class="button button-primary" data-close>${esc(next)}</button>`;
  return h;
}

function finishHtml(state, summary) {
  const l = lexicon(state.mode);
  let h = `<h2 id="dialog-title">Fin du projet</h2>`;
  if (state.mode === MODES.cascade && !summary.launched) {
    h += `<p class="bad">${esc(l.neverReleased(summary.lastBuildSprint, summary.doneOffline))}</p>`;
  } else {
    h += `<p>${esc(l.endOfDev(summary.lastBuildSprint))}</p>`;
    h += `<p class="good">L'appli tourne avec <strong>${plural(summary.liveCount, 'fonctionnalité')}</strong>.</p>`;
  }
  h += `<p>${esc(exploitationText(summary.lastBuildSprint, HORIZON_WEEKS, SPRINT_WEEKS))}</p>`;
  h += `<p>Ventes cumulées après ${HORIZON_WEEKS} semaines : <strong>${formatEuro(summary.cumulative)}</strong></p>`;
  h += `<button type="button" class="button button-primary" data-close>${esc(l.finishButton)}</button>`;
  return h;
}

function finishCurrentRound() {
  const { state, summary } = finishRound(app.round);
  app.round = state;
  app.results[state.mode] = roundResults(state);
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
  let h = '<h2 id="dialog-title">Demande de changement</h2>';
  h += `<blockquote class="quote">« ${esc(r.ask)} »<footer>Madame Lefèvre, la commanditaire</footer></blockquote>`;
  h += `<p><strong>${esc(r.name)}</strong> (${esc(r.desc)}) : ${r.cost} points, intuition ${stars(r.stars)}.</p>`;
  h += `<p class="muted">Accepter, c'est signer un avenant : ${AVENANT} points de recette en plus, et le budget du projet ne bouge pas. Il faut donc retirer du cahier des charges des lots pas encore commencés.</p>`;
  h += `<div class="panel-head"><strong>Cahier des charges avec la demande</strong><span class="count">${st.total} / ${st.budget} points</span></div>`;
  h += `<div class="meter ${st.over > 0 ? 'over' : ''}"><span style="width:${Math.min(100, (st.total / st.budget) * 100)}%"></span></div>`;
  h += `<p class="hint ${st.valid ? '' : 'is-error'}" role="status">${esc(st.message)}</p>`;
  const broken = Object.keys(st.impossible).filter((id) => id !== s.pendingRequest);
  if (broken.length) h += `<p class="item-alert">Deviendraient impossibles : ${broken.map((id) => esc(feature(id).name)).join(', ')}</p>`;
  h += st.removable.length
    ? `<fieldset class="removals"><legend>Retirer des lots</legend>${st.removable.map((id) => {
      const f = feature(id);
      const why = st.impossible[id] && !app.remove.includes(id) ? ` <span class="chip warn">Impossible sans « ${esc(feature(st.impossible[id]).name)} »</span>` : '';
      return `<label class="include ${why ? 'is-impossible' : ''}"><input type="checkbox" data-remove="${id}" ${app.remove.includes(id) ? 'checked' : ''}><span>${esc(f.name)} <span class="muted nowrap">· ${f.cost} pts · ${stars(f.stars)}</span>${why}</span></label>`;
    }).join('')}</fieldset>`
    : '<p class="muted">Tous les lots sont commencés : plus rien ne peut être retiré.</p>';
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

const firstWeek = (period) => periodWeeks(period)[0];

function renderResults() {
  const a = app.results[MODES.cascade];
  const b = app.results[MODES.increment];
  const series = [
    { kind: 1, label: 'Manche 1 : projet, une livraison à la fin', values: a.curve },
    { kind: 2, label: 'Manche 2 : Scrum, un incrément à chaque Sprint', values: b.curve },
  ];
  app.chart = { series, frontier: a.lastBuildSprint, periods: a.curve.map((_, i) => i + 1) };
  drawChart();
  $('legend').innerHTML = legendHtml(series);
  const first = (r) => (r.firstSale ? `Dès la semaine ${firstWeek(r.firstSale)}` : 'Jamais');
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
  $('kpi').innerHTML = '<thead><tr><th scope="col"><span hidden>Indicateur</span></th><th scope="col">Manche 1 · Projet</th><th scope="col">Manche 2 · Scrum</th></tr></thead><tbody>'
    + rows.map(([label, x, y]) => `<tr><th scope="row">${label}</th><td>${x}</td><td>${y}</td></tr>`).join('') + '</tbody>';
  $('truth').innerHTML = '<thead><tr><th scope="col">Fonctionnalité</th><th scope="col">Intuition</th><th scope="col" class="num">Ventes réelles / 2 sem.</th></tr></thead><tbody>'
    + truthTable().map((t) => `<tr><td>${esc(t.name)}${t.requested ? ' <span class="chip request">Demande</span>' : ''}</td><td>${stars(t.stars)}</td><td class="num">${formatEuro(t.sales)}</td></tr>`).join('') + '</tbody>';
  show('results');
}

function drawChart() {
  if (!app.chart) return;
  const { series, frontier, periods } = app.chart;
  $('chart').innerHTML = chartSvg(series, {
    axis: periods.map((p) => `${periodWeeks(p)[1]} sem.`),
    names: periods.map((p) => { const [x, y] = periodWeeks(p); return `semaines ${x} et ${y}`; }),
    frontier,
    compact: compactQuery.matches,
  });
}

/* ---------------------------------------------------------------- Démarrage */

export function init() {
  $('start').addEventListener('click', () => {
    app.results = {};
    app.round = newRound(MODES.cascade);
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
    app.round = newRound(MODES.increment);
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
