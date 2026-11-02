## ADDED Requirements

### Requirement: Ordre journalisé
À chaque période jouée, le moteur SHALL retenir dans le journal l'ordre de la liste au début de la période, pour que l'interface puisse dire ce qui a changé d'une période à l'autre. Cet ajout MUST NOT changer les résultats.

#### Scenario: Réordonnancement retrouvé
- **GIVEN** un Product Backlog où l'alerte « fournée chaude » passe du rang 5 au rang 2 entre le Sprint 1 et le Sprint 2
- **WHEN** le fil des décisions est calculé
- **THEN** il indique que l'alerte a été remontée de 5 à 2 avant le Sprint 2
