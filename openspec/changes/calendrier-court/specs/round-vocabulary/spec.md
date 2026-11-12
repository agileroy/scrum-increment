## MODIFIED Requirements

### Requirement: Lexique de la manche 1
Les textes de la manche 1 SHALL employer le vocabulaire de la gestion de projet : le joueur est chef de projet, Mme Lefèvre la boulangère (le mot « commanditaire » MUST NOT apparaître), la charge se compte en jours/homme (jamais en points), chaque semaine se termine par un COPIL (« COPIL 2 sur 6 »), la liste est le cahier des charges, ses éléments sont des lots, le bilan est un compte rendu de COPIL, la fin propre est la recette et la mise en production, un changement passe par une demande de changement et un avenant. Avant la sortie de l'appli, le journal de la manche 1 SHALL rendre compte de l'avancement et de la météo sans mentionner de ventes.

#### Scenario: Tableau de la manche 1
- **GIVEN** la manche 1, avant le deuxième COPIL
- **WHEN** le tableau s'affiche
- **THEN** il titre « COPIL 2 sur 6 », son bouton dit « Avancer jusqu'au COPIL 2 » et sa liste s'intitule « Cahier des charges »

#### Scenario: Journal sans ventes
- **GIVEN** la manche 1 après le COPIL 3, appli pas encore sortie
- **WHEN** le journal s'affiche
- **THEN** sa ligne indique « COPIL 3 : avancement 51 %, météo ensoleillé. », sans ventes

### Requirement: Lexique de la manche 2
Les textes de la manche 2 SHALL employer le vocabulaire du Scrum Guide 2020 : le joueur est Product Owner, Mme Lefèvre une partie prenante, la semaine est un Sprint, la liste est le Product Backlog, le bilan est la Sprint Review, la fin propre est la Definition of Done, et un changement devient un nouvel élément du Product Backlog.

#### Scenario: Capacité de la manche 2
- **GIVEN** la manche 2
- **WHEN** le tableau s'affiche
- **THEN** la capacité indique 10 points pour construire et 2 points pour respecter la Definition of Done

### Requirement: Vocabulaire des specs du moteur
Les specs du moteur (`scenario`, `sprint-simulation`) SHALL continuer d'appeler « Sprint » toute période d'une semaine, dans les deux manches : c'est une convention interne, que l'interface traduit selon la manche.

#### Scenario: Lecture des specs
- **GIVEN** une exigence du moteur qui parle du « Sprint 3 » de la manche 1
- **WHEN** l'interface l'affiche
- **THEN** elle parle du COPIL 3, à la fin de la semaine 3
