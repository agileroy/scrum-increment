## 1. Moteur et logique de salle

- [ ] 1.1 Ajouter à `site/js/game-core.js` `reviveRound`, `reportFromState`, `finishSummary` et le refus « faute de décision » dans `decideRequest`. Vérification : tests (état relu après aller-retour dans une base qui supprime tableaux vides et `null`, bilan reconstruit identique à celui de `playSprint` à chaque période, résumé identique à `finishRound`).
- [ ] 1.2 Écrire `site/js/room-core.js` : code de salle, prénoms, équipes et noms, approche par équipe, répartition dans l'équipe la moins nombreuse, rééquilibrage à la réduction du nombre d'équipes, état « prêt », chrono. Vérification : `tests/room-core.test.mjs` (scénarios « Répartition automatique », « Réduire le nombre d'équipes », « Prénom déjà pris »).

## 2. Base et actions de salle

- [ ] 2.1 Reprendre `firebase-db.js`, `memory-db.js` (clés de démo propres à ce jeu) et `firebase-config.js` des jeux frères ; écrire `site/js/room-store.js` : salle, prénoms, équipes, réglages, présence, retrait, suppression, lancement de la partie, actions d'équipe en transaction, prêt, lancement de période, révélation. Vérification : `tests/room-store.test.mjs`, parties complètes à plusieurs clients sur la base en mémoire (2 et 4 équipes, retardataire, demande refusée faute de décision, actions simultanées, coupure, révélation).
- [ ] 2.2 Ajouter la branche `incrementGame` à `database.rules.json` (repris de `scrum-events`, autres branches identiques). Vérification : `tests/rules.test.mjs` (branche présente, codes, chrono, nombre d'équipes, champs protégés de l'état d'équipe, suppression à 24 heures, autres branches inchangées).

## 3. Interface

- [ ] 3.1 Accueil à trois entrées ; chargement à la demande de la base, de `room-ui.js` et du QR code ; `ui.js` passe par `act(fn)` pour être réutilisé par une équipe. Vérification : jeu seul inchangé (parcours de référence à l'écran), aucune requête externe en jeu seul.
- [ ] 3.2 Écrire `site/js/room-ui.js` : écran du formateur (salle d'attente, équipes et membres, réglages, partie, chrono, lancement, fin, révélation), écran du participant (rejoindre, attente, jeu de l'équipe, prêt, bilans, demandes, fin, attente, résultats), présentation du rôle pour une équipe Scrum. Vérification : liste de contrôle 4.1.
- [ ] 3.3 Résultats collectifs : `chart.js` à une couleur par équipe, légende et indicateurs par équipe, approches dévoilées. Vérification : captures à 2 et 6 équipes.

## 4. Vérification et publication

- [ ] 4.1 Jouer des parties complètes en mode démo dans un navigateur automatisé (un onglet formateur, plusieurs onglets participants) : 2 et 4 équipes, retardataire, déplacements simultanés, demande tranchée par un membre, demande refusée faute de décision, chrono, coupure, révélation ; neutralité de l'écran du formateur ; vocabulaire de chaque équipe. Vérification : aucune erreur dans la console, chiffres d'équipe égaux à ceux du moteur.
- [ ] 4.2 Vérifier l'affichage à 360, 390, 1280 et 1440 px, en thème clair et sombre. Vérification : captures sans défilement horizontal.
- [ ] 4.3 Mettre à jour `README.md` et `openspec/config.yaml`. Vérification : `npm test` et `openspec validate` au vert.
- [ ] 4.4 Recopier `database.rules.json` dans `roles-responsabilites`, `scrum-events`, `poker-planning`, `matrice-competences`, `wheel-of-chance` et `moving-motivators`. Vérification : fichier identique partout, tests de chaque dépôt au vert, publications réussies.
- [ ] 4.5 Pousser sur `main` et vérifier la publication GitHub Actions. Vérification : workflow réussi et déploiement du dernier commit.
- [ ] 4.6 L'auteur publie les règles dans la console Firebase et joue une partie avec de vrais téléphones. Vérification : validation explicite de l'auteur.

## Workflow follow-up

- Archiver le changement avec `/opsx:archive` après la validation de l'auteur.
