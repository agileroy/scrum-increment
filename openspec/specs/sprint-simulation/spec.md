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
  - manche 2, Product Backlog dans l'ordre initial, jamais réordonné : 13 200 € ;
  - manche 2, ordre vitrine, réservation, alerte, gâteaux, click & collect, fidélité, paiement, livraison, avis : 22 800 €

### Requirement: Demande de changement en manche 1
Dans la manche 1, la demande annoncée à la Sprint Review SHALL être tranchée avant le Sprint suivant. Refuser SHALL laisser le plan inchangé. Accepter SHALL ajouter la fonctionnalité à la fin du plan, ajouter 2 points d'avenant à la recette et retirer du plan les fonctionnalités choisies par le joueur. L'acceptation MUST NOT être possible si le plan obtenu dépasse le budget ou viole un prérequis.

#### Scenario: Accepter en retirant
- **GIVEN** le plan de 61 points, au moment de la demande « Plateaux pour les entreprises » (6 points), avec les gâteaux sur mesure pas encore commencés
- **WHEN** le joueur accepte en retirant les gâteaux sur mesure
- **THEN** le plan fait 58 points pour un budget de 62, la recette passe à 10 points, et les plateaux sont la dernière fonctionnalité du plan

#### Scenario: Accepter sans faire de place
- **GIVEN** le plan de 61 points, au moment de la demande « Version anglaise » (5 points)
- **WHEN** le joueur veut accepter sans rien retirer
- **THEN** l'acceptation est refusée, car le plan ferait 66 points pour un budget de 62

### Requirement: Retraits possibles
Seules les fonctionnalités du plan qui n'ont reçu aucun point SHALL pouvoir être retirées lors d'une acceptation. Une fonctionnalité commencée ou terminée MUST NOT être retirée.

#### Scenario: Fonctionnalité commencée
- **GIVEN** la carte de fidélité commencée
- **WHEN** le joueur examine une demande de changement
- **THEN** la carte de fidélité ne peut pas être retirée

### Requirement: Demande de changement en manche 2
Dans la manche 2, la demande annoncée à la Sprint Review SHALL s'ajouter en bas du Product Backlog, sans avenant ni décision à prendre. Elle se déplace, se construit et révèle sa valeur réelle comme les autres fonctionnalités.

#### Scenario: Demande dans le Product Backlog
- **GIVEN** la manche 2 après la Sprint Review du Sprint 1
- **WHEN** le joueur prépare le Sprint 2
- **THEN** la version anglaise est en dernière position du Product Backlog et peut être remontée

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

### Requirement: Découverte du travail sous-estimé
Le moteur SHALL révéler une découverte quand l'élément concerné reçoit des points de travail (ou quand la recette commence), à partir de la deuxième période : le coût de l'élément augmente du travail découvert, la découverte est journalisée pour la période, et la construction continue avec la capacité habituelle. Un élément commencé pendant la première période SHALL révéler sa découverte la première fois qu'il reçoit des points dans une période suivante. La première période (premier COPIL, premier Sprint) MUST NOT annoncer de découverte. Le moteur MUST NOT utiliser de hasard : la découverte arrive au même moment pour la même suite de décisions.

#### Scenario: Cahier des charges resserré
- **GIVEN** la manche 1 avec un cahier des charges de 39 points (vitrine, réservation, alerte, gâteaux, click & collect, fidélité)
- **WHEN** la partie est jouée jusqu'à la coupure
- **THEN** les découvertes (click & collect au COPIL 2, gâteaux au COPIL 3, recette au COPIL 5) portent le travail total à 61 points, au-delà des 60 points réalisables, et l'appli ne sort pas avant la coupure

#### Scenario: Découverte en manche 2
- **GIVEN** la manche 2 dans l'ordre initial
- **WHEN** l'équipe commence le paiement en ligne au Sprint 2
- **THEN** son coût passe de 8 à 14 points, et la Sprint Review du Sprint 2 annonce la découverte

#### Scenario: Premier COPIL sans surprise
- **GIVEN** la manche 1, un cahier des charges qui place les gâteaux juste après la vitrine
- **WHEN** le premier COPIL a lieu
- **THEN** aucune découverte n'est annoncée et la météo est ensoleillée ; les 6 points des gâteaux sont découverts au COPIL 2

### Requirement: Ordre journalisé
À chaque période jouée, le moteur SHALL retenir dans le journal l'ordre de la liste au début de la période, pour que l'interface puisse dire ce qui a changé d'une période à l'autre. Cet ajout MUST NOT changer les résultats.

#### Scenario: Réordonnancement retrouvé
- **GIVEN** un Product Backlog où l'alerte « fournée chaude » passe du rang 5 au rang 2 entre le Sprint 1 et le Sprint 2
- **WHEN** le fil des décisions est calculé
- **THEN** il indique que l'alerte a été remontée de 5 à 2 avant le Sprint 2

### Requirement: Arbitrage du périmètre (manche 1)
En manche 1, entre deux COPIL, quand le reste à faire dépasse la capacité restante jusqu'à la fin prévue (météo orageuse) et qu'aucune demande n'attend, le moteur SHALL permettre de retirer du cahier des charges des lots qui n'ont reçu aucun point. Le retrait MUST NOT être possible pour un lot commencé, ni s'il laisse un lot sans son prérequis, ni quand le projet est ensoleillé. Le moteur SHALL donner, pour un retrait envisagé, le reste à faire, la capacité restante et la météo qui en résulteraient, et journaliser l'arbitrage. À chaque COPIL orageux, l'arbitrage SHALL être obligatoire : retirer des lots, ou maintenir le périmètre (journalisé « périmètre maintenu malgré l'orage »). Un arbitrage non fait au lancement de la période suivante SHALL valoir maintien d'office (« faute de décision »).

#### Scenario: Arbitrer pour sortir
- **GIVEN** le cahier des charges de 61 points, orageux au COPIL 2
- **WHEN** le COPIL retire la livraison, la fidélité et le click & collect
- **THEN** le projet repasse au soleil, l'appli sort au COPIL 5 et les ventes cumulées valent 9 842 €

#### Scenario: Pas d'arbitrage au soleil
- **GIVEN** un projet ensoleillé
- **WHEN** le joueur cherche à retirer un lot
- **THEN** l'arbitrage n'est pas proposé

### Requirement: Décisions du COPIL révisables
En manche 1, les décisions prises pendant la réflexion qui suit un COPIL (demande de changement, arbitrage) SHALL pouvoir être revues jusqu'au lancement de la période suivante : la révision remet le cahier des charges, la recette, le journal et la demande en attente dans l'état du COPIL. Avant le premier COPIL, la révision rouvre le cahier des charges validé. Après le lancement, plus rien n'est révisable.

#### Scenario: Revoir une demande acceptée
- **GIVEN** la demande « Promotions flash » acceptée au COPIL 2 en retirant la livraison
- **WHEN** l'équipe revoit les décisions de ce COPIL
- **THEN** la livraison revient au cahier des charges et la demande attend de nouveau une décision

### Requirement: Prévision de la demande
Pour une demande de changement en manche 1, le moteur SHALL donner, en plus du budget du contrat (en estimations), le reste à faire réel (travail découvert compris) face au temps restant, et la météo qui en résulterait si la demande est acceptée telle quelle ou refusée.

#### Scenario: Le contrat tient, le projet non
- **GIVEN** un cahier des charges de 52 points (tout sauf la livraison), le paiement découvert au COPIL 2
- **WHEN** la demande « Promotions flash » est examinée
- **THEN** elle tient dans le budget du contrat, mais l'accepter rendrait le projet orageux

### Requirement: Ordre de la manche 2 et éléments terminés
En manche 2, le moteur SHALL placer les éléments terminés en tête de l'ordre, dans l'ordre où ils ont été terminés, à la fin de chaque Sprint, et MUST NOT accepter de déplacement qui place un élément au-dessus d'eux. Le fil des décisions MUST NOT compter cette remontée comme un déplacement décidé par l'équipe. Les résultats SHALL donner la période de mise en ligne de chaque fonctionnalité.

#### Scenario: Remontée automatique
- **GIVEN** l'ordre vitrine, paiement, alerte, réservation
- **WHEN** le Sprint 1 termine la vitrine et l'alerte, le paiement étant sauté faute de réservation
- **THEN** l'ordre commence par vitrine, alerte, paiement
