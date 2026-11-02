# team-play Specification

## Purpose
Le jeu d'une équipe sur les téléphones de ses membres : état partagé, actions de chacun, signal « prêts », bilans de période, demandes de changement, fin du projet et attente de la révélation.

## Requirements

### Requirement: État partagé
Tous les membres d'une équipe SHALL voir le même cahier des charges ou Product Backlog, mis à jour en temps réel. Toute action d'un membre (cocher un lot, déplacer un élément par les flèches ou le glisser-déposer, valider le cahier des charges, trancher une demande de changement) SHALL s'appliquer pour toute l'équipe, avec les mêmes règles qu'en solo. Deux actions simultanées MUST NOT s'écraser : chacune s'applique sur l'état le plus récent.

#### Scenario: Deux membres déplacent en même temps
- **GIVEN** deux membres de l'équipe Baguette
- **WHEN** l'un remonte l'alerte et l'autre descend la livraison au même moment
- **THEN** les deux déplacements sont appliqués, et les deux téléphones affichent le même ordre

### Requirement: Jeu dans le vocabulaire de l'équipe
Une équipe « projet » SHALL jouer la manche 1 du solo (cahier des charges, COPIL, recette, avenants) et une équipe « Scrum » la manche 2 (Product Backlog, Sprints, Sprint Review, Definition of Done), avec le vocabulaire de chaque manche. Les téléphones MUST NOT montrer l'existence de l'autre approche avant la révélation. Une équipe « Scrum » SHALL voir, avant le premier Sprint, une présentation de son rôle de Product Owner et des règles de sa manche.

#### Scenario: Équipe Scrum au départ
- **GIVEN** une partie lancée
- **WHEN** un membre de l'équipe Baguette ouvre son téléphone
- **THEN** il voit le Product Backlog, la présentation de son rôle de Product Owner, et aucun mot sur le cahier des charges ou les COPIL

### Requirement: Nous sommes prêts
Pendant la réflexion d'une période, chaque téléphone SHALL proposer « Nous sommes prêts », qui signale au formateur que l'équipe a fini, et « Nous ne sommes plus prêts » pour revenir dessus. Une équipe « projet » SHALL d'abord valider son cahier des charges pour se déclarer prête à la première période, et trancher sa demande de changement en attente. Le lancement de la période par le formateur se fait sans attendre l'équipe ; les téléphones SHALL l'indiquer (« En attente du formateur »).

#### Scenario: Prêts
- **GIVEN** l'équipe Croissant, cahier des charges validé
- **WHEN** un membre appuie sur « Nous sommes prêts »
- **THEN** l'écran du formateur montre l'équipe Croissant comme prête

### Requirement: Bilan de période
Quand le formateur lance une période, chaque téléphone SHALL afficher le bilan de son équipe pour cette période (compte rendu de COPIL ou Sprint Review), avec les mêmes contenus qu'en solo, puis la demande de changement de la période s'il y en a une. Un membre qui ferme le bilan SHALL retrouver le tableau ; un membre qui arrive après le lancement SHALL voir le dernier bilan de son équipe une fois.

#### Scenario: Bilan après lancement
- **GIVEN** une partie à la période 2
- **WHEN** le formateur lance la période 2
- **THEN** chaque téléphone de l'équipe Croissant affiche le compte rendu du COPIL 2, et chaque téléphone de l'équipe Baguette la Sprint Review du Sprint 2

### Requirement: Demande de changement en équipe
Dans une équipe « projet », la demande de changement SHALL s'afficher sur tous les téléphones de l'équipe ; les cases de retrait sont propres à chaque téléphone jusqu'à la décision ; le premier membre qui accepte ou refuse tranche pour toute l'équipe, et la fenêtre se ferme sur les autres téléphones. Une demande non tranchée au lancement de la période suivante SHALL être refusée d'office, et le journal SHALL l'indiquer (« refusée faute de décision »).

#### Scenario: Décision d'un membre
- **GIVEN** la demande « Version anglaise » ouverte sur trois téléphones de l'équipe Croissant
- **WHEN** l'un des membres refuse
- **THEN** la demande disparaît des trois téléphones et le journal indique le refus

### Requirement: Fin du projet et attente
À la coupure, chaque téléphone SHALL afficher la fin du projet de son équipe, comme en solo, puis un écran d'attente « Le formateur va révéler les résultats », avec les ventes cumulées de l'équipe après 20 semaines.

#### Scenario: Après la coupure
- **GIVEN** la période 5 lancée
- **WHEN** le bilan et la fin du projet ont été fermés
- **THEN** le téléphone affiche l'écran d'attente et les ventes de son équipe
