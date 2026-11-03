# round-vocabulary Specification

## Purpose
Le vocabulaire de chaque manche : la langue de la gestion de projet en manche 1, celle de Scrum en manche 2, la météo du projet et la bascule de vocabulaire entre les deux.

## Requirements

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

### Requirement: Lexique de la manche 2
Les textes de la manche 2 SHALL employer le vocabulaire du Scrum Guide 2020 : le joueur est Product Owner, Mme Lefèvre une partie prenante, les 2 semaines sont un Sprint, la liste est le Product Backlog, le bilan est la Sprint Review, la fin propre est la Definition of Done, et un changement devient un nouvel élément du Product Backlog.

#### Scenario: Capacité de la manche 2
- **GIVEN** la manche 2
- **WHEN** le tableau s'affiche
- **THEN** la capacité indique 10 points pour construire et 2 points pour respecter la Definition of Done

### Requirement: Pas de mélange
Les écrans, fenêtres et journal de la manche 1 MUST NOT employer « Sprint », « Product Backlog », « Sprint Review », « Definition of Done » ni « Product Owner ». La manche 1 MUST NOT non plus compter en « points ». Ceux de la manche 2 MUST NOT employer « COPIL », « cahier des charges », « chef de projet », « lot », « avenant » ni « jours/homme ». L'accueil, la transition et les résultats MAY employer les deux vocabulaires pour les comparer.

#### Scenario: Manche 1 complète
- **GIVEN** une manche 1 jouée jusqu'à la fin du projet, demandes comprises
- **WHEN** on relit tous les textes affichés pendant la manche
- **THEN** aucun ne contient « Sprint » ni « Product Backlog »

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

### Requirement: Météo du projet sans préavis
Chaque compte rendu de COPIL de la manche 1 SHALL donner une météo du projet : « Ensoleillé » tant que le reste à faire (lots, recette, avenants et travail découvert compris) tient dans la capacité restante jusqu'à la fin prévue du projet, « Orageux » sinon, et « Livré » une fois l'appli sortie. Comme la coupure n'est jamais annoncée, la météo MUST NOT en tenir compte avant qu'elle tombe.

#### Scenario: Soleil jusqu'à la coupure
- **GIVEN** la manche 1 avec le cahier des charges resserré de 39 points, demandes refusées
- **WHEN** les COPIL 1 à 5 ont lieu
- **THEN** la météo est « Ensoleillé » aux COPIL 1 à 4, puis « Orageux » au COPIL 5, quand la recette révèle ses anomalies et que la coupure tombe

#### Scenario: Livré avant la coupure
- **GIVEN** la manche 1 avec un tout petit cahier des charges de 26 points (vitrine, réservation, alerte, gâteaux), demandes refusées
- **WHEN** les COPIL 1 à 5 ont lieu
- **THEN** la météo est « Ensoleillé » aux COPIL 1 à 3, puis « Livré » aux COPIL 4 et 5

#### Scenario: Cahier des charges sans marge
- **GIVEN** la manche 1 avec le cahier des charges de 61 points, demandes refusées
- **WHEN** le travail découvert sur la vitrine et la réservation est annoncé au COPIL 1
- **THEN** la météo passe à « Orageux » dès le COPIL 1
