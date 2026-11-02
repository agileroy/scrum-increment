## 1. Scénario et moteur

- [x] 1.1 Ajouter à `site/js/scenario.js` la durée d'un Sprint et l'horizon en semaines, les trois demandes de changement (`REQUESTS`) et leurs retours clients. Vérification : `tests/scenario.test.mjs` (demandes annoncées après les Sprints 1, 2 et 3, prérequis connus, identifiants distincts de `FEATURES`, scénario « Opinions trompeuses », un retour par demande, `FEATURES` inchangé à 66 points).
- [x] 1.2 Faire évoluer `site/js/game-core.js` : coût de recette par manche, demande en attente en manche 1 (`requestStatus`, `decideRequest`, Sprint refusé tant qu'une demande attend, retraits limités aux fonctionnalités sans points), ajout en bas du Product Backlog en manche 2, libellés de période (`periodLabel`), résultats avec `requestsLive` et `lastBuildSprint`, `truthTable` avec les demandes. Vérification : `tests/game-core.test.mjs` couvre chaque scénario modifié ou ajouté de `sprint-simulation`, les six parcours de référence inchangés (demandes refusées ou laissées en bas) et un nouveau parcours de référence : manche 1 sans coupure, livraison en fin de plan, plateaux acceptés au Sprint 3 en retirant la livraison, ventes supérieures au refus.

## 2. Interface

- [x] 2.1 Faire évoluer `site/js/chart.js` : axe en Sprints puis « +N sem. », ligne « Fin du projet », zone « Exploitation, plus de développement », mode compact sous 560 px. Vérification : captures avec et sans coupure, dans les deux thèmes, à 360 et 1280 px.
- [x] 2.2 Faire évoluer `site/js/ui.js`, `site/index.html` et `site/app.css` : fenêtre de demande de changement en manche 1 (cases, jauge, message, « Accepter » / « Refuser », Échap neutralisé), annonce de la demande en manche 2, badge « Demande de Mme Lefèvre », journal, fin du projet en semaines d'exploitation, indicateurs (premier euro, demandes en ligne, ventes après 20 semaines), tableau « intuition contre réalité » avec les demandes, nouvelle question de débrief. Vérification : liste de contrôle 3.1.

## 3. Vérification

- [x] 3.1 Jouer dans un navigateur automatisé : demandes refusées dans les deux manches avec et sans coupure (chiffres de référence), acceptation refusée sans retrait, acceptation avec retrait, Échap sur une demande, parcours de référence avec les plateaux acceptés, textes de fin de projet sans « Sprint » après le développement. Vérification : aucune erreur dans la console, chiffres affichés égaux aux tests.
- [x] 3.2 Vérifier l'affichage à 360, 390, 1280 et 1440 px, en thème clair et sombre, dont la fenêtre de demande. Vérification : captures sans défilement horizontal.
- [x] 3.3 Mettre à jour `README.md` (calendrier, demandes de changement) et `openspec/config.yaml` (tempo par le formateur retenu pour le mode collectif, demandes de changement). Vérification : `npm test` au vert et `openspec validate --specs` sans erreur après synchronisation.
- [ ] 3.4 Pousser sur `main` et vérifier la publication GitHub Actions. Vérification : workflow réussi et déploiement du dernier commit.
- [ ] 3.5 Faire jouer les deux manches par l'auteur. Vérification : validation explicite de l'auteur.

## Workflow follow-up

- Archiver le changement avec `/opsx:archive` après la validation de l'auteur.
