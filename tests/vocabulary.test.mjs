import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEXICON, FORBIDDEN, lexicon, logEntry, exploitationText } from '../site/js/vocabulary.js';
import {
  newRound, toggleInPlan, validatePlan, playSprint, decideRequest, developmentOver, planStatus, requestStatus,
} from '../site/js/game-core.js';
import { EVENTS, REQUESTS, FEATURES } from '../site/js/scenario.js';

// Toutes les chaînes que le lexique d'une manche peut produire, avec des faits d'exemple de chaque type.
function allStrings(mode) {
  const lex = lexicon(mode);
  const out = [];
  const walk = (v) => {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  for (const [key, value] of Object.entries(lex)) {
    if (typeof value === 'string') out.push(value);
    else if (typeof value === 'function') {
      for (const args of [[1, 6], [3, 5], [6, 6]]) {
        try { walk(value(...args)); } catch { /* fonctions à arguments typés, couvertes plus bas */ }
      }
    }
  }
  for (const w of ['sunny', 'stormy', 'delivered']) if (lex.weather) walk(lex.weather(w));
  walk(lex.stats({}, { progress: 40, weather: 'sunny', live: 2, clientele: 90, cumulative: 1200 }));
  for (const e of EVENTS) { out.push(lex.eventText(e), lex.eventLog(e)); }
  for (const r of REQUESTS) {
    out.push(lex.requestAnnounce(r));
    for (const decision of mode === 'cascade' ? ['accepted', 'refused'] : ['backlog']) {
      out.push(lex.decision({ request: r.id, decision, removed: ['livraison', 'avis'] }));
    }
  }
  out.push(lex.periodLog({ progress: 40, weather: 'stormy', launched: true, completed: ['vitrine', 'resa'] }));
  out.push(lex.periodLog({ progress: 40, weather: 'sunny', launched: false, completed: [] }));
  if (lex.neverReleased) out.push(lex.neverReleased(5, 6), lex.neverReleased(5, 1));
  // Journal d'une manche réellement jouée, avec coupure et demandes.
  let s = newRound(mode, { cut: true });
  if (mode === 'cascade') { s = validatePlan(toggleInPlan(s, 'avis')); out.push(planStatus(newRound(mode)).message); }
  while (!developmentOver(s)) {
    s = playSprint(s).state;
    if (s.pendingRequest) {
      out.push(requestStatus(s, []).message, requestStatus(s, ['livraison']).message);
      s = decideRequest(s, { accept: false });
    }
  }
  for (const entry of s.log) walk(logEntry(mode, entry));
  return out.filter(Boolean);
}

for (const mode of ['cascade', 'increment']) {
  test(`Pas de mélange : aucun mot de l'autre manche dans le lexique ${mode}`, () => {
    const strings = allStrings(mode);
    assert.ok(strings.length > 40, `${strings.length} chaînes`);
    for (const str of strings) {
      for (const re of FORBIDDEN[mode]) assert.ok(!re.test(str), `« ${str} » contient ${re}`);
    }
  });
}

test('Tableau de la manche 1', () => {
  const lex = LEXICON.cascade;
  assert.equal(lex.deadline(2, 6), 'COPIL 2 sur 6');
  assert.equal(lex.play(2), "Avancer jusqu'au COPIL 2");
  assert.equal(lex.listTitle, 'Cahier des charges');
  assert.equal(lex.deadlineWeeks(3), 'semaines 5 et 6');
});

test('Capacité de la manche 2 : 10 points pour construire et 2 pour la Definition of Done', () => {
  const stats = LEXICON.increment.stats({}, { live: 0, clientele: 100, cumulative: 0 });
  assert.ok(stats.some(([v, l]) => v === '10 pts + 2' && /Definition of Done/.test(l)));
});

test('Annonce de la coupure en manche 1 : COPIL 5, sans Sprint', () => {
  const coupure = EVENTS.find((e) => e.id === 'coupure');
  assert.match(LEXICON.cascade.eventText(coupure), /COPIL 5/);
  assert.doesNotMatch(LEXICON.cascade.eventText(coupure), /Sprint/);
});

test('fin du projet : exploitation sans Sprint ni COPIL', () => {
  const text = exploitationText(5, 20, 2);
  assert.match(text, /10 semaines/);
  assert.doesNotMatch(text, /Sprint|COPIL/);
  assert.equal(LEXICON.cascade.endOfDev(5), "Le projet s'arrête au COPIL 5.");
});

test('les deux lexiques ont les mêmes clés de base', () => {
  const base = ['round', 'role', 'deadline', 'play', 'listTitle', 'item', 'journalTitle', 'requestChip', 'valuePer', 'stats', 'reportTitle', 'next', 'salesLine', 'eventText', 'eventLog', 'requestAnnounce', 'decision', 'periodLog', 'periodName', 'endOfDev', 'finishButton'];
  for (const k of base) for (const m of ['cascade', 'increment']) assert.ok(k in LEXICON[m], `${m}.${k}`);
  assert.equal(FEATURES.length, 9);
});
