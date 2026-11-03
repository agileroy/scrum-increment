## ADDED Requirements

### Requirement: Annonce du travail sous-estimé
Le compte rendu de COPIL ou la Sprint Review de la période SHALL annoncer chaque découverte de travail sous-estimé dans le vocabulaire de la manche, et l'élément concerné SHALL afficher son coût sous la forme « coût prévu + travail découvert » (par exemple « 8 + 6 pts »).

#### Scenario: Découverte annoncée au COPIL
- **GIVEN** la manche 1, la réservation commencée pendant la période 2
- **WHEN** le compte rendu du COPIL 2 s'affiche
- **THEN** il annonce que la réservation doit être reliée au logiciel de caisse (+6 points), et le lot affiche « 8 + 6 pts »
