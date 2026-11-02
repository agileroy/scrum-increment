// Scénario « Fournée » : la boulangerie de Madame Lefèvre.
// Données pures, importées par le navigateur et par les tests Node.
// Les chiffres sont réglés avec les parcours de référence de tests/game-core.test.mjs :
// toute retouche qui change l'histoire doit faire échouer ces tests.

/** Ventes générées par un point de valeur, par Sprint. */
export const EURO_PER_POINT = 100;
/** Coût de développement d'un point de capacité, pour l'indicateur « Investi avant le premier euro ». */
export const COST_PER_POINT = 500;
/** Nombre de Sprints de développement prévus au budget. */
export const PLANNED_SPRINTS = 6;
/** Durée d'un Sprint, et de chaque période d'exploitation après le projet, en semaines. */
export const SPRINT_WEEKS = 2;
/** Durée couverte par la partie, à partir du lancement du projet. */
export const HORIZON_WEEKS = 20;
/** Nombre de périodes simulées (Sprints de développement, puis périodes d'exploitation). */
export const LAST_SPRINT = HORIZON_WEEKS / SPRINT_WEEKS;
/** Capacité par Sprint de l'équipe (12 points dans les deux manches). */
export const TEAM_CAPACITY = 12;
/** Manche 2 : points consacrés à finir proprement à chaque Sprint. */
export const DONE_COST = 2;
/** Manche 1 : recette et mise en production finales. */
export const RECETTE = 8;
/** Manche 1 : points de recette ajoutés par chaque demande de changement acceptée. */
export const AVENANT = 2;
/** Manche 1 : capacité totale du projet, recette comprise. */
export const PROJECT_CAPACITY = PLANNED_SPRINTS * TEAM_CAPACITY;
/** Manche 1 : points disponibles pour les fonctionnalités du plan, sans avenant. */
export const PLAN_BUDGET = PROJECT_CAPACITY - RECETTE;
/** Part de clients potentiels gardée à chaque Sprint sans appli, une fois le concurrent arrivé. */
export const CLIENT_LOSS = 0.9;

/**
 * Fonctionnalités, dans l'ordre initial du plan et du Product Backlog.
 * stars : intuition de Mme Lefèvre (visible) ; value : valeur réelle en points (cachée).
 */
export const FEATURES = [
  { id: 'vitrine',   name: 'Vitrine en ligne',          desc: 'Produits, prix et horaires',            cost: 5,  stars: 3, value: 2,  req: null },
  { id: 'resa',      name: 'Réservation de pain',       desc: 'Réserver sa baguette pour le soir',     cost: 8,  stars: 4, value: 10, req: 'vitrine' },
  { id: 'paiement',  name: 'Paiement en ligne',         desc: 'Payer au moment de la commande',        cost: 8,  stars: 5, value: 2,  req: 'resa' },
  { id: 'livraison', name: 'Livraison à domicile',      desc: 'Livrer les commandes dans le quartier', cost: 14, stars: 5, value: 1,  req: 'resa' },
  { id: 'fidelite',  name: 'Carte de fidélité',         desc: 'Le 10e pain offert',                    cost: 7,  stars: 4, value: 3,  req: 'vitrine' },
  { id: 'avis',      name: 'Avis clients',              desc: 'Notes et commentaires',                 cost: 5,  stars: 3, value: 0,  req: 'vitrine' },
  { id: 'cc',        name: 'Créneau click & collect',   desc: 'Choisir son heure de passage',          cost: 6,  stars: 3, value: 5,  req: 'resa' },
  { id: 'gateaux',   name: 'Gâteaux sur mesure',        desc: "Commander un gâteau d'anniversaire",    cost: 9,  stars: 2, value: 7,  req: 'vitrine' },
  { id: 'alerte',    name: 'Alerte « fournée chaude »', desc: 'Notification à la sortie du four',      cost: 4,  stars: 2, value: 6,  req: 'vitrine' },
];

/**
 * Retours clients de la Sprint Review, par ordre de priorité d'affichage.
 * need : fonctionnalité qui doit être en ligne ; notLive : indice qui disparaît quand cette fonctionnalité est en ligne.
 */
export const QUOTES = [
  { id: 'tradition',   need: 'vitrine',   notLive: 'resa',      who: 'Sophie, cliente du soir',       text: "Enfin les horaires en ligne ! Mais ce que je veux vraiment, c'est être sûre d'avoir ma tradition le soir." },
  { id: 'anniv',       need: 'vitrine',   notLive: 'gateaux',   who: 'Julie, maman de trois enfants', text: "Vous faites des gâteaux d'anniversaire ? Je n'ai vu ça nulle part sur l'appli." },
  { id: 'resa-ok',     need: 'resa',                            who: 'Karim, infirmier',              text: "Réserver ma baguette avant 18 h, ça change tout. Je n'arrive plus devant un panier vide." },
  { id: 'pas-livre',   need: 'resa',      notLive: 'livraison', who: 'Mme Petit, retraitée',          text: "Me faire livrer ? J'habite à 300 mètres, je passe en rentrant." },
  { id: 'croissants',  need: 'resa',      notLive: 'alerte',    who: 'Lucas, étudiant',               text: "Si l'appli pouvait me prévenir quand les croissants sortent du four…" },
  { id: 'comptoir',    need: 'paiement',                        who: 'Jean, client fidèle',           text: "Payer dans l'appli ? Je préfère payer au comptoir, ça me permet de discuter avec Mme Lefèvre." },
  { id: 'alerte-ok',   need: 'alerte',                          who: 'Lucas, étudiant',               text: "Alerte reçue à 7 h 02, j'ai couru : ils étaient encore tièdes !" },
  { id: 'gateau-ok',   need: 'gateaux',                         who: 'Julie, maman de trois enfants', text: 'Le gâteau des 7 ans de Léa commandé en deux clics, parfait.' },
  { id: 'creneau-ok',  need: 'cc',                              who: 'Thomas, papa pressé',           text: "Choisir mon créneau pour le dimanche matin, fini la file d'attente." },
  { id: 'fidelite-ok', need: 'fidelite',                        who: 'Jean, client fidèle',           text: "Le 10e pain offert, c'est sympa, même si je venais déjà tous les jours." },
  { id: 'livraison-ok',need: 'livraison',                       who: 'Sophie, cliente du soir',       text: "La livraison ? Je n'ai jamais essayé, je passe devant tous les jours." },
  { id: 'avis-ok',     need: 'avis',                            who: 'Mme Petit, retraitée',          text: 'Des avis ? Tout le quartier connaît la boulangerie, personne ne les lit.' },
  // Retours sur les demandes de changement, après les autres pour ne pas changer l'ordre des Reviews existantes.
  { id: 'anglais-ok',  need: 'anglais',                         who: 'Karim, infirmier',              text: "Une version anglaise ? Ici, tout le monde parle français, et les touristes ne passent pas par notre rue." },
  { id: 'promos-ok',   need: 'promos',                          who: 'Jean, client fidèle',           text: "J'ai reçu trois promos flash cette semaine. J'achète quand même toujours la même baguette." },
  { id: 'plateaux-ok', need: 'plateaux',                        who: "Nadia, cabinet d'avocats voisin", text: "Les plateaux du vendredi pour toute l'équipe : on recommande chaque semaine !" },
];

/**
 * Demandes de changement de Mme Lefèvre : de nouvelles fonctionnalités, annoncées dans la Sprint Review
 * du Sprint `after`, identiques dans les deux manches. Même format que FEATURES, plus `after` et `ask`.
 */
export const REQUESTS = [
  { id: 'anglais',  name: 'Version anglaise',              desc: "L'appli traduite pour les touristes",       cost: 5, stars: 4, value: 0, req: 'vitrine', after: 1,
    ask: "L'été, il y a des touristes dans le quartier : il nous faut absolument l'appli en anglais !" },
  { id: 'promos',   name: 'Promotions flash',              desc: 'Des réductions envoyées aux clients',        cost: 6, stars: 4, value: 1, req: 'vitrine', after: 2,
    ask: 'La Mie Dorée a son appli : contre-attaquons avec des promotions flash, ça fera venir du monde !' },
  { id: 'plateaux', name: 'Plateaux pour les entreprises', desc: 'Commander des plateaux petit-déjeuner',      cost: 6, stars: 2, value: 4, req: 'vitrine', after: 3,
    ask: "Le cabinet d'avocats d'à côté m'a demandé des plateaux petit-déjeuner. Je ne sais pas si ça vaut vraiment le coup…" },
];

/** Au plus ce nombre de nouveaux retours par Sprint Review. */
export const QUOTES_PER_REVIEW = 3;

/**
 * Imprévus, annoncés à la fin de la période `after` (COPIL en manche 1, Sprint Review en manche 2),
 * identiques dans les deux manches ; textes rédigés dans le vocabulaire de chaque manche.
 */
export const EVENTS = [
  {
    id: 'concurrent', after: 2, optional: false,
    title: 'Nouvelle du quartier',
    text: {
      cascade: "La boulangerie concurrente « La Mie Dorée » lance sa commande en ligne. Tant que Mme Lefèvre n'a pas d'appli, elle perd des clients toutes les deux semaines.",
      increment: "La boulangerie concurrente « La Mie Dorée » lance sa commande en ligne. Tant que Mme Lefèvre n'a pas d'appli, elle perd des clients toutes les deux semaines.",
    },
    log: {
      cascade: 'La Mie Dorée lance sa commande en ligne.',
      increment: 'La Mie Dorée lance sa commande en ligne.',
    },
  },
  {
    id: 'coupure', after: 3, optional: true, lastBuildSprint: 5,
    title: 'Coup dur',
    text: {
      cascade: "La banque réduit le prêt : le projet s'arrêtera au COPIL 5.",
      increment: "La banque réduit le prêt : le développement s'arrêtera après le Sprint 5.",
    },
    log: {
      cascade: "La banque réduit le prêt : le projet s'arrête au COPIL 5.",
      increment: "La banque réduit le prêt : le développement s'arrête après le Sprint 5.",
    },
  },
];

/** Sprint à partir duquel le concurrent fait perdre des clients. */
export const COMPETITOR_FROM = EVENTS.find((e) => e.id === 'concurrent').after + 1;
