## MODIFIED Requirements

### Requirement: Ventes et clients perdus
Les ventes d'un Sprint SHALL être la somme des valeurs réelles des fonctionnalités en ligne dont le prérequis est aussi en ligne, multipliée par la part de clients potentiels restante. Cette part SHALL valoir 100 % au départ et SHALL être multipliée par 0,9 au début de chaque Sprint à partir du Sprint 3 tant qu'aucune fonctionnalité n'est en ligne. Les clients perdus MUST NOT revenir quand l'appli sort.

#### Scenario: Sortie tardive
- **GIVEN** la manche 1 avec un cahier des charges de 47 points, appli sortie à la fin du Sprint 5
- **WHEN** le Sprint 6 est joué
- **THEN** la part de clients potentiels est de 0,9³, environ 73 %, et les ventes sont réduites d'autant

### Requirement: Après le développement
Après le dernier Sprint de développement, le moteur SHALL simuler des périodes d'exploitation de 2 semaines, sans construction, jusqu'à 20 semaines après le lancement : seules les ventes et, si rien n'est en ligne, les pertes de clients continuent. Le moteur SHALL fournir, pour la manche, la courbe des ventes cumulées sur les 10 périodes, la période de la première vente, les points dépensés avant elle, les fonctionnalités en ligne à la fin du développement, les demandes de changement mises en ligne et les ventes cumulées.

#### Scenario: Parcours de référence
- **GIVEN** les parcours suivants, où la manche 1 refuse toutes les demandes et où la manche 2 laisse les demandes en bas du Product Backlog
- **WHEN** chacun est joué jusqu'à 20 semaines
- **THEN** les ventes cumulées valent :
  - manche 1, cahier des charges de 61 points (tout sauf les avis clients) : 0 € ;
  - manche 1, cahier des charges resserré de 39 points (vitrine, réservation, alerte, gâteaux, click & collect, fidélité) : 16 038 € ;
  - manche 2, Product Backlog dans l'ordre initial, jamais réordonné : 13 300 € ;
  - manche 2, ordre vitrine, réservation, alerte, gâteaux, click & collect, fidélité, paiement, livraison, avis : 25 300 €

## REMOVED Requirements

### Requirement: Une seule livraison à la fin (manche 1)
**Reason**: Son scénario « Sortie au Sprint 6 » n'est plus possible, la coupure arrêtant toujours le développement après le Sprint 5.
**Migration**: Remplacée par « Livraison unique (manche 1) », aux mêmes règles, avec des scénarios compatibles avec la coupure.

### Requirement: Coupure budgétaire
**Reason**: La coupure n'est plus une option annoncée à la Review du Sprint 3.
**Migration**: Remplacée par « Coupure sans préavis ».

## ADDED Requirements

### Requirement: Livraison unique (manche 1)
Dans la manche 1, la capacité SHALL être de 12 points par Sprint, sur un budget prévu de 6 Sprints. Le plan SHALL contenir au moins une fonctionnalité, respecter les prérequis et tenir dans le budget : 72 points moins la recette. La recette et la mise en production SHALL coûter 8 points, plus 2 points par avenant. Le plan validé ne change ensuite que par les demandes de changement. La recette SHALL commencer une fois tout le plan terminé ; les fonctionnalités SHALL alors passer en ligne toutes en même temps, à la fin du Sprint qui termine la recette.

#### Scenario: Plan par défaut
- **GIVEN** le plan initial avec les neuf fonctionnalités
- **WHEN** le joueur veut le valider
- **THEN** la validation est refusée, car le plan fait 66 points pour un budget de 64

#### Scenario: Cahier des charges resserré
- **GIVEN** un cahier des charges de 39 points (vitrine, réservation, alerte, gâteaux, click & collect, fidélité), demandes refusées
- **WHEN** les Sprints sont joués
- **THEN** l'appli sort à la fin du Sprint 4 avec 6 fonctionnalités, avant la coupure, et les premières ventes arrivent au Sprint 5

### Requirement: Coupure sans préavis
À la fin du Sprint 5, dans les deux manches, le moteur SHALL arrêter le développement, sans aucun signe dans les comptes rendus des Sprints 1 à 4. Le plan et l'avancement SHALL rester en l'état : les fonctionnalités terminées mais pas encore en ligne de la manche 1 MUST NOT être mises en ligne.

#### Scenario: Appli jamais sortie
- **GIVEN** la manche 1 avec un plan de 61 points
- **WHEN** le Sprint 5 est joué
- **THEN** le développement s'arrête, aucune fonctionnalité n'est en ligne et les ventes restent à 0 € jusqu'à 20 semaines

#### Scenario: Comptes rendus muets
- **GIVEN** une manche quelconque
- **WHEN** les Sprints 1 à 4 sont joués
- **THEN** aucun compte rendu ne contient l'imprévu de coupure, et le développement prévu reste de 6 Sprints jusqu'au Sprint 5
