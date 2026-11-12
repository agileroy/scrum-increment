## MODIFIED Requirements

### Requirement: Plan de la manche 1
Avant le premier COPIL, l'écran du cahier des charges SHALL présenter la mission en briefing : le contexte (Mme Lefèvre, sa boulangerie, l'appli qu'elle vous confie, puis la démarche projet choisie), une réplique de Madame Lefèvre, puis la règle en quatre tuiles chiffrées (6 semaines avec un COPIL chaque semaine ; 72 j/h, une petite équipe abattant 12 jours/homme par semaine ; 8 j/h de recette et de mise en production finales ; cahier des charges contractuel une fois validé, tout changement passant par un avenant), puis la mission en une phrase juste au-dessus de la jauge, suivie d'une légende qui explique l'intuition (ce que Mme Lefèvre pense que chaque lot va rapporter, de 1 à 5 étoiles : son avis, pas une mesure). L'écran MUST NOT présenter ces règles en paragraphe. Il SHALL lister les lots avec leur rang, leur coût, l'intuition de Mme Lefèvre et leur prérequis. Le joueur SHALL pouvoir retirer ou remettre un lot et changer son rang. Une jauge SHALL comparer la charge planifiée aux 64 jours/homme, et un message SHALL dire ce qui bloque ou que le cahier des charges tient. La validation SHALL rester inactive tant qu'il est invalide.

#### Scenario: Dépassement
- **GIVEN** le cahier des charges initial de 66 points
- **WHEN** l'écran s'affiche
- **THEN** la jauge est rouge, le message indique un dépassement de 2 jours/homme et la validation est impossible

#### Scenario: Prérequis retiré
- **GIVEN** un cahier des charges qui contient le paiement en ligne
- **WHEN** le joueur retire la réservation de pain
- **THEN** le message indique que « Paiement en ligne » nécessite « Réservation de pain » et la validation est impossible

#### Scenario: Briefing lisible d'un coup d'œil
- **GIVEN** un téléphone de 360 px de large
- **WHEN** l'écran du cahier des charges s'affiche
- **THEN** la réplique de Mme Lefèvre et les quatre tuiles (6 semaines, 72 j/h, 8 j/h, contrat) tiennent sans défilement horizontal, et la phrase de mission précède la jauge

#### Scenario: Intuition expliquée
- **GIVEN** l'écran du cahier des charges
- **WHEN** le joueur lit la mission
- **THEN** une légende sous la mission explique que les étoiles « Intuition » sont l'avis de Mme Lefèvre sur ce que chaque lot va rapporter, pas une mesure

### Requirement: Tableau de Sprint
Pendant le développement, l'écran SHALL afficher la manche, la prochaine échéance (« COPIL N sur M » ou « Sprint N sur M ») et ses semaines, la capacité, la liste ordonnée et le journal. En manche 1, les indicateurs SHALL être ceux d'un pilotage de projet : temps écoulé contre travail fait (deux barres en pourcentage : semaines écoulées sur 6, avancement du plan recette comprise), météo du projet et capacité ; les ventes cumulées n'y apparaissent qu'après la sortie de l'appli, et l'écran MUST NOT afficher de part de clients ni de ligne « Ventes réelles » sur les lots. En manche 2, les indicateurs SHALL être les ventes cumulées, la capacité, les fonctionnalités en ligne et les clients potentiels. Chaque élément SHALL afficher son avancement, l'intuition et son état, et en manche 2 sa valeur réelle si elle est révélée. En manche 1, la liste « Cahier des charges » SHALL être figée et finir par « Recette et mise en production ». En manche 2, chaque élément non terminé du Product Backlog SHALL pouvoir monter ou descendre d'un rang.

#### Scenario: Plan figé
- **GIVEN** la manche 1 en cours
- **WHEN** le tableau s'affiche
- **THEN** aucun lot ne peut changer de rang, et le texte rappelle que le cahier des charges est contractuel

#### Scenario: Échéance et semaines
- **GIVEN** la manche 1, avant le troisième COPIL
- **WHEN** le tableau s'affiche
- **THEN** il indique « COPIL 3 sur 6 · semaine 3 »

#### Scenario: Pilotage sans ventes
- **GIVEN** la manche 1 au COPIL 2, appli pas encore sortie
- **WHEN** le tableau s'affiche
- **THEN** il montre le temps écoulé contre le travail fait, la météo et la capacité, et aucun mot sur les ventes ou les clients

### Requirement: Fin de Sprint
Après chaque période, une fenêtre SHALL faire le bilan, puis un bouton SHALL mener à la période suivante ou à la fin du projet. En manche 1, c'est le compte rendu de COPIL : météo du projet, temps écoulé et travail fait ; il MUST NOT parler de ventes ni de clients avant la sortie de l'appli, puis il SHALL annoncer la sortie et donner les ventes de la période. En manche 2, c'est la Sprint Review : fonctionnalités mises en ligne, ventes et au plus trois nouveaux retours clients. Les imprévus et la demande de changement de la période SHALL y être annoncés, dans le vocabulaire de la manche.

#### Scenario: Aucun retour avant la sortie
- **GIVEN** la manche 1, appli pas encore sortie
- **WHEN** le compte rendu du COPIL 2 s'affiche
- **THEN** il donne la météo, le temps écoulé et le travail fait, et ne contient ni ventes ni retours clients, ni phrase qui en signale l'absence

#### Scenario: COPIL après la sortie
- **GIVEN** la manche 1 avec un cahier des charges resserré, appli sortie au COPIL 4
- **WHEN** le compte rendu du COPIL 5 s'affiche
- **THEN** il indique que l'appli est en ligne et donne les ventes de la semaine, sans retours clients

#### Scenario: Premiers retours dès le Sprint 1
- **GIVEN** la manche 2, quel que soit l'ordre du Product Backlog
- **WHEN** le Sprint 1 est joué
- **THEN** la vitrine, seule fonctionnalité sans prérequis, est en ligne et la Sprint Review affiche déjà des retours clients

#### Scenario: Demande annoncée en manche 2
- **GIVEN** la manche 2
- **WHEN** la Sprint Review du Sprint 1 s'affiche
- **THEN** elle cite la demande de Mme Lefèvre et indique que la version anglaise est ajoutée en bas du Product Backlog

### Requirement: Fin du développement et enchaînement
À la fin du développement, une fenêtre SHALL annoncer la fin du projet, dire ce qui est en ligne (ou, en manche 1 sans sortie, que l'appli n'est jamais sortie), expliquer que les semaines suivantes sont de l'exploitation sans développement, jusqu'à 10 semaines après le lancement, et donner les ventes cumulées. Elle MUST NOT parler de Sprints ni de COPIL pour la période d'exploitation. Après la manche 1, l'écran de transition SHALL présenter la manche 2 ; après la manche 2, le jeu SHALL afficher les résultats. « Rejouer » SHALL ramener à l'accueil.

#### Scenario: Enchaînement des manches
- **GIVEN** la fin du développement de la manche 1
- **WHEN** le joueur continue
- **THEN** l'écran de transition s'affiche, puis le tableau du Sprint 1 avec le Product Backlog dans l'ordre initial

#### Scenario: Fin de projet après une coupure
- **GIVEN** la manche 1, au COPIL 5
- **WHEN** la fenêtre de fin du projet s'affiche, juste après le compte rendu qui annonce la coupure
- **THEN** elle dit que le projet s'arrête au COPIL 5, en l'état, annonce 5 semaines d'exploitation sans développement, et ne parle d'aucun Sprint

### Requirement: Fenêtre de demande de changement (manche 1)
En manche 1, quand un COPIL annonce une demande de la boulangère, le compte rendu SHALL ensuite présenter la demande en deux temps. D'abord la situation : la réplique de Mme Lefèvre, la charge de la demande (jours/homme de lot et 2 jours/homme de recette pour l'avenant), l'intuition de Mme Lefèvre, puis deux choix côte à côte. « Si vous acceptez » SHALL dire de combien de jours/homme de lots pas commencés il faudra réduire le cahier des charges (demande, avenant et travail découvert compris), ou que rien n'est à retirer, ou que c'est impossible. « Si vous refusez » SHALL dire que le cahier des charges tient dans le temps prévu, ou de combien il faudra quand même le réduire à cause du travail découvert, le COPIL devant alors arbitrer. Le travail découvert MUST NOT être mentionné tant qu'il n'y en a pas eu, pour ne rien annoncer de ce qui vient. Ensuite, si l'équipe accepte et qu'il faut retirer des lots : les lots pas commencés avec des cases à cocher, une jauge du retiré face à l'objectif, ce qui reste à retirer pour tenir dans le temps prévu (un seul objectif, sans distinguer budget signé et délais), « Signer l'avenant » (inactif tant que l'objectif n'est pas atteint, sauf s'il n'y a plus rien à retirer, ou qu'un prérequis manque) et « Revenir au choix ». « Refuser » SHALL toujours être possible ; si le projet dépasse déjà le temps prévu, refuser SHALL ouvrir aussitôt la fenêtre d'arbitrage, qui propose aussi « Maintenir le périmètre » ; fermer la fenêtre MUST NOT trancher la demande à la place du joueur.

#### Scenario: Rien de découvert, rien d'annoncé
- **GIVEN** la demande « Version anglaise » au COPIL 1, aucun travail découvert
- **WHEN** la fenêtre s'affiche
- **THEN** « Si vous acceptez » demande de réduire le cahier des charges de 4 jours/homme, sans parler de travail découvert, et « Si vous refusez » dit que le cahier des charges tient dans le temps prévu

#### Scenario: Situation au COPIL 2
- **GIVEN** le cahier des charges sans les avis clients, le paiement découvert, la demande « Promotions flash »
- **WHEN** la fenêtre s'affiche
- **THEN** « Si vous acceptez » demande de réduire le cahier des charges d'au moins 11 jours/homme, travail découvert (6 jours/homme) compris, et « Si vous refusez » annonce qu'il faudra quand même le réduire d'au moins 3 jours/homme

#### Scenario: Faire de la place
- **GIVEN** la même situation, le joueur ayant choisi d'accepter
- **WHEN** il coche la livraison et la fidélité (21 jours/homme)
- **THEN** l'objectif est atteint et « Signer l'avenant » est actif

#### Scenario: Touche Échap
- **GIVEN** la fenêtre d'une demande de changement
- **WHEN** le joueur appuie sur Échap
- **THEN** la fenêtre reste ouverte et la demande n'est ni acceptée ni refusée

### Requirement: Annonce du travail sous-estimé
Le compte rendu de COPIL ou la Sprint Review de la période SHALL annoncer chaque découverte de travail sous-estimé dans le vocabulaire de la manche, avec un pictogramme, et l'élément concerné SHALL afficher son coût sous la forme « coût prévu + travail découvert » (par exemple « 8 + 6 j/h » en manche 1, « 8 + 6 pts » en manche 2).

#### Scenario: Découverte annoncée au COPIL
- **GIVEN** la manche 1, le paiement en ligne commencé pendant la période 2
- **WHEN** le compte rendu du COPIL 2 s'affiche
- **THEN** il annonce que la banque exige une sécurisation et une certification (+6 jours/homme), et le lot affiche « 8 + 6 j/h »

### Requirement: Briefing de la manche 2
L'écran de transition vers la manche 2 SHALL présenter la nouvelle mission avec la même mise en page que le cahier des charges : une réplique de Madame Lefèvre, quatre tuiles (Sprint d'une semaine conclu par une Sprint Review ; 10 points pour construire et 2 pour la Definition of Done ; une fonctionnalité terminée est en ligne et rapporte dès le Sprint suivant ; chaque Sprint Review révèle la vraie valeur grâce aux retours clients) et la mission en une phrase. Le tableau des équivalences de vocabulaire SHALL rester sur cet écran.

#### Scenario: Transition
- **GIVEN** la fin de la manche 1
- **WHEN** le joueur ferme la fin du projet
- **THEN** il voit la réplique de Mme Lefèvre, les quatre tuiles de la manche 2, le tableau « Ce qui change » et « Commencer la manche 2 »
