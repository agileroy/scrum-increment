// Cohérence entre les règles de sécurité Firebase et la logique du jeu.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CODE_ALPHABET, TIMER_CHOICES, MIN_TEAMS, MAX_TEAMS } from '../site/js/room-core.js';
import { ROOT } from '../site/js/room-store.js';

const rules = JSON.parse(await readFile(new URL('../database.rules.json', import.meta.url), 'utf8')).rules;
const game = rules[ROOT];
const room = game.rooms.$code;

test('la branche incrementGame existe à côté des autres outils', () => {
  assert.equal(ROOT, 'incrementGame');
  for (const branch of ['room', 'skillMatrix', 'wheelOfChance', 'movingMotivators', 'rolesGame', 'eventsGame', 'incrementGame']) assert.ok(rules[branch], branch);
  assert.equal(rules['.read'], false);
  assert.equal(rules['.write'], false);
});

test('la branche incrementGame ne fait référence qu\'à elle-même', () => {
  const text = JSON.stringify(game);
  for (const other of ['eventsGame', 'rolesGame', 'skillMatrix', 'wheelOfChance', 'movingMotivators']) assert.ok(!text.includes(other), other);
});

test('le code de salle des règles correspond à l\'alphabet du jeu', () => {
  const rule = game.expiry.$code['.validate'].match(/\[([A-Z-]+)\]\{4\}/)[1];
  const allowed = rule.replace(/([A-Z])-([A-Z])/g, (_, a, b) => {
    let out = '';
    for (let c = a.charCodeAt(0); c <= b.charCodeAt(0); c += 1) out += String.fromCharCode(c);
    return out;
  });
  assert.equal(allowed, CODE_ALPHABET);
});

test('les durées de chrono acceptées par les règles sont celles du jeu', () => {
  const values = [...room.meta.timerSeconds['.validate'].matchAll(/=== (\d+)/g)].map((m) => Number(m[1]));
  assert.deepEqual(values.sort((a, b) => a - b), [...TIMER_CHOICES].sort((a, b) => a - b));
});

test('nombre d\'équipes et numéros d\'équipe : de 2 à 6', () => {
  assert.match(room.meta.teamCount['.validate'], new RegExp(`>= ${MIN_TEAMS} && .*<= ${MAX_TEAMS}`));
  assert.match(room.players.$uid.team['.validate'], new RegExp(`<= ${MAX_TEAMS}`));
  assert.match(room.teams.$n['.validate'], new RegExp(`\\[1-${MAX_TEAMS}\\]`));
});

test('un participant ne joue pas de période ni ne touche aux ventes de son équipe', () => {
  const write = room.teams.$n.state['.write'];
  for (const field of ['sprint', 'mode', 'cumulative', 'clientele', 'finished', 'lastBuildSprint']) {
    assert.ok(write.includes(`newData.child('${field}').val() === data.child('${field}').val()`), field);
  }
  for (let k = 1; k <= MAX_TEAMS; k += 1) assert.ok(write.includes(`$n === '${k}'`), `appartenance à l'équipe ${k}`);
  assert.match(write, /meta\/status'\)\.val\(\) === 'playing'/);
});

test('seul le formateur règle la salle, change les équipes et retire un participant', () => {
  assert.match(room.meta['.write'], /hostUid/);
  assert.match(room.players.$uid.removed['.write'], /meta\/hostUid/);
  assert.match(room.players.$uid.team['.write'], /auth\.uid === \$uid && !data\.exists\(\)/);
});

test('suppression au-delà de 24 heures seulement (hors formateur)', () => {
  assert.match(room['.write'], /now - 86400000/);
  assert.match(game.expiry.$code['.write'], /now - 86400000/);
});

test('aucune autre donnée acceptée dans une salle', () => {
  assert.deepEqual(room.$other, { '.validate': false });
  assert.deepEqual(room.teams.$n.$other, { '.validate': false });
  assert.deepEqual(room.meta.$other, { '.validate': false });
});
