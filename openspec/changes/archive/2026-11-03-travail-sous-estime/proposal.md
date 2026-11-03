## Why

Remarque de l'auteur : en manche 1, une équipe qui resserre fortement son cahier des charges (39 points : vitrine, réservation, alerte, gâteaux, click & collect, fidélité) termine et sort son appli au COPIL 4, avant la coupure. C'est rare, mais ça brouille la leçon. Dans la réalité, ce qui fait déraper un projet « big bang », c'est surtout le travail sous-estimé, découvert en route et surtout à l'intégration finale. Le scénario n'en a pas : toutes les estimations sont justes.

## What Changes

- **Travail sous-estimé** : trois découvertes, fixes et identiques pour les deux approches (le moteur reste déterministe), annoncées au moment où l'équipe commence l'élément concerné :
  - « Vitrine en ligne » : +4 points (la charte graphique et l'accessibilité n'étaient pas prévues) ;
  - « Réservation de pain » : +6 points (il faut la relier au logiciel de caisse) ;
  - recette et mise en production finales (manche 1 seulement) : +4 points d'anomalies découvertes à l'intégration. En manche 2, la Definition of Done de chaque Sprint absorbe ce travail au fil de l'eau : pas de découverte finale.
- **Effet visé** : le cahier des charges resserré de 39 points passe de 47 à 61 points avec la recette, au-delà des 60 points réalisables avant la coupure : l'appli ne sort plus. Un plan encore plus petit (3 ou 4 lots) peut encore sortir : c'est assumé, et c'est un bon sujet de débrief (« vous avez livré un tiers de l'appli : était-ce le contrat ? »).
- **Annonce** : dans le compte rendu de COPIL ou la Sprint Review de la période, et dans le journal, avec le vocabulaire de chaque manche ; en manche 1, le travail ajouté fait basculer la météo plus tôt.
- **Chiffres de référence** : les ventes des parcours de référence changent (vitrine et réservation sortent plus tard aussi en Scrum) ; ils seront recalculés et figés dans les tests, en gardant l'histoire : la manche 1 ne sort jamais avec un cahier des charges raisonnable, la manche 2 vend dès les premières semaines.

## Capabilities

### New Capabilities
_Aucune._

### Modified Capabilities
- `scenario` : découvertes de travail sous-estimé.
- `sprint-simulation` : prise en compte des découvertes dans la construction et la recette ; parcours de référence recalculés.
- `solo-game` : annonce des découvertes dans les bilans.

## Impact

- `site/js/scenario.js` (découvertes), `site/js/game-core.js` (coût effectif d'un élément = coût + découverte, révélée au premier point de travail), `site/js/vocabulary.js` (annonces et journal), `site/js/ui.js` (bilans, coût affiché).
- Tests des parcours de référence, README (tableau des ordres de grandeur).
- L'état d'une équipe en base garde la même forme (les découvertes se déduisent de l'avancement) : pas de changement des règles Firebase.
