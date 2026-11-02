## MODIFIED Requirements

### Requirement: Calendrier
Une période de développement SHALL durer 2 semaines : un Sprint en manche 2, l'intervalle entre deux COPIL en manche 1. La partie SHALL couvrir 20 semaines à partir du lancement du projet, soit 10 périodes de 2 semaines : les périodes de développement, puis des semaines d'exploitation sans développement. Les textes d'imprévus SHALL exister dans le vocabulaire de chaque manche.

#### Scenario: Coupure budgétaire
- **GIVEN** une partie avec la coupure budgétaire
- **WHEN** le développement s'arrête après la cinquième période
- **THEN** la partie continue 10 semaines d'exploitation, jusqu'à 20 semaines après le lancement

#### Scenario: Annonce de la coupure en manche 1
- **GIVEN** la manche 1 avec la coupure budgétaire
- **WHEN** la coupure est annoncée
- **THEN** le texte dit que le projet s'arrêtera au COPIL 5, sans parler de Sprint
