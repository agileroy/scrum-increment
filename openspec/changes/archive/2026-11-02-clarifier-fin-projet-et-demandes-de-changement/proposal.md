## Why

Retours de l'auteur après une première partie. D'abord, la fin du projet est confuse : la coupure annonce un arrêt du développement après le Sprint 5, puis le jeu parle de « Sprints suivants jusqu'au Sprint 10 », comme si le développement continuait. Ensuite, la manche 1 est trop passive : l'équipe n'a qu'à cliquer sur « Lancer le Sprint », pendant que celle de la manche 2 réfléchit à l'ordre du Product Backlog. En séance collective, les deux équipes n'auraient pas le même temps de réflexion, et la première décrocherait.

## What Changes

- **Calendrier lisible** : un Sprint dure 2 semaines. Les Sprints s'arrêtent avec le développement ; la période suivante se compte en semaines d'exploitation, sans développement, jusqu'à 20 semaines après le lancement du projet (« +2 sem. », « +4 sem. »…). Les fenêtres, le graphique et les indicateurs n'emploient plus « Sprint » après la fin du projet.
- **Frontière visible sur le graphique** : une ligne verticale « Fin du projet » et une zone grisée « Exploitation, plus de développement ». La fin du projet est la même pour les deux manches.
- **Demandes de changement de Madame Lefèvre** : trois nouvelles fonctionnalités demandées pendant le projet, dans les Sprint Reviews des Sprints 1, 2 et 3 (version anglaise, promotions flash, plateaux pour les entreprises), avec l'intuition de Mme Lefèvre et une valeur réelle cachée, comme les autres.
  - **Manche 1** : l'équipe accepte ou refuse chaque demande. Le budget reste de 6 Sprints : accepter coûte la fonctionnalité plus 2 points d'avenant (ajoutés à la recette), et oblige à retirer du plan des fonctionnalités pas encore commencées pour rester dans le budget. La décision se prend sur des opinions, sans retour client.
  - **Manche 2** : la même demande arrive et s'ajoute en bas du Product Backlog, sans avenant ; l'équipe l'ordonne comme le reste.
- **Résultats** : nouvel indicateur « Demandes de Mme Lefèvre mises en ligne », les demandes apparaissent dans « intuition contre réalité », et une question de débrief : décider sur des opinions ou sur des retours clients, qu'est-ce que ça change ?
- **Contexte du projet** : le futur mode collectif donnera le tempo par le formateur (timebox par Sprint, Sprint lancé pour toutes les équipes en même temps) ; noté dans `openspec/config.yaml`.

Hors périmètre : le tempo par le formateur lui-même (il n'existe qu'en mode collectif), d'autres types de demandes (retirer ou modifier une fonctionnalité), une demande en manche 2 qui coûterait un avenant.

## Capabilities

### New Capabilities

_Aucune._

### Modified Capabilities

- `scenario` : ajout des trois demandes de changement (texte de Mme Lefèvre, coût, prérequis, intuition, valeur réelle, retours clients) et de la durée d'un Sprint.
- `sprint-simulation` : règles d'acceptation et de refus en manche 1 (budget fixe, avenant, retraits), ajout au Product Backlog en manche 2, période d'exploitation en semaines.
- `solo-game` : fenêtre de demande de changement en manche 1, annonce de la demande en manche 2, textes de fin de projet sans « Sprint » après le développement.
- `game-results` : frontière « Fin du projet » et zone d'exploitation sur le graphique, axe en Sprints puis en semaines, indicateurs et tableaux mis à jour, nouvelle question de débrief.

## Impact

- `site/js/scenario.js`, `site/js/game-core.js`, `site/js/chart.js`, `site/js/ui.js`, `site/index.html`, `site/app.css`, `tests/`, `README.md`, `openspec/config.yaml`.
- Les parcours de référence où le joueur refuse toutes les demandes (manche 1) ou ne les remonte pas dans le Product Backlog (manche 2) gardent leurs chiffres ; de nouveaux parcours couvrent les demandes acceptées.
