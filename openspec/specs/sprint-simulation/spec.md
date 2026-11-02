# sprint-simulation Specification

## Purpose
Règles du moteur de simulation pour les deux façons de livrer : capacité, construction dans l'ordre, prérequis, mise en ligne, ventes, clients perdus face au concurrent, coupure budgétaire et période après le développement.

## Requirements

### Requirement: Déroulé d'un Sprint
Le moteur SHALL jouer un Sprint dans cet ordre : appliquer la perte de clients due au concurrent, encaisser les ventes du Sprint avec les fonctionnalités en ligne au début du Sprint, puis construire avec la capacité du Sprint et mettre en ligne ce qui doit l'être à la fin du Sprint. Une fonctionnalité mise en ligne à la fin d'un Sprint SHALL rapporter à partir du Sprint suivant. Le moteur MUST NOT utiliser de tirage au hasard : la même suite de décisions produit toujours les mêmes résultats.

#### Scenario: Première vente
- **GIVEN** la manche 2, avec la vitrine en tête du Product Backlog
- **WHEN** la vitrine est terminée au Sprint 1
- **THEN** les ventes du Sprint 1 sont de 0 € et celles du Sprint 2 de 200 €

### Requirement: Construction dans l'ordre
À chaque Sprint, le moteur SHALL répartir la capacité de construction sur les fonctionnalités dans l'ordre de la liste (plan ou Product Backlog), de haut en bas : une fonctionnalité reçoit les points qui lui manquent dans la limite de la capacité restante, et le reste passe à la suivante. Une fonctionnalité non terminée SHALL garder ses points et continuer au Sprint suivant. Une fonctionnalité dont le prérequis n'est pas terminé SHALL être sautée, sans recevoir de points ; un prérequis terminé plus haut dans le même Sprint compte comme terminé. Une fonctionnalité terminée MUST NOT recevoir de points.

#### Scenario: Prérequis manquant
- **GIVEN** le paiement en ligne placé au-dessus de la réservation de pain, la vitrine terminée
- **WHEN** le Sprint est joué
- **THEN** le paiement ne reçoit aucun point, la réservation reçoit ses 8 points en priorité, et les 2 points restants vont à la fonctionnalité suivante dont le prérequis est terminé

### Requirement: Une seule livraison à la fin (manche 1)
Dans la manche 1, la capacité SHALL être de 12 points par Sprint sur 6 Sprints. Le plan SHALL contenir au moins une fonctionnalité, respecter les prérequis (pas de fonctionnalité dont le prérequis est absent du plan) et tenir dans 64 points ; il MUST NOT changer une fois validé. Une fois toutes les fonctionnalités du plan terminées, la capacité restante SHALL financer la recette et la mise en production (8 points). Les fonctionnalités terminées SHALL rester hors ligne jusqu'à la fin de la recette ; elles SHALL alors toutes passer en ligne en même temps, à la fin du Sprint qui termine la recette.

#### Scenario: Plan par défaut
- **GIVEN** le plan initial avec les neuf fonctionnalités
- **WHEN** le joueur veut le valider
- **THEN** la validation est refusée, car le plan fait 66 points pour un budget de 64

#### Scenario: Sortie au Sprint 6
- **GIVEN** un plan de 61 points (toutes les fonctionnalités sauf les avis clients), sans coupure budgétaire
- **WHEN** les 6 Sprints sont joués
- **THEN** l'appli sort à la fin du Sprint 6 avec 8 fonctionnalités, et les premières ventes arrivent au Sprint 7

### Requirement: Un incrément à chaque Sprint (manche 2)
Dans la manche 2, la capacité de construction SHALL être de 10 points par Sprint (12 points dont 2 consacrés à finir proprement). Toutes les fonctionnalités SHALL être dans le Product Backlog. Avant chaque Sprint, le joueur SHALL pouvoir déplacer d'un rang vers le haut ou vers le bas toute fonctionnalité non terminée. Une fonctionnalité terminée SHALL passer en ligne à la fin du Sprint, et sa valeur réelle SHALL alors être révélée.

#### Scenario: Valeur révélée
- **GIVEN** la manche 2
- **WHEN** la réservation de pain est terminée au Sprint 2
- **THEN** elle est en ligne et affiche « Ventes réelles : 1 000 € / Sprint »

### Requirement: Ventes et clients perdus
Les ventes d'un Sprint SHALL être la somme des valeurs réelles des fonctionnalités en ligne dont le prérequis est aussi en ligne, multipliée par la part de clients potentiels restante. Cette part SHALL valoir 100 % au départ et SHALL être multipliée par 0,9 au début de chaque Sprint à partir du Sprint 3 tant qu'aucune fonctionnalité n'est en ligne. Les clients perdus MUST NOT revenir quand l'appli sort.

#### Scenario: Sortie tardive
- **GIVEN** la manche 1, appli sortie à la fin du Sprint 6
- **WHEN** le Sprint 7 est joué
- **THEN** la part de clients potentiels est de 0,9⁴, environ 66 %, et les ventes sont réduites d'autant

### Requirement: Coupure budgétaire
Si l'option est activée, la Sprint Review du Sprint 3 SHALL ramener la fin du développement au Sprint 5 dans les deux manches. Dans la manche 1, le plan signé MUST NOT changer pour autant.

#### Scenario: Appli jamais sortie
- **GIVEN** la manche 1 avec un plan de 61 points et la coupure activée
- **WHEN** le Sprint 5 est joué
- **THEN** le développement s'arrête, aucune fonctionnalité n'est en ligne et les ventes restent à 0 € jusqu'au Sprint 10

### Requirement: Après le développement
Après le dernier Sprint de développement, le moteur SHALL jouer les Sprints suivants jusqu'au Sprint 10 sans construction : seules les ventes (et, si rien n'est en ligne, les pertes de clients) continuent. Le moteur SHALL alors fournir, pour la manche, la courbe des ventes cumulées du Sprint 1 au Sprint 10, le Sprint de la première vente, les points dépensés avant la première vente (ou au total s'il n'y en a pas), les fonctionnalités en ligne à la fin du développement et les ventes cumulées.

#### Scenario: Parcours de référence
- **GIVEN** les parcours suivants
- **WHEN** chacun est joué jusqu'au Sprint 10
- **THEN** les ventes cumulées valent :
  - manche 1, plan sans les avis clients : 9 448 € sans coupure, 0 € avec coupure ;
  - manche 2, Product Backlog dans l'ordre initial, jamais réordonné : 15 300 € sans coupure, 13 300 € avec coupure ;
  - manche 2, ordre vitrine, réservation, alerte, gâteaux, click & collect, fidélité, paiement, livraison, avis : 25 300 € avec ou sans coupure
