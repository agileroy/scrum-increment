// Logique métier pure du jeu « Fournée » : ni DOM, ni hasard.
// L'état d'une manche est un objet JSON simple (tableaux, nombres, chaînes) :
// il peut être sérialisé tel quel, par exemple pour un futur mode collectif.
// Chaque fonction qui fait évoluer l'état renvoie un nouvel état sans modifier celui reçu.

import {
  FEATURES, QUOTES, QUOTES_PER_REVIEW, EVENTS, EURO_PER_POINT, COST_PER_POINT,
  PLANNED_SPRINTS, LAST_SPRINT, TEAM_CAPACITY, DONE_COST, RECETTE, PLAN_BUDGET,
  CLIENT_LOSS, COMPETITOR_FROM,
} from './scenario.js';

export const MODES = { cascade: 'cascade', increment: 'increment' };

const byId = Object.fromEntries(FEATURES.map((f) => [f.id, f]));

export function feature(id) {
  const f = byId[id];
  if (!f) throw new Error(`Fonctionnalité inconnue : ${id}`);
  return f;
}

const clone = (state) => JSON.parse(JSON.stringify(state));
const has = (list, id) => list.includes(id);

/** Nouvelle manche. `cut` active la coupure budgétaire. */
export function newRound(mode, { cut = true } = {}) {
  if (!Object.values(MODES).includes(mode)) throw new Error(`Manche inconnue : ${mode}`);
  return {
    mode,
    cut: Boolean(cut),
    sprint: 0,
    lastBuildSprint: PLANNED_SPRINTS,
    planValidated: mode === MODES.increment,
    order: FEATURES.map((f) => f.id),
    included: FEATURES.map((f) => f.id),
    progress: Object.fromEntries(FEATURES.map((f) => [f.id, 0])),
    done: [],
    live: [],
    revealed: [],
    shownQuotes: [],
    recette: 0,
    launched: false,
    clientele: 1,
    cumulative: 0,
    curve: [],
    spent: 0,
    firstSale: null,
    spentBeforeFirstSale: null,
    liveAtEnd: null,
    finished: false,
    log: [],
  };
}

/** Capacité de construction d'un Sprint. */
export function buildCapacity(state) {
  return state.mode === MODES.cascade ? TEAM_CAPACITY : TEAM_CAPACITY - DONE_COST;
}

/** Fonctionnalités travaillées, dans l'ordre : le plan (manche 1) ou tout le Product Backlog (manche 2). */
export function workItems(state) {
  return state.mode === MODES.cascade ? state.order.filter((id) => has(state.included, id)) : state.order.slice();
}

/** Statut du plan de la manche 1 : total, dépassement, prérequis absents, validité et message. */
export function planStatus(state) {
  const items = workItems(state);
  const total = items.reduce((sum, id) => sum + feature(id).cost, 0);
  const over = Math.max(0, total - PLAN_BUDGET);
  const missing = items
    .filter((id) => feature(id).req && !has(items, feature(id).req))
    .map((id) => ({ id, req: feature(id).req }));
  let message;
  if (items.length === 0) message = 'Le plan est vide : ajoutez au moins une fonctionnalité.';
  else if (over > 0) message = `Le plan dépasse de ${over} point${over > 1 ? 's' : ''} : retirez au moins une fonctionnalité.`;
  else if (missing.length) message = `« ${feature(missing[0].id).name} » nécessite « ${feature(missing[0].req).name} ».`;
  else message = 'Le plan tient dans le budget. Le comité est prêt à signer.';
  return { total, budget: PLAN_BUDGET, over, missing, valid: items.length > 0 && over === 0 && missing.length === 0, message };
}

function editablePlan(state) {
  return state.mode === MODES.cascade && !state.planValidated;
}

/** Manche 1, avant validation : retire ou remet une fonctionnalité dans le plan. */
export function toggleInPlan(state, id) {
  feature(id);
  if (!editablePlan(state)) throw new Error('Le plan ne peut plus changer.');
  const next = clone(state);
  next.included = has(next.included, id) ? next.included.filter((x) => x !== id) : [...next.included, id];
  return next;
}

/** Peut-on changer le rang de cette fonctionnalité ? */
export function canMove(state, id) {
  if (state.finished) return false;
  if (state.mode === MODES.cascade) return editablePlan(state);
  return !has(state.done, id);
}

/** Déplace une fonctionnalité d'un rang (direction -1 : vers le haut, +1 : vers le bas). */
export function moveFeature(state, id, direction) {
  if (!canMove(state, id)) throw new Error('Cette fonctionnalité ne peut pas changer de rang.');
  const i = state.order.indexOf(id);
  const j = i + Math.sign(direction);
  if (i < 0 || j < 0 || j >= state.order.length) return state;
  const next = clone(state);
  [next.order[i], next.order[j]] = [next.order[j], next.order[i]];
  return next;
}

/** Manche 1 : valide le plan, qui ne peut plus changer ensuite. */
export function validatePlan(state) {
  if (!editablePlan(state)) throw new Error('Aucun plan à valider.');
  const status = planStatus(state);
  if (!status.valid) throw new Error(status.message);
  const next = clone(state);
  next.planValidated = true;
  next.log.push({ sprint: 0, kind: 'plan', text: `Plan de ${status.total} points validé et signé par le comité.` });
  return next;
}

/** Ventes d'un Sprint avec les fonctionnalités en ligne et la part de clients restante. */
export function salesRate(state) {
  const points = state.live
    .filter((id) => !feature(id).req || has(state.live, feature(id).req))
    .reduce((sum, id) => sum + feature(id).value, 0);
  return points * EURO_PER_POINT * state.clientele;
}

/** Avancement du plan de la manche 1, recette comprise, en pourcentage entier. */
export function planProgress(state) {
  const items = workItems(state);
  const total = items.reduce((sum, id) => sum + feature(id).cost, 0) + RECETTE;
  const doneSoFar = items.reduce((sum, id) => sum + Math.min(state.progress[id], feature(id).cost), 0) + state.recette;
  return Math.round((doneSoFar / total) * 100);
}

/** État d'une fonctionnalité pour l'affichage. */
export function featureState(state, id) {
  const f = feature(id);
  if (has(state.live, id)) return 'live';
  if (has(state.done, id)) return 'awaiting';
  if (state.progress[id] > 0) return 'in-progress';
  if (f.req && !has(state.done, f.req)) return 'blocked';
  return 'todo';
}

// Pertes de clients et ventes du Sprint `sprint`, avec ce qui est en ligne au début du Sprint.
function earn(state, sprint) {
  if (sprint >= COMPETITOR_FROM && state.live.length === 0) state.clientele *= CLIENT_LOSS;
  const sales = salesRate(state);
  if (sales > 0 && state.firstSale === null) {
    state.firstSale = sprint;
    state.spentBeforeFirstSale = state.spent;
  }
  state.cumulative += sales;
  state.curve.push(Math.round(state.cumulative));
  return sales;
}

// Construction dans l'ordre de la liste, puis mise en ligne de fin de Sprint.
function build(state) {
  let capacity = buildCapacity(state);
  const items = workItems(state);
  const completed = [];
  for (const id of items) {
    if (capacity <= 0) break;
    if (has(state.done, id)) continue;
    const f = feature(id);
    if (f.req && !has(state.done, f.req)) continue;
    const use = Math.min(capacity, f.cost - state.progress[id]);
    state.progress[id] += use;
    state.spent += use;
    capacity -= use;
    if (state.progress[id] >= f.cost) {
      state.done.push(id);
      completed.push(id);
    }
  }
  let launched = false;
  if (state.mode === MODES.cascade) {
    const allDone = items.every((id) => has(state.done, id));
    if (allDone && capacity > 0 && state.recette < RECETTE) {
      const use = Math.min(capacity, RECETTE - state.recette);
      state.recette += use;
      state.spent += use;
    }
    if (allDone && state.recette >= RECETTE && !state.launched) {
      state.launched = launched = true;
      state.live = items.slice();
      state.revealed = items.slice();
    }
  } else {
    for (const id of completed) {
      state.live.push(id);
      state.revealed.push(id);
    }
  }
  return { completed, launched };
}

// Nouveaux retours clients de la Sprint Review (manche 2 seulement).
function review(state) {
  if (state.mode !== MODES.increment) return [];
  const quotes = [];
  for (const q of QUOTES) {
    if (quotes.length >= QUOTES_PER_REVIEW) break;
    if (has(state.shownQuotes, q.id) || !has(state.live, q.need) || (q.notLive && has(state.live, q.notLive))) continue;
    state.shownQuotes.push(q.id);
    quotes.push(q);
  }
  return quotes;
}

/** Le développement est-il terminé (dernier Sprint de développement joué) ? */
export function developmentOver(state) {
  return state.sprint >= state.lastBuildSprint;
}

/** Joue le Sprint suivant et renvoie le nouvel état et le compte rendu du Sprint. */
export function playSprint(state) {
  if (!state.planValidated) throw new Error("Le plan doit être validé avant le premier Sprint.");
  if (developmentOver(state)) throw new Error('Le développement est terminé.');
  const next = clone(state);
  next.sprint += 1;
  const sprint = next.sprint;
  const sales = earn(next, sprint);
  const { completed, launched } = build(next);
  const quotes = review(next);
  const events = EVENTS.filter((e) => e.after === sprint && (!e.optional || next.cut));
  for (const e of events) if (e.lastBuildSprint) next.lastBuildSprint = Math.min(next.lastBuildSprint, e.lastBuildSprint);

  const progress = next.mode === MODES.cascade ? planProgress(next) : null;
  let text;
  if (next.mode === MODES.cascade) text = launched ? `avancement ${progress} %, appli en ligne.` : `avancement ${progress} %.`;
  else text = completed.length ? `${completed.map((id) => feature(id).name).join(', ')} en ligne.` : 'élément en cours.';
  next.log.push({ sprint, kind: 'sprint', text, sales: Math.round(sales) });
  for (const q of quotes) next.log.push({ sprint, kind: 'quote', text: q.text, who: q.who });
  for (const e of events) next.log.push({ sprint, kind: 'event', text: e.log });

  return {
    state: next,
    report: {
      sprint, sales, completed, launched, progress, quotes, events,
      nothingLive: next.live.length === 0,
      developmentOver: developmentOver(next),
    },
  };
}

/** Fin du développement : joue les Sprints suivants sans construction jusqu'au Sprint 10. */
export function finishRound(state) {
  if (!developmentOver(state)) throw new Error("Le développement n'est pas terminé.");
  if (state.finished) throw new Error('La manche est déjà terminée.');
  const next = clone(state);
  next.liveAtEnd = next.live.slice();
  const lastBuildSprint = next.sprint;
  for (let s = next.sprint + 1; s <= LAST_SPRINT; s++) earn(next, s);
  next.sprint = LAST_SPRINT;
  next.finished = true;
  return {
    state: next,
    summary: {
      lastBuildSprint,
      launched: next.mode === MODES.cascade ? next.launched : next.liveAtEnd.length > 0,
      liveCount: next.liveAtEnd.length,
      doneOffline: next.done.filter((id) => !has(next.liveAtEnd, id)).length,
      cumulative: next.cumulative,
    },
  };
}

/** Résultats d'une manche terminée, pour l'écran de comparaison. */
export function roundResults(state) {
  if (!state.finished) throw new Error("La manche n'est pas terminée.");
  const lowUse = state.liveAtEnd.filter((id) => feature(id).value * EURO_PER_POINT <= 100);
  const investedPoints = state.firstSale === null ? state.spent : state.spentBeforeFirstSale;
  return {
    mode: state.mode,
    curve: state.curve.slice(),
    firstSale: state.firstSale,
    invested: investedPoints * COST_PER_POINT,
    neverSold: state.firstSale === null,
    liveAtEnd: state.liveAtEnd.slice(),
    lowUse,
    cumulative: Math.round(state.cumulative),
  };
}

/** Fonctionnalités triées par valeur réelle décroissante (« intuition contre réalité »). */
export function truthTable() {
  return FEATURES.slice()
    .sort((a, b) => b.value - a.value)
    .map((f) => ({ id: f.id, name: f.name, stars: f.stars, sales: f.value * EURO_PER_POINT }));
}
