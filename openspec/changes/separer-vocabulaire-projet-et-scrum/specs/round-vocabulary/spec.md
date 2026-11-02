## Purpose

Le vocabulaire de chaque manche : la langue de la gestion de projet en manche 1, celle de Scrum en manche 2, la météo du projet et la bascule de vocabulaire entre les deux.

## ADDED Requirements

### Requirement: Lexique de la manche 1
Les textes de la manche 1 SHALL employer le vocabulaire de la gestion de projet : le joueur est chef de projet, Mme Lefèvre la commanditaire, les 2 semaines se terminent par un COPIL (« COPIL 2 sur 6 »), la liste est le cahier des charges, ses éléments sont des lots, le bilan est un compte rendu de COPIL, la fin propre est la recette et la mise en production, un changement passe par une demande de changement et un avenant.

#### Scenario: Tableau de la manche 1
- **GIVEN** la manche 1, avant le deuxième COPIL
- **WHEN** le tableau s'affiche
- **THEN** il titre « COPIL 2 sur 6 », son bouton dit « Avancer jusqu'au COPIL 2 » et sa liste s'intitule « Cahier des charges »

### Requirement: Lexique de la manche 2
Les textes de la manche 2 SHALL employer le vocabulaire du Scrum Guide 2020 : le joueur est Product Owner, Mme Lefèvre une partie prenante, les 2 semaines sont un Sprint, la liste est le Product Backlog, le bilan est la Sprint Review, la fin propre est la Definition of Done, et un changement devient un nouvel élément du Product Backlog.

#### Scenario: Capacité de la manche 2
- **GIVEN** la manche 2
- **WHEN** le tableau s'affiche
- **THEN** la capacité indique 10 points pour construire et 2 points pour respecter la Definition of Done

### Requirement: Pas de mélange
Les écrans, fenêtres et journal de la manche 1 MUST NOT employer « Sprint », « Product Backlog », « Sprint Review », « Definition of Done » ni « Product Owner ». Ceux de la manche 2 MUST NOT employer « COPIL », « cahier des charges », « chef de projet », « lot » ni « avenant ». L'accueil, la transition et les résultats MAY employer les deux vocabulaires pour les comparer.

#### Scenario: Manche 1 complète
- **GIVEN** une manche 1 jouée jusqu'à la fin du projet, demandes comprises
- **WHEN** on relit tous les textes affichés pendant la manche
- **THEN** aucun ne contient « Sprint » ni « Product Backlog »

### Requirement: Météo du projet
Chaque compte rendu de COPIL de la manche 1 SHALL donner une météo du projet : « Ensoleillé » tant que le reste à faire (lots, recette et avenants compris) tient dans la capacité restante jusqu'à la fin du projet, « Orageux » sinon, et « Livré » une fois l'appli sortie.

#### Scenario: Orage à l'annonce de la coupure
- **GIVEN** la manche 1 avec le plan de 61 points et la coupure budgétaire
- **WHEN** les COPIL 1, 2 et 3 ont lieu
- **THEN** la météo est « Ensoleillé » aux COPIL 1 et 2, puis « Orageux » au COPIL 3, qui annonce la coupure

#### Scenario: Soleil sans coupure
- **GIVEN** la manche 1 avec le plan de 61 points, sans coupure, demandes refusées
- **WHEN** les COPIL se succèdent
- **THEN** la météo reste « Ensoleillé » jusqu'à la sortie, puis passe à « Livré »

### Requirement: Bascule de vocabulaire
L'écran de transition entre les manches SHALL annoncer le changement de rôle et de vocabulaire : chef de projet → Product Owner, cahier des charges → Product Backlog, COPIL → Sprint Review, recette finale → Definition of Done à chaque Sprint.

#### Scenario: Transition
- **GIVEN** la fin de la manche 1
- **WHEN** l'écran de transition s'affiche
- **THEN** il dit que le joueur n'est plus chef de projet mais Product Owner, et liste les équivalences de vocabulaire

### Requirement: Vocabulaire des specs du moteur
Les specs du moteur (`scenario`, `sprint-simulation`) SHALL continuer d'appeler « Sprint » toute période de 2 semaines, dans les deux manches : c'est une convention interne, que l'interface traduit selon la manche.

#### Scenario: Lecture des specs
- **GIVEN** une exigence du moteur qui parle du « Sprint 3 » de la manche 1
- **WHEN** l'interface l'affiche
- **THEN** elle parle du COPIL 3, à la fin des semaines 5 et 6
