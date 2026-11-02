## MODIFIED Requirements

### Requirement: Accueil
L'accueil SHALL présenter l'histoire de Madame Lefèvre en quelques lignes, annoncer deux manches sur le même projet (d'abord en chef de projet, puis en Product Owner) avec une comparaison à la fin, proposer l'option « Coupure budgétaire en cours de projet » (activée par défaut) et un bouton pour commencer la manche 1. L'accueil MUST NOT dévoiler les valeurs réelles ni les imprévus.

#### Scenario: Partie sans coupure
- **GIVEN** l'accueil
- **WHEN** le joueur décoche la coupure budgétaire puis commence
- **THEN** les deux manches se jouent sur 12 semaines de développement : 6 COPIL en manche 1, 6 Sprints en manche 2

### Requirement: Plan de la manche 1
Avant le premier COPIL, l'écran du cahier des charges SHALL expliquer la règle (12 semaines, 6 COPIL, 12 points tous les 15 jours, dont 8 points de recette et de mise en production finales, cahier des charges contractuel une fois validé) et lister les lots avec leur rang, leur coût, l'intuition de la commanditaire et leur prérequis. Le joueur SHALL pouvoir retirer ou remettre un lot et changer son rang. Une jauge SHALL comparer les points planifiés aux 64 points, et un message SHALL dire ce qui bloque ou que le cahier des charges tient. La validation SHALL rester inactive tant qu'il est invalide.

#### Scenario: Dépassement
- **GIVEN** le cahier des charges initial de 66 points
- **WHEN** l'écran s'affiche
- **THEN** la jauge est rouge, le message indique un dépassement de 2 points et la validation est impossible

#### Scenario: Prérequis retiré
- **GIVEN** un cahier des charges qui contient le paiement en ligne
- **WHEN** le joueur retire la réservation de pain
- **THEN** le message indique que « Paiement en ligne » nécessite « Réservation de pain » et la validation est impossible

### Requirement: Tableau de Sprint
Pendant le développement, l'écran SHALL afficher la manche, la prochaine échéance (« COPIL N sur M » ou « Sprint N sur M ») et ses semaines, la capacité, l'indicateur de tête de la manche (avancement en manche 1, ventes cumulées en manche 2), les fonctionnalités en ligne, les clients potentiels, la liste ordonnée et le journal. Chaque élément SHALL afficher son avancement, l'intuition, la valeur réelle si elle est révélée et son état. En manche 1, la liste « Cahier des charges » SHALL être figée et finir par « Recette et mise en production ». En manche 2, chaque élément non terminé du Product Backlog SHALL pouvoir monter ou descendre d'un rang.

#### Scenario: Plan figé
- **GIVEN** la manche 1 en cours
- **WHEN** le tableau s'affiche
- **THEN** aucun lot ne peut changer de rang, et le texte rappelle que le cahier des charges est contractuel

#### Scenario: Échéance et semaines
- **GIVEN** la manche 1, avant le troisième COPIL
- **WHEN** le tableau s'affiche
- **THEN** il indique « COPIL 3 sur 6 · semaines 5 et 6 »

### Requirement: Fin de Sprint
Après chaque période, une fenêtre SHALL faire le bilan, puis un bouton SHALL mener à la période suivante ou à la fin du projet. En manche 1, c'est le compte rendu de COPIL : avancement du cahier des charges, météo du projet ou annonce de la sortie, ventes, absence de retour client avant la sortie. En manche 2, c'est la Sprint Review : fonctionnalités mises en ligne, ventes et au plus trois nouveaux retours clients. Les imprévus et la demande de changement de la période SHALL y être annoncés, dans le vocabulaire de la manche.

#### Scenario: Aucun retour avant la sortie
- **GIVEN** la manche 1, appli pas encore sortie
- **WHEN** le compte rendu de COPIL s'affiche
- **THEN** il indique qu'il n'y a aucun retour client, car l'appli n'est pas encore sortie

#### Scenario: Premiers retours dès le Sprint 1
- **GIVEN** la manche 2, quel que soit l'ordre du Product Backlog
- **WHEN** le Sprint 1 est joué
- **THEN** la vitrine, seule fonctionnalité sans prérequis, est en ligne et la Sprint Review affiche déjà des retours clients

#### Scenario: Demande annoncée en manche 2
- **GIVEN** la manche 2
- **WHEN** la Sprint Review du Sprint 1 s'affiche
- **THEN** elle cite la demande de Mme Lefèvre et indique que la version anglaise est ajoutée en bas du Product Backlog

### Requirement: Fin du développement et enchaînement
À la fin du développement, une fenêtre SHALL annoncer la fin du projet, dire ce qui est en ligne (ou, en manche 1 sans sortie, que l'appli n'est jamais sortie), expliquer que les semaines suivantes sont de l'exploitation sans développement, jusqu'à 20 semaines après le lancement, et donner les ventes cumulées. Elle MUST NOT parler de Sprints ni de COPIL pour la période d'exploitation. Après la manche 1, l'écran de transition SHALL présenter la manche 2 ; après la manche 2, le jeu SHALL afficher les résultats. « Rejouer » SHALL ramener à l'accueil.

#### Scenario: Enchaînement des manches
- **GIVEN** la fin du développement de la manche 1
- **WHEN** le joueur continue
- **THEN** l'écran de transition s'affiche, puis le tableau du Sprint 1 avec le Product Backlog dans l'ordre initial

#### Scenario: Fin de projet après une coupure
- **GIVEN** la manche 1 avec la coupure budgétaire
- **WHEN** la fenêtre de fin du projet s'affiche
- **THEN** elle dit que le projet s'arrête au COPIL 5, annonce 10 semaines d'exploitation sans développement, et ne parle d'aucun Sprint

### Requirement: Fenêtre de demande de changement (manche 1)
En manche 1, quand un COPIL annonce une demande de la commanditaire, le compte rendu SHALL ensuite présenter la demande : texte de Mme Lefèvre, coût, intuition et avenant de 2 points. La fenêtre SHALL lister les lots retirables avec des cases à cocher, une jauge du cahier des charges par rapport au nouveau budget et un message sur ce qui bloque. « Accepter (avenant) » SHALL rester inactif tant que le résultat est invalide ; « Refuser » SHALL toujours être possible. Fermer la fenêtre MUST NOT trancher la demande à la place du joueur.

#### Scenario: Faire de la place
- **GIVEN** la demande « Version anglaise » avec le cahier des charges de 61 points
- **WHEN** le joueur coche la livraison à domicile (14 points, pas commencée)
- **THEN** la jauge passe à 52 points sur 62 et « Accepter (avenant) » devient actif

#### Scenario: Touche Échap
- **GIVEN** la fenêtre d'une demande de changement
- **WHEN** le joueur appuie sur Échap
- **THEN** la fenêtre reste ouverte et la demande n'est ni acceptée ni refusée

### Requirement: Demandes visibles dans les listes
Une fonctionnalité issue d'une demande SHALL être signalée comme « Demande de la commanditaire » dans le cahier des charges et comme « Demande de Mme Lefèvre » dans le Product Backlog. Le journal SHALL garder chaque demande et la décision prise : acceptée par avenant avec les lots retirés, refusée, ou ajoutée au Product Backlog.

#### Scenario: Journal de la manche 1
- **GIVEN** une demande refusée au COPIL 1
- **WHEN** le joueur lit les comptes rendus de COPIL
- **THEN** il y trouve la demande de la version anglaise et son refus
