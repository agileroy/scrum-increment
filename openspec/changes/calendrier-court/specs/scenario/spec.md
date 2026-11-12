## MODIFIED Requirements

### Requirement: Calendrier
Une période de développement SHALL durer une semaine : un Sprint en manche 2, l'intervalle entre deux COPIL en manche 1. Le budget prévoit 6 périodes de développement, mais la coupure budgétaire arrête toujours le développement après la cinquième. La partie SHALL couvrir 10 semaines à partir du lancement du projet, soit 10 périodes d'une semaine : les périodes de développement, puis des semaines d'exploitation sans développement. Les textes d'imprévus SHALL exister dans le vocabulaire de chaque manche.

#### Scenario: Coupure budgétaire
- **GIVEN** une partie
- **WHEN** le développement s'arrête après la cinquième période
- **THEN** la partie continue 5 semaines d'exploitation, jusqu'à 10 semaines après le lancement

#### Scenario: Annonce de la coupure en manche 1
- **GIVEN** la manche 1
- **WHEN** la coupure tombe, au COPIL 5
- **THEN** le texte dit que la banque coupe le prêt sans préavis et que le projet s'arrête maintenant, en l'état, sans parler de Sprint

### Requirement: Concurrent
Le scénario SHALL contenir l'imprévu du concurrent, identique dans les deux manches : à la fin de la deuxième période, « La Mie Dorée » lance sa commande en ligne ; à partir de la troisième période, tant qu'aucune fonctionnalité n'est en ligne, la boulangerie perd des clients potentiels chaque semaine.

#### Scenario: Annonce du concurrent
- **GIVEN** une partie
- **WHEN** la deuxième période se termine
- **THEN** le bilan (COPIL 2 ou Sprint Review du Sprint 2) annonce que La Mie Dorée lance sa commande en ligne
