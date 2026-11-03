// Interface du jeu : écrans, listes et fenêtres, en solo et pour une équipe du mode collectif.
// Aucune règle de jeu ici (tout vient de game-core.js), et aucun mot propre à une manche
// (tout vient de vocabulary.js) : l'interface met en page.
// Toute action du joueur passe par act(fn) : en solo, fn s'applique à l'état local ; en équipe
// (app.session, posé par room-ui.js), elle s'applique aussi tout de suite à l'écran, puis à l'état partagé.

import {
  MODES, feature, newRound, planStatus, toggleInPlan, canMove, moveFeature, validatePlan,
  moveFeatureTo, workItems, featureState, playSprint, finishRound, roundResults, truthTable,
  requestStatus, decideRequest, isRequest, firstMovableIndex, intuitionSurprises, canDescope, descopeStatus, descope, needsArbitrage, keepScope, canRevise, reviseDecisions, periodWeeks, planProgress, planWork, projectWeather, dependencyState,
} from './game-core.js?v=__VERSION__';
import { EURO_PER_POINT, MAN_DAYS_PER_POINT, AVENANT, SPRINT_WEEKS, HORIZON_WEEKS, RECETTE, PLANNED_SPRINTS } from './scenario.js?v=__VERSION__';
import { lexicon, logEntry, exploitationText, discoveryText, STORY, SPEAKER } from './vocabulary.js?v=__VERSION__';
import { chartSvg, legendHtml, formatEuro } from './chart.js?v=__VERSION__';

const $ = (id) => document.getElementById(id);
const SCREENS = ['home', 'plan', 'board', 'transition', 'results', 'host', 'wait', 'role'];

// session : null en solo ; en équipe { label, commit(fn), renderBar() } fourni par room-ui.js.
const app = { round: null, results: {}, afterDialog: null, remove: [], session: null, dialogKind: null, onIdle: null, silentCloses: 0 };
const compactQuery = window.matchMedia('(max-width: 560px)');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
const lex = () => lexicon(app.round.mode);
const stars = (n, decorative = false) => `<span class="stars" ${decorative ? 'aria-hidden="true"' : `aria-label="Intuition de Mme Lefèvre : ${n} sur 5"`}>${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>`;
// Jauge du cahier des charges (manche 1), en jours/homme.
const ratio = (total, budget) => `${total * MAN_DAYS_PER_POINT} / ${lexicon(MODES.cascade).sizeLong(budget)}`;

// Pictogramme décoratif d'une fonctionnalité : le nom reste le texte lu.
const emo = (icon) => (icon ? `<span class="emo" aria-hidden="true">${icon}</span>` : '');
const nameHtml = (id) => `${emo(feature(id).icon)}${esc(feature(id).name)}`;

/** Réplique de Mme Lefèvre : avatar, bulle entre guillemets, signature. */
function speechHtml(text) {
  return `<figure class="speech"><span class="avatar" aria-hidden="true">👩‍🍳</span><blockquote><p>«&nbsp;${esc(text)}&nbsp;»</p><footer>${esc(SPEAKER)}</footer></blockquote></figure>`;
}

const roundLabel = () => (app.session ? app.session.label : lex().round);

function show(name, { keepScroll = false } = {}) {
  const changed = $(`screen-${name}`).hidden;
  for (const s of SCREENS) $(`screen-${s}`).hidden = s !== name;
  const chip = $('round-chip');
  const inRound = ['plan', 'board'].includes(name) && app.round && !app.session;
  chip.hidden = !inRound;
  if (inRound) chip.textContent = roundLabel();
  if (changed || !keepScroll) window.scrollTo(0, 0);
}

/** Action du joueur : appliquée à l'écran tout de suite, et à l'état partagé en équipe. */
function act(fn, render) {
  let next;
  try { next = fn(app.round); } catch { return false; }
  if (!next || next === app.round) return false;
  app.round = next;
  render?.();
  app.session?.commit(fn);
  return true;
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

// Badge de dépendance : rouge « Impossible sans » si l'élément est placé avant son prérequis, neutre s'il est bien placé après.
function dependencyHtml(state, id, list) {
  const dep = dependencyState(state, id, list);
  if (!dep) return { cls: '', chip: '', note: '' };
  const req = feature(feature(id).req).name;
  if (dep === 'after') return { cls: '', chip: `<span class="chip dep">Après « ${esc(req)} »</span>`, note: '' };
  return { cls: 'is-misplaced', chip: `<span class="chip warn">Impossible sans « ${esc(req)} »</span>`, note: '' };
}

function moveButtons(id, index, count, top = 0) {
  const name = esc(feature(id).name);
  return `<div class="move">
    <button type="button" data-move="${id}" data-dir="-1" aria-label="Monter « ${name} »" ${index <= top ? 'disabled' : ''}>↑</button>
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
  return `<li class="item ${cls}" data-id="${id}" data-drag="${id}">
    <div class="rank">${index + 1}</div>
    <div>
      <div class="item-head"><span class="item-name">${nameHtml(id)}</span>${chip}</div>
      <div class="item-desc">${esc(f.desc)}</div>
      <div class="item-meta"><span>${esc(lexicon(state.mode).size(f.cost))}</span><span>Intuition ${stars(f.stars)}</span>${f.req ? `<span>Nécessite : ${esc(feature(f.req).name)}</span>` : ''}</div>
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
  const extra = state.extra?.[id] ?? 0;
  const cost = f.cost + extra;
  const p = Math.min(state.progress[id], cost);
  // Manche 1 : pas de « Ventes réelles » sur les lots (un projet ne suit pas les ventes).
  let value = '';
  if (state.mode === MODES.increment) {
    value = state.revealed.includes(id)
      ? `<span class="value-known">💶 Ventes réelles : ${formatEuro(f.value * EURO_PER_POINT)} ${l.valuePer}</span>`
      : '<span>Ventes réelles : ?</span>';
  }
  const chip = isRequest(id) ? `<span class="chip request">${esc(l.requestChip)}</span>` : '';
  // En équipe, une fois « prêts », l'ordre est figé jusqu'à « Nous ne sommes plus prêts ».
  const movable = canMove(state, id) && !app.session?.locked;
  const controls = movable ? moveButtons(id, index, count, firstMovableIndex(state)) : '';
  const dep = dependencyHtml(state, id);
  const cls = featureState(state, id) === 'live' ? 'is-live' : dep.cls;
  return `<li class="item ${cls}" data-id="${id}"${movable ? ` data-drag="${id}"` : ''}>
    <div class="rank">${index + 1}</div>
    <div>
      <div class="item-head"><span class="item-name">${nameHtml(id)}</span>${chip}${stateBadge(state, id)}${dep.chip}</div>
      <div class="item-desc">${esc(f.desc)}</div>
      <div class="item-meta"><span${extra ? ` class="extra" title="${esc(l.extraTitle(extra))}"` : ''}>${esc(l.sizeOf(p, f.cost, extra))}</span><span>Intuition ${stars(f.stars)}</span>${value}</div>
      ${dep.note}
      <div class="bar"><span style="width:${(p / cost) * 100}%"></span></div>
    </div>
    <div class="item-controls">${controls}</div>
  </li>`;
}

function recetteHtml(state) {
  const l = lexicon(state.mode);
  const ready = workItems(state).every((id) => state.done.includes(id));
  const anomalies = state.extra?.recette ?? 0;
  const avenants = state.recetteCost - RECETTE - anomalies;
  return `<li class="item is-recette ${state.launched ? 'is-live' : ''}">
    <div class="rank" aria-hidden="true">✓</div>
    <div>
      <div class="item-head"><span class="item-name">${esc(l.recetteName)}</span>${state.launched ? '<span class="chip live">Appli en ligne</span>' : ''}</div>
      <div class="item-desc">${esc(ready ? l.recetteReady : l.recetteWaiting)}</div>
      <div class="item-meta"><span>${esc(l.sizeOf(state.recette, state.recetteCost, 0))}</span>${avenants ? `<span>${esc(l.recetteAvenant(avenants))}</span>` : ''}${anomalies ? `<span class="extra">${esc(l.anomalies(anomalies))}</span>` : ''}</div>
      <div class="bar"><span style="width:${(state.recette / state.recetteCost) * 100}%"></span></div>
    </div>
    <div class="item-controls"></div>
  </li>`;
}

/* ---------------------------------------------------------------- Cahier des charges (manche 1) */

function renderPlan() {
  const s = app.round;
  const st = planStatus(s);
  $('plan-total').textContent = ratio(st.total, st.budget);
  const meter = $('plan-meter');
  meter.classList.toggle('over', st.over > 0);
  meter.firstElementChild.style.width = `${Math.min(100, (st.total / st.budget) * 100)}%`;
  $('plan-message').textContent = st.message;
  $('plan-chip').textContent = `${roundLabel()} · Avant le premier COPIL`;
  $('plan-story').textContent = `${STORY} ${lex().approach}`;
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
  $('board-chip').textContent = roundLabel();
  $('board-title').textContent = `${l.deadline(next, s.lastBuildSprint)} · ${l.deadlineWeeks(next)}`;
  $('play-sprint').textContent = l.play(next);
  $('solo-actions').hidden = Boolean(app.session);
  $('team-bar').hidden = !app.session;
  app.session?.renderBar();
  $('list-title').textContent = l.listTitle;
  $('list-hint').textContent = app.session?.locked && !cascade ? l.lockedHint : l.listHint;
  $('board-intuition').innerHTML = `${stars(3, true)} ${esc(l.intuitionHelp)}`;
  // Manche 1 : arbitrage du COPIL quand le reste à faire dépasse le temps restant, et décisions révisables.
  const need = cascade && needsArbitrage(s);
  const more = cascade && !need && canDescope(s);
  const revise = cascade && canRevise(s);
  $('descope-bar').hidden = !(need || more);
  for (const btn of document.querySelectorAll('[data-revise]')) {
    btn.hidden = !revise;
    btn.textContent = s.sprint === 0 ? l.revisePlan : l.reviseButton;
  }
  if (cascade) {
    $('descope-hint').textContent = need ? l.arbitrageNeeded : more ? l.arbitrageMore : '';
    $('descope-hint').hidden = !(need || more);
    $('descope-open').textContent = l.descopeButton;
    $('descope-open').hidden = !(need || more);
    $('keep-scope').textContent = l.keepButton;
    $('keep-scope').hidden = !need;
  }
  $('play-sprint').disabled = need;
  $('journal-title').textContent = l.journalTitle;
  const tiles = l.stats(s, {
    weather: cascade ? projectWeather(s) : null,
    launched: s.launched,
    live: s.live.length,
    clientele: Math.round(s.clientele * 100),
    cumulative: s.cumulative,
  }).map(([v, label]) => `<div class="stat"><strong>${esc(v)}</strong><span>${esc(label)}</span></div>`).join('');
  $('board-stats').classList.toggle('stats-project', cascade);
  $('board-stats').innerHTML = (cascade ? timeVsWorkHtml(s) : '') + tiles;
  const items = workItems(s);
  $('board-list').innerHTML = items.map((id, i) => boardItemHtml(s, id, i, items.length)).join('') + (cascade ? recetteHtml(s) : '');
  const lines = s.log.slice().reverse().map((fact) => logHtml(s.mode, fact)).filter(Boolean);
  $('journal').innerHTML = lines.length ? lines.join('') : `<p class="muted">${esc(l.journalEmpty)}</p>`;
}

/** Manche 1 : temps écoulé contre travail fait, le regard d'un COPIL. */
function timeVsWorkHtml(state) {
  const l = lexicon(state.mode);
  const totalWeeks = PLANNED_SPRINTS * SPRINT_WEEKS;
  const weeks = Math.min(state.sprint, PLANNED_SPRINTS) * SPRINT_WEEKS;
  const timePct = Math.round((weeks / totalWeeks) * 100);
  const work = planWork(state);
  const workPct = planProgress(state);
  const row = (label, pct, cls) => `<div class="tvw-row"><span>${label}</span><div class="tvw-track ${cls}"><span style="width:${pct}%"></span></div><b>${pct} %</b></div>`;
  return `<div class="tvw" role="group" aria-label="Temps contre travail">
    ${row('Temps écoulé', timePct, 'tvw-time')}
    ${row('Travail fait', workPct, 'tvw-work')}
    <p>${esc(l.timeVsWork({ weeks, totalWeeks, ...work }))}</p>
  </div>`;
}

/* ---------------------------------------------------------------- Fenêtres */

function openDialog(html, afterClose, kind = 'info') {
  app.afterDialog = afterClose ?? null;
  app.dialogKind = kind;
  $('dialog-body').innerHTML = `<div class="dialog-content">${html}</div>`;
  const dialog = $('dialog');
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('.button')?.focus();
}

function reportHtml(state, report, { team = false } = {}) {
  const l = lexicon(state.mode);
  const cascade = state.mode === MODES.cascade;
  let h = `<h2 id="dialog-title">${esc(l.reportTitle(report.sprint))}</h2>`;
  if (cascade) {
    const w = l.weather(report.weather);
    h += `<p class="weather weather-${report.weather}"><span class="weather-icon" aria-hidden="true">${w.icon}</span><span><strong>Météo du projet : ${esc(w.label)}.</strong> ${esc(w.text)}</span></p>`;
    // Un COPIL pilote un plan : ni ventes ni clients tant que l'appli n'est pas sortie.
    const weeks = Math.min(report.sprint, PLANNED_SPRINTS) * SPRINT_WEEKS;
    if (report.launched) {
      h += `<p class="good launch"><span class="emo pop" aria-hidden="true">🎉</span><strong>L'appli est en ligne !</strong> Les ${state.live.length} lots du cahier des charges sortent tous en même temps.</p>`;
    } else {
      h += `<p>Temps écoulé : <strong>${weeks} semaines sur ${PLANNED_SPRINTS * SPRINT_WEEKS}</strong> · Travail fait : <strong>${report.progress} %</strong></p>`;
    }
    if (report.sales > 0) h += `<p>${esc(l.salesLine(report.sales))}</p>`;
    if (report.weather === 'stormy' && !report.developmentOver) h += `<p class="hint">${esc(l.descopeHint)}</p>`;
  } else {
    h += report.completed.length
      ? `<p class="good launch"><span class="emo pop" aria-hidden="true">🚀</span><span>Mis en ligne : <strong>${report.completed.map(nameHtml).join(', ')}</strong></span></p>`
      : '<p>Rien de nouveau en ligne ce Sprint : un élément est encore en cours.</p>';
    h += `<p>${esc(l.salesLine(report.sales))}</p>`;
    h += '<h3>Ce que disent les clients</h3>';
    h += report.quotes.length
      ? report.quotes.map((q) => `<blockquote class="quote">« ${esc(q.text)} »<footer>${esc(q.who)}</footer></blockquote>`).join('')
      : '<p class="muted">Pas de nouveau retour.</p>';
    // La valeur réelle de ce qui vient d'être mis en ligne est désormais connue : on la dit, et le Product Backlog l'affiche.
    if (report.completed.length) {
      h += `<div class="reveal"><p><strong>Ce que ça rapporte vraiment</strong>, désormais affiché dans le Product Backlog :</p><ul>${report.completed.map((id) => `<li>${nameHtml(id)} : <strong>${formatEuro(feature(id).value * EURO_PER_POINT)}</strong> par Sprint · intuition ${stars(feature(id).stars)}</li>`).join('')}</ul></div>`;
    }
  }
  for (const d of report.discoveries ?? []) {
    h += `<p class="discovery">${emo('🔍')}<strong>Travail sous-estimé :</strong> ${esc(discoveryText(state.mode, d))}</p>`;
  }
  for (const e of report.events) {
    h += `<p class="news">${emo(e.icon)}<strong>${esc(e.title)} :</strong> ${esc(l.eventText(e))}</p>`;
  }
  if (report.request) {
    const r = report.request;
    h += `<div class="request-box"><p>${emo('📨')}<strong>Demande de ${esc(l.stakeholder)} :</strong> « ${esc(r.ask)} »</p><p>${esc(l.requestAnnounce(r))}</p></div>`;
  }
  let next = report.developmentOver ? 'Fin du projet' : (team ? 'Revenir au tableau' : l.next(report.sprint + 1));
  if (cascade && report.request) next = l.seeRequest;
  h += `<button type="button" class="button button-primary" data-close>${esc(next)}</button>`;
  return h;
}

function finishHtml(state, summary, button = lexicon(state.mode).finishButton) {
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
  h += `<button type="button" class="button button-primary" data-close>${esc(button)}</button>`;
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
  openDialog(reportHtml(state, report), after, 'report');
}

/* ---------------------------------------------------------------- Demande de changement (manche 1) */

// Fenêtre de demande en deux temps : d'abord la situation (accepter ou refuser, et ce que chaque choix impose),
// puis, si l'on accepte, le choix des lots à retirer pour atteindre la cible.
function requestHtml() {
  const s = app.round;
  const r = feature(s.pendingRequest);
  const l = lexicon(s.mode);
  const jh = (pts) => esc(l.sizeLong(pts));
  const base = requestStatus(s, []);
  const left = base.forecast.left;
  const needBudget = base.over;
  const needTime = Math.max(0, base.forecast.accept.remaining - left);
  const target = Math.max(needBudget, needTime);
  const refuseGap = Math.max(0, base.forecast.refuse.remaining - left);
  const removableTotal = base.removable.reduce((sum, id) => sum + feature(id).cost, 0);
  let h = '<h2 id="dialog-title">Demande de changement</h2>';
  h += speechHtml(r.ask);
  h += `<p><strong>${nameHtml(r.id)}</strong> (${esc(r.desc)}) : ${jh(r.cost)} de lot, plus ${jh(AVENANT)} de recette (avenant). Intuition de Mme Lefèvre ${stars(r.stars)}.</p>`;

  if (app.requestStep !== 'remove') {
    // 1. La situation : ce qu'impose chaque choix.
    let accept;
    if (needBudget > removableTotal) {
      accept = `<p>Impossible : il faudrait retirer ${jh(needBudget)} pour tenir le budget signé, et il n'en reste pas assez parmi les lots pas commencés.</p>`;
    } else if (target === 0) {
      accept = '<p>☀️ Le cahier des charges absorbe la demande : rien à retirer, et le projet reste dans les temps.</p>';
    } else {
      accept = `<p>Il faudra retirer au moins <strong>${jh(target)}</strong> de lots pas encore commencés :</p><ul>`
        + (needBudget ? `<li>${jh(needBudget)} pour tenir le budget signé (obligatoire) ;</li>` : '<li>le budget signé tient déjà ;</li>')
        + (needTime ? `<li>${jh(needTime)} pour finir dans les temps, travail découvert compris${needTime > removableTotal ? ' (impossible en entier : le projet restera orageux)' : ''}.</li>` : '<li>les délais tiennent déjà.</li>')
        + '</ul>';
    }
    const refuse = refuseGap
      ? `<p>⛈️ Le cahier des charges ne change pas, mais le travail découvert dépasse déjà le temps restant de <strong>${jh(refuseGap)}</strong> : le COPIL devra arbitrer quand même.</p>`
      : '<p>☀️ Le cahier des charges ne change pas, et le projet tient dans les temps.</p>';
    const acceptButton = needBudget > removableTotal
      ? ''
      : target === 0
        ? '<button type="button" class="button button-primary" data-accept>Accepter (avenant)</button>'
        : '<button type="button" class="button button-primary" data-request-step>Accepter : choisir les lots à retirer</button>';
    h += `<div class="choices"><section class="choice"><h3>Si vous acceptez</h3>${accept}${acceptButton}</section>`
      + `<section class="choice"><h3>Si vous refusez</h3>${refuse}<button type="button" class="button button-ghost" data-refuse>Refuser</button></section></div>`;
    return h;
  }

  // 2. Accepter : retirer des lots jusqu'à la cible.
  const st = requestStatus(s, app.remove);
  const removed = app.remove.reduce((sum, id) => sum + feature(id).cost, 0);
  const timeGap = Math.max(0, st.forecast.accept.remaining - left);
  h += `<div class="panel-head"><strong>Retiré : ${jh(removed)}</strong><span class="count">objectif : ${jh(target)}</span></div>`;
  h += `<div class="meter ${removed >= target ? 'done' : ''}"><span style="width:${target ? Math.min(100, (removed / target) * 100) : 100}%"></span></div>`;
  h += '<ul class="forecast">'
    + `<li class="${st.over > 0 ? 'stormy' : 'sunny'}">${st.over > 0 ? `Budget signé : il manque ${jh(st.over)} (obligatoire pour signer).` : 'Budget signé : tenu ✓'}</li>`
    + `<li class="${timeGap > 0 ? 'stormy' : 'sunny'}">${timeGap > 0 ? `Délais : il manque ${jh(timeGap)}, le projet sera orageux et le COPIL devra arbitrer.` : 'Délais : le projet reste dans les temps ☀️'}</li>`
    + '</ul>';
  const missing = Object.keys(st.impossible).filter((id) => id !== s.pendingRequest);
  if (missing.length) h += `<p class="item-alert">Deviendraient impossibles : ${missing.map((id) => esc(feature(id).name)).join(', ')}</p>`;
  h += st.removable.length
    ? `<fieldset class="removals"><legend>Lots pas encore commencés</legend>${st.removable.map((id) => {
      const f = feature(id);
      const why = st.impossible[id] && !app.remove.includes(id) ? ` <span class="chip warn">Impossible sans « ${esc(feature(st.impossible[id]).name)} »</span>` : '';
      return `<label class="include ${why ? 'is-impossible' : ''}"><input type="checkbox" data-remove="${id}" ${app.remove.includes(id) ? 'checked' : ''}><span>${nameHtml(id)} <span class="muted nowrap">· ${esc(l.size(f.cost))} · ${stars(f.stars)}</span>${why}</span></label>`;
    }).join('')}</fieldset>`
    : '<p class="muted">Tous les lots sont commencés : plus rien ne peut être retiré.</p>';
  h += `<div class="actions"><button type="button" class="button button-primary" data-accept ${st.valid ? '' : 'disabled'}>Signer l'avenant</button><button type="button" class="button button-ghost" data-request-back>← Revenir au choix</button></div>`;
  return h;
}

function openRequestDialog() {
  app.requestStep = 'choice';
  openDialog(requestHtml(), null, 'request');
}

function refreshRequestDialog() {
  const st = requestStatus(app.round, []);
  app.remove = app.remove.filter((id) => st.removable.includes(id));
  const focused = document.activeElement?.dataset?.remove;
  $('dialog-body').innerHTML = `<div class="dialog-content">${requestHtml()}</div>`;
  if (focused) $('dialog-body').querySelector(`[data-remove="${focused}"]`)?.focus();
}

function decide(accept) {
  const id = app.round.pendingRequest;
  const remove = accept ? app.remove : [];
  // Sur l'état le plus récent : rien si la demande a déjà été tranchée par un autre membre de l'équipe.
  act((s) => (s.pendingRequest === id ? decideRequest(s, { accept, remove }) : s), renderBoard);
  app.remove = [];
  app.afterDialog = null;
  if (!app.round.pendingRequest) $('dialog').close();
}

/* ---------------------------------------------------------------- Arbitrage du COPIL (manche 1) */

/** Revoir les décisions de ce COPIL : la demande éventuelle redevient en attente et sa fenêtre se rouvre. */
function revise() {
  if (!act((s) => (canRevise(s) ? reviseDecisions(s) : s), renderBoard)) return;
  if (!app.round.planValidated) { closeDialog(); renderPlan(); show('plan'); return; }
  if (app.round.pendingRequest) { closeDialog(); app.remove = []; openRequestDialog(); }
}

function descopeHtml() {
  const s = app.round;
  const l = lexicon(s.mode);
  const st = descopeStatus(s, app.remove);
  let h = `<h2 id="dialog-title">${esc(l.descopeTitle)}</h2>`;
  h += `<p>${esc(l.descopeIntro(remainingNow(s), st.left))}</p>`;
  h += `<div class="panel-head"><strong>${esc(l.descopeGauge)}</strong><span class="count">${ratio(st.remaining, st.left)}</span></div>`;
  h += `<div class="meter ${st.weather === 'stormy' ? 'over' : ''}"><span style="width:${Math.min(100, st.left ? (st.remaining / st.left) * 100 : 100)}%"></span></div>`;
  h += `<p class="hint ${st.valid || !app.remove.length ? '' : 'is-error'}" role="status">${esc(st.message)}</p>`;
  h += `<fieldset class="removals"><legend>Retirer des lots pas encore commencés</legend>${st.removable.map((id) => {
    const f = feature(id);
    const why = st.impossible[id] ? ` <span class="chip warn">Impossible sans « ${esc(feature(st.impossible[id]).name)} »</span>` : '';
    return `<label class="include ${why ? 'is-impossible' : ''}"><input type="checkbox" data-descope="${id}" ${app.remove.includes(id) ? 'checked' : ''}><span>${nameHtml(id)} <span class="muted nowrap">· ${esc(l.size(f.cost))} · ${stars(f.stars)}</span>${why}</span></label>`;
  }).join('')}</fieldset>`;
  h += `<div class="actions"><button type="button" class="button button-primary" data-descope-ok ${st.valid ? '' : 'disabled'}>${esc(l.descopeConfirm)}</button><button type="button" class="button button-ghost" data-close>Annuler</button></div>`;
  return h;
}

const remainingNow = (s) => descopeStatus(s, []).remaining;

function openDescopeDialog() {
  app.remove = [];
  openDialog(descopeHtml(), null, 'descope');
}

/** Rafraîchit la fenêtre d'arbitrage (état changé par un coéquipier), ou la ferme si l'arbitrage n'est plus possible. */
function refreshDescopeDialog() {
  if (app.dialogKind !== 'descope') return;
  if (!canDescope(app.round)) { closeDialog(); app.remove = []; return; }
  const st = descopeStatus(app.round, []);
  app.remove = app.remove.filter((id) => st.removable.includes(id));
  const focused = document.activeElement?.dataset?.descope;
  $('dialog-body').innerHTML = `<div class="dialog-content">${descopeHtml()}</div>`;
  if (focused) $('dialog-body').querySelector(`[data-descope="${focused}"]`)?.focus();
}

function confirmDescope() {
  const remove = app.remove.slice();
  act((s) => (canDescope(s) && descopeStatus(s, remove).valid ? descope(s, remove) : s), renderBoard);
  app.remove = [];
  closeDialog();
}

/** Ferme la fenêtre sans enchaîner (l'événement « close » arrive plus tard : il est ignoré). */
function closeDialog() {
  app.afterDialog = null;
  app.dialogKind = null;
  if (!$('dialog').open) return;
  app.silentCloses += 1;
  $('dialog').close();
}

/* ---------------------------------------------------------------- Résultats */

const firstWeek = (period) => periodWeeks(period)[0];

/**
 * Questions de débrief du solo. `show` : ce qui se révèle après la discussion
 * (chart : la courbe ; kpi : lignes d'indicateurs ; truth : intuition contre réalité ; decisions : décisions des équipes).
 */
export const DEBRIEF_SOLO = [
  // D'abord l'exercice, chiffres à l'appui…
  { text: 'À quel moment la boulangerie a-t-elle gagné son premier euro dans chaque manche ? Qu\'est-ce qui l\'a permis ?', show: { chart: true, kpi: ['first', 'invested'] } },
  { text: 'Qu\'ont appris les Sprint Reviews de la manche 2 ? Comment ont-elles changé l\'ordre du Product Backlog ?', show: { surprises: true } },
  { text: 'Manche 1 : à quel COPIL avez-vous su que le projet ne tiendrait pas ? Qu\'en avez-vous fait : avenants, arbitrages, ou rien ?', show: { chart: true, kpi: ['live'] } },
  { text: 'Quelles fonctionnalités Madame Lefèvre jugeait-elle indispensables ? Qu\'en pensaient vraiment ses clients ?', show: { surprises: true, kpi: ['lowUse'] } },
  { text: 'Face aux demandes de Mme Lefèvre, vous avez décidé sur des opinions en manche 1, et avec des retours clients en manche 2. Qu\'est-ce que ça change ?', show: { kpi: ['requests'] } },
  { text: 'Quand la banque a coupé le prêt, que restait-il entre vos mains dans chaque manche ?', show: { chart: true, kpi: ['live', 'cumulative'] } },
  { text: 'Si la banque vous avait prévenus deux COPIL plus tôt, qu\'auriez-vous fait ? Et avec Scrum, qu\'est-ce que ça aurait changé ?', show: { chart: true } },
  // … puis la prise de recul.
  { text: 'COPIL et cahier des charges, puis Sprint Review et Product Backlog : qu\'est-ce que le changement de vocabulaire a changé dans votre façon de décider ?', show: {} },
];

const ALL_SHOWN = { chart: true, kpi: ['first', 'invested', 'live', 'lowUse', 'requests', 'cumulative'], surprises: true, truth: true, decisions: true };

/** Surprises de l'intuition, et quand chaque manche ou équipe les a mises en ligne. */
function surprisesHtml(columns) {
  const { underrated, overrated } = intuitionSurprises();
  const when = (c, id) => {
    const p = c.results.liveSince?.[id];
    if (!p) return '—';
    return c.kind === 1 ? `COPIL ${p}` : `Sprint ${p}`;
  };
  const head = `<thead><tr><th scope="col">Fonctionnalité</th><th scope="col">Intuition</th><th scope="col" class="num">Ventes réelles / 2 sem.</th>${columns.map((c) => `<th scope="col">En ligne · ${esc(c.head)}</th>`).join('')}</tr></thead>`;
  const rows = (list) => list.map((f) => `<tr><td>${nameHtml(f.id)}${f.requested ? ' <span class="chip request">Demande</span>' : ''}</td><td>${stars(f.stars)}</td><td class="num">${formatEuro(f.sales)}</td>${columns.map((c) => `<td>${when(c, f.id)}</td>`).join('')}</tr>`).join('');
  return `<h4>💎 Peu d'étoiles, beaucoup de ventes</h4><div class="table-wrap"><table>${head}<tbody>${rows(underrated)}</tbody></table></div>`
    + `<h4>🎈 Beaucoup d'étoiles, presque rien</h4><div class="table-wrap"><table>${head}<tbody>${rows(overrated)}</tbody></table></div>`;
}

/** Le débrief en cours : { questions, step, shown, presenter, onChange({ step, shown }) }. */
app.debrief = null;

/** Applique l'étape du débrief : la question, puis seulement les indicateurs liés, une fois révélés. */
function renderDebrief() {
  const d = app.debrief;
  if (!d) return;
  const count = d.questions.length;
  const step = Math.max(0, Math.min(d.step ?? 0, count));
  const overview = step === count;
  const q = overview ? null : d.questions[step];
  const show = overview ? ALL_SHOWN : q.show;
  const hasShow = Boolean(show.chart || show.truth || show.surprises || show.decisions || show.kpi?.length);
  const visible = overview || (d.shown && hasShow);
  $('debrief-count').textContent = overview ? 'Vue d\'ensemble' : `Question ${step + 1} sur ${count}`;
  $('debrief-question').textContent = overview ? 'Tous les indicateurs, pour conclure.' : q.text;
  let note = '';
  if (!overview && !hasShow) note = 'Pas d\'indicateur pour cette question : place à la discussion.';
  else if (!overview && !d.shown) note = d.presenter ? 'Lancez la discussion, puis révélez les indicateurs.' : 'Les indicateurs apparaîtront après votre discussion.';
  $('debrief-note').textContent = note;
  $('debrief-note').hidden = !note;
  $('debrief-controls').hidden = !d.presenter;
  $('debrief-prev').disabled = step === 0;
  $('debrief-next').disabled = overview;
  $('debrief-next').textContent = step === count - 1 ? 'Vue d\'ensemble →' : 'Suivante →';
  $('debrief-reveal').hidden = overview || !hasShow;
  $('debrief-reveal').textContent = d.shown ? 'Masquer les indicateurs' : '📊 Révéler les indicateurs';
  $('chart-panel').hidden = !(visible && show.chart);
  if (visible && show.chart) drawChart();
  const kpi = visible ? (show.kpi ?? []) : [];
  $('kpi-panel').hidden = !kpi.length;
  for (const row of $('kpi').querySelectorAll('tr[data-kpi]')) row.hidden = !kpi.includes(row.dataset.kpi);
  $('truth-panel').hidden = !(visible && show.truth);
  $('surprises-panel').hidden = !(visible && show.surprises);
  $('decisions').hidden = !(visible && show.decisions && d.teams);
  $('results-grid').hidden = $('kpi-panel').hidden && $('truth-panel').hidden;
}

function changeDebrief(patch) {
  const d = app.debrief;
  if (!d?.presenter) return;
  Object.assign(d, patch);
  renderDebrief();
  d.onChange?.({ step: d.step, shown: d.shown });
}

function renderResults() {
  const a = app.results[MODES.cascade];
  const b = app.results[MODES.increment];
  renderComparison([
    { kind: 1, label: 'Manche 1 : projet, une livraison à la fin', head: 'Manche 1 · Projet', results: a },
    { kind: 2, label: 'Manche 2 : Scrum, un incrément à chaque Sprint', head: 'Manche 2 · Scrum', results: b },
  ], { title: 'Un projet, puis Scrum : deux courbes', debrief: { questions: DEBRIEF_SOLO, step: 0, shown: false, presenter: true } });
}

/**
 * Écran de résultats : une courbe et une colonne d'indicateurs par entrée de `columns`
 * ([{ kind: 1 | 2, label, head, results, team? }]), dans l'ordre donné.
 */
function renderComparison(columns, { title, intro = '', keepScroll = false, debrief }) {
  const series = columns.map((c) => ({ kind: c.kind, label: c.label, values: c.results.curve, team: c.team }));
  const frontier = columns[0].results.lastBuildSprint;
  app.chart = { series, frontier, periods: columns[0].results.curve.map((_, i) => i + 1) };
  $('results-title').textContent = title;
  $('results-intro').innerHTML = intro;
  $('results-intro').hidden = !intro;
  drawChart();
  $('legend').innerHTML = legendHtml(series);
  const first = (r) => (r.firstSale ? `Dès la semaine ${firstWeek(r.firstSale)}` : 'Jamais');
  const invested = (r) => `${formatEuro(r.invested)}${r.neverSold ? ' (sans retour)' : ''}`;
  // Peu utilisées et demandes : on nomme les fonctionnalités, avec ce qu'elles rapportent.
  const named = (ids) => ids.map((id) => `<span class="nowrap">${nameHtml(id)} (${formatEuro(feature(id).value * EURO_PER_POINT)})</span>`).join('<br>');
  const low = (r) => (r.liveAtEnd.length ? `${r.lowUse.length} sur ${r.liveAtEnd.length}${r.lowUse.length ? `<br>${named(r.lowUse)}` : ''}` : '—');
  const reqs = (r) => (r.requestsLive.length ? `${r.requestsLive.length}<br>${named(r.requestsLive)}` : '0');
  const rows = [
    ['first', 'Premier euro encaissé', first],
    ['invested', 'Investi avant le premier euro', invested],
    ['live', 'Fonctionnalités en ligne à la fin du projet', (r) => r.liveAtEnd.length],
    ['lowUse', 'Fonctionnalités en ligne peu utilisées (100 € ou moins toutes les 2 semaines)', low],
    ['requests', 'Demandes de Mme Lefèvre mises en ligne (ventes toutes les 2 semaines)', reqs],
    ['cumulative', `Ventes cumulées après ${HORIZON_WEEKS} semaines`, (r) => `<strong>${formatEuro(r.cumulative)}</strong>`],
  ];
  $('kpi').innerHTML = `<thead><tr><th scope="col"><span hidden>Indicateur</span></th>${columns.map((c) => `<th scope="col">${esc(c.head)}</th>`).join('')}</tr></thead><tbody>`
    + rows.map(([key, label, cell]) => `<tr data-kpi="${key}"><th scope="row">${label}</th>${columns.map((c) => `<td>${cell(c.results)}</td>`).join('')}</tr>`).join('') + '</tbody>';
  $('kpi').classList.toggle('kpi-wide', columns.length > 2);
  $('surprises').innerHTML = surprisesHtml(columns);
  $('truth').innerHTML = '<thead><tr><th scope="col">Fonctionnalité</th><th scope="col">Intuition</th><th scope="col" class="num">Ventes réelles / 2 sem.</th></tr></thead><tbody>'
    + truthTable().map((t) => `<tr><td>${emo(feature(t.id).icon)}${esc(t.name)}${t.requested ? ' <span class="chip request">Demande</span>' : ''}</td><td>${stars(t.stars)}</td><td class="num">${formatEuro(t.sales)}</td></tr>`).join('') + '</tbody>';
  // Débrief : à l'arrivée sur les résultats, on repart de la première question, indicateurs cachés ;
  // ensuite, seul le présentateur fait avancer (en salle, l'étape vient de la salle).
  if (debrief) app.debrief = { ...debrief };
  show('results', { keepScroll });
  renderDebrief();
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

/* ---------------------------------------------------------------- Glisser-déposer */
// Toute la carte se saisit (hors boutons et cases à cocher), avec les événements Pointer comme dans scrum-events.
// Souris et stylet : le geste démarre au-delà de 6 px. Doigt : après un appui long de 350 ms sans bouger,
// pour qu'un glissé direct fasse toujours défiler la page ; une fois lancé, le défilement est bloqué.

const DRAG_THRESHOLD = 6;
const TOUCH_SLOP = 8;
const LONG_PRESS_MS = 350;
const AUTO_SCROLL_EDGE = 60;
let drag = null; // { id, list, render, pointerId, touch, startX, startY, x, y, timer, ghost, source, target, offsetY }

function clearDropMarks(list) {
  list.querySelectorAll('.drop-before, .drop-after').forEach((li) => li.classList.remove('drop-before', 'drop-after'));
}

// Rang d'arrivée (dans l'ordre complet) sous le pointeur, ou null hors de la liste.
function dropTarget(x, y) {
  const rect = drag.list.getBoundingClientRect();
  if (x < rect.left - 40 || x > rect.right + 40 || y < rect.top - 40 || y > rect.bottom + 40) return null;
  const rows = [...drag.list.querySelectorAll('li[data-id]')];
  if (!rows.length) return null;
  let row = rows.find((li) => { const r = li.getBoundingClientRect(); return y >= r.top && y <= r.bottom; });
  let after;
  if (row) {
    const r = row.getBoundingClientRect();
    after = y > r.top + r.height / 2;
  } else if (y < rows[0].getBoundingClientRect().top) { row = rows[0]; after = false; }
  else if (y > rows.at(-1).getBoundingClientRect().bottom) { row = rows.at(-1); after = true; }
  else return drag.target; // entre deux lignes : on garde la dernière position
  const order = app.round.order;
  let index = order.indexOf(row.dataset.id) + (after ? 1 : 0);
  if (order.indexOf(drag.id) < index) index -= 1;
  return { index, row, after };
}

function activateDrag() {
  const r = drag.source.getBoundingClientRect();
  const ghost = drag.source.cloneNode(true);
  ghost.classList.add('drag-ghost');
  ghost.removeAttribute('data-id');
  ghost.removeAttribute('data-drag');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.style.width = `${r.width}px`;
  ghost.style.left = `${r.left}px`;
  drag.offsetY = drag.y - r.top;
  document.body.append(ghost);
  document.body.classList.add('is-dragging');
  drag.source.classList.add('drag-source');
  drag.ghost = ghost;
  followPointer();
}

function followPointer() {
  drag.ghost.style.top = `${drag.y - drag.offsetY}px`;
  if (drag.y < AUTO_SCROLL_EDGE) window.scrollBy(0, -12);
  else if (drag.y > window.innerHeight - AUTO_SCROLL_EDGE) window.scrollBy(0, 12);
  drag.target = dropTarget(drag.x, drag.y);
  clearDropMarks(drag.list);
  if (drag.target) drag.target.row.classList.add(drag.target.after ? 'drop-after' : 'drop-before');
}

function onDragMove(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  drag.x = event.clientX;
  drag.y = event.clientY;
  const moved = Math.hypot(drag.x - drag.startX, drag.y - drag.startY);
  if (!drag.ghost) {
    if (drag.touch) { if (moved > TOUCH_SLOP) endDrag(); return; } // glissé avant l'appui long : on laisse défiler
    if (moved < DRAG_THRESHOLD) return;
    activateDrag();
  }
  event.preventDefault();
  followPointer();
}

function onDragEnd(event) {
  if (!drag || (event.pointerId !== undefined && event.pointerId !== drag.pointerId)) return;
  const { id, ghost, render, list } = drag;
  const target = ghost && event.type === 'pointerup' ? dropTarget(event.clientX, event.clientY) : null;
  endDrag();
  if (!target) return;
  act((st) => moveFeatureTo(st, id, target.index), render);
  list.querySelector(`button[data-move="${id}"]:not(:disabled)`)?.focus();
}

// Une fois le geste lancé au doigt, le défilement de la page est bloqué.
function onTouchMove(event) {
  if (drag?.ghost) event.preventDefault();
}

function endDrag() {
  if (!drag) return;
  clearTimeout(drag.timer);
  drag.ghost?.remove();
  drag.source?.classList.remove('drag-source');
  clearDropMarks(drag.list);
  document.body.classList.remove('is-dragging');
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', onDragEnd);
  window.removeEventListener('pointercancel', onDragEnd);
  window.removeEventListener('keydown', onDragKey);
  drag = null;
  app.onIdle?.(); // rendu d'une mise à jour de l'équipe arrivée pendant le geste
}

function onDragKey(event) {
  if (event.key === 'Escape') { event.preventDefault(); endDrag(); }
}

function enableDrag(listId, render) {
  const list = $(listId);
  list.addEventListener('pointerdown', (event) => {
    const card = event.target.closest('li[data-drag]');
    if (!card || event.button > 0 || drag) return;
    if (event.target.closest('button, input, label, a')) return;
    const touch = event.pointerType === 'touch';
    if (!touch) event.preventDefault();
    drag = {
      id: card.dataset.drag, list, render, pointerId: event.pointerId, touch,
      startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY,
      timer: null, ghost: null, target: null, source: card,
    };
    if (touch) drag.timer = setTimeout(() => { if (drag && !drag.ghost) activateDrag(); }, LONG_PRESS_MS);
    window.addEventListener('pointermove', onDragMove, { passive: false });
    window.addEventListener('pointerup', onDragEnd);
    window.addEventListener('pointercancel', onDragEnd);
    window.addEventListener('keydown', onDragKey);
  });
  list.addEventListener('contextmenu', (event) => { if (event.target.closest('li[data-drag]')) event.preventDefault(); });
}

document.addEventListener('touchmove', onTouchMove, { passive: false });

/* ---------------------------------------------------------------- Démarrage */

export function init() {
  $('start').addEventListener('click', () => {
    app.session = null;
    app.results = {};
    app.round = newRound(MODES.cascade);
    renderPlan();
    show('plan');
  });

  $('plan-list').addEventListener('change', (e) => {
    const id = e.target.dataset.toggle;
    if (!id) return;
    act((st) => toggleInPlan(st, id), renderPlan);
  });

  for (const [list, render] of [['plan-list', renderPlan], ['board-list', renderBoard]]) {
    $(list).addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-move]');
      if (!btn || btn.disabled) return;
      const id = btn.dataset.move;
      const dir = Number(btn.dataset.dir);
      act((st) => moveFeature(st, id, dir), render);
      // garder le focus sur le même bouton de la fonctionnalité déplacée
      $(list).querySelector(`button[data-move="${id}"][data-dir="${dir}"]:not(:disabled)`)?.focus();
    });
  }

  enableDrag('plan-list', renderPlan);
  enableDrag('board-list', renderBoard);

  $('validate-plan').addEventListener('click', () => {
    if (act(validatePlan, renderBoard)) show('board');
  });

  $('play-sprint').addEventListener('click', () => { if (!app.session) onPlaySprint(); });
  $('descope-open').addEventListener('click', () => { if (canDescope(app.round)) openDescopeDialog(); });
  $('keep-scope').addEventListener('click', () => { act((s) => (needsArbitrage(s) ? keepScope(s) : s), renderBoard); });
  for (const btn of document.querySelectorAll('[data-revise]')) btn.addEventListener('click', revise);

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
    else if (e.target.closest('[data-descope-ok]:not(:disabled)')) confirmDescope();
    else if (e.target.closest('[data-request-step]')) { app.requestStep = 'remove'; refreshRequestDialog(); $('dialog-body').querySelector('[data-remove]')?.focus(); }
    else if (e.target.closest('[data-request-back]')) { app.requestStep = 'choice'; app.remove = []; refreshRequestDialog(); }
  });
  dialog.addEventListener('change', (e) => {
    const cut = e.target.dataset.descope;
    if (cut) {
      app.remove = e.target.checked ? [...app.remove, cut] : app.remove.filter((x) => x !== cut);
      refreshDescopeDialog();
      return;
    }
    const id = e.target.dataset.remove;
    if (!id) return;
    app.remove = e.target.checked ? [...app.remove, id] : app.remove.filter((x) => x !== id);
    refreshRequestDialog();
  });
  // Échap ne doit pas trancher une demande de changement à la place du joueur.
  dialog.addEventListener('cancel', (e) => { if (app.round?.pendingRequest && !app.afterDialog) e.preventDefault(); });
  compactQuery.addEventListener('change', drawChart);
  $('debrief-prev').addEventListener('click', () => changeDebrief({ step: Math.max(0, app.debrief.step - 1), shown: false }));
  $('debrief-next').addEventListener('click', () => changeDebrief({ step: Math.min(app.debrief.questions.length, app.debrief.step + 1), shown: false }));
  $('debrief-reveal').addEventListener('click', () => changeDebrief({ shown: !app.debrief.shown }));
  // Fermer la fenêtre (bouton ou Échap) poursuit toujours la partie.
  dialog.addEventListener('close', () => {
    if (app.silentCloses > 0) { app.silentCloses -= 1; return; }
    const next = app.afterDialog;
    app.afterDialog = null;
    app.dialogKind = null;
    if (next) next();
    // Si le navigateur ferme quand même la fenêtre d'une demande (Échap répété), on la rouvre.
    else if (app.round?.pendingRequest) openRequestDialog();
  });
}

/** Ce que room-ui.js réutilise pour le jeu d'une équipe et les résultats collectifs. */
export const ui = {
  app, $, esc, plural, show, act, speechHtml, refreshDescopeDialog, revise, renderDebrief, renderPlan, renderBoard, openDialog, closeDialog, reportHtml, finishHtml,
  openRequestDialog, refreshRequestDialog, renderComparison, isDragging: () => Boolean(drag),
};
