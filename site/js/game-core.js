// Logique métier pure du jeu « Fournée » : ni DOM, ni hasard.
// L'état d'une manche est un objet JSON simple (tableaux, nombres, chaînes) :
// il peut être sérialisé tel quel, par exemple pour un futur mode collectif.
// Chaque fonction qui fait évoluer l'état renvoie un nouvel état sans modifier celui reçu.

import {
  FEATURES, REQUESTS, QUOTES, QUOTES_PER_REVIEW, EVENTS, EURO_PER_POINT, COST_PER_POINT,
  PLANNED_SPRINTS, LAST_SPRINT, TEAM_CAPACITY, DONE_COST, RECETTE, AVENANT, PROJECT_CAPACITY,
  CLIENT_LOSS, COMPETITOR_FROM, SPRINT_WEEKS,
} from './scenario.js';

export const MODES = { cascade: 'cascade', increment: 'increment' };

const byId = Object.fromEntries([...FEATURES, ...REQUESTS].map((f) => [f.id, f]));
const requestIds = REQUESTS.map((r) => r.id);

/** Cette fonctionnalité vient-elle d'une demande de changement de Mme Lefèvre ? */
export function isRequest(id) {
  return requestIds.includes(id);
}

export function feature(id) {
  const f = byId[id];
  if (!f) throw new Error(`Fonctionnalité inconnue : ${id}`);
  return f;
}

const clone = (state) => JSON.parse(JSON.stringify(state));
const has = (list, id) => list.includes(id);

/** Nouvelle manche. La coupure budgétaire fait partie du scénario : toujours là, jamais annoncée avant. */
export function newRound(mode) {
  if (!Object.values(MODES).includes(mode)) throw new Error(`Manche inconnue : ${mode}`);
  return {
    mode,
    sprint: 0,
    lastBuildSprint: PLANNED_SPRINTS,
    planValidated: mode === MODES.increment,
    order: FEATURES.map((f) => f.id),
    included: FEATURES.map((f) => f.id),
    progress: Object.fromEntries([...FEATURES, ...REQUESTS].map((f) => [f.id, 0])),
    done: [],
    live: [],
    revealed: [],
    shownQuotes: [],
    recette: 0,
    recetteCost: RECETTE,
    pendingRequest: null,
    requests: [],
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

/** Budget des fonctionnalités du plan (manche 1) : capacité du projet moins la recette, avenants compris. */
export function planBudget(state, recetteCost = state.recetteCost) {
  return PROJECT_CAPACITY - recetteCost;
}

/**
 * Lots impossibles d'une liste : { id → premier lot manquant de sa chaîne de prérequis }.
 * Exemple : sans la vitrine, la réservation et le paiement sont impossibles sans « Vitrine en ligne ».
 */
export function impossibleLots(items) {
  const out = {};
  for (const id of items) {
    let req = feature(id).req;
    while (req) {
      if (!has(items, req)) { out[id] = req; break; }
      req = feature(req).req;
    }
  }
  return out;
}

// Total, dépassement, lots impossibles, validité et message pour une liste de fonctionnalités.
function checkPlan(items, budget) {
  const total = items.reduce((sum, id) => sum + feature(id).cost, 0);
  const over = Math.max(0, total - budget);
  const impossible = impossibleLots(items);
  const missing = Object.entries(impossible).map(([id, req]) => ({ id, req }));
  let message;
  if (items.length === 0) message = 'Le cahier des charges est vide : ajoutez au moins un lot.';
  else if (over > 0) message = `Le cahier des charges dépasse de ${over} point${over > 1 ? 's' : ''} : retirez au moins un lot.`;
  else if (missing.length) message = `« ${feature(missing[0].id).name} » nécessite « ${feature(missing[0].req).name} ».`;
  else message = 'Le cahier des charges tient dans le budget : la commanditaire est prête à signer.';
  return { total, budget, over, missing, impossible, valid: items.length > 0 && over === 0 && missing.length === 0, message };
}

/** Statut du plan de la manche 1 : total, dépassement, prérequis absents, validité et message. */
export function planStatus(state) {
  return checkPlan(workItems(state), planBudget(state));
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

/**
 * Place une fonctionnalité au rang `index` de la liste (0 = en haut), mêmes règles que les flèches.
 * Les éléments terminés restent où ils sont et peuvent être enjambés.
 */
export function moveFeatureTo(state, id, index) {
  if (!canMove(state, id)) throw new Error('Cette fonctionnalité ne peut pas changer de rang.');
  const from = state.order.indexOf(id);
  const to = Math.max(0, Math.min(state.order.length - 1, Math.trunc(index)));
  if (from < 0 || from === to) return state;
  const next = clone(state);
  next.order.splice(from, 1);
  next.order.splice(to, 0, id);
  return next;
}

/** Manche 1 : valide le plan, qui ne peut plus changer ensuite. */
export function validatePlan(state) {
  if (!editablePlan(state)) throw new Error('Aucun plan à valider.');
  const status = planStatus(state);
  if (!status.valid) throw new Error(status.message);
  const next = clone(state);
  next.planValidated = true;
  next.log.push({ sprint: 0, kind: 'plan', total: status.total });
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
  const total = items.reduce((sum, id) => sum + feature(id).cost, 0) + state.recetteCost;
  const doneSoFar = items.reduce((sum, id) => sum + Math.min(state.progress[id], feature(id).cost), 0) + state.recette;
  return Math.round((doneSoFar / total) * 100);
}

/** État d'une fonctionnalité pour l'affichage. */
export function featureState(state, id) {
  const f = feature(id);
  if (has(state.live, id)) return 'live';
  if (has(state.done, id)) return 'awaiting';
  if (state.progress[id] > 0) return 'in-progress';
  return 'todo';
}

/**
 * Dépendance d'un élément dans une liste ordonnée (par défaut la liste travaillée) :
 * « misplaced » s'il est placé au-dessus de son prérequis non terminé, ou si ce prérequis est lui-même
 * « misplaced » (l'équipe le sautera, et tout ce qui en dépend avec lui) ;
 * « after » s'il est bien placé sous un prérequis non terminé lui-même bien placé ; null sinon.
 */
export function dependencyState(state, id, list = workItems(state)) {
  const req = feature(id).req;
  if (!req || has(state.done, id) || has(state.done, req)) return null;
  const i = list.indexOf(id);
  const j = list.indexOf(req);
  if (i < 0 || j < 0) return null;
  if (j > i) return 'misplaced';
  return dependencyState(state, req, list) === 'misplaced' ? 'misplaced' : 'after';
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
    if (allDone && capacity > 0 && state.recette < state.recetteCost) {
      const use = Math.min(capacity, state.recetteCost - state.recette);
      state.recette += use;
      state.spent += use;
    }
    if (allDone && state.recette >= state.recetteCost && !state.launched) {
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
  if (state.pendingRequest) throw new Error('Une demande de changement attend une décision.');
  const next = clone(state);
  next.sprint += 1;
  const sprint = next.sprint;
  const sales = earn(next, sprint);
  const { completed, launched } = build(next);
  const quotes = review(next);
  const events = EVENTS.filter((e) => e.after === sprint);
  for (const e of events) if (e.lastBuildSprint) next.lastBuildSprint = Math.min(next.lastBuildSprint, e.lastBuildSprint);

  const progress = next.mode === MODES.cascade ? planProgress(next) : null;
  const weather = next.mode === MODES.cascade ? projectWeather(next) : null;
  next.log.push({ sprint, kind: 'sprint', completed: completed.slice(), launched, progress, weather, sales: Math.round(sales) });
  for (const q of quotes) next.log.push({ sprint, kind: 'quote', quote: q.id });
  for (const e of events) next.log.push({ sprint, kind: 'event', event: e.id });

  const request = REQUESTS.find((r) => r.after === sprint && !developmentOver(next)) ?? null;
  if (request) {
    next.log.push({ sprint, kind: 'request', request: request.id });
    if (next.mode === MODES.cascade) {
      next.pendingRequest = request.id;
    } else {
      next.order.push(request.id);
      next.requests.push({ id: request.id, sprint, decision: 'backlog', removed: [] });
      next.log.push({ sprint, kind: 'decision', request: request.id, decision: 'backlog', removed: [] });
    }
  }

  return {
    state: next,
    report: {
      sprint, sales, completed, launched, progress, weather, quotes, events, request,
      nothingLive: next.live.length === 0,
      developmentOver: developmentOver(next),
    },
  };
}

/** Fin du développement : joue les Sprints suivants sans construction jusqu'au Sprint 10. */
export function finishRound(state) {
  if (!developmentOver(state)) throw new Error("Le développement n'est pas terminé.");
  if (state.finished) throw new Error('La manche est déjà terminée.');
  if (state.pendingRequest) throw new Error('Une demande de changement attend une décision.');
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
    requestsLive: state.liveAtEnd.filter(isRequest),
    lastBuildSprint: state.lastBuildSprint,
    lowUse,
    cumulative: Math.round(state.cumulative),
  };
}

/** Fonctionnalités triées par valeur réelle décroissante (« intuition contre réalité »). */
export function truthTable() {
  return [...FEATURES, ...REQUESTS]
    .sort((a, b) => b.value - a.value)
    .map((f) => ({ id: f.id, name: f.name, stars: f.stars, sales: f.value * EURO_PER_POINT, requested: isRequest(f.id) }));
}

/* ---------- Demandes de changement (manche 1) ---------- */

/** Une fonctionnalité du plan peut-elle être retirée pour faire de la place ? (aucun point reçu) */
export function canRemove(state, id) {
  return workItems(state).includes(id) && !has(state.done, id) && state.progress[id] === 0;
}

/** Plan obtenu si la demande en attente est acceptée en retirant `remove`. */
export function requestStatus(state, remove = []) {
  const id = state.pendingRequest;
  if (!id) throw new Error('Aucune demande de changement en attente.');
  const removable = workItems(state).filter((x) => canRemove(state, x));
  const items = [...workItems(state).filter((x) => !remove.includes(x)), id];
  const status = checkPlan(items, planBudget(state, state.recetteCost + AVENANT));
  const blocked = remove.filter((x) => !removable.includes(x));
  if (blocked.length) {
    return { ...status, removable, valid: false, message: `« ${feature(blocked[0]).name} » est déjà commencé : ce lot ne peut plus être retiré.` };
  }
  let message = status.message;
  if (status.over > 0) message = `Le cahier des charges dépasserait le budget de ${status.over} point${status.over > 1 ? 's' : ''} : retirez des lots pas encore commencés.`;
  else if (status.valid) message = 'Le cahier des charges tient dans le budget : le COPIL peut signer l\'avenant.';
  return { ...status, removable, message };
}

/**
 * Accepte (avec les retraits) ou refuse la demande en attente.
 * `reason: 'timeout'` : refus d'office, faute de décision au lancement de la période suivante (mode collectif).
 */
export function decideRequest(state, { accept, remove = [], reason = null }) {
  const id = state.pendingRequest;
  if (!id) throw new Error('Aucune demande de changement en attente.');
  const next = clone(state);
  if (accept) {
    const status = requestStatus(state, remove);
    if (!status.valid) throw new Error(status.message);
    next.included = [...next.included.filter((x) => !remove.includes(x)), id];
    next.order = [...next.order.filter((x) => x !== id), id];
    next.recetteCost += AVENANT;
    next.log.push({ sprint: next.sprint, kind: 'decision', request: id, decision: 'accepted', removed: remove.slice() });
  } else {
    const entry = { sprint: next.sprint, kind: 'decision', request: id, decision: 'refused', removed: [] };
    if (reason === 'timeout') entry.reason = 'timeout';
    next.log.push(entry);
  }
  const record = { id, sprint: next.sprint, decision: accept ? 'accepted' : 'refused', removed: accept ? remove.slice() : [] };
  if (!accept && reason === 'timeout') record.reason = 'timeout';
  next.requests.push(record);
  next.pendingRequest = null;
  return next;
}

/* ---------- Calendrier ---------- */

/** Semaines couvertes par une période (1 à 10) : [2p − 1, 2p]. */
export function periodWeeks(period) {
  return [period * SPRINT_WEEKS - 1, period * SPRINT_WEEKS];
}

/* ---------- Météo du projet (manche 1) ---------- */

/** Points restant à faire : lots du plan non terminés, puis recette (avenants compris). */
export function remainingWork(state) {
  const items = workItems(state);
  return items.reduce((sum, id) => sum + Math.max(0, feature(id).cost - state.progress[id]), 0)
    + Math.max(0, state.recetteCost - state.recette);
}

/** « delivered » une fois l'appli sortie ; « sunny » si le reste tient dans la capacité restante ; « stormy » sinon. */
export function projectWeather(state) {
  if (state.launched) return 'delivered';
  const capacityLeft = Math.max(0, state.lastBuildSprint - state.sprint) * TEAM_CAPACITY;
  return remainingWork(state) <= capacityLeft ? 'sunny' : 'stormy';
}

/* ---------- Mode collectif : état relu depuis la base, bilans reconstruits ---------- */

// Tableau depuis une valeur de la base : Firebase ne stocke pas les tableaux vides
// et renvoie parfois un tableau sous forme d'objet à clés numériques.
function toArray(value) {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value.filter((v) => v !== undefined && v !== null);
  if (typeof value === 'object') {
    return Object.keys(value).sort((a, b) => Number(a) - Number(b)).map((k) => value[k]).filter((v) => v !== undefined && v !== null);
  }
  return [];
}

function reviveEntry(entry) {
  const e = { ...entry };
  if (e.kind === 'sprint') {
    e.completed = toArray(e.completed);
    e.launched = Boolean(e.launched);
    e.progress = e.progress ?? null;
    e.weather = e.weather ?? null;
    e.sales = e.sales ?? 0;
  }
  if (e.kind === 'decision') e.removed = toArray(e.removed);
  return e;
}

/**
 * Reconstruit un état complet à partir d'un état relu depuis la base (Firebase ne stocke
 * ni tableaux vides ni null) : mêmes champs et mêmes types que `newRound`.
 */
export function reviveRound(raw) {
  if (!raw || !raw.mode) return null;
  const base = newRound(raw.mode);
  const out = {};
  for (const [key, def] of Object.entries(base)) {
    const v = raw[key];
    if (Array.isArray(def)) out[key] = toArray(v);
    else if (key === 'progress') out[key] = { ...def, ...(v ?? {}) };
    else out[key] = v === undefined ? def : v;
  }
  out.log = toArray(raw.log).map(reviveEntry);
  out.requests = toArray(raw.requests).map((r) => ({ ...r, removed: toArray(r.removed) }));
  out.liveAtEnd = out.finished ? toArray(raw.liveAtEnd) : null;
  return out;
}

/** Bilan d'une période reconstruit depuis le journal de l'état (mêmes champs utiles que `playSprint`). */
export function reportFromState(state, sprint = state.sprint) {
  const entries = state.log.filter((e) => e.sprint === sprint);
  const main = entries.find((e) => e.kind === 'sprint');
  if (!main) return null;
  const requestEntry = entries.find((e) => e.kind === 'request');
  const buildEnd = Math.min(state.lastBuildSprint, LAST_SPRINT);
  return {
    sprint,
    sales: main.sales,
    completed: main.completed.slice(),
    launched: main.launched,
    progress: main.progress,
    weather: main.weather,
    quotes: entries.filter((e) => e.kind === 'quote').map((e) => QUOTES.find((q) => q.id === e.quote)).filter(Boolean),
    events: entries.filter((e) => e.kind === 'event').map((e) => EVENTS.find((x) => x.id === e.event)).filter(Boolean),
    request: requestEntry ? feature(requestEntry.request) : null,
    developmentOver: sprint >= buildEnd,
  };
}

/** Résumé de fin du projet d'une manche terminée (mêmes champs que celui de `finishRound`). */
export function finishSummary(state) {
  if (!state.finished) return null;
  const liveAtEnd = state.liveAtEnd ?? [];
  return {
    lastBuildSprint: state.lastBuildSprint,
    launched: state.mode === MODES.cascade ? state.launched : liveAtEnd.length > 0,
    liveCount: liveAtEnd.length,
    doneOffline: state.done.filter((id) => !has(liveAtEnd, id)).length,
    cumulative: state.cumulative,
  };
}
