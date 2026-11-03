## MODIFIED Requirements

### Requirement: Coulisses du formateur
L'écran du formateur SHALL proposer un panneau « Coulisses (à ne pas projeter) », fermé par défaut, qui donne pour chaque équipe, dans son vocabulaire, le fil de ses décisions période par période : pour une équipe « projet », le cahier des charges validé et les lots écartés, chaque demande de la boulangère et sa décision (acceptée par avenant avec les lots retirés, refusée, refusée faute de décision), l'avancement et la météo, la sortie de l'appli ; pour une équipe « Scrum », les éléments du Product Backlog qui ont bougé avant chaque Sprint, les fonctionnalités mises en ligne et les demandes ajoutées. Les coulisses MUST NOT afficher de ventes. Le panneau SHALL se refermer au lancement d'une période et à la révélation.

#### Scenario: Décision visible en coulisses
- **GIVEN** l'équipe Croissant a accepté les promotions flash en retirant « Livraison à domicile »
- **WHEN** le formateur ouvre les coulisses
- **THEN** il lit, sous Croissant, « COPIL 2 : promotions flash acceptées par avenant, en retirant Livraison à domicile »

#### Scenario: Fermeture au lancement
- **GIVEN** les coulisses ouvertes
- **WHEN** le formateur lance la période suivante
- **THEN** le panneau se referme et l'écran redevient neutre
