// Vocabulaire de chaque manche : la gestion de projet en manche 1, Scrum en manche 2.
// Toutes les phrases propres à une manche sont ici ; ui.js n'en contient aucune.
// tests/vocabulary.test.mjs vérifie qu'aucune manche n'emploie les mots de l'autre.

import { feature, periodWeeks } from './game-core.js';
import { EVENTS, QUOTES, TEAM_CAPACITY, DONE_COST, AVENANT } from './scenario.js';

const euro = (n) => `${Math.round(n).toLocaleString('fr-FR')} €`;
const plural = (n, one, many = `${one}s`) => `${n} ${n > 1 ? many : one}`;
const names = (ids) => ids.map((id) => feature(id).name).join(', ');
const weeksText = (period) => { const [a, b] = periodWeeks(period); return `semaines ${a} et ${b}`; };

/** Mots qu'une manche ne doit jamais employer (ceux de l'autre manche). */
export const FORBIDDEN = {
  cascade: [/Sprint/, /Product Backlog/, /Definition of Done/, /Product Owner/],
  increment: [/COPIL/, /cahier des charges/i, /chef de projet/i, /\blots?\b/i, /avenant/i],
};

const WEATHER = {
  sunny: { icon: '☀️', label: 'Ensoleillé', text: 'Le projet avance comme prévu.' },
  stormy: { icon: '⛈️', label: 'Orageux', text: 'Le reste à faire ne tient plus dans le temps restant.' },
  delivered: { icon: '📦', label: 'Livré', text: "L'appli est sortie." },
};

const cascade = {
  mode: 'cascade',
  round: 'Manche 1 · Projet',
  role: 'Chef de projet',
  stakeholder: 'la commanditaire',
  deadline: (n, total) => `COPIL ${n} sur ${total}`,
  deadlineWeeks: (n) => weeksText(n),
  play: (n) => `Avancer jusqu'au COPIL ${n}`,
  listTitle: 'Cahier des charges',
  listHint: "Le cahier des charges est contractuel : l'ordre des lots ne peut plus changer.",
  item: 'lot',
  journalTitle: 'Comptes rendus de COPIL',
  journalEmpty: 'Le projet démarre.',
  requestChip: 'Demande de la commanditaire',
  valuePer: '/ 2 semaines',
  awaiting: 'Terminé, en attente de recette',
  recetteName: 'Recette et mise en production',
  recetteReady: 'Tous les lots du cahier des charges sont terminés.',
  recetteWaiting: 'Commence quand tous les lots sont terminés.',
  recetteAvenant: (pts) => `dont ${pts} points d'avenant`,
  weather: (w) => WEATHER[w],
  stats: (s, { progress, weather, live, clientele, cumulative }) => [
    [`${progress} %`, 'Avancement'],
    [`${WEATHER[weather].icon} ${WEATHER[weather].label}`, 'Météo du projet'],
    [`${TEAM_CAPACITY} pts`, 'Capacité toutes les 2 semaines'],
    [`${clientele} %`, 'Clients potentiels'],
    [euro(cumulative), 'Ventes cumulées'],
  ],
  reportTitle: (n) => `Compte rendu du COPIL ${n}`,
  next: (n) => `Avancer jusqu'au COPIL ${n}`,
  seeRequest: 'Voir la demande de la commanditaire',
  salesLine: (sales) => `Ventes pendant ces 2 semaines : ${euro(sales)}`,
  eventText: (e) => e.text.cascade,
  eventLog: (e) => e.log.cascade,
  requestAnnounce: (r) => `${r.name} : ${r.cost} points, plus ${AVENANT} points d'avenant. Le COPIL doit trancher avant de continuer.`,
  decision: (d) => {
    const r = feature(d.request).name;
    if (d.decision === 'accepted') return `${r} acceptée par avenant (+${AVENANT} points de recette)${d.removed.length ? `, en retirant : ${names(d.removed)}` : ''}.`;
    if (d.reason === 'timeout') return `${r} refusée faute de décision : le cahier des charges reste inchangé.`;
    return `${r} refusée : le cahier des charges reste inchangé.`;
  },
  planLog: (total) => `Cahier des charges de ${total} points validé et signé par la commanditaire.`,
  periodLog: (f) => `avancement ${f.progress} %, météo ${WEATHER[f.weather].label.toLowerCase()}${f.launched ? ', appli en ligne' : ''}.`,
  periodName: (n) => `COPIL ${n}`,
  endOfDev: (n) => `Le projet s'arrête au COPIL ${n}, en l'état.`,
  neverReleased: (n, offline) => `Le projet s'arrête au COPIL ${n}, en l'état, et l'appli n'est jamais sortie : ${plural(offline, 'lot terminé ne sert', 'lots terminés ne servent')} à aucun client.`,
  finishButton: 'Passer à la manche 2',
};

const increment = {
  mode: 'increment',
  round: 'Manche 2 · Scrum',
  role: 'Product Owner',
  stakeholder: 'Mme Lefèvre',
  deadline: (n, total) => `Sprint ${n} sur ${total}`,
  deadlineWeeks: (n) => weeksText(n),
  play: (n) => `Lancer le Sprint ${n}`,
  listTitle: 'Product Backlog',
  listHint: "Ordonnez le Product Backlog : l'équipe prend les éléments par le haut, et un élément non terminé continue au Sprint suivant.",
  item: 'élément',
  journalTitle: 'Journal des Sprints',
  journalEmpty: 'Le premier Sprint va commencer.',
  requestChip: 'Demande de Mme Lefèvre',
  valuePer: '/ Sprint',
  stats: (s, { live, clientele, cumulative }) => [
    [euro(cumulative), 'Ventes cumulées'],
    [`${TEAM_CAPACITY - DONE_COST} pts + ${DONE_COST}`, 'Pour construire + Definition of Done'],
    [live, 'Fonctionnalités en ligne'],
    [`${clientele} %`, 'Clients potentiels'],
  ],
  reportTitle: (n) => `Sprint Review du Sprint ${n}`,
  next: (n) => `Préparer le Sprint ${n}`,
  salesLine: (sales) => `Ventes pendant ce Sprint : ${euro(sales)}`,
  eventText: (e) => e.text.increment,
  eventLog: (e) => e.log.increment,
  requestAnnounce: (r) => `${r.name} est ajoutée en bas du Product Backlog : à vous de l'ordonner.`,
  decision: (d) => `${feature(d.request).name} ajoutée en bas du Product Backlog.`,
  planLog: () => '',
  periodLog: (f) => (f.completed.length ? `${names(f.completed)} en ligne.` : 'élément en cours.'),
  periodName: (n) => `Sprint ${n}`,
  endOfDev: (n) => `Le développement s'arrête après le Sprint ${n}, en l'état.`,
  finishButton: 'Voir les résultats',
};

export const LEXICON = { cascade, increment };

/** Lexique d'une manche. */
export function lexicon(mode) {
  const lex = LEXICON[mode];
  if (!lex) throw new Error(`Manche inconnue : ${mode}`);
  return lex;
}

/** Une entrée du journal mise en mots : { kind, label?, text, who? } (texte brut, à échapper). */
export function logEntry(mode, entry) {
  const lex = lexicon(mode);
  switch (entry.kind) {
    case 'plan': return { kind: 'plan', text: lex.planLog(entry.total) };
    case 'sprint': return { kind: 'sprint', label: lex.periodName(entry.sprint), text: `${lex.periodLog(entry)} Ventes : ${euro(entry.sales)}.` };
    case 'quote': { const q = QUOTES.find((x) => x.id === entry.quote); return { kind: 'quote', text: q.text, who: q.who }; }
    case 'event': return { kind: 'event', label: 'Imprévu', text: lex.eventLog(EVENTS.find((e) => e.id === entry.event)) };
    case 'request': { const r = feature(entry.request); return { kind: 'request', label: `Demande de ${lex.stakeholder}`, text: `${r.name} : « ${r.ask} »` }; }
    case 'decision': return { kind: 'decision', text: lex.decision(entry) };
    default: throw new Error(`Entrée de journal inconnue : ${entry.kind}`);
  }
}

/** Textes de l'écran de fin du projet, communs aux deux manches (exploitation sans Sprint ni COPIL). */
export function exploitationText(lastBuildSprint, horizonWeeks, sprintWeeks) {
  const weeks = (horizonWeeks / sprintWeeks - lastBuildSprint) * sprintWeeks;
  return `Place à l'exploitation : ${weeks} semaines sans développement, jusqu'à ${horizonWeeks} semaines après le lancement du projet. La boulangerie vit avec ce qui est en ligne.`;
}

