// Logique pure de la salle collective : code, prénoms, équipes, état « prêt », chrono.
// Ni DOM ni base : testée avec Node.js, utilisée par room-store.js et room-ui.js.

import { MODES } from './game-core.js';

export const MAX_PLAYERS = 30;
export const MIN_TEAMS = 2;
export const MAX_TEAMS = 6;
export const DEFAULT_TEAMS = 2;
export const ROOM_TTL_MS = 24 * 60 * 60 * 1000;
export const TIMER_CHOICES = [0, 60, 120, 180];
export const NAME_MAX = 20;
export const CODE_LENGTH = 4;
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ';
export const TEAM_NAMES = ['Croissant', 'Baguette', 'Brioche', 'Éclair', 'Chouquette', 'Fougasse'];

/* ---------- Code et prénoms (comme les jeux frères) ---------- */

export function normalizeCode(code) {
  return String(code ?? '').trim().toUpperCase();
}

export function isValidCode(code) {
  return new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`).test(code);
}

export function generateCode(random = Math.random) {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i += 1) code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  return code;
}

export function normalizeName(name) {
  return String(name ?? '').trim().replace(/\s+/g, ' ');
}

export function validateName(name) {
  const value = normalizeName(name);
  if (!value) return 'Saisissez votre prénom.';
  if ([...value].length > NAME_MAX) return `Votre prénom doit faire ${NAME_MAX} caractères au plus.`;
  return null;
}

/** Clé d'unicité d'un prénom : sans majuscules ni accents, utilisable comme clé Firebase. */
export function nameKey(name) {
  return normalizeName(name).normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('fr-FR')
    .replace(/[.#$[\]/%]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`);
}

/* ---------- Équipes ---------- */

export function teamName(n) {
  return TEAM_NAMES[n - 1] ?? `Équipe ${n}`;
}

/** Approche d'une équipe : « projet » (cascade) pour les impaires, « Scrum » (increment) pour les paires. */
export function teamMode(n) {
  return n % 2 === 1 ? MODES.cascade : MODES.increment;
}

export function clampTeamCount(n) {
  return Math.max(MIN_TEAMS, Math.min(MAX_TEAMS, Math.trunc(Number(n) || DEFAULT_TEAMS)));
}

export function teamNumbers(teamCount) {
  return Array.from({ length: clampTeamCount(teamCount) }, (_, i) => i + 1);
}

/** Participants actifs (nommés, non retirés), sous forme [uid, fiche]. */
export function activePlayers(room) {
  return Object.entries(room?.players ?? {}).filter(([, p]) => p && p.name && !p.removed);
}

export function isConnected(player) {
  return Boolean(player?.connections && Object.keys(player.connections).length);
}

/** Membres de chaque équipe : { n → [[uid, fiche], …] }, triés par arrivée. */
export function teamMembers(room) {
  const teamCount = clampTeamCount(room?.meta?.teamCount);
  const out = Object.fromEntries(teamNumbers(teamCount).map((n) => [n, []]));
  for (const entry of activePlayers(room)) {
    const t = entry[1].team;
    if (out[t]) out[t].push(entry);
  }
  for (const list of Object.values(out)) list.sort((a, b) => (a[1].joinedAt ?? 0) - (b[1].joinedAt ?? 0));
  return out;
}

/** Équipe la moins nombreuse (la première en cas d'égalité), sans compter `exceptUid`. */
export function smallestTeam(room, exceptUid = null, teamCount = room?.meta?.teamCount) {
  const counts = Object.fromEntries(teamNumbers(teamCount).map((n) => [n, 0]));
  for (const [uid, p] of activePlayers(room)) if (uid !== exceptUid && counts[p.team] !== undefined) counts[p.team] += 1;
  return Number(Object.entries(counts).sort((a, b) => a[1] - b[1] || Number(a[0]) - Number(b[0]))[0][0]);
}

/**
 * Nouvelle affectation quand le nombre d'équipes change : les participants d'une équipe supprimée
 * vont, un par un, dans l'équipe restante la moins nombreuse. Renvoie { uid → équipe } des changements.
 */
export function rebalance(room, teamCount) {
  const count = clampTeamCount(teamCount);
  const players = activePlayers(room).sort((a, b) => (a[1].joinedAt ?? 0) - (b[1].joinedAt ?? 0));
  const assigned = Object.fromEntries(players.map(([uid, p]) => [uid, p.team]));
  const changes = {};
  for (const [uid, p] of players) {
    if (p.team >= 1 && p.team <= count) continue;
    const counts = Object.fromEntries(teamNumbers(count).map((n) => [n, 0]));
    for (const [other, t] of Object.entries(assigned)) if (other !== uid && counts[t] !== undefined) counts[t] += 1;
    const target = Number(Object.entries(counts).sort((a, b) => a[1] - b[1] || Number(a[0]) - Number(b[0]))[0][0]);
    assigned[uid] = target;
    changes[uid] = target;
  }
  return changes;
}

/** Toutes les équipes ont-elles au moins un participant ? */
export function everyTeamHasPlayers(room) {
  return Object.values(teamMembers(room)).every((list) => list.length > 0);
}

/* ---------- Partie ---------- */

/** Le cahier des charges d'une équipe « projet » est-il validé ? (toujours vrai pour une équipe Scrum) */
export function planReady(state) {
  return !state || state.mode !== MODES.cascade || Boolean(state.planValidated);
}

/** L'équipe peut-elle se déclarer prête ? (cahier des charges validé, aucune demande en attente) */
export function canBeReady(state) {
  return Boolean(state) && planReady(state) && !state.pendingRequest && !state.finished;
}

/** L'équipe s'est-elle déclarée prête pour la prochaine période ? */
export function isReady(team, period) {
  return Boolean(team?.state) && team.ready === period + 1 && canBeReady(team.state);
}

/** Temps de réflexion restant, en secondes (null sans chrono). */
export function timeLeft(meta, now) {
  const timer = meta?.timerSeconds ?? 0;
  if (!timer || typeof meta?.periodOpenedAt !== 'number') return null;
  return Math.max(0, Math.ceil((meta.periodOpenedAt + timer * 1000 - now) / 1000));
}

export function formatSeconds(total) {
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, '0')}`;
}

