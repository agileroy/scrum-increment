// Fil des décisions d'une équipe : coulisses du formateur et débrief.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newRound, toggleInPlan, validatePlan, playSprint, decideRequest, moveFeatureTo, decisionTrail, reviveRound,
} from '../site/js/game-core.js';
import { trailText, trailPeriod, FORBIDDEN } from '../site/js/vocabulary.js';

const texts = (state) => decisionTrail(state).flatMap((p) => p.facts.map((f) => trailText(state.mode, f)));

test('Équipe projet : plan validé, demande acceptée en retirant un lot, refus, refus faute de décision', () => {
  let s = validatePlan(toggleInPlan(newRound('cascade'), 'avis'));
  s = playSprint(s).state;                                   // demande « anglais »
  s = decideRequest(s, { accept: false });
  s = playSprint(s).state;                                   // demande « promos »
  s = decideRequest(s, { accept: true, remove: ['livraison'] });
  s = playSprint(s).state;                                   // demande « plateaux »
  s = decideRequest(s, { accept: false, reason: 'timeout' });
  const trail = decisionTrail(s);
  assert.deepEqual(trail.map((p) => p.period), [0, 1, 2, 3]);
  assert.deepEqual(trail[0].facts, [{ kind: 'plan', total: 61, dropped: ['avis'] }]);
  const all = texts(s).join('\n');
  assert.match(all, /Cahier des charges de 61 points validé, sans : Avis clients\./);
  assert.match(all, /Version anglaise refusée/);
  assert.match(all, /Promotions flash acceptée par avenant .*en retirant : Livraison à domicile/);
  assert.match(all, /Plateaux pour les entreprises refusée faute de décision/);
  assert.match(all, /Travail sous-estimé : Paiement en ligne \(\+6 points\)/);
  assert.match(all, /météo orageux/);
  assert.equal(trailPeriod('cascade', 2), 'COPIL 2');
});

test('Équipe Scrum : réordonnancement retrouvé, demande placée, mises en ligne', () => {
  let s = newRound('increment');
  s = playSprint(s).state;                                   // vitrine en ligne, « anglais » ajoutée en bas
  s = moveFeatureTo(s, 'alerte', 1);                         // alerte du rang 9 au rang 2
  s = moveFeatureTo(s, 'anglais', 2);                        // la demande remonte du bas au rang 3
  s = playSprint(s).state;
  const sprint2 = decisionTrail(s).find((p) => p.period === 2).facts;
  assert.ok(sprint2.some((f) => f.kind === 'moved' && f.id === 'alerte' && f.from === 9 && f.to === 2));
  assert.ok(sprint2.some((f) => f.kind === 'moved' && f.id === 'anglais' && f.from === 10 && f.to === 3));
  const all = texts(s).join('\n');
  assert.match(all, /« Alerte « fournée chaude » » remontée du rang 9 au rang 2\./);
  assert.match(all, /Mis en ligne : Vitrine en ligne\./);
  assert.match(all, /Version anglaise ajoutée en bas du Product Backlog\./);
  assert.equal(trailPeriod('increment', 2), 'Sprint 2');
});

test('Fil sans ventes et sans mot de l\'autre manche', () => {
  for (const mode of ['cascade', 'increment']) {
    let s = newRound(mode);
    if (mode === 'cascade') s = validatePlan(toggleInPlan(s, 'avis'));
    for (let i = 0; i < 5; i++) {
      s = playSprint(s).state;
      if (s.pendingRequest) s = decideRequest(s, { accept: false });
    }
    for (const t of [...texts(s), trailPeriod(mode, 0), trailPeriod(mode, 3)]) {
      assert.doesNotMatch(t, /vente|€/i, t);
      for (const re of FORBIDDEN[mode]) assert.ok(!re.test(t), `« ${t} » contient ${re}`);
    }
  }
});

test('Fil relu depuis la base, et état sans ordre journalisé (partie commencée avant)', () => {
  let s = playSprint(newRound('increment')).state;
  const raw = JSON.parse(JSON.stringify(s));
  delete raw.log[0].order;
  const revived = reviveRound(raw);
  assert.equal(revived.log.find((e) => e.kind === 'sprint').order, null);
  assert.ok(decisionTrail(revived).length > 0);
});
