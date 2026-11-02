## MODIFIED Requirements

### Requirement: Tableau de Sprint
Pendant le développement, l'écran SHALL afficher la manche, la prochaine échéance (« COPIL N sur M » ou « Sprint N sur M ») et ses semaines, la capacité, la liste ordonnée et le journal. En manche 1, les indicateurs SHALL être ceux d'un pilotage de projet : avancement, météo du projet, capacité, budget consommé (points dépensés sur 72) et semaines écoulées (sur 12) ; les ventes cumulées n'y apparaissent qu'après la sortie de l'appli, et l'écran MUST NOT afficher de part de clients ni de ligne « Ventes réelles » sur les lots. En manche 2, les indicateurs SHALL être les ventes cumulées, la capacité, les fonctionnalités en ligne et les clients potentiels. Chaque élément SHALL afficher son avancement, l'intuition et son état, et en manche 2 sa valeur réelle si elle est révélée. En manche 1, la liste « Cahier des charges » SHALL être figée et finir par « Recette et mise en production ». En manche 2, chaque élément non terminé du Product Backlog SHALL pouvoir monter ou descendre d'un rang.

#### Scenario: Plan figé
- **GIVEN** la manche 1 en cours
- **WHEN** le tableau s'affiche
- **THEN** aucun lot ne peut changer de rang, et le texte rappelle que le cahier des charges est contractuel

#### Scenario: Échéance et semaines
- **GIVEN** la manche 1, avant le troisième COPIL
- **WHEN** le tableau s'affiche
- **THEN** il indique « COPIL 3 sur 6 · semaines 5 et 6 »

#### Scenario: Pilotage sans ventes
- **GIVEN** la manche 1 au COPIL 2, appli pas encore sortie
- **WHEN** le tableau s'affiche
- **THEN** il montre l'avancement, la météo, la capacité, le budget consommé et les semaines écoulées, et aucun mot sur les ventes ou les clients

### Requirement: Fin de Sprint
Après chaque période, une fenêtre SHALL faire le bilan, puis un bouton SHALL mener à la période suivante ou à la fin du projet. En manche 1, c'est le compte rendu de COPIL : météo du projet, avancement du cahier des charges et budget consommé ; il MUST NOT parler de ventes ni de clients avant la sortie de l'appli, puis il SHALL annoncer la sortie et donner les ventes de la période. En manche 2, c'est la Sprint Review : fonctionnalités mises en ligne, ventes et au plus trois nouveaux retours clients. Les imprévus et la demande de changement de la période SHALL y être annoncés, dans le vocabulaire de la manche.

#### Scenario: Aucun retour avant la sortie
- **GIVEN** la manche 1, appli pas encore sortie
- **WHEN** le compte rendu du COPIL 2 s'affiche
- **THEN** il donne la météo, l'avancement et le budget consommé, et ne contient ni ventes ni retours clients, ni phrase qui en signale l'absence

#### Scenario: COPIL après la sortie
- **GIVEN** la manche 1 avec un cahier des charges resserré, appli sortie au COPIL 4
- **WHEN** le compte rendu du COPIL 5 s'affiche
- **THEN** il indique que l'appli est en ligne et donne les ventes de ces 2 semaines, sans retours clients

#### Scenario: Premiers retours dès le Sprint 1
- **GIVEN** la manche 2, quel que soit l'ordre du Product Backlog
- **WHEN** le Sprint 1 est joué
- **THEN** la vitrine, seule fonctionnalité sans prérequis, est en ligne et la Sprint Review affiche déjà des retours clients

#### Scenario: Demande annoncée en manche 2
- **GIVEN** la manche 2
- **WHEN** la Sprint Review du Sprint 1 s'affiche
- **THEN** elle cite la demande de Mme Lefèvre et indique que la version anglaise est ajoutée en bas du Product Backlog
