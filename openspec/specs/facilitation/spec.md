# facilitation Specification

## Purpose
L'écran du formateur pendant une partie collective : tempo, chrono, lancement des périodes pour toutes les équipes, suivi neutre des équipes et révélation des résultats.

## Requirements

### Requirement: Lancement de la partie
Dans la salle d'attente, « Lancer la partie » SHALL être actif dès que chaque équipe compte au moins un participant. Le lancement SHALL créer le jeu de chaque équipe selon son approche et ouvrir la réflexion de la première période.

#### Scenario: Équipe vide
- **GIVEN** une salle à 3 équipes, sans personne dans Brioche
- **WHEN** le formateur regarde la salle d'attente
- **THEN** « Lancer la partie » est inactif, et un message invite à réduire le nombre d'équipes ou à attendre

### Requirement: Suivi neutre des équipes
Pendant la partie, l'écran du formateur SHALL afficher la période en cours (« Période 3 sur 6 · semaines 5 et 6 »), le chrono s'il y en a un, et pour chaque équipe son nom, ses membres connectés et son état : « Prête » ou « En réflexion ». Il SHALL aussi afficher un fil neutre des derniers événements de la salle (périodes lancées, équipes prêtes ou plus prêtes). Hors du panneau Coulisses, il MUST NOT afficher l'approche, les ventes, l'avancement, les cahiers des charges ou les Product Backlogs des équipes, ni de mot propre à une approche (COPIL, Sprint, cahier des charges, Product Backlog).

#### Scenario: Écran projeté
- **GIVEN** une partie à la période 2, coulisses fermées
- **WHEN** les participants regardent l'écran projeté
- **THEN** ils voient « Période 2 sur 6 », les équipes, leur état et le fil neutre, et rien qui distingue l'approche d'une équipe

### Requirement: Lancement d'une période
Le formateur SHALL lancer chaque période pour toutes les équipes en même temps avec « Lancer la période N ». À la première période, le bouton SHALL rester inactif tant qu'un cahier des charges n'est pas validé, et l'écran SHALL nommer les équipes qui préparent encore (sans dire pourquoi). Si des équipes ne sont pas prêtes, le formateur SHALL confirmer le lancement. Au lancement, une demande de changement non tranchée SHALL être refusée d'office.

#### Scenario: Lancer sans tout le monde
- **GIVEN** la période 3, l'équipe Croissant prête et l'équipe Baguette en réflexion
- **WHEN** le formateur lance la période 3
- **THEN** une confirmation nomme l'équipe Baguette, et après confirmation, la période 3 est jouée pour les deux équipes

### Requirement: Chrono de réflexion
Avec un chrono réglé, chaque période de réflexion SHALL afficher un compte à rebours sur l'écran du formateur et sur tous les écrans. À zéro, les écrans SHALL afficher « Temps écoulé » ; la période ne se lance pas toute seule.

#### Scenario: Temps écoulé
- **GIVEN** un chrono de 1 minute
- **WHEN** la minute est passée
- **THEN** tous les écrans affichent « Temps écoulé » et attendent le formateur

### Requirement: Coupure et révélation
La coupure budgétaire SHALL tomber pour toutes les équipes à la fin de la période 5, comme en solo, sans aucune annonce avant. L'écran du formateur SHALL alors afficher « Fin du projet » et « Révéler les résultats ». La révélation SHALL afficher les résultats collectifs sur l'écran du formateur et sur tous les écrans.

#### Scenario: Révéler
- **GIVEN** la période 5 lancée
- **WHEN** le formateur clique sur « Révéler les résultats »
- **THEN** l'écran projeté et les écrans affichent les résultats de toutes les équipes

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

### Requirement: Débrief piloté par le formateur
Après la révélation, seul le formateur SHALL piloter le débrief (question précédente ou suivante, révéler ou masquer les indicateurs). Les écrans des participants SHALL suivre la même question et la même révélation, sans commande, avec la mention « Les indicateurs apparaîtront après votre discussion. » tant qu'ils sont cachés. L'étape et la révélation SHALL être partagées par la salle (règles de sécurité : étape de 0 à 20, révélation booléenne, écrites par le formateur seul).

#### Scenario: Révélation synchronisée
- **GIVEN** une partie révélée, le formateur et un participant sur la question 1
- **WHEN** le formateur révèle les indicateurs
- **THEN** la courbe apparaît aussi chez le participant, qui n'a aucun bouton de débrief
