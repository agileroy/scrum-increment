## MODIFIED Requirements

### Requirement: Nous sommes prêts
Pendant la réflexion d'une période, chaque écran SHALL proposer « Nous sommes prêts », qui signale au formateur que l'équipe a fini, et « Nous ne sommes plus prêts » pour revenir dessus. Une équipe « projet » SHALL d'abord valider son cahier des charges pour se déclarer prête à la première période, trancher sa demande de changement en attente, et arbitrer quand le projet est orageux. Un bouton « Revoir les décisions du COPIL » (« Revoir le cahier des charges » avant le premier COPIL), à côté de « Nous sommes prêts », SHALL rouvrir ces décisions pour toute l'équipe, et « Nous ne sommes plus prêts » aussi (la demande de changement se rouvre) ; une équipe dont les décisions sont rouvertes n'est plus prête. Une fois l'équipe prête, l'ordre du Product Backlog SHALL être figé (ni flèches ni glisser-déposer), avec un message qui renvoie à « Nous ne sommes plus prêts ». Le lancement de la période par le formateur se fait sans attendre l'équipe ; les écrans SHALL l'indiquer (« En attente du formateur »).

#### Scenario: Prêts
- **GIVEN** l'équipe Croissant, cahier des charges validé
- **WHEN** un membre appuie sur « Nous sommes prêts »
- **THEN** l'écran du formateur montre l'équipe Croissant comme prête

#### Scenario: Revenir sur une demande
- **GIVEN** l'équipe Croissant prête, après avoir accepté une demande au COPIL 2
- **WHEN** un membre appuie sur « Nous ne sommes plus prêts »
- **THEN** la fenêtre de la demande se rouvre pour toute l'équipe

#### Scenario: Ordre figé une fois prêts
- **GIVEN** l'équipe Baguette prête
- **WHEN** un membre veut déplacer un élément
- **THEN** il n'a ni flèches ni glisser-déposer, jusqu'à « Nous ne sommes plus prêts »

#### Scenario: Arbitrage avant d'être prêts
- **GIVEN** l'équipe Croissant, projet orageux, sans arbitrage
- **WHEN** un membre veut se déclarer prêt
- **THEN** le bouton n'est pas proposé et l'écran indique « Arbitrez d'abord : le projet est orageux. »

## ADDED Requirements

### Requirement: Contexte de la mission
Dès l'attente de la salle, l'écran d'un participant SHALL raconter le contexte et la démarche de son équipe : Mme Lefèvre tient la boulangerie du quartier, veut une appli pour que ses clients commandent en ligne et en confie la réalisation à l'équipe ; « Vous optez pour une démarche projet » (cahier des charges signé avant de commencer, COPIL toutes les deux semaines) pour une équipe projet, « Vous optez pour Scrum » (Product Owner, un Increment utilisable à chaque Sprint, une Sprint Review pour montrer ce qui marche) pour une équipe Scrum ; puis une réplique de Mme Lefèvre dans l'esprit de la démarche (« J'ai besoin d'un engagement clair : un périmètre, un budget, une date. Je signe, et je vous laisse travailler. » pour une équipe projet, « Je ne sais pas encore tout ce dont j'ai besoin. Construisons petit à petit, et montrez-moi régulièrement ce qui marche. » pour une équipe Scrum). Le premier écran de l'équipe SHALL reprendre ce contexte au lancement.

#### Scenario: Attente d'une équipe projet
- **GIVEN** un participant de Croissant dans une salle pas encore lancée
- **WHEN** son écran d'attente s'affiche
- **THEN** il lit le contexte suivi de « Vous optez pour une démarche projet : un cahier des charges complet, signé avant de commencer, et un COPIL toutes les deux semaines pour suivre l'avancement. »

#### Scenario: Démarche au lancement
- **GIVEN** la partie lancée
- **WHEN** un membre de Baguette ouvre le jeu
- **THEN** la présentation du rôle de Product Owner commence par le contexte, suivi de « Vous optez pour Scrum »

### Requirement: Arbitrage en équipe
Dans une équipe projet, tout membre SHALL pouvoir arbitrer (retirer des lots ou maintenir le périmètre) pour toute l'équipe, avec les mêmes règles qu'en solo ; au lancement de la période suivante, un arbitrage attendu et non fait vaut maintien du périmètre. La fenêtre ouverte chez un coéquipier SHALL suivre l'état partagé et se fermer quand l'arbitrage n'est plus possible.

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
