// Parties collectives complètes à plusieurs clients sur la base en mémoire.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryServer } from '../site/js/memory-db.js';
import { createRoomStore, teamState, teamsPreparing, ROOT } from '../site/js/room-store.js';
import { toggleInPlan, validatePlan, moveFeatureTo, decideRequest, roundResults } from '../site/js/game-core.js';
import { isReady, teamMembers } from '../site/js/room-core.js';

function setup() {
  let clock = 1_000_000;
  const server = createMemoryServer({ now: () => clock });
  const client = (uid) => createRoomStore(server.client(uid));
  return { server, client, tick: (ms) => { clock += ms; } };
}

const SMART = ['vitrine', 'resa', 'alerte', 'gateaux', 'cc', 'fidelite', 'paiement', 'livraison', 'avis'];

async function room(host, code) { return host.getRoom(code); }

async function lobby(teams, players) {
  const env = setup();
  const host = env.client('host');
  const code = await host.createRoom();
  let r = await room(host, code);
  if (teams !== 2) { await host.setTeamCount(code, r, teams); }
  const stores = {};
  for (const name of players) {
    stores[name] = env.client(`u-${name}`);
    assert.equal(await stores[name].join(code, name), null);
  }
  return { ...env, host, code, stores };
}

// Chaque équipe « projet » retire les avis et valide ; chaque équipe Scrum ordonne comme « à l'écoute ».
async function prepare(env, r) {
  const members = teamMembers(r);
  for (const [n, list] of Object.entries(members)) {
    const store = env.stores[list[0][1].name];
    const st = teamState(r, n);
    if (st.mode === 'cascade') {
      assert.ok(await store.teamAction(env.code, n, (s) => toggleInPlan(s, 'avis')));
      assert.ok(await store.teamAction(env.code, n, (s) => validatePlan(s)));
    } else {
      for (const [i, id] of SMART.entries()) await store.teamAction(env.code, n, (s) => moveFeatureTo(s, id, i));
    }
  }
}

test('salle : création, prénoms uniques, répartition et retardataire', async () => {
  const env = await lobby(2, ['Julie', 'Karim', 'Lucas']);
  const r = await room(env.host, env.code);
  assert.equal(r.meta.status, 'lobby');
  assert.deepEqual(Object.values(r.players).map((p) => p.team).sort(), [1, 1, 2]);
  const intruder = env.client('u-autre');
  assert.equal(await intruder.join(env.code, 'julie'), 'Ce prénom est déjà pris dans la salle.');
  assert.equal(await intruder.join('ZZZZ', 'Paul'), 'Aucune partie avec ce code.');
  assert.equal(await intruder.join(env.code, 'Éloïse'), null);
  assert.equal((await room(env.host, env.code)).players['u-autre'].team, 2);
});

test('nombre d\'équipes : réduire replace les membres, lancement impossible avec une équipe vide', async () => {
  const env = await lobby(3, ['A', 'B', 'C', 'D']);
  let r = await room(env.host, env.code);
  assert.equal(r.meta.teamCount, 3);
  await env.host.setTeamCount(env.code, r, 5);
  r = await room(env.host, env.code);
  assert.equal(await env.host.launchGame(env.code, r), false);
  await env.host.setTeamCount(env.code, r, 2);
  r = await room(env.host, env.code);
  assert.deepEqual(Object.values(r.players).map((p) => p.team).sort(), [1, 1, 2, 2]);
  assert.equal(await env.host.launchGame(env.code, r), true);
});

async function playFullGame(teams, names) {
  const env = await lobby(teams, names);
  let r = await room(env.host, env.code);
  assert.ok(await env.host.launchGame(env.code, r));
  r = await room(env.host, env.code);
  assert.equal(r.meta.status, 'playing');
  // Période 1 impossible tant qu'un cahier des charges n'est pas validé.
  assert.ok(teamsPreparing(r).length > 0);
  assert.equal(await env.host.launchPeriod(env.code, r), false);
  await prepare(env, r);
  r = await room(env.host, env.code);
  assert.deepEqual(teamsPreparing(r), []);
  for (let p = 1; p <= 5; p += 1) {
    assert.ok(await env.host.launchPeriod(env.code, r), `période ${p}`);
    r = await room(env.host, env.code);
    // Les demandes de la manche 1 sont laissées sans décision : refusées faute de décision au lancement suivant.
  }
  assert.equal(r.meta.status, 'ended');
  assert.equal(r.meta.period, 5);
  return { env, r };
}

test('partie complète à 2 équipes : chiffres du moteur, demandes refusées faute de décision', async () => {
  const { env, r } = await playFullGame(2, ['Julie', 'Karim']);
  const a = roundResults(teamState(r, 1));
  const b = roundResults(teamState(r, 2));
  assert.equal(a.cumulative, 0);
  assert.equal(b.cumulative, 21200);
  const timeouts = teamState(r, 1).log.filter((e) => e.kind === 'decision' && e.reason === 'timeout');
  assert.deepEqual(timeouts.map((e) => e.request), ['anglais', 'promos', 'plateaux']);
  assert.equal(await env.host.launchPeriod(env.code, r), false);
  await env.host.reveal(env.code);
  assert.equal((await room(env.host, env.code)).meta.status, 'revealed');
});

test('partie complète à 4 équipes', async () => {
  const { r } = await playFullGame(4, ['A', 'B', 'C', 'D', 'E', 'F']);
  assert.deepEqual([1, 2, 3, 4].map((n) => teamState(r, n).mode), ['cascade', 'increment', 'cascade', 'increment']);
  assert.ok([1, 2, 3, 4].every((n) => teamState(r, n).finished));
});

test('lancement idempotent : un double clic ne joue pas deux fois la période', async () => {
  const env = await lobby(2, ['A', 'B']);
  let r = await room(env.host, env.code);
  await env.host.launchGame(env.code, r);
  r = await room(env.host, env.code);
  await prepare(env, r);
  r = await room(env.host, env.code);
  await Promise.all([env.host.launchPeriod(env.code, r), env.host.launchPeriod(env.code, r)]);
  const after = await room(env.host, env.code);
  assert.equal(teamState(after, 1).sprint, 1);
  assert.equal(teamState(after, 2).sprint, 1);
});

test('actions d\'équipe : deux membres en même temps, demande tranchée par un membre, prêt', async () => {
  const env = await lobby(2, ['Julie', 'Karim', 'Lucas', 'Nadia']);
  let r = await room(env.host, env.code);
  await env.host.launchGame(env.code, r);
  r = await room(env.host, env.code);
  const team2 = teamMembers(r)[2].map(([, p]) => env.stores[p.name]);
  await Promise.all([
    team2[0].teamAction(env.code, 2, (s) => moveFeatureTo(s, 'alerte', 0)),
    team2[1].teamAction(env.code, 2, (s) => moveFeatureTo(s, 'livraison', 8)),
  ]);
  r = await room(env.host, env.code);
  const order = teamState(r, 2).order;
  assert.equal(order[0], 'alerte');
  assert.equal(order[8], 'livraison');
  await prepare(env, r);
  r = await room(env.host, env.code);
  const team1 = teamMembers(r)[1].map(([, p]) => env.stores[p.name]);
  assert.ok(await team1[0].setReady(env.code, 1, r, true));
  r = await room(env.host, env.code);
  assert.ok(isReady(r.teams[1], r.meta.period));
  await env.host.launchPeriod(env.code, r);
  r = await room(env.host, env.code);
  assert.equal(isReady(r.teams[1], r.meta.period), false, 'prêt remis à zéro à la période suivante');
  assert.equal(teamState(r, 1).pendingRequest, 'anglais');
  assert.equal(await team1[0].setReady(env.code, 1, r, true), false, 'pas prêt avec une demande en attente');
  const [first, second] = await Promise.all([
    team1[0].teamAction(env.code, 1, (s) => (s.pendingRequest ? decideRequest(s, { accept: false }) : s)),
    team1[1].teamAction(env.code, 1, (s) => (s.pendingRequest ? decideRequest(s, { accept: false }) : s)),
  ]);
  assert.equal([first, second].filter(Boolean).length, 1, 'une seule décision appliquée');
  r = await room(env.host, env.code);
  assert.equal(teamState(r, 1).pendingRequest, null);
  assert.equal(teamState(r, 1).log.filter((e) => e.kind === 'decision').length, 1);
});

test('retrait, retardataire pendant la partie, suppression et salles anciennes', async () => {
  const env = await lobby(2, ['A', 'B', 'C']);
  let r = await room(env.host, env.code);
  await env.host.launchGame(env.code, r);
  const late = env.client('u-late');
  assert.equal(await late.join(env.code, 'Retard'), null);
  r = await room(env.host, env.code);
  assert.equal(r.players['u-late'].team, 2);
  await env.host.removePlayer(env.code, 'u-late');
  assert.equal(await late.join(env.code, 'Retard'), 'Le formateur vous a retiré de cette partie.');
  await env.host.movePlayer(env.code, 'u-A', 2);
  r = await room(env.host, env.code);
  assert.equal(r.players['u-A'].team, 2);
  env.tick(25 * 60 * 60 * 1000);
  const other = env.client('host2');
  await other.createRoom();
  assert.equal(env.server.read(`${ROOT}/rooms/${env.code}`), null);
});
