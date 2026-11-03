## ADDED Requirements

### Requirement: Contexte de la mission
Dès l'attente de la salle, l'écran d'un participant SHALL raconter le contexte et la démarche de son équipe : Mme Lefèvre tient la boulangerie du quartier, veut une appli pour que ses clients commandent en ligne et en confie la réalisation à l'équipe ; « Vous optez pour une démarche projet » (cahier des charges signé avant de commencer, COPIL toutes les deux semaines) pour une équipe projet, « Vous optez pour Scrum » (Product Owner, un Increment utilisable à chaque Sprint, une Sprint Review pour montrer ce qui marche) pour une équipe Scrum ; puis la réplique « Ma seule question : quand est-ce que ça me rapporte ? ». Le premier écran de l'équipe SHALL reprendre ce contexte au lancement.

#### Scenario: Attente d'une équipe projet
- **GIVEN** un participant de Croissant dans une salle pas encore lancée
- **WHEN** son écran d'attente s'affiche
- **THEN** il lit le contexte suivi de « Vous optez pour une démarche projet : un cahier des charges complet, signé avant de commencer, et un COPIL toutes les deux semaines pour suivre l'avancement. »

#### Scenario: Démarche au lancement
- **GIVEN** la partie lancée
- **WHEN** un membre de Baguette ouvre le jeu
- **THEN** la présentation du rôle de Product Owner commence par le contexte, suivi de « Vous optez pour Scrum »

### Requirement: Arbitrage en équipe
Dans une équipe projet, tout membre SHALL pouvoir ouvrir l'arbitrage quand il est possible et retirer des lots pour toute l'équipe, avec les mêmes règles qu'en solo. La fenêtre ouverte chez un coéquipier SHALL suivre l'état partagé et se fermer quand l'arbitrage n'est plus possible.

#### Scenario: Arbitrage par un coéquipier
- **GIVEN** deux membres de Croissant, la fenêtre d'arbitrage ouverte chez les deux
- **WHEN** l'un retire la livraison et le projet repasse au soleil
- **THEN** la fenêtre de l'autre se ferme et son tableau n'affiche plus la livraison

### Requirement: Ordinateur d'abord
Les participants SHALL être présentés comme jouant depuis leur ordinateur ; le téléphone reste un poste de dépannage (VPN qui bloque l'ordinateur, par exemple), toujours jouable. Les textes du jeu (accueil, attente, fin du projet, questions de débrief) MUST NOT présenter le téléphone comme le poste habituel.

#### Scenario: Attente de la salle
- **GIVEN** un participant qui vient de rejoindre
- **WHEN** l'écran d'attente s'affiche
- **THEN** il lit que chaque membre peut agir depuis son ordinateur, sans mention de téléphone
