## MODIFIED Requirements

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

## ADDED Requirements

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
En manche 1, les décisions prises pendant la réflexion qui suit un COPIL (demande de changement, arbitrage) SHALL pouvoir être revues jusqu'au lancement de la période suivante : la révision remet le cahier des charges, la recette, le journal et la demande en attente dans l'état du COPIL. Après le lancement, plus rien n'est révisable.

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
