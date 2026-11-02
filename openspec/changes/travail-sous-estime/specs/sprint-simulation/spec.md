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
