// Actions de la partie collective sur la base partagée (Firebase en production, mémoire pour les tests et la démo).
// Les règles du jeu viennent de game-core.js et room-core.js ; database.rules.json applique les mêmes
// contraintes côté base. Toute action d'équipe est une transaction sur l'état de l'équipe.

import {
  newRound, reviveRound, playSprint, finishRound, decideRequest, developmentOver,
} from './game-core.js';
import {
  ROOM_TTL_MS, TIMER_CHOICES, MAX_PLAYERS, generateCode, isValidCode, normalizeCode, normalizeName, validateName,
  nameKey, teamMode, teamNumbers, clampTeamCount, smallestTeam, rebalance, activePlayers, everyTeamHasPlayers,
  planReady, canBeReady,
} from './room-core.js';

export const ROOT = 'incrementGame';
const roomPath = (code) => `${ROOT}/rooms/${code}`;

/** Message d'erreur si l'on ne peut pas rejoindre cette salle, null sinon. */
export function joinRefusal(room, uid) {
  if (!room?.meta) return 'Aucune partie avec ce code.';
  if (room.players?.[uid]?.removed) return 'Le formateur vous a retiré de cette partie.';
  if (room.players?.[uid]?.name) return null; // déjà dans la salle
  if (room.meta.status === 'revealed') return 'Cette partie est terminée.';
  if (activePlayers(room).length >= MAX_PLAYERS) return `La salle est complète (${MAX_PLAYERS} participants au maximum).`;
  return null;
}

/** État du jeu d'une équipe, relu depuis la base. */
export function teamState(room, n) {
  return reviveRound(room?.teams?.[n]?.state ?? null);
}

/** Équipes « projet » dont le cahier des charges n'est pas encore validé. */
export function teamsPreparing(room) {
  return teamNumbers(room?.meta?.teamCount).filter((n) => !planReady(teamState(room, n)));
}

function cryptoRandom() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
}

export function createRoomStore(db, { random = cryptoRandom } = {}) {
  let stopPresence = null;
  let presenceFor = null;

  const store = {
    get uid() { return db.uid; },
    start: () => db.start(),
    serverNow: () => db.serverNow(),
    onConnection: (callback) => db.onConnection(callback),
    watchRoom: (code, callback) => db.onValue(roomPath(code), callback),
    getRoom: (code) => db.get(roomPath(code)),

    // ------------------------------------------------------------ Formateur : salle

    /** Supprime les salles de plus de 24 heures (règles : autorisé à tous au-delà de ce délai). */
    async sweepExpired() {
      const expiry = (await db.get(`${ROOT}/expiry`).catch(() => null)) ?? {};
      const limit = db.serverNow() - ROOM_TTL_MS;
      const old = Object.entries(expiry).filter(([, e]) => typeof e?.createdAt === 'number' && e.createdAt < limit);
      await Promise.all(old.map(([code]) =>
        db.update(ROOT, { [`rooms/${code}`]: null, [`expiry/${code}`]: null }).catch(() => {})));
      return old.length;
    },

    /** Crée une salle avec un code libre ; le navigateur appelant en devient le formateur. */
    async createRoom() {
      await store.sweepExpired();
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const code = generateCode(random);
        const reserved = await db.claim(`${ROOT}/expiry/${code}`, { createdAt: db.TIMESTAMP, hostUid: db.uid });
        if (!reserved) continue;
        const createdAt = (await db.get(`${ROOT}/expiry/${code}/createdAt`)) ?? db.serverNow();
        await db.set(`${roomPath(code)}/meta`, {
          hostUid: db.uid, createdAt, status: 'lobby', teamCount: 2, timerSeconds: 0, period: 0,
        });
        return code;
      }
      throw new Error('Impossible de trouver un code de salle libre.');
    },

    /** Nombre d'équipes (avant le lancement) : les membres d'une équipe supprimée sont replacés. */
    async setTeamCount(code, room, value) {
      if (room?.meta?.status !== 'lobby') return false;
      const count = clampTeamCount(value);
      const patch = { 'meta/teamCount': count };
      for (const [uid, team] of Object.entries(rebalance(room, count))) patch[`players/${uid}/team`] = team;
      await db.update(roomPath(code), patch);
      return true;
    },

    setTimer(code, seconds) {
      if (!TIMER_CHOICES.includes(seconds)) return Promise.resolve(false);
      return db.set(`${roomPath(code)}/meta/timerSeconds`, seconds).then(() => true);
    },

    movePlayer(code, uid, team) {
      return db.set(`${roomPath(code)}/players/${uid}/team`, team);
    },

    removePlayer(code, uid) {
      return db.set(`${roomPath(code)}/players/${uid}/removed`, true);
    },

    deleteRoom(code) {
      return db.update(ROOT, { [`rooms/${code}`]: null, [`expiry/${code}`]: null });
    },

    // ------------------------------------------------------------ Formateur : partie

    /** Lance la partie : le jeu de chaque équipe selon son approche, réflexion de la première période. */
    async launchGame(code, room) {
      if (room?.meta?.status !== 'lobby' || !everyTeamHasPlayers(room)) return false;
      const patch = {
        'meta/status': 'playing', 'meta/period': 0, 'meta/periodOpenedAt': db.TIMESTAMP, 'meta/startedAt': db.TIMESTAMP,
      };
      for (const n of teamNumbers(room.meta.teamCount)) patch[`teams/${n}`] = { state: newRound(teamMode(n)) };
      await db.update(roomPath(code), patch);
      return true;
    },

    /**
     * Joue la période suivante pour toutes les équipes : demande en attente refusée faute de décision,
     * période jouée, fin du projet à la coupure. Idempotent : une équipe déjà passée n'est pas rejouée.
     */
    async launchPeriod(code, room) {
      if (room?.meta?.status !== 'playing') return false;
      if (teamsPreparing(room).length) return false;
      const period = room.meta.period ?? 0;
      let ended = false;
      for (const n of teamNumbers(room.meta.teamCount)) {
        await db.transaction(`${roomPath(code)}/teams/${n}/state`, (raw) => {
          if (!raw) return raw;
          let s = reviveRound(raw);
          if (s.sprint !== period || s.finished) return undefined;
          if (s.pendingRequest) s = decideRequest(s, { accept: false, reason: 'timeout' });
          s = playSprint(s).state;
          if (developmentOver(s)) s = finishRound(s).state;
          return s;
        });
        const after = reviveRound(await db.get(`${roomPath(code)}/teams/${n}/state`));
        if (after?.finished) ended = true;
      }
      const patch = { 'meta/period': period + 1, 'meta/periodOpenedAt': db.TIMESTAMP };
      if (ended) { patch['meta/status'] = 'ended'; patch['meta/endedAt'] = db.TIMESTAMP; }
      await db.update(roomPath(code), patch);
      return true;
    },

    reveal(code) {
      return db.set(`${roomPath(code)}/meta/status`, 'revealed');
    },

    // ------------------------------------------------------------ Participant

    /** Entre dans la salle avec un prénom unique ; placé dans l'équipe la moins nombreuse. Renvoie null ou une erreur. */
    async join(rawCode, rawName) {
      const code = normalizeCode(rawCode);
      if (!isValidCode(code)) return 'Le code de la salle fait 4 lettres.';
      const nameError = validateName(rawName);
      if (nameError) return nameError;
      const name = normalizeName(rawName);
      const room = await db.get(roomPath(code)).catch(() => null);
      const refusal = joinRefusal(room, db.uid);
      if (refusal) return refusal;
      const key = nameKey(name);
      const me = room.players?.[db.uid];
      const previous = me?.name;
      const claimed = await db.transaction(`${roomPath(code)}/names/${key}`, (owner) =>
        (owner === null || owner === db.uid ? db.uid : undefined)).catch(() => false);
      if (!claimed) return 'Ce prénom est déjà pris dans la salle.';
      const patch = { name, joinedAt: db.TIMESTAMP };
      if (!me?.team) patch.team = smallestTeam(room, db.uid);
      await db.update(`${roomPath(code)}/players/${db.uid}`, patch);
      if (previous && nameKey(previous) !== key) {
        await db.remove(`${roomPath(code)}/names/${nameKey(previous)}`).catch(() => {});
      }
      store.openPresence(code);
      return null;
    },

    /** Présence dans la salle (une entrée par onglet, retirée à la déconnexion). */
    openPresence(code) {
      if (presenceFor === code) return;
      stopPresence?.();
      presenceFor = code;
      stopPresence = db.presence(`${roomPath(code)}/players/${db.uid}/connections`);
    },

    async closePresence() {
      const stop = stopPresence;
      stopPresence = null;
      presenceFor = null;
      await stop?.();
    },

    /**
     * Action d'un membre sur le jeu de son équipe : `fn(état)` du moteur, appliquée à l'état le plus récent.
     * Renvoie true si l'action a été appliquée (false si elle n'a plus de sens, par exemple une demande déjà tranchée).
     */
    async teamAction(code, n, fn) {
      let applied = false;
      await db.transaction(`${roomPath(code)}/teams/${n}/state`, (raw) => {
        applied = false; // la fonction peut être rappelée sur un état plus récent
        if (!raw) return raw;
        try {
          const before = reviveRound(raw);
          const next = fn(before);
          if (!next || next === before) return undefined;
          applied = true;
          return next;
        } catch {
          return undefined;
        }
      }).catch(() => false);
      return applied;
    },

    /** « Nous sommes prêts » (ou plus prêts) pour la prochaine période. */
    setReady(code, n, room, ready) {
      const state = teamState(room, n);
      if (ready && !canBeReady(state)) return Promise.resolve(false);
      const value = ready ? (room.meta.period ?? 0) + 1 : null;
      return db.set(`${roomPath(code)}/teams/${n}/ready`, value).then(() => true, () => false);
    },
  };
  return store;
}
