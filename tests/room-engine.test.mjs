// Mode collectif : état relu depuis la base, bilans et résumés reconstruits depuis l'état.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newRound, toggleInPlan, validatePlan, playSprint, decideRequest, developmentOver, finishRound,
  reviveRound, reportFromState, finishSummary, moveFeatureTo, roundResults,
} from '../site/js/game-core.js';

// Ce que Firebase fait d'une valeur : null et tableaux ou objets vides supprimés ;
// `asObjects` renvoie en plus chaque tableau sous forme d'objet à clés numériques.
function firebaseLike(value, asObjects = false) {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) {
    const items = value.map((v) => firebaseLike(v, asObjects));
    if (!items.length) return undefined;
    return asObjects ? Object.fromEntries(items.map((v, i) => [String(i), v])) : items;
  }
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const x = firebaseLike(v, asObjects);
      if (x !== undefined) out[k] = x;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return value;
}

function plays(mode, decide) {
  let s = newRound(mode);
  if (mode === 'cascade') s = validatePlan(toggleInPlan(s, 'avis'));
  else s = moveFeatureTo(s, 'alerte', 2);
  const steps = [{ state: s }];
  while (!developmentOver(s)) {
    const r = playSprint(s);
    s = r.state;
    steps.push({ state: s, report: r.report });
    if (s.pendingRequest) { s = decideRequest(s, decide(s)); steps.push({ state: s }); }
  }
  const f = finishRound(s);
  steps.push({ state: f.state, summary: f.summary });
  return steps;
}

const DECISIONS = [
  () => ({ accept: false }),
  () => ({ accept: false, reason: 'timeout' }),
  (s) => (s.pendingRequest === 'anglais' ? { accept: true, remove: ['livraison'] } : { accept: false, reason: 'timeout' }),
];

for (const mode of ['cascade', 'increment']) {
  DECISIONS.forEach((decide, n) => {
    test(`état relu depuis la base identique à chaque étape (${mode}, décisions ${n + 1})`, () => {
      for (const { state } of plays(mode, decide)) {
        for (const asObjects of [false, true]) {
          assert.deepEqual(reviveRound(firebaseLike(state, asObjects)), state);
        }
      }
    });

    test(`bilan reconstruit identique à celui de playSprint (${mode}, décisions ${n + 1})`, () => {
      for (const { state, report } of plays(mode, decide)) {
        if (!report) continue;
        const revived = reviveRound(firebaseLike(state, true));
        const rebuilt = reportFromState(revived, report.sprint);
        assert.equal(rebuilt.sales, Math.round(report.sales));
        assert.deepEqual(rebuilt.completed, report.completed);
        assert.equal(rebuilt.launched, report.launched);
        assert.equal(rebuilt.progress, report.progress);
        assert.equal(rebuilt.weather, report.weather);
        assert.deepEqual(rebuilt.quotes.map((q) => q.id), report.quotes.map((q) => q.id));
        assert.deepEqual(rebuilt.events.map((e) => e.id), report.events.map((e) => e.id));
        assert.equal(rebuilt.request?.id ?? null, report.request?.id ?? null);
        assert.equal(rebuilt.developmentOver, report.developmentOver);
      }
    });
  });

  test(`résumé de fin identique à celui de finishRound (${mode})`, () => {
    const last = plays(mode, DECISIONS[0]).at(-1);
    assert.deepEqual(finishSummary(reviveRound(firebaseLike(last.state, true))), last.summary);
    assert.deepEqual(roundResults(reviveRound(firebaseLike(last.state))), roundResults(last.state));
  });
}

test('refus faute de décision : journalisé et enregistré', () => {
  let s = validatePlan(toggleInPlan(newRound('cascade'), 'avis'));
  s = playSprint(s).state;
  s = decideRequest(s, { accept: false, reason: 'timeout' });
  assert.equal(s.log.at(-1).reason, 'timeout');
  assert.equal(s.requests.at(-1).reason, 'timeout');
  assert.equal(s.pendingRequest, null);
});

test('reviveRound : rien à relire', () => {
  assert.equal(reviveRound(null), null);
  assert.equal(reviveRound({}), null);
});
