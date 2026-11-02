import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newRound, planStatus, toggleInPlan, moveFeature, validatePlan, playSprint, finishRound,
  roundResults, canMove, featureState, developmentOver, truthTable,
  requestStatus, decideRequest, canRemove, periodWeeks, projectWeather, planStatus as status,
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
  // vitrine finie, paiement au-dessus de la réservation
  let t = newRound('increment');
  t = moveFeature(t, 'paiement', -1); // vitrine, paiement, resa, …
  t.done.push('vitrine'); t.live.push('vitrine'); t.progress.vitrine = 5;
  const r = playSprint(t);
  assert.equal(r.state.progress.resa, 8);
  assert.ok(r.report.completed.includes('resa'));
  // le paiement est sauté au moment de son passage (réservation pas encore finie), puis
  // les 2 points restants vont à la fonctionnalité suivante dont le prérequis est terminé
  assert.equal(r.state.progress.paiement, 0);
  assert.equal(r.state.progress.livraison, 2);
});

test('une fonctionnalité non terminée garde ses points', () => {
  const r = playSprint(newRound('increment'));
  assert.equal(r.state.progress.resa, 5);
  assert.equal(featureState(r.state, 'resa'), 'in-progress');
});

/* ---------- Manche 1 ---------- */

test('Plan par défaut : 66 points, validation refusée', () => {
  const s = newRound('cascade');
  const st = planStatus(s);
  assert.equal(st.total, 66);
  assert.equal(st.over, 2);
  assert.equal(st.valid, false);
  assert.match(st.message, /dépasse de 2 points/);
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

test('Cahier des charges resserré : sortie au Sprint 4, avant la coupure', () => {
  const { reports, results } = playAll(cascadeWith(LEAN));
  assert.equal(reports.length, 5);
  assert.equal(reports[3].launched, true);
  assert.equal(results.liveAtEnd.length, 6);
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

test('Sortie tardive : cahier des charges de 47 points, sorti au Sprint 5, 0,9³ des clients', () => {
  const { reports, results, state } = playAll(cascadeWith([...LEAN, 'paiement']));
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
  ['manche 1, cahier des charges resserré de 39 points', () => cascadeWith(LEAN), 16038],
  ['manche 2, ordre initial', () => newRound('increment'), 13300],
  ['manche 2, à l\'écoute', () => ({ ...newRound('increment'), order: SMART_ORDER.slice() }), 25300],
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
  assert.equal(results.liveAtEnd.length, 6);
  assert.deepEqual(results.lowUse.slice().sort(), ['avis', 'livraison']);
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
  const r = playSprint(s); // fidélité commencée (1 point) à la fin du Sprint 3
  assert.ok(r.state.progress.fidelite > 0);
  assert.equal(canRemove(r.state, 'fidelite'), false);
  const st = requestStatus(r.state, ['fidelite']);
  assert.equal(st.valid, false);
  assert.ok(!st.removable.includes('fidelite'));
  assert.throws(() => decideRequest(r.state, { accept: true, remove: ['fidelite'] }));
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
  s.order = ['vitrine', 'anglais', ...s.order.filter((x) => !['vitrine', 'anglais'].includes(x))];
  s = playSprint(s).state;
  assert.ok(s.live.includes('anglais'));
  const r = playSprint({ ...s, shownQuotes: s.shownQuotes.concat(['resa-ok', 'pas-livre', 'croissants', 'tradition', 'anniv']) });
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

test('Soleil jusqu\'à la coupure : orage au COPIL 5', () => {
  const { reports } = playDevelopment(cascadeWithoutReviews());
  assert.deepEqual(reports.map((r) => r.weather), ['sunny', 'sunny', 'sunny', 'sunny', 'stormy']);
});

test('Livré avant la coupure', () => {
  const { reports } = playDevelopment(cascadeWith(LEAN));
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
