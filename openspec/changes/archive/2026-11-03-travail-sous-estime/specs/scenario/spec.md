## ADDED Requirements

### Requirement: Travail sous-estimé
Le scénario SHALL prévoir trois découvertes de travail sous-estimé, fixes : « Vitrine en ligne » coûte 4 points de plus que prévu, « Réservation de pain » 6 points de plus, et en manche 1 seulement, la recette et la mise en production finales 4 points de plus (anomalies découvertes à l'intégration). Chaque découverte SHALL avoir un texte dans le vocabulaire de chaque manche concernée.

#### Scenario: Mêmes découvertes pour les deux approches
- **GIVEN** le scénario
- **WHEN** on liste les découvertes
- **THEN** la vitrine et la réservation sont concernées dans les deux manches, et la recette seulement en manche 1
