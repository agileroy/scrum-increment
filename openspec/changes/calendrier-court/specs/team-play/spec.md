## MODIFIED Requirements

### Requirement: Fin du projet et attente
À la coupure, chaque écran SHALL afficher la fin du projet de son équipe, comme en solo, puis un écran d'attente « Le formateur va révéler les résultats », avec les ventes cumulées de l'équipe après 10 semaines.

#### Scenario: Après la coupure
- **GIVEN** la période 5 lancée
- **WHEN** le bilan et la fin du projet ont été fermés
- **THEN** l'écran affiche l'écran d'attente et les ventes de son équipe

### Requirement: Contexte de la mission
Dès l'attente de la salle, l'écran d'un participant SHALL raconter le contexte et la démarche de son équipe : Mme Lefèvre tient la boulangerie du quartier, veut une appli pour que ses clients commandent en ligne et en confie la réalisation à l'équipe ; « Vous optez pour une démarche projet » (cahier des charges signé avant de commencer, COPIL chaque semaine) pour une équipe projet, « Vous optez pour Scrum » (Product Owner, un Increment utilisable à chaque Sprint, une Sprint Review pour montrer ce qui marche) pour une équipe Scrum ; puis une réplique de Mme Lefèvre dans l'esprit de la démarche (« J'ai besoin d'un engagement clair : un périmètre, un budget, une date. Je signe, et je vous laisse travailler. » pour une équipe projet, « Je ne sais pas encore tout ce dont j'ai besoin. Construisons petit à petit, et montrez-moi régulièrement ce qui marche. » pour une équipe Scrum). Le premier écran de l'équipe SHALL reprendre ce contexte au lancement.

#### Scenario: Attente d'une équipe projet
- **GIVEN** un participant de Croissant dans une salle pas encore lancée
- **WHEN** son écran d'attente s'affiche
- **THEN** il lit le contexte suivi de « Vous optez pour une démarche projet : un cahier des charges complet, signé avant de commencer, et un COPIL chaque semaine pour suivre l'avancement. »

#### Scenario: Démarche au lancement
- **GIVEN** la partie lancée
- **WHEN** un membre de Baguette ouvre le jeu
- **THEN** la présentation du rôle de Product Owner commence par le contexte, suivi de « Vous optez pour Scrum »
