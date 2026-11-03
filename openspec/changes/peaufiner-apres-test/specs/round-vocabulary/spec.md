## MODIFIED Requirements

### Requirement: Lexique de la manche 1
Les textes de la manche 1 SHALL employer le vocabulaire de la gestion de projet : le joueur est chef de projet, Mme Lefèvre la boulangère (le mot « commanditaire » MUST NOT apparaître), les 2 semaines se terminent par un COPIL (« COPIL 2 sur 6 »), la liste est le cahier des charges, ses éléments sont des lots, le bilan est un compte rendu de COPIL, la fin propre est la recette et la mise en production, un changement passe par une demande de changement et un avenant. Avant la sortie de l'appli, le journal de la manche 1 SHALL rendre compte de l'avancement et de la météo sans mentionner de ventes.

#### Scenario: Tableau de la manche 1
- **GIVEN** la manche 1, avant le deuxième COPIL
- **WHEN** le tableau s'affiche
- **THEN** il titre « COPIL 2 sur 6 », son bouton dit « Avancer jusqu'au COPIL 2 » et sa liste s'intitule « Cahier des charges »

#### Scenario: Journal sans ventes
- **GIVEN** la manche 1 après le COPIL 3, appli pas encore sortie
- **WHEN** le journal s'affiche
- **THEN** sa ligne indique « COPIL 3 : avancement 51 %, météo ensoleillé. », sans ventes
