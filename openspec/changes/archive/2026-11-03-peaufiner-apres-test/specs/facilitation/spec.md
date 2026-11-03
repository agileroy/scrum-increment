## MODIFIED Requirements

### Requirement: Coulisses du formateur
L'écran du formateur SHALL proposer un panneau « Coulisses (à ne pas projeter) », fermé par défaut, qui donne pour chaque équipe, dans son vocabulaire, le fil de ses décisions période par période : pour une équipe « projet », le cahier des charges validé et les lots écartés, chaque demande de la boulangère et sa décision (acceptée par avenant avec les lots retirés, refusée, refusée faute de décision), chaque arbitrage du COPIL et les lots retirés, l'avancement et la météo, la sortie de l'appli ; pour une équipe « Scrum », les éléments du Product Backlog qui ont bougé avant chaque Sprint, les fonctionnalités mises en ligne et les demandes ajoutées. Les coulisses MUST NOT afficher de ventes. Le panneau SHALL se refermer au lancement d'une période et à la révélation.

#### Scenario: Décision visible en coulisses
- **GIVEN** l'équipe Croissant a accepté les promotions flash en retirant « Livraison à domicile »
- **WHEN** le formateur ouvre les coulisses
- **THEN** il lit, sous Croissant, « COPIL 2 : promotions flash acceptées par avenant, en retirant Livraison à domicile »

#### Scenario: Fermeture au lancement
- **GIVEN** les coulisses ouvertes
- **WHEN** le formateur lance la période suivante
- **THEN** le panneau se referme et l'écran redevient neutre

## ADDED Requirements

### Requirement: Débrief piloté par le formateur
Après la révélation, seul le formateur SHALL piloter le débrief (question précédente ou suivante, révéler ou masquer les indicateurs). Les écrans des participants SHALL suivre la même question et la même révélation, sans commande, avec la mention « Les indicateurs apparaîtront après votre discussion. » tant qu'ils sont cachés. L'étape et la révélation SHALL être partagées par la salle (règles de sécurité : étape de 0 à 20, révélation booléenne, écrites par le formateur seul).

#### Scenario: Révélation synchronisée
- **GIVEN** une partie révélée, le formateur et un participant sur la question 1
- **WHEN** le formateur révèle les indicateurs
- **THEN** la courbe apparaît aussi chez le participant, qui n'a aucun bouton de débrief
