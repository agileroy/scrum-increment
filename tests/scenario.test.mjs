import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FEATURES, QUOTES, EVENTS, REQUESTS, PLAN_BUDGET, EURO_PER_POINT, SPRINT_WEEKS, HORIZON_WEEKS, LAST_SPRINT,
} from '../site/js/scenario.js';

const ids = FEATURES.map((f) => f.id);
const allIds = [...ids, ...REQUESTS.map((r) => r.id)];
const byId = Object.fromEntries(FEATURES.map((f) => [f.id, f]));

test('neuf fonctionnalités aux identifiants uniques', () => {
  assert.equal(FEATURES.length, 9);
  assert.equal(new Set(ids).size, ids.length);
});

test('champs complets et valeurs cohérentes', () => {
  for (const f of FEATURES) {
    assert.ok(f.name && f.desc, f.id);
    assert.ok(Number.isInteger(f.cost) && f.cost > 0, f.id);
    assert.ok(Number.isInteger(f.stars) && f.stars >= 1 && f.stars <= 5, f.id);
    assert.ok(Number.isInteger(f.value) && f.value >= 0, f.id);
  }
});

test('prérequis connus et sans cycle', () => {
  for (const f of FEATURES) {
    const seen = new Set([f.id]);
    let req = f.req;
    while (req) {
      assert.ok(ids.includes(req), `${f.id} → ${req}`);
      assert.ok(!seen.has(req), `cycle depuis ${f.id}`);
      seen.add(req);
      req = byId[req].req;
    }
  }
});

test('66 points au total : le plan initial dépasse le budget de 2 points', () => {
  const total = FEATURES.reduce((s, f) => s + f.cost, 0);
  assert.equal(total, 66);
  assert.equal(PLAN_BUDGET, 64);
  assert.equal(total - PLAN_BUDGET, 2);
});

test('intuition trompeuse', () => {
  const top3 = FEATURES.slice().sort((a, b) => b.value - a.value).slice(0, 3).map((f) => f.id);
  for (const f of FEATURES.filter((x) => x.stars === 5)) assert.ok(f.value * EURO_PER_POINT <= 200, f.id);
  assert.deepEqual(FEATURES.filter((x) => x.stars === 5).map((f) => f.id).sort(), ['livraison', 'paiement']);
  assert.deepEqual(top3.slice().sort(), ['alerte', 'gateaux', 'resa']);
  for (const f of FEATURES.filter((x) => x.stars === 2)) assert.ok(top3.includes(f.id), f.id);
});

test('retours clients : fonctionnalités connues, un retour par fonctionnalité en ligne', () => {
  const qids = QUOTES.map((q) => q.id);
  assert.equal(new Set(qids).size, qids.length);
  for (const q of QUOTES) {
    assert.ok(allIds.includes(q.need), q.id);
    if (q.notLive) assert.ok(allIds.includes(q.notLive), q.id);
    assert.ok(q.text && q.who, q.id);
  }
  // chaque fonctionnalité a au moins un retour qui la concerne une fois en ligne ;
  // la vitrine n'a que des indices, qui la concernent aussi (« Enfin les horaires en ligne ! »)
  for (const id of ids) assert.ok(QUOTES.some((q) => q.need === id), id);
  for (const id of ids.filter((x) => x !== 'vitrine')) assert.ok(QUOTES.some((q) => q.need === id && !q.notLive), id);
});

test('imprévus : concurrent à la fin de la période 2, coupure toujours à la fin de la période 5', () => {
  const concurrent = EVENTS.find((e) => e.id === 'concurrent');
  const coupure = EVENTS.find((e) => e.id === 'coupure');
  assert.equal(concurrent.after, 2);
  assert.equal(coupure.after, 5);
  assert.equal(coupure.lastBuildSprint, 5);
  assert.ok(EVENTS.every((e) => !('optional' in e)));
});

test('calendrier : Sprints de 2 semaines, 20 semaines, 10 périodes', () => {
  assert.equal(SPRINT_WEEKS, 2);
  assert.equal(HORIZON_WEEKS, 20);
  assert.equal(LAST_SPRINT, 10);
});

test('demandes de changement : après les Sprints 1, 2 et 3, identifiants et prérequis valides', () => {
  assert.deepEqual(REQUESTS.map((r) => r.after), [1, 2, 3]);
  assert.equal(new Set(allIds).size, allIds.length);
  for (const r of REQUESTS) {
    assert.ok(r.name && r.desc && r.ask, r.id);
    assert.ok(Number.isInteger(r.cost) && r.cost > 0, r.id);
    assert.ok(ids.includes(r.req), r.id);
    assert.ok(QUOTES.some((q) => q.need === r.id && !q.notLive), `retour pour ${r.id}`);
  }
});

test('Opinions trompeuses', () => {
  const four = REQUESTS.filter((r) => r.stars === 4);
  assert.equal(four.length, 2);
  for (const r of four) assert.ok(r.value * EURO_PER_POINT <= 100, r.id);
  const best = REQUESTS.slice().sort((a, b) => b.value - a.value)[0];
  assert.equal(best.stars, 2);
});

test('les retours des demandes viennent après les autres', () => {
  const firstRequestQuote = QUOTES.findIndex((q) => REQUESTS.some((r) => r.id === q.need));
  assert.ok(QUOTES.slice(firstRequestQuote).every((q) => REQUESTS.some((r) => r.id === q.need)));
});
