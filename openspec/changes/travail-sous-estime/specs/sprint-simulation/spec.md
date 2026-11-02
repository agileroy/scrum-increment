## MODIFIED Requirements

### Requirement: Construction dans l'ordre
À chaque Sprint, le moteur SHALL répartir la capacité de construction sur les fonctionnalités dans l'ordre de la liste (plan ou Product Backlog), de haut en bas : une fonctionnalité reçoit les points qui lui manquent dans la limite de la capacité restante, et le reste passe à la suivante. Une fonctionnalité non terminée SHALL garder ses points et continuer au Sprint suivant. Une fonctionnalité dont le prérequis n'est pas terminé SHALL être sautée, sans recevoir de points ; un prérequis terminé plus haut dans le même Sprint compte comme terminé. Une fonctionnalité terminée MUST NOT recevoir de points.

#### Scenario: Prérequis manquant
- **GIVEN** en manche 2, la vitrine terminée, puis dans l'ordre le paiement en ligne (qui attend la réservation), l'alerte et les gâteaux
- **WHEN** le Sprint est joué
- **THEN** le paiement ne reçoit aucun point, l'alerte reçoit ses 4 points, et les 6 points restants vont aux gâteaux

### Requirement: Un incrément à chaque Sprint (manche 2)
Dans la manche 2, la capacité de construction SHALL être de 10 points par Sprint (12 points dont 2 consacrés à finir proprement). Toutes les fonctionnalités SHALL être dans le Product Backlog. Avant chaque Sprint, le joueur SHALL pouvoir déplacer d'un rang vers le haut ou vers le bas toute fonctionnalité non terminée. Une fonctionnalité terminée SHALL passer en ligne à la fin du Sprint, et sa valeur réelle SHALL alors être révélée.

#### Scenario: Valeur révélée
- **GIVEN** la manche 2
- **WHEN** la réservation de pain (8 points, plus 6 découverts) est terminée au Sprint 3
- **THEN** elle est en ligne et affiche « Ventes réelles : 1 000 € / Sprint »

### Requirement: Ventes et clients perdus
Les ventes d'un Sprint SHALL être la somme des valeurs réelles des fonctionnalités en ligne dont le prérequis est aussi en ligne, multipliée par la part de clients potentiels restante. Cette part SHALL valoir 100 % au départ et SHALL être multipliée par 0,9 au début de chaque Sprint à partir du Sprint 3 tant qu'aucune fonctionnalité n'est en ligne. Les clients perdus MUST NOT revenir quand l'appli sort.

#### Scenario: Sortie tardive
- **GIVEN** la manche 1 avec un cahier des charges de 32 points (vitrine, réservation, alerte, gâteaux, click & collect), appli sortie à la fin du COPIL 5
- **WHEN** le Sprint 6 est joué
- **THEN** la part de clients potentiels est de 0,9³, environ 73 %, et les ventes sont réduites d'autant

### Requirement: Après le développement
Après le dernier Sprint de développement, le moteur SHALL simuler des périodes d'exploitation de 2 semaines, sans construction, jusqu'à 20 semaines après le lancement : seules les ventes et, si rien n'est en ligne, les pertes de clients continuent. Le moteur SHALL fournir, pour la manche, la courbe des ventes cumulées sur les 10 périodes, la période de la première vente, les points dépensés avant elle, les fonctionnalités en ligne à la fin du développement, les demandes de changement mises en ligne et les ventes cumulées.

#### Scenario: Parcours de référence
- **GIVEN** les parcours suivants, où la manche 1 refuse toutes les demandes et où la manche 2 laisse les demandes en bas du Product Backlog
- **WHEN** chacun est joué jusqu'à 20 semaines
- **THEN** les ventes cumulées valent :
  - manche 1, cahier des charges de 61 points (tout sauf les avis clients) : 0 € ;
  - manche 1, cahier des charges resserré de 39 points (vitrine, réservation, alerte, gâteaux, click & collect, fidélité) : 0 €, le travail découvert empêchant la sortie ;
  - manche 1, tout petit cahier des charges de 26 points (vitrine, réservation, alerte, gâteaux) : 12 150 € ;
  - manche 2, Product Backlog dans l'ordre initial, jamais réordonné : 10 500 € ;
  - manche 2, ordre vitrine, réservation, alerte, gâteaux, click & collect, fidélité, paiement, livraison, avis : 21 200 €

### Requirement: Livraison unique (manche 1)
Dans la manche 1, la capacité SHALL être de 12 points par Sprint, sur un budget prévu de 6 Sprints. Le plan SHALL contenir au moins une fonctionnalité, respecter les prérequis et tenir dans le budget : 72 points moins la recette. La recette et la mise en production SHALL coûter 8 points, plus 2 points par avenant et le travail découvert à la recette. Le budget du cahier des charges SHALL se calculer sur les estimations, sans le travail découvert. Le plan validé ne change ensuite que par les demandes de changement. La recette SHALL commencer une fois tout le plan terminé ; les fonctionnalités SHALL alors passer en ligne toutes en même temps, à la fin du Sprint qui termine la recette.

#### Scenario: Plan par défaut
- **GIVEN** le plan initial avec les neuf fonctionnalités
- **WHEN** le joueur veut le valider
- **THEN** la validation est refusée, car le plan fait 66 points pour un budget de 64

#### Scenario: Cahier des charges resserré
- **GIVEN** un cahier des charges de 39 points (vitrine, réservation, alerte, gâteaux, click & collect, fidélité), demandes refusées
- **WHEN** les COPIL sont joués jusqu'à la coupure
- **THEN** le travail découvert porte le total à 61 points avec la recette, et l'appli ne sort pas avant la coupure

#### Scenario: Tout petit cahier des charges
- **GIVEN** un cahier des charges de 26 points (vitrine, réservation, alerte, gâteaux), demandes refusées
- **WHEN** les COPIL sont joués
- **THEN** l'appli sort à la fin du COPIL 4 avec 4 fonctionnalités, avant la coupure, et les premières ventes arrivent au COPIL 5

## ADDED Requirements

### Requirement: Découverte du travail sous-estimé
Le moteur SHALL révéler une découverte quand l'élément concerné reçoit son premier point de travail (ou quand la recette commence) : le coût de l'élément augmente du travail découvert, la découverte est journalisée pour la période, et la construction continue avec la capacité habituelle. Le moteur MUST NOT utiliser de hasard : la découverte arrive au même moment pour la même suite de décisions.

#### Scenario: Cahier des charges resserré
- **GIVEN** la manche 1 avec un cahier des charges de 39 points (vitrine, réservation, alerte, gâteaux, click & collect, fidélité)
- **WHEN** la partie est jouée jusqu'à la coupure
- **THEN** les découvertes portent le travail total à 61 points, au-delà des 60 points réalisables, et l'appli ne sort pas avant la coupure

#### Scenario: Découverte en manche 2
- **GIVEN** la manche 2 avec la réservation en tête après la vitrine
- **WHEN** l'équipe commence la réservation
- **THEN** son coût passe de 8 à 14 points, et la Sprint Review de la période annonce la découverte
