## MODIFIED Requirements

### Requirement: Fin du développement et enchaînement
À la fin du développement, une fenêtre SHALL annoncer la fin du projet, dire ce qui est en ligne (ou, en manche 1 sans sortie, que l'appli n'est jamais sortie), expliquer que les semaines suivantes sont de l'exploitation sans développement, jusqu'à 20 semaines après le lancement, et donner les ventes cumulées. Elle MUST NOT parler de Sprints ni de COPIL pour la période d'exploitation. Après la manche 1, l'écran de transition SHALL présenter la manche 2 ; après la manche 2, le jeu SHALL afficher les résultats. « Rejouer » SHALL ramener à l'accueil.

#### Scenario: Enchaînement des manches
- **GIVEN** la fin du développement de la manche 1
- **WHEN** le joueur continue
- **THEN** l'écran de transition s'affiche, puis le tableau du Sprint 1 avec le Product Backlog dans l'ordre initial

#### Scenario: Fin de projet après une coupure
- **GIVEN** la manche 1, au COPIL 5
- **WHEN** la fenêtre de fin du projet s'affiche, juste après le compte rendu qui annonce la coupure
- **THEN** elle dit que le projet s'arrête au COPIL 5, en l'état, annonce 10 semaines d'exploitation sans développement, et ne parle d'aucun Sprint

## REMOVED Requirements

### Requirement: Accueil
**Reason**: L'option « Coupure budgétaire en cours de projet » disparaît : la coupure doit rester une surprise.
**Migration**: Remplacée par « Accueil sans option ».

## ADDED Requirements

### Requirement: Accueil sans option
L'accueil SHALL présenter l'histoire de Madame Lefèvre en quelques lignes, annoncer deux manches sur le même projet (d'abord en chef de projet, puis en Product Owner) avec une comparaison à la fin, et proposer un bouton pour commencer la manche 1. L'accueil MUST NOT proposer d'option de coupure, ni dévoiler les valeurs réelles ou les imprévus.

#### Scenario: Rien à régler
- **GIVEN** l'accueil
- **WHEN** il s'affiche
- **THEN** il ne contient ni case à cocher, ni mot sur la banque ou une coupure, et le bouton lance directement le cahier des charges de la manche 1
