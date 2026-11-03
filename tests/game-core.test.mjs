import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newRound, planStatus, toggleInPlan, moveFeature, validatePlan, playSprint, finishRound,
  roundResults, canMove, featureState, developmentOver, truthTable,
  requestStatus, decideRequest, canRemove, impossibleLots, dependencyState, moveFeatureTo, periodWeeks, projectWeather, planStatus as status,
  effectiveCost, underestimate, canDescope, descopeStatus, descope, decisionTrail,
} from '../site/js/game-core.js';

const SMART_ORDER = ['vitrine', 'resa', 'alerte', 'gateaux', 'cc', 'fidelite', 'paiement', 'livraison', 'avis'];

const LEAN = ['vitrine', 'resa', 'alerte', 'gateaux', 'cc', 'fidelite'];

// Manche 1 avec un cahier des charges limité aux lots `keep`, validé.
function cascadeWith(keep) {
  let s = newRound('cascade');
  for (const id of s.order) if (!keep.includes(id)) s = toggleInPlan(s, id);
  return validatePlan(s);
}

// Manche 1 avec le cahier des charges de 61 points (tout sauf les avis clients).
function cascadeWithoutReviews() {
  let s = newRound('cascade');
  s = toggleInPlan(s, 'avis');
  return validatePlan(s);
}

// Joue un Sprint ; en manche 1, tranche la demande éventuelle avec `decide` (refus par défaut).
function sprint(state, decide = () => ({ accept: false })) {
  const r = playSprint(state);
  if (r.state.pendingRequest) r.state = decideRequest(r.state, decide(r.state));
  return r;
}

function playDevelopment(state, decide) {
  const reports = [];
  while (!developmentOver(state)) {
    const r = sprint(state, decide);
    state = r.state;
    reports.push(r.report);
  }
  return { state, reports };
}

function playAll(state, decide) {
  const { state: s, reports } = playDevelopment(state, decide);
  const { state: done, summary } = finishRound(s);
  return { state: done, reports, summary, results: roundResults(done) };
}

/* ---------- Construction ---------- */

test('Première vente : la vitrine livrée au Sprint 1 rapporte au Sprint 2', () => {
  let s = newRound('increment');
  let r = playSprint(s);
  assert.deepEqual(r.report.completed, ['vitrine']);
  assert.equal(r.report.sales, 0);
  r = playSprint(r.state);
  assert.equal(r.report.sales, 200);
});

test('Prérequis manquant : sauté sans points, le reste continue', () => {
  // vitrine finie, paiement (qui attend la réservation) au-dessus de l'alerte et des gâteaux
  let t = newRound('increment');
  t.order = ['vitrine', 'paiement', 'alerte', 'gateaux', 'resa', 'livraison', 'fidelite', 'avis', 'cc'];
  t.done.push('vitrine'); t.live.push('vitrine'); t.progress.vitrine = 9; t.extra.vitrine = 4;
  const r = playSprint(t);
  // le paiement est sauté sans points, l'alerte reçoit ses 4 points, les 6 restants vont aux gâteaux
  assert.equal(r.state.progress.paiement, 0);
  assert.equal(r.state.progress.alerte, 4);
  assert.ok(r.report.completed.includes('alerte'));
  assert.equal(r.state.progress.gateaux, 6);
});

test('une fonctionnalité non terminée garde ses points', () => {
  const r = playSprint(newRound('increment'));
  assert.equal(r.state.progress.resa, 5); // vitrine 5, puis 5 points sur la réservation
  assert.equal(featureState(r.state, 'resa'), 'in-progress');
});

/* ---------- Manche 1 ---------- */

test('Plan par défaut : 66 points, validation refusée', () => {
  const s = newRound('cascade');
  const st = planStatus(s);
  assert.equal(st.total, 66);
  assert.equal(st.over, 2);
  assert.equal(st.valid, false);
  assert.match(st.message, /dépasse de 10 jours\/homme/);
  assert.throws(() => validatePlan(s));
  assert.throws(() => playSprint(s));
});

test('Prérequis retiré : message et validation impossible', () => {
  let s = newRound('cascade');
  s = toggleInPlan(s, 'resa');
  const st = planStatus(s);
  assert.equal(st.valid, false);
  assert.match(st.message, /« Paiement en ligne » nécessite « Réservation de pain »/);
});

test('plan vide refusé', () => {
  let s = newRound('cascade');
  for (const id of s.order) s = toggleInPlan(s, id);
  assert.equal(planStatus(s).valid, false);
});

test('Plan figé une fois validé', () => {
  const s = cascadeWithoutReviews();
  assert.equal(canMove(s, 'vitrine'), false);
  assert.throws(() => moveFeature(s, 'vitrine', 1));
  assert.throws(() => toggleInPlan(s, 'vitrine'));
});

test('Cahier des charges resserré : le travail découvert empêche la sortie avant la coupure', () => {
  const { reports, results, state } = playAll(cascadeWith(LEAN));
  assert.equal(reports.length, 5);
  assert.ok(reports.every((r) => !r.launched));
  // 39 points + 10 points découverts sur le click & collect et les gâteaux + recette de 8 + 4 points d'anomalies
  assert.equal(39 + 10 + 8 + 4, 61);
  assert.deepEqual(state.extra, { cc: 4, gateaux: 6, recette: 4 });
  assert.equal(results.cumulative, 0);
});

test('Tout petit cahier des charges : sortie au COPIL 4, avant la coupure', () => {
  const { reports, results } = playAll(cascadeWith(['vitrine', 'resa', 'alerte', 'gateaux']));
  assert.equal(reports[3].launched, true);
  assert.equal(results.liveAtEnd.length, 4);
  assert.equal(results.firstSale, 5);
  assert.deepEqual(periodWeeks(results.firstSale), [9, 10]);
});

test('fonctionnalités terminées hors ligne jusqu\'à la recette', () => {
  let s = cascadeWithoutReviews();
  for (let i = 0; i < 3; i++) s = sprint(s).state;
  assert.ok(s.done.length > 0);
  assert.equal(s.live.length, 0);
  assert.equal(featureState(s, s.done[0]), 'awaiting');
});

test('Sortie tardive : cahier des charges de 32 points, sorti au COPIL 5, 0,9³ des clients', () => {
  const { reports, results, state } = playAll(cascadeWith(['vitrine', 'resa', 'alerte', 'gateaux', 'cc']));
  assert.equal(reports[4].launched, true);
  assert.equal(results.firstSale, 6);
  assert.ok(Math.abs(state.clientele - 0.9 ** 3) < 1e-12);
});

test('Appli jamais sortie', () => {
  const { reports, results, summary } = playAll(cascadeWithoutReviews());
  assert.equal(reports.length, 5);
  assert.equal(summary.launched, false);
  assert.ok(summary.doneOffline > 0);
  assert.equal(results.cumulative, 0);
  assert.deepEqual(results.curve, Array(10).fill(0));
  assert.equal(results.neverSold, true);
  assert.equal(results.invested, 60 * 500);
});

/* ---------- Manche 2 ---------- */

test('Valeur révélée : réservation en ligne au Sprint 2', () => {
  let s = newRound('increment');
  s = playSprint(s).state;
  assert.ok(!s.revealed.includes('resa'));
  const r = playSprint(s);
  assert.ok(r.report.completed.includes('resa'));
  assert.ok(r.state.live.includes('resa'));
  assert.ok(r.state.revealed.includes('resa'));
});

test('déplacement : fonctionnalité terminée figée, les autres bougent', () => {
  let s = playSprint(newRound('increment')).state;
  assert.equal(canMove(s, 'vitrine'), false);
  assert.throws(() => moveFeature(s, 'vitrine', 1));
  const moved = moveFeature(s, 'alerte', -1);
  assert.equal(moved.order.indexOf('alerte'), s.order.indexOf('alerte') - 1);
  const last = s.order.at(-1);
  assert.equal(moveFeature(s, last, 1), s); // déjà en bas
});

test('Premiers retours dès le Sprint 1, quel que soit l\'ordre', () => {
  const worst = ['livraison', 'paiement', 'cc', 'resa', 'gateaux', 'fidelite', 'avis', 'alerte', 'vitrine'];
  const r = playSprint({ ...newRound('increment'), order: worst });
  assert.deepEqual(r.state.live, ['vitrine']);
  assert.equal(r.report.nothingLive, false);
  assert.ok(r.report.quotes.length > 0);
});

test('Aucun retour avant la sortie (manche 1)', () => {
  const r = playSprint(cascadeWithoutReviews());
  assert.equal(r.report.nothingLive, true);
  assert.deepEqual(r.report.quotes, []);
});

test('retours clients : au plus trois, dans l\'ordre, sans répétition, indices qui disparaissent', () => {
  let s = newRound('increment');
  let r = playSprint(s);
  assert.deepEqual(r.report.quotes.map((q) => q.id), ['tradition', 'anniv']);
  r = playSprint(r.state);
  assert.deepEqual(r.report.quotes.map((q) => q.id), ['resa-ok', 'pas-livre', 'croissants']);
  r = playSprint(r.state);
  assert.deepEqual(r.report.quotes.map((q) => q.id), ['comptoir']);
  const shown = new Set();
  let st = newRound('increment');
  st.order = SMART_ORDER.slice();
  while (!developmentOver(st)) {
    const x = playSprint(st);
    st = x.state;
    assert.ok(x.report.quotes.length <= 3);
    for (const q of x.report.quotes) {
      assert.ok(!shown.has(q.id));
      shown.add(q.id);
      if (q.notLive) assert.ok(!st.live.includes(q.notLive));
    }
  }
});

test('Indice qui disparaît : « gâteaux d\'anniversaire » absent une fois les gâteaux en ligne', () => {
  let s = newRound('increment');
  s.order = ['vitrine', 'gateaux', ...s.order.filter((x) => !['vitrine', 'gateaux'].includes(x))];
  // vitrine 5 + gâteaux 5/9 au Sprint 1, gâteaux finis au Sprint 2 : l'indice ne doit jamais dépasser ce moment
  let r = playSprint(s);
  assert.ok(r.report.quotes.some((q) => q.id === 'anniv'));
  r = playSprint(r.state);
  assert.ok(r.state.live.includes('gateaux'));
  const fresh = { ...r.state, shownQuotes: [] };
  const r3 = playSprint(fresh);
  assert.ok(!r3.report.quotes.some((q) => q.id === 'anniv'));
});

/* ---------- Imprévus ---------- */

test('concurrent annoncé à la Review du Sprint 2, dans les deux manches', () => {
  for (const s of [newRound('increment'), cascadeWithoutReviews()]) {
    let r = sprint(s);
    assert.equal(r.report.events.length, 0);
    r = sprint(r.state);
    assert.deepEqual(r.report.events.map((e) => e.id), ['concurrent']);
  }
});

test('Aucun préavis et comptes rendus muets : rien sur la coupure aux Sprints 1 à 4', () => {
  for (const start of [newRound('increment'), cascadeWithoutReviews()]) {
    let s = start;
    for (let i = 1; i <= 4; i++) {
      const r = playSprint(s);
      s = r.state.pendingRequest ? decideRequest(r.state, { accept: false }) : r.state;
      assert.ok(!r.report.events.some((e) => e.id === 'coupure'), `Sprint ${i}`);
      assert.equal(s.lastBuildSprint, 6);
      assert.equal(r.report.developmentOver, false);
    }
  }
});

test('La coupure tombe à la fin du Sprint 5, dans les deux manches', () => {
  for (const start of [newRound('increment'), cascadeWithoutReviews()]) {
    const { reports, state } = playDevelopment(start);
    assert.equal(reports.length, 5);
    assert.deepEqual(reports[4].events.map((e) => e.id), ['coupure']);
    assert.equal(reports[4].developmentOver, true);
    assert.equal(state.lastBuildSprint, 5);
    assert.throws(() => playSprint(state));
  }
});

/* ---------- Parcours de référence ---------- */

const REFERENCE = [
  ['manche 1, cahier des charges de 61 points', () => cascadeWithoutReviews(), 0],
  ['manche 1, cahier des charges resserré de 39 points', () => cascadeWith(LEAN), 0],
  ['manche 1, tout petit cahier des charges de 26 points', () => cascadeWith(['vitrine', 'resa', 'alerte', 'gateaux']), 12150],
  ['manche 2, ordre initial', () => newRound('increment'), 13200],
  ['manche 2, à l\'écoute', () => ({ ...newRound('increment'), order: SMART_ORDER.slice() }), 22800],
];

for (const [name, start, expected] of REFERENCE) {
  test(`Parcours de référence : ${name} → ${expected} €`, () => {
    const { results } = playAll(start());
    assert.equal(results.cumulative, expected);
    assert.equal(results.curve.length, 10);
    assert.equal(results.curve[9], expected);
  });
}

test('indicateurs de la manche 2 dans l\'ordre initial', () => {
  const { results } = playAll(newRound('increment'));
  assert.equal(results.firstSale, 2);
  assert.equal(results.invested, 10 * 500);
  assert.equal(results.liveAtEnd.length, 5);
  assert.deepEqual(results.lowUse.slice().sort(), ['livraison']);
});

/* ---------- Propriétés générales ---------- */

test('déterminisme et état sérialisable', () => {
  const a = playAll(cascadeWithoutReviews()).results;
  const b = playAll(cascadeWithoutReviews()).results;
  assert.deepEqual(a, b);
  let s = newRound('increment');
  s = playSprint(s).state;
  const copy = JSON.parse(JSON.stringify(s));
  assert.deepEqual(playSprint(copy), playSprint(s));
});

test('les fonctions ne modifient pas l\'état reçu', () => {
  const s = newRound('increment');
  const before = JSON.stringify(s);
  playSprint(s);
  moveFeature(s, 'resa', 1);
  assert.equal(JSON.stringify(s), before);
});

test('fin de manche : uniquement après le développement, une seule fois', () => {
  const s = newRound('increment');
  assert.throws(() => finishRound(s));
  assert.throws(() => roundResults(s));
  const { state } = playAll(s);
  assert.throws(() => finishRound(state));
});

test('Révélation : réservation en tête, avis et version anglaise en dernier à 0 €', () => {
  const t = truthTable();
  assert.equal(t.length, 12);
  assert.equal(t[0].id, 'resa');
  assert.deepEqual(t.slice(-2).map((x) => x.id).sort(), ['anglais', 'avis']);
  assert.ok(t.slice(-2).every((x) => x.sales === 0));
  assert.deepEqual(t.filter((x) => x.requested).map((x) => x.id).sort(), ['anglais', 'plateaux', 'promos']);
});

/* ---------- Demandes de changement ---------- */

test('manche 1 : la demande bloque le Sprint suivant jusqu\'à la décision', () => {
  const r = playSprint(cascadeWithoutReviews());
  assert.equal(r.report.request.id, 'anglais');
  assert.equal(r.state.pendingRequest, 'anglais');
  assert.throws(() => playSprint(r.state));
  const refused = decideRequest(r.state, { accept: false });
  assert.equal(refused.pendingRequest, null);
  assert.deepEqual(refused.included, r.state.included);
  assert.equal(refused.recetteCost, 8);
  assert.deepEqual(refused.log.at(-1), { sprint: 1, kind: 'decision', request: 'anglais', decision: 'refused', removed: [] });
  assert.ok(playSprint(refused));
});

test('Accepter sans faire de place : 66 points pour un budget de 62', () => {
  const s = playSprint(cascadeWithoutReviews()).state;
  const st = requestStatus(s, []);
  assert.equal(st.total, 66);
  assert.equal(st.budget, 62);
  assert.equal(st.valid, false);
  assert.throws(() => decideRequest(s, { accept: true }));
});

test('Faire de la place : retirer la livraison donne 52 points sur 62', () => {
  const s = playSprint(cascadeWithoutReviews()).state;
  const st = requestStatus(s, ['livraison']);
  assert.equal(st.total, 52);
  assert.equal(st.budget, 62);
  assert.equal(st.valid, true);
});

test('Accepter en retirant : plateaux contre gâteaux, 58 points sur 62, recette à 10', () => {
  let s = cascadeWithoutReviews();
  s = sprint(s).state; s = sprint(s).state;
  const r = playSprint(s);
  assert.equal(r.report.request.id, 'plateaux');
  assert.ok(canRemove(r.state, 'gateaux'));
  const next = decideRequest(r.state, { accept: true, remove: ['gateaux'] });
  assert.equal(status(next).total, 58);
  assert.equal(status(next).budget, 62);
  assert.equal(next.recetteCost, 10);
  assert.equal(next.included.at(-1), 'plateaux');
  assert.ok(!next.included.includes('gateaux'));
});

test('Retraits possibles : une fonctionnalité commencée ne peut pas être retirée', () => {
  let s = cascadeWithoutReviews();
  s = sprint(s).state; s = sprint(s).state;
  const r = playSprint(s); // livraison commencée (5 points) à la fin du Sprint 3
  assert.ok(r.state.progress.livraison > 0);
  assert.equal(canRemove(r.state, 'livraison'), false);
  const st = requestStatus(r.state, ['livraison']);
  assert.equal(st.valid, false);
  assert.ok(!st.removable.includes('livraison'));
  assert.throws(() => decideRequest(r.state, { accept: true, remove: ['livraison'] }));
});

test('Demande dans le Product Backlog (manche 2)', () => {
  const r = playSprint(newRound('increment'));
  assert.equal(r.report.request.id, 'anglais');
  assert.equal(r.state.pendingRequest, null);
  assert.equal(r.state.order.at(-1), 'anglais');
  assert.ok(canMove(r.state, 'anglais'));
  assert.equal(r.state.recetteCost, 8);
  const moved = moveFeature(r.state, 'anglais', -1);
  assert.equal(moved.order.at(-2), 'anglais');
});

test('Version anglaise en ligne : un retour indique que personne ne l\'utilise', () => {
  let s = newRound('increment');
  s = playSprint(s).state;
  // la réservation passe en dernier : sa mise en ligne prendrait les trois places de retours
  s.order = ['vitrine', 'anglais', 'alerte', ...s.order.filter((x) => !['vitrine', 'anglais', 'alerte', 'resa'].includes(x)), 'resa'];
  const r = playSprint(s);
  assert.ok(r.state.live.includes('anglais'));
  assert.ok(r.report.quotes.some((q) => q.id === 'anglais-ok'));
});

test('les trois demandes arrivent aux Reviews 1, 2 et 3 dans les deux manches', () => {
  for (const start of [newRound('increment'), cascadeWithoutReviews()]) {
    const { reports } = playDevelopment(start);
    assert.deepEqual(reports.map((r) => r.request?.id ?? null), ['anglais', 'promos', 'plateaux', null, null]);
  }
});

test('Coupure budgétaire : 10 semaines d\'exploitation après la cinquième période', () => {
  const { results } = playAll(newRound('increment'));
  assert.equal(results.lastBuildSprint, 5);
  assert.deepEqual(periodWeeks(5), [9, 10]);
  assert.equal((10 - results.lastBuildSprint) * 2, 10);
});

test('Échéance et semaines : la troisième période couvre les semaines 5 et 6', () => {
  assert.deepEqual(periodWeeks(3), [5, 6]);
  assert.deepEqual(periodWeeks(1), [1, 2]);
});

test('Soleil jusqu\'à la coupure : orage au COPIL 5 (cahier des charges resserré)', () => {
  const { reports } = playDevelopment(cascadeWith(LEAN));
  assert.deepEqual(reports.map((r) => r.weather), ['sunny', 'sunny', 'sunny', 'sunny', 'stormy']);
});

test('Cahier des charges sans marge : soleil au COPIL 1, orage dès le paiement découvert au COPIL 2', () => {
  const { reports } = playDevelopment(cascadeWithoutReviews());
  assert.deepEqual(reports.map((r) => r.weather), ['sunny', 'stormy', 'stormy', 'stormy', 'stormy']);
  assert.deepEqual(reports[1].discoveries, [{ target: 'paiement', extra: 6 }]);
});

test('Livré avant la coupure', () => {
  const { reports } = playDevelopment(cascadeWith(['vitrine', 'resa', 'alerte', 'gateaux']));
  assert.deepEqual(reports.map((r) => r.weather), ['sunny', 'sunny', 'sunny', 'delivered', 'delivered']);
});

test('pas de météo en manche 2', () => {
  assert.equal(playSprint(newRound('increment')).report.weather, null);
  assert.equal(projectWeather(cascadeWithoutReviews()), 'sunny');
});

test('journal en faits, sans phrase', () => {
  const { state } = playDevelopment(newRound('increment'));
  for (const entry of state.log) assert.ok(!('text' in entry), JSON.stringify(entry));
  assert.ok(state.log.some((l) => l.kind === 'quote' && typeof l.quote === 'string'));
  assert.ok(state.log.some((l) => l.kind === 'event' && l.event === 'coupure'));
  assert.ok(state.log.some((l) => l.kind === 'decision' && l.decision === 'backlog'));
});


test('résultats : demandes en ligne en manche 2 quand on les remonte', () => {
  let st = newRound('increment');
  while (!developmentOver(st)) {
    st = playSprint(st).state;
    if (st.order.includes('plateaux') && st.order.indexOf('plateaux') > 2 && !st.done.includes('plateaux')) {
      while (canMove(st, 'plateaux') && st.order.indexOf('plateaux') > st.done.length) st = moveFeature(st, 'plateaux', -1);
    }
  }
  const { results } = playAll(st);
  assert.ok(results.requestsLive.includes('plateaux'));
});

/* ---------- Dépendances ---------- */

test('Décocher la réservation : paiement, livraison et click & collect impossibles', () => {
  const st = planStatus(toggleInPlan(newRound('cascade'), 'resa'));
  assert.deepEqual(st.impossible, { paiement: 'resa', livraison: 'resa', cc: 'resa' });
  assert.equal(st.valid, false);
});

test('Décocher la vitrine : les huit autres lots impossibles sans la vitrine', () => {
  const st = planStatus(toggleInPlan(newRound('cascade'), 'vitrine'));
  assert.equal(Object.keys(st.impossible).length, 8);
  assert.ok(Object.values(st.impossible).every((r) => r === 'vitrine'));
  assert.match(st.message, /nécessite « Vitrine en ligne »/);
});

test('Ordre initial : rien de mal placé, paiement après la réservation', () => {
  const s = newRound('increment');
  assert.ok(s.order.every((id) => dependencyState(s, id) !== 'misplaced'));
  assert.equal(dependencyState(s, 'paiement'), 'after');
  assert.equal(dependencyState(s, 'vitrine'), null);
});

test('Paiement remonté trop haut : mal placé, et sauté par l\'équipe', () => {
  const s = moveFeature(newRound('increment'), 'paiement', -1);
  assert.equal(dependencyState(s, 'paiement'), 'misplaced');
  assert.equal(dependencyState(s, 'resa'), 'after');
});

test('Prérequis terminé : plus de badge de dépendance', () => {
  let s = newRound('increment');
  s = playSprint(s).state; s = playSprint(s).state; s = playSprint(s).state;
  assert.ok(s.done.includes('resa'));
  for (const id of ['paiement', 'livraison', 'cc']) assert.equal(dependencyState(s, id), null);
});

test('ordre du cahier des charges avant validation : lot mal placé détecté sur la liste retenue', () => {
  let s = moveFeature(newRound('cascade'), 'paiement', -1);
  const list = s.order.filter((id) => s.included.includes(id));
  assert.equal(dependencyState(s, 'paiement', list), 'misplaced');
});

test('Retirer la réservation dans une demande : trois lots deviendraient impossibles', () => {
  let s = newRound('cascade');
  s = toggleInPlan(s, 'avis');
  s.order = ['vitrine', 'fidelite', 'alerte', 'gateaux', 'resa', 'paiement', 'livraison', 'cc', 'avis'];
  s = validatePlan(s);
  const r = playSprint(s);
  assert.ok(canRemove(r.state, 'resa'));
  const st = requestStatus(r.state, ['resa']);
  assert.deepEqual(Object.keys(st.impossible).sort(), ['cc', 'livraison', 'paiement']);
  assert.equal(st.valid, false);
});

test('impossibleLots : chaîne complète', () => {
  assert.deepEqual(impossibleLots(['paiement']), { paiement: 'resa' });
  assert.deepEqual(impossibleLots(['resa', 'paiement']), { resa: 'vitrine', paiement: 'vitrine' });
});

test('Rouge en chaîne : réservation avant la vitrine, paiement et livraison en rouge aussi', () => {
  const s = { ...newRound('increment') };
  s.order = ['resa', 'paiement', 'livraison', 'vitrine', ...s.order.filter((x) => !['resa', 'paiement', 'livraison', 'vitrine'].includes(x))];
  assert.equal(dependencyState(s, 'resa'), 'misplaced');
  assert.equal(dependencyState(s, 'paiement'), 'misplaced');
  assert.equal(dependencyState(s, 'livraison'), 'misplaced');
  assert.equal(dependencyState(s, 'cc'), 'misplaced');
  assert.equal(dependencyState(s, 'fidelite'), 'after');
});

/* ---------- Glisser-déposer ---------- */

test('Remonter de plusieurs rangs : l\'alerte du rang 9 au rang 3', () => {
  const s = newRound('increment');
  const before = JSON.stringify(s);
  const next = moveFeatureTo(s, 'alerte', 2);
  assert.deepEqual(next.order.slice(0, 4), ['vitrine', 'resa', 'alerte', 'paiement']);
  assert.equal(next.order.length, s.order.length);
  assert.equal(JSON.stringify(s), before);
});

test('Badges mis à jour : le paiement glissé tout en haut est mal placé', () => {
  const next = moveFeatureTo(newRound('increment'), 'paiement', 0);
  assert.equal(next.order[0], 'paiement');
  assert.equal(dependencyState(next, 'paiement'), 'misplaced');
});

test('moveFeatureTo : bornes, même rang, règles des flèches', () => {
  const s = newRound('increment');
  assert.equal(moveFeatureTo(s, 'resa', 1), s);
  assert.equal(moveFeatureTo(s, 'vitrine', -5).order[0], 'vitrine');
  assert.equal(moveFeatureTo(s, 'vitrine', 99).order.at(-1), 'vitrine');
  const played = playSprint(s).state;
  assert.throws(() => moveFeatureTo(played, 'vitrine', 3));
  const moved = moveFeatureTo(played, 'alerte', 0);
  assert.equal(moved.order[0], 'alerte');
  assert.throws(() => moveFeatureTo(cascadeWithoutReviews(), 'alerte', 0));
  assert.equal(moveFeatureTo(newRound('cascade'), 'alerte', 0).order[0], 'alerte');
});

/* ---------- Travail sous-estimé ---------- */

test('Découverte en manche 2 : le paiement passe de 8 à 14 points quand l\'équipe le commence', () => {
  const first = playSprint(newRound('increment'));
  assert.deepEqual(first.report.discoveries, []);
  const r = playSprint(first.state);
  assert.deepEqual(r.report.discoveries, [{ target: 'paiement', extra: 6 }]);
  assert.equal(effectiveCost(r.state, 'paiement'), 14);
  assert.equal(r.state.recetteCost, 8); // pas de recette finale en manche 2
  assert.ok(r.state.log.some((e) => e.kind === 'discovery' && e.target === 'paiement' && e.extra === 6));
});

test('Premier Sprint sans surprise : les gâteaux commencés au Sprint 1 révèlent leurs 6 points au Sprint 2', () => {
  let s = newRound('increment');
  s.order = ['vitrine', 'alerte', 'gateaux', ...s.order.filter((x) => !['vitrine', 'alerte', 'gateaux'].includes(x))];
  const r = playSprint(s);
  assert.deepEqual(r.report.discoveries, []);
  assert.equal(r.state.progress.gateaux, 1);
  assert.equal(r.state.extra.gateaux, undefined);
  const r2 = playSprint(r.state);
  assert.deepEqual(r2.report.discoveries.map((d) => d.target), ['gateaux']);
  assert.equal(effectiveCost(r2.state, 'gateaux'), 15);
});

test('Premier COPIL sans surprise, quel que soit le cahier des charges', () => {
  for (const second of ['resa', 'gateaux', 'alerte', 'fidelite', 'avis']) {
    let s = newRound('cascade');
    s = toggleInPlan(s, 'livraison');
    s.order = ['vitrine', second, ...s.order.filter((x) => !['vitrine', second].includes(x))];
    const r = playSprint(validatePlan(s));
    assert.deepEqual(r.report.discoveries, [], second);
    assert.equal(r.report.weather, 'sunny', second);
  }
});

test('Recette : 4 points d\'anomalies découverts quand elle commence (manche 1 seulement)', () => {
  const { reports, state } = playDevelopment(cascadeWith(['vitrine', 'resa', 'alerte', 'gateaux']));
  const when = reports.findIndex((r) => r.discoveries.some((d) => d.target === 'recette'));
  assert.ok(when >= 0);
  assert.equal(state.recetteCost, 12);
  assert.equal(underestimate('increment', 'recette'), null);
});

test('Le budget du cahier des charges reste celui des estimations', () => {
  const s = cascadeWith(LEAN);
  assert.equal(planStatus(s).total, 39);
  const after = playSprint(s).state;
  assert.equal(planStatus(after).total, 39);
});

/* ---------- Arbitrage du COPIL (manche 1) ---------- */

test('Arbitrage : fermé tant que le projet est ensoleillé, ouvert dès l\'orage', () => {
  let s = cascadeWithoutReviews();
  assert.equal(canDescope(s), false); // avant le premier COPIL : soleil
  s = sprint(s).state;
  assert.equal(canDescope(s), false); // COPIL 1 : soleil
  s = sprint(s).state;
  assert.equal(canDescope(s), true);  // COPIL 2 : orage (paiement découvert)
  assert.equal(canDescope(newRound('increment')), false);
});

test('Arbitrage : retirer livraison, fidélité et click & collect au COPIL 2 fait sortir l\'appli au COPIL 5', () => {
  let s = cascadeWithoutReviews();
  s = sprint(sprint(s).state).state;
  const st = descopeStatus(s, ['livraison', 'fidelite', 'cc']);
  assert.equal(st.valid, true);
  assert.equal(st.weather, 'sunny');
  s = descope(s, ['livraison', 'fidelite', 'cc']);
  assert.ok(!s.included.includes('livraison'));
  assert.ok(s.log.some((e) => e.kind === 'descope' && e.sprint === 2));
  assert.ok(decisionTrail(s).find((p) => p.period === 2).facts.some((f) => f.kind === 'descope'));
  const { reports, results } = playAll(s);
  assert.equal(reports.at(-1).launched, true);
  assert.equal(results.cumulative, 9842);
});

test('Arbitrage : lot commencé, prérequis cassé ou rien de coché sont refusés', () => {
  let s = cascadeWithoutReviews();
  s = sprint(sprint(s).state).state;
  assert.equal(descopeStatus(s, []).valid, false);
  assert.match(descopeStatus(s, ['paiement']).message, /déjà commencé/);
  assert.equal(descopeStatus(s, ['resa']).valid, false);
  assert.throws(() => descope(s, ['paiement']));
  assert.match(descopeStatus(s, ['livraison']).message, /soleil|orageux/);
});
