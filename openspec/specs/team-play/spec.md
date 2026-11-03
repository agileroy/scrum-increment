# team-play Specification

## Purpose
Le jeu d'une équipe sur les écrans de ses membres (ordinateur, téléphone en dépannage) : état partagé, actions de chacun, signal « prêts », bilans de période, demandes de changement, fin du projet et attente de la révélation.

## Requirements

### Requirement: État partagé
Tous les membres d'une équipe SHALL voir le même cahier des charges ou Product Backlog, mis à jour en temps réel. Toute action d'un membre (cocher un lot, déplacer un élément par les flèches ou le glisser-déposer, valider le cahier des charges, trancher une demande de changement) SHALL s'appliquer pour toute l'équipe, avec les mêmes règles qu'en solo. Deux actions simultanées MUST NOT s'écraser : chacune s'applique sur l'état le plus récent.

#### Scenario: Deux membres déplacent en même temps
- **GIVEN** deux membres de l'équipe Baguette
- **WHEN** l'un remonte l'alerte et l'autre descend la livraison au même moment
- **THEN** les deux déplacements sont appliqués, et les deux écrans affichent le même ordre

### Requirement: Jeu dans le vocabulaire de l'équipe
Une équipe « projet » SHALL jouer la manche 1 du solo (cahier des charges, COPIL, recette, avenants) et une équipe « Scrum » la manche 2 (Product Backlog, Sprints, Sprint Review, Definition of Done), avec le vocabulaire de chaque manche. Les écrans des participants MUST NOT montrer l'existence de l'autre approche avant la révélation. Une équipe « Scrum » SHALL voir, avant le premier Sprint, une présentation de son rôle de Product Owner en briefing, comme la transition du solo (réplique de Madame Lefèvre, quatre tuiles de la manche 2, mission en une phrase avec le signal « Nous sommes prêts »), sans le tableau des équivalences de vocabulaire.

#### Scenario: Équipe Scrum au départ
- **GIVEN** une partie lancée
- **WHEN** un membre de l'équipe Baguette ouvre le jeu
- **THEN** il voit le Product Backlog, la présentation de son rôle de Product Owner, et aucun mot sur le cahier des charges ou les COPIL

### Requirement: Nous sommes prêts
Pendant la réflexion d'une période, chaque écran SHALL proposer « Nous sommes prêts », qui signale au formateur que l'équipe a fini, et « Nous ne sommes plus prêts » pour revenir dessus. Une équipe « projet » SHALL d'abord valider son cahier des charges pour se déclarer prête à la première période, trancher sa demande de changement en attente, et arbitrer quand le projet est orageux. Un bouton « Changer la décision du COPIL » (« Revoir le cahier des charges » avant le premier COPIL), à côté de « Nous sommes prêts », SHALL rouvrir ces décisions pour toute l'équipe, et « Nous ne sommes plus prêts » aussi (la demande de changement se rouvre) ; une équipe dont les décisions sont rouvertes n'est plus prête. Une fois l'équipe prête, l'ordre du Product Backlog SHALL être figé (ni flèches ni glisser-déposer), avec un message qui renvoie à « Nous ne sommes plus prêts ». Le lancement de la période par le formateur se fait sans attendre l'équipe ; les écrans SHALL l'indiquer (« En attente du formateur »).

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

### Requirement: Bilan de période
Quand le formateur lance une période, chaque écran SHALL afficher le bilan de son équipe pour cette période (compte rendu de COPIL ou Sprint Review), avec les mêmes contenus qu'en solo, puis la demande de changement de la période s'il y en a une. Un membre qui ferme le bilan SHALL retrouver le tableau ; un membre qui arrive après le lancement SHALL voir le dernier bilan de son équipe une fois.

#### Scenario: Bilan après lancement
- **GIVEN** une partie à la période 2
- **WHEN** le formateur lance la période 2
- **THEN** chaque écran de l'équipe Croissant affiche le compte rendu du COPIL 2, et chaque écran de l'équipe Baguette la Sprint Review du Sprint 2

### Requirement: Demande de changement en équipe
Dans une équipe « projet », la demande de changement SHALL s'afficher sur tous les écrans de l'équipe ; les cases de retrait sont propres à chaque écran jusqu'à la décision ; le premier membre qui accepte ou refuse tranche pour toute l'équipe, et la fenêtre se ferme sur les autres écrans. Une demande non tranchée au lancement de la période suivante SHALL être refusée d'office, et le journal SHALL l'indiquer (« refusée faute de décision »).

#### Scenario: Décision d'un membre
- **GIVEN** la demande « Version anglaise » ouverte sur trois écrans de l'équipe Croissant
- **WHEN** l'un des membres refuse
- **THEN** la demande disparaît des trois écrans et le journal indique le refus

### Requirement: Fin du projet et attente
À la coupure, chaque écran SHALL afficher la fin du projet de son équipe, comme en solo, puis un écran d'attente « Le formateur va révéler les résultats », avec les ventes cumulées de l'équipe après 20 semaines.

#### Scenario: Après la coupure
- **GIVEN** la période 5 lancée
- **WHEN** le bilan et la fin du projet ont été fermés
- **THEN** l'écran affiche l'écran d'attente et les ventes de son équipe

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
