import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newRound, planStatus, toggleInPlan, moveFeature, validatePlan, playSprint, finishRound,
  roundResults, canMove, featureState, developmentOver, truthTable,
} from '../site/js/game-core.js';

const SMART_ORDER = ['vitrine', 'resa', 'alerte', 'gateaux', 'cc', 'fidelite', 'paiement', 'livraison', 'avis'];

function cascadeWithoutReviews(cut) {
  let s = newRound('cascade', { cut });
  s = toggleInPlan(s, 'avis');
  return validatePlan(s);
}

function playDevelopment(state) {
  const reports = [];
  while (!developmentOver(state)) {
    const r = playSprint(state);
    state = r.state;
    reports.push(r.report);
  }
  return { state, reports };
}

function playAll(state) {
  const { state: s, reports } = playDevelopment(state);
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
  const s = cascadeWithoutReviews(false);
  assert.equal(canMove(s, 'vitrine'), false);
  assert.throws(() => moveFeature(s, 'vitrine', 1));
  assert.throws(() => toggleInPlan(s, 'vitrine'));
});

test('Sortie au Sprint 6 : 8 fonctionnalités, premières ventes au Sprint 7', () => {
  const { reports, results, state } = playAll(cascadeWithoutReviews(false));
  assert.equal(reports.length, 6);
  assert.equal(reports[5].launched, true);
  assert.ok(reports.slice(0, 5).every((r) => !r.launched && r.sales === 0));
  assert.ok(reports.every((r) => r.quotes.length === 0));
  assert.equal(results.liveAtEnd.length, 8);
  assert.equal(results.firstSale, 7);
  assert.equal(state.recette, 8);
});

test('fonctionnalités terminées hors ligne jusqu\'à la recette', () => {
  let s = cascadeWithoutReviews(false);
  for (let i = 0; i < 3; i++) s = playSprint(s).state;
  assert.ok(s.done.length > 0);
  assert.equal(s.live.length, 0);
  assert.equal(featureState(s, s.done[0]), 'awaiting');
});

test('Sortie tardive : 0,9⁴ des clients au Sprint 7', () => {
  const { state } = playAll(cascadeWithoutReviews(false));
  assert.ok(Math.abs(state.clientele - 0.9 ** 4) < 1e-12);
  assert.equal(state.curve[6], Math.round(3600 * 0.9 ** 4));
});

test('Appli jamais sortie avec la coupure', () => {
  const { reports, results, summary } = playAll(cascadeWithoutReviews(true));
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
  assert.equal(moveFeature(s, 'alerte', 1), s); // déjà en bas
});

test('Premiers retours dès le Sprint 1, quel que soit l\'ordre', () => {
  const worst = ['livraison', 'paiement', 'cc', 'resa', 'gateaux', 'fidelite', 'avis', 'alerte', 'vitrine'];
  const r = playSprint({ ...newRound('increment'), order: worst });
  assert.deepEqual(r.state.live, ['vitrine']);
  assert.equal(r.report.nothingLive, false);
  assert.ok(r.report.quotes.length > 0);
});

test('Aucun retour avant la sortie (manche 1)', () => {
  const r = playSprint(cascadeWithoutReviews(false));
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
  for (const s of [newRound('increment'), cascadeWithoutReviews(false)]) {
    let r = playSprint(s);
    assert.equal(r.report.events.length, 0);
    r = playSprint(r.state);
    assert.deepEqual(r.report.events.map((e) => e.id), ['concurrent']);
  }
});

test('Coupure désactivée : rien au Sprint 3, 6 Sprints de développement', () => {
  let s = newRound('increment', { cut: false });
  for (let i = 0; i < 3; i++) {
    const r = playSprint(s);
    s = r.state;
    if (i === 2) assert.equal(r.report.events.length, 0);
  }
  assert.equal(s.lastBuildSprint, 6);
});

test('coupure activée : annoncée au Sprint 3, fin du développement au Sprint 5', () => {
  let s = newRound('increment', { cut: true });
  let r;
  for (let i = 0; i < 3; i++) { r = playSprint(s); s = r.state; }
  assert.deepEqual(r.report.events.map((e) => e.id), ['coupure']);
  assert.equal(s.lastBuildSprint, 5);
  s = playSprint(s).state;
  r = playSprint(s);
  assert.equal(r.report.developmentOver, true);
  assert.throws(() => playSprint(r.state));
});

/* ---------- Parcours de référence ---------- */

const REFERENCE = [
  ['manche 1, plan sans les avis, sans coupure', () => cascadeWithoutReviews(false), 9448],
  ['manche 1, plan sans les avis, avec coupure', () => cascadeWithoutReviews(true), 0],
  ['manche 2, ordre initial, sans coupure', () => newRound('increment', { cut: false }), 15300],
  ['manche 2, ordre initial, avec coupure', () => newRound('increment', { cut: true }), 13300],
  ['manche 2, à l\'écoute, sans coupure', () => ({ ...newRound('increment', { cut: false }), order: SMART_ORDER.slice() }), 25300],
  ['manche 2, à l\'écoute, avec coupure', () => ({ ...newRound('increment', { cut: true }), order: SMART_ORDER.slice() }), 25300],
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
  const { results } = playAll(newRound('increment', { cut: true }));
  assert.equal(results.firstSale, 2);
  assert.equal(results.invested, 10 * 500);
  assert.equal(results.liveAtEnd.length, 6);
  assert.deepEqual(results.lowUse.slice().sort(), ['avis', 'livraison']);
});

/* ---------- Propriétés générales ---------- */

test('déterminisme et état sérialisable', () => {
  const a = playAll(cascadeWithoutReviews(false)).results;
  const b = playAll(cascadeWithoutReviews(false)).results;
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

test('Révélation : réservation en tête, avis en dernier à 0 €', () => {
  const t = truthTable();
  assert.equal(t[0].id, 'resa');
  assert.equal(t.at(-1).id, 'avis');
  assert.equal(t.at(-1).sales, 0);
});
