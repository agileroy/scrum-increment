// Vocabulaire de chaque manche : la gestion de projet en manche 1, Scrum en manche 2.
// Toutes les phrases propres à une manche sont ici ; ui.js n'en contient aucune.
// tests/vocabulary.test.mjs vérifie qu'aucune manche n'emploie les mots de l'autre.

import { feature, periodWeeks } from './game-core.js?v=__VERSION__';
import { EVENTS, QUOTES, TEAM_CAPACITY, DONE_COST, AVENANT, UNDERESTIMATES, MAN_DAYS_PER_POINT } from './scenario.js?v=__VERSION__';

const euro = (n) => `${Math.round(n).toLocaleString('fr-FR')} €`;
const plural = (n, one, many = `${one}s`) => `${n} ${n > 1 ? many : one}`;
const names = (ids) => ids.map((id) => feature(id).name).join(', ');
// Charge : en jours/homme en manche 1 (projet), en points en manche 2 (Scrum).
const md = (pts) => pts * MAN_DAYS_PER_POINT;
const jh = (pts) => `${md(pts)} jours/homme`;
const weeksText = (period) => { const [a, b] = periodWeeks(period); return `semaines ${a} et ${b}`; };

/** Mots qu'une manche ne doit jamais employer (ceux de l'autre manche). */
export const FORBIDDEN = {
  cascade: [/Sprint/, /Product Backlog/, /Definition of Done/, /Product Owner/, /\bpoints?\b/i, /\bpts\b/],
  increment: [/COPIL/, /cahier des charges/i, /chef de projet/i, /\blots?\b/i, /avenant/i, /jours?\/homme/i, /\bj\/h\b/],
};

/** Le contexte, commun aux deux approches : rien sur la façon de travailler. */
export const STORY = "Madame Lefèvre tient la boulangerie du quartier. Elle veut une appli pour que ses clients commandent en ligne, et elle vous en confie la réalisation.";

/** Signature des répliques de Mme Lefèvre. */
export const SPEAKER = 'Madame Lefèvre, la boulangère';

const WEATHER = {
  sunny: { icon: '☀️', label: 'Ensoleillé', text: 'Le projet avance comme prévu.' },
  stormy: { icon: '⛈️', label: 'Orageux', text: 'Le reste à faire ne tient plus dans le temps restant.' },
  delivered: { icon: '📦', label: 'Livré', text: "L'appli est sortie." },
};

const cascade = {
  mode: 'cascade',
  round: 'Manche 1 · Projet',
  role: 'Chef de projet',
  stakeholder: 'la boulangère',
  /** Charge courte (« 40 j/h ») et longue (« 40 jours/homme »), à partir des points du moteur. */
  size: (pts) => `${md(pts)} j/h`,
  sizeLong: (pts) => jh(pts),
  sizeOf: (done, cost, extra) => `${md(done)} / ${extra ? `${md(cost)} + ${md(extra)}` : md(cost)} j/h`,
  extraTitle: (pts) => `${jh(pts)} découverts en cours de route`,
  anomalies: (pts) => `dont ${jh(pts)} d'anomalies`,
  // Réplique de Mme Lefèvre dans la salle d'attente, dans l'esprit de la démarche de l'équipe.
  lobbySpeech: "J'ai besoin d'un engagement clair : un périmètre, un budget, une date. Je signe, et je vous laisse travailler.",
  descopeButton: 'Arbitrer : retirer des lots',
  descopeTitle: 'Arbitrage du COPIL',
  descopeIntro: (remaining, left) => `Reste à faire : ${jh(remaining)}. Temps restant jusqu'à la fin prévue : ${jh(left)}. Le COPIL peut retirer du cahier des charges des lots pas encore commencés, avec l'accord de la boulangère.`,
  descopeGauge: 'Reste à faire après l\'arbitrage',
  descopeConfirm: 'Retirer ces lots',
  descopeHint: 'Le projet est orageux : le COPIL devra arbitrer, en retirant des lots pas encore commencés ou en maintenant le périmètre.',
  descopeLog: (removed, reason) => {
    if (removed.length) return `Arbitrage du COPIL : ${names(removed)} ${removed.length > 1 ? 'retirés' : 'retiré'} du cahier des charges.`;
    return reason === 'timeout' ? 'Arbitrage du COPIL : périmètre maintenu faute de décision.' : "Arbitrage du COPIL : périmètre maintenu malgré l'orage.";
  },
  keepButton: 'Maintenir le périmètre',
  reviseButton: 'Changer la décision du COPIL',
  revisePlan: 'Revoir le cahier des charges',
  arbitrageNeeded: "Le projet est orageux : le reste à faire dépasse le temps restant. Le COPIL doit arbitrer avant de continuer : retirer des lots pas encore commencés, ou maintenir le périmètre.",
  arbitrageMore: 'Le projet reste orageux : le COPIL peut encore retirer des lots pas encore commencés.',
  arbitrageBar: 'Arbitrez d\'abord : le projet est orageux.',
  forecast: (label, weather, remaining, left) => `${label} : reste à faire ${jh(remaining)} pour ${jh(left)} de temps restant, ${weather === 'sunny' ? 'projet ensoleillé ☀️' : 'projet orageux ⛈️, le COPIL devra arbitrer'}.`,
  approach: 'Vous optez pour une démarche projet : un cahier des charges complet, signé avant de commencer, et un COPIL toutes les deux semaines pour suivre l\'avancement.',
  intuitionHelp: "Intuition : ce que Mme Lefèvre pense que chaque lot va rapporter, de 1 à 5 étoiles. C'est son avis, pas une mesure.",
  requestFits: (r) => `Accepter, c'est signer un avenant : ${jh(r.cost)} de lot et ${jh(AVENANT)} de recette en plus. Le cahier des charges garde assez de marge : rien à retirer.`,
  requestTight: () => `Accepter, c'est signer un avenant : ${jh(AVENANT)} de recette en plus, et le budget du projet ne bouge pas. Il faut donc retirer du cahier des charges des lots pas encore commencés.`,
  deadline: (n, total) => `COPIL ${n} sur ${total}`,
  deadlineWeeks: (n) => weeksText(n),
  play: (n) => `Avancer jusqu'au COPIL ${n}`,
  listTitle: 'Cahier des charges',
  listHint: "Le cahier des charges est contractuel : l'ordre des lots ne peut plus changer.",
  item: 'lot',
  journalTitle: 'Comptes rendus de COPIL',
  journalEmpty: 'Le projet démarre.',
  requestChip: 'Demande de la boulangère',
  valuePer: '/ 2 semaines',
  awaiting: 'Terminé, en attente de recette',
  recetteName: 'Recette et mise en production',
  recetteReady: 'Tous les lots du cahier des charges sont terminés.',
  recetteWaiting: 'Commence quand tous les lots sont terminés.',
  recetteAvenant: (pts) => `dont ${jh(pts)} d'avenant`,
  weather: (w) => WEATHER[w],
  // Pilotage de projet : pas de ventes ni de clients tant que l'appli n'est pas sortie
  // (le bloc « Temps contre travail » est dessiné par ui.js).
  stats: (s, { weather, launched, cumulative }) => [
    [`${WEATHER[weather].icon} ${WEATHER[weather].label}`, 'Météo du projet'],
    [`${md(TEAM_CAPACITY)} j/h`, 'Capacité toutes les 2 semaines'],
    ...(launched ? [[euro(cumulative), 'Ventes cumulées']] : []),
  ],
  timeVsWork: ({ weeks, totalWeeks, done, total }) => `${weeks} semaine${weeks > 1 ? 's' : ''} sur ${totalWeeks} · ${md(done)} jours/homme sur ${md(total)}, recette comprise`,
  reportTitle: (n) => `Compte rendu du COPIL ${n}`,
  next: (n) => `Avancer jusqu'au COPIL ${n}`,
  seeRequest: 'Voir la demande de la boulangère',
  salesLine: (sales) => `Ventes pendant ces 2 semaines : ${euro(sales)}`,
  eventText: (e) => e.text.cascade,
  eventLog: (e) => e.log.cascade,
  requestAnnounce: (r) => `${r.name} : ${jh(r.cost)}, plus ${jh(AVENANT)} d'avenant. Le COPIL doit trancher avant de continuer.`,
  decision: (d) => {
    const r = feature(d.request).name;
    if (d.decision === 'accepted') return `${r} acceptée par avenant (+${jh(AVENANT)} de recette)${d.removed.length ? `, en retirant : ${names(d.removed)}` : ''}.`;
    if (d.reason === 'timeout') return `${r} refusée faute de décision : le cahier des charges reste inchangé.`;
    return `${r} refusée : le cahier des charges reste inchangé.`;
  },
  planLog: (total) => `Cahier des charges de ${jh(total)} validé et signé par la boulangère.`,
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
  lobbySpeech: "Je ne sais pas encore tout ce dont j'ai besoin. Construisons petit à petit, et montrez-moi régulièrement ce qui marche.",
  size: (pts) => `${pts} pts`,
  sizeLong: (pts) => plural(pts, 'point'),
  sizeOf: (done, cost, extra) => `${done} / ${extra ? `${cost} + ${extra}` : cost} pts`,
  extraTitle: (pts) => `${plural(pts, 'point')} découverts en cours de route`,
  anomalies: (pts) => `dont ${plural(pts, 'point')} d'anomalies`,
  approach: 'Vous optez pour Scrum : vous êtes Product Owner, l\'équipe livre un Increment utilisable à chaque Sprint, et chaque Sprint Review montre ce qui marche.',
  intuitionHelp: "Intuition : ce que Mme Lefèvre pense que chaque élément va rapporter, de 1 à 5 étoiles. C'est son avis : les Sprint Reviews diront ce qu'en pensent ses clients.",
  deadline: (n, total) => `Sprint ${n} sur ${total}`,
  deadlineWeeks: (n) => weeksText(n),
  play: (n) => `Lancer le Sprint ${n}`,
  listTitle: 'Product Backlog',
  listHint: "Ordonnez le Product Backlog : l'équipe prend les éléments par le haut, et un élément non terminé continue au Sprint suivant.",
  lockedHint: 'Vous êtes prêts : l\'ordre du Product Backlog est figé. Pour le changer, appuyez sur « Nous ne sommes plus prêts ».',
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
    case 'sprint': {
      // Manche 1 : pas de ventes dans le journal tant que l'appli ne rapporte rien.
      const sales = mode === 'cascade' && !entry.sales ? '' : ` Ventes : ${euro(entry.sales)}.`;
      return { kind: 'sprint', label: lex.periodName(entry.sprint), text: `${lex.periodLog(entry)}${sales}` };
    }
    case 'quote': { const q = QUOTES.find((x) => x.id === entry.quote); return { kind: 'quote', text: q.text, who: q.who }; }
    case 'event': return { kind: 'event', label: 'Imprévu', text: lex.eventLog(EVENTS.find((e) => e.id === entry.event)) };
    case 'request': { const r = feature(entry.request); return { kind: 'request', label: `Demande de ${lex.stakeholder}`, text: `${r.name} : « ${r.ask} »` }; }
    case 'decision': return { kind: 'decision', text: lex.decision(entry) };
    case 'discovery': return { kind: 'discovery', label: 'Travail sous-estimé', text: discoveryText(mode, entry) };
    case 'descope': return { kind: 'decision', text: lex.descopeLog(entry.removed, entry.reason) };
    default: throw new Error(`Entrée de journal inconnue : ${entry.kind}`);
  }
}

/** Nom d'une période du fil des décisions (0 : avant la première). */
export function trailPeriod(mode, period) {
  if (period === 0) return mode === 'cascade' ? 'Avant le premier COPIL' : 'Avant le premier Sprint';
  return mode === 'cascade' ? `COPIL ${period}` : `Sprint ${period}`;
}

/** Un fait du fil des décisions mis en mots, dans le vocabulaire de la manche (jamais de ventes). */
export function trailText(mode, fact) {
  const lex = lexicon(mode);
  const name = (id) => feature(id).name;
  switch (fact.kind) {
    case 'plan': return `Cahier des charges de ${jh(fact.total)} validé${fact.dropped.length ? `, sans : ${names(fact.dropped)}` : ', avec tous les lots'}.`;
    case 'status': return `Avancement ${fact.progress} %, météo ${WEATHER[fact.weather].label.toLowerCase()}.`;
    case 'release': return "L'appli sort : tous les lots du cahier des charges sont en ligne.";
    case 'live': return `Mis en ligne : ${names(fact.ids)}.`;
    case 'moved': return `« ${name(fact.id)} » ${fact.to < fact.from ? 'remontée' : 'descendue'} du rang ${fact.from} au rang ${fact.to}.`;
    case 'discovery': return `Travail sous-estimé : ${fact.target === 'recette' ? lex.recetteName : name(fact.target)} (+${lex.sizeLong(fact.extra)}).`;
    case 'descope': return lex.descopeLog(fact.removed, fact.reason);
    case 'decision': return lex.decision(fact);
    default: throw new Error(`Fait inconnu : ${fact.kind}`);
  }
}

/** Annonce d'une découverte de travail sous-estimé : « texte (+6 points) ». */
export function discoveryText(mode, { target, extra }) {
  const u = UNDERESTIMATES.find((x) => x.target === target && (!x.mode || x.mode === mode));
  return `${u.text[mode]} (+${lexicon(mode).sizeLong(extra)})`;
}

/** Textes de l'écran de fin du projet, communs aux deux manches (exploitation sans Sprint ni COPIL). */
export function exploitationText(lastBuildSprint, horizonWeeks, sprintWeeks) {
  const weeks = (horizonWeeks / sprintWeeks - lastBuildSprint) * sprintWeeks;
  return `Place à l'exploitation : ${weeks} semaines sans développement, jusqu'à ${horizonWeeks} semaines après le lancement du projet. La boulangerie vit avec ce qui est en ligne.`;
}

