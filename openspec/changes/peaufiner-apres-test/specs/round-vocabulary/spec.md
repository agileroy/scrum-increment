## MODIFIED Requirements

### Requirement: Lexique de la manche 1
Les textes de la manche 1 SHALL employer le vocabulaire de la gestion de projet : le joueur est chef de projet, Mme Lefèvre la boulangère (le mot « commanditaire » MUST NOT apparaître), la charge se compte en jours/homme (jamais en points), les 2 semaines se terminent par un COPIL (« COPIL 2 sur 6 »), la liste est le cahier des charges, ses éléments sont des lots, le bilan est un compte rendu de COPIL, la fin propre est la recette et la mise en production, un changement passe par une demande de changement et un avenant. Avant la sortie de l'appli, le journal de la manche 1 SHALL rendre compte de l'avancement et de la météo sans mentionner de ventes.

#### Scenario: Tableau de la manche 1
- **GIVEN** la manche 1, avant le deuxième COPIL
- **WHEN** le tableau s'affiche
- **THEN** il titre « COPIL 2 sur 6 », son bouton dit « Avancer jusqu'au COPIL 2 » et sa liste s'intitule « Cahier des charges »

#### Scenario: Journal sans ventes
- **GIVEN** la manche 1 après le COPIL 3, appli pas encore sortie
- **WHEN** le journal s'affiche
- **THEN** sa ligne indique « COPIL 3 : avancement 51 %, météo ensoleillé. », sans ventes

### Requirement: Pas de mélange
Les écrans, fenêtres et journal de la manche 1 MUST NOT employer « Sprint », « Product Backlog », « Sprint Review », « Definition of Done » ni « Product Owner ». La manche 1 MUST NOT non plus compter en « points ». Ceux de la manche 2 MUST NOT employer « COPIL », « cahier des charges », « chef de projet », « lot », « avenant » ni « jours/homme ». L'accueil, la transition et les résultats MAY employer les deux vocabulaires pour les comparer.

#### Scenario: Manche 1 complète
- **GIVEN** une manche 1 jouée jusqu'à la fin du projet, demandes comprises
- **WHEN** on relit tous les textes affichés pendant la manche
- **THEN** aucun ne contient « Sprint » ni « Product Backlog »
