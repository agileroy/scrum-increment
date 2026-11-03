import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeCode, isValidCode, generateCode, validateName, nameKey, teamName, teamMode, clampTeamCount,
  teamMembers, smallestTeam, rebalance, everyTeamHasPlayers, canBeReady, isReady, timeLeft, formatSeconds,
  CODE_ALPHABET, TEAM_NAMES,
} from '../site/js/room-core.js';
import { newRound, validatePlan, toggleInPlan, playSprint } from '../site/js/game-core.js';

const room = (teamCount, players) => ({
  meta: { teamCount },
  players: Object.fromEntries(players.map(([uid, team, joinedAt = 0, extra = {}]) => [uid, { name: uid, team, joinedAt, ...extra }])),
});

test('code de salle : 4 lettres sans I, L, O', () => {
  assert.equal(CODE_ALPHABET.length, 23);
  for (const c of 'ILO') assert.ok(!CODE_ALPHABET.includes(c));
  assert.ok(isValidCode(generateCode()));
  assert.equal(normalizeCode(' abcd '), 'ABCD');
  assert.ok(!isValidCode('ABCI'));
});

test('Prénom déjà pris : même clé sans majuscules ni accents', () => {
  assert.equal(nameKey('Julie'), nameKey('julie'));
  assert.equal(nameKey('Éloïse'), nameKey('eloise'));
  assert.equal(nameKey(' Jean  Marc '), nameKey('jean marc'));
  assert.ok(!nameKey('a.b').includes('.'));
  assert.equal(validateName('   '), 'Saisissez votre prénom.');
  assert.ok(validateName('x'.repeat(21)));
  assert.equal(validateName('Karim'), null);
});

test('équipes : noms de viennoiseries, approche impaire « projet », paire « Scrum »', () => {
  assert.deepEqual(TEAM_NAMES, ['Croissant', 'Baguette', 'Brioche', 'Éclair', 'Chouquette', 'Fougasse']);
  assert.equal(teamName(2), 'Baguette');
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(teamMode), ['cascade', 'increment', 'cascade', 'increment', 'cascade', 'increment']);
  assert.equal(clampTeamCount(1), 2);
  assert.equal(clampTeamCount(9), 6);
  assert.equal(clampTeamCount(undefined), 2);
});

test('Répartition automatique : dans l\'équipe la moins nombreuse, la première en cas d\'égalité', () => {
  assert.equal(smallestTeam(room(2, [['a', 1], ['b', 1], ['c', 2]])), 2);
  assert.equal(smallestTeam(room(2, [['a', 1], ['b', 2]])), 1);
  assert.equal(smallestTeam(room(3, [])), 1);
  assert.equal(smallestTeam(room(2, [['a', 1], ['b', 2, 0, { removed: true }]])), 2);
});

test('Réduire le nombre d\'équipes : les membres d\'une équipe supprimée vont dans la moins nombreuse', () => {
  const r = room(3, [['a', 1, 1], ['b', 1, 2], ['c', 2, 3], ['d', 3, 4], ['e', 3, 5]]);
  const changes = rebalance(r, 2);
  assert.deepEqual(changes, { d: 2, e: 1 });
  assert.deepEqual(rebalance(r, 3), {});
});

test('équipes vides et membres', () => {
  const r = room(3, [['a', 1], ['b', 2]]);
  assert.equal(everyTeamHasPlayers(r), false);
  assert.equal(everyTeamHasPlayers(room(2, [['a', 1], ['b', 2]])), true);
  assert.deepEqual(Object.keys(teamMembers(r)), ['1', '2', '3']);
});

test('prêt : cahier des charges validé et aucune demande en attente', () => {
  const plan = newRound('cascade');
  assert.equal(canBeReady(plan), false);
  const valid = validatePlan(toggleInPlan(plan, 'avis'));
  assert.equal(canBeReady(valid), true);
  const pending = playSprint(valid).state;
  assert.equal(canBeReady(pending), false);
  assert.equal(canBeReady(newRound('increment')), true);
  assert.equal(isReady({ state: valid, ready: 1 }, 0), true);
  assert.equal(isReady({ state: valid, ready: 1 }, 1), false);
  assert.equal(isReady({ state: plan, ready: 1 }, 0), false);
});

test('chrono : temps restant et format', () => {
  assert.equal(timeLeft({ timerSeconds: 0, periodOpenedAt: 0 }, 5000), null);
  assert.equal(timeLeft({ timerSeconds: 60, periodOpenedAt: 1000 }, 31000), 30);
  assert.equal(timeLeft({ timerSeconds: 60, periodOpenedAt: 1000 }, 99000), 0);
  assert.equal(formatSeconds(125), '2:05');
});

test('Pas prête tant que le COPIL n\'a pas arbitré un projet orageux', async () => {
  const g = await import('../site/js/game-core.js');
  let s = g.newRound('cascade');
  s = g.validatePlan(g.toggleInPlan(s, 'avis'));
  s = g.playSprint(s).state; s = g.decideRequest(s, { accept: false });
  s = g.playSprint(s).state; s = g.decideRequest(s, { accept: false });
  assert.equal(g.needsArbitrage(s), true);
  assert.equal(canBeReady(s), false);
  assert.equal(canBeReady(g.keepScope(s)), true);
});
