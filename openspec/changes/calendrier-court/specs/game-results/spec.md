## MODIFIED Requirements

### Requirement: Courbes superposées
L'écran de résultats SHALL afficher les ventes cumulées sur 10 semaines, une courbe par manche, avec une légende qui nomme chaque approche : « Manche 1 : projet, une livraison à la fin » et « Manche 2 : Scrum, un incrément à chaque Sprint ». L'axe horizontal SHALL être commun et gradué en semaines (« 1 sem. » à « 20 sem. »). Une ligne verticale « Fin du projet » et une zone « Exploitation, plus de développement » SHALL séparer les deux périodes. Chaque point SHALL donner sa valeur au survol. Les courbes MUST NOT se distinguer par la couleur seule.

#### Scenario: Manche 1 sans sortie
- **GIVEN** une manche 1 dont l'appli n'est jamais sortie
- **WHEN** les résultats s'affichent
- **THEN** sa courbe reste à 0 € sur les 10 semaines

#### Scenario: Frontière après une coupure
- **GIVEN** une partie, coupée comme toujours après la cinquième période
- **WHEN** les résultats s'affichent
- **THEN** l'axe va de « 1 sem. » à « 20 sem. », avec la ligne « Fin du projet » entre « 10 sem. » et « 12 sem. »

### Requirement: Indicateurs
L'écran de résultats SHALL comparer les deux manches dans un tableau « Les indicateurs », révélé ligne par ligne selon la question de débrief en cours (voir « Questions de débrief »), et en entier dans la vue d'ensemble : premier euro encaissé (« Dès la semaine N » ou « Jamais »), argent investi avant le premier euro (points × 500 €, « sans retour » s'il n'y a jamais eu de vente), fonctionnalités en ligne à la fin du projet, fonctionnalités en ligne peu utilisées (100 € ou moins), demandes de Mme Lefèvre mises en ligne, et ventes cumulées après 10 semaines.

#### Scenario: Investi sans retour
- **GIVEN** une manche 1 dont l'appli n'est jamais sortie, avec 60 points dépensés
- **WHEN** la vue d'ensemble s'affiche
- **THEN** la ligne « Investi avant le premier euro » affiche « 30 000 € (sans retour) »

#### Scenario: Premier euro après le projet
- **GIVEN** une manche 1 avec le cahier des charges resserré de 39 points, sortie au COPIL 4, et une manche 2 dont la vitrine est en ligne à la fin du Sprint 1
- **WHEN** la vue d'ensemble s'affiche
- **THEN** la ligne « Premier euro encaissé » affiche « Dès la semaine 5 » pour la manche 1 et « Dès la semaine 2 » pour la manche 2

#### Scenario: Indicateurs cachés à l'arrivée
- **GIVEN** la fin de la manche 2
- **WHEN** les résultats s'affichent
- **THEN** aucun indicateur n'est visible avant que le joueur les révèle

### Requirement: Surprises de l'intuition
Pour les questions sur les Sprint Reviews et sur l'intuition de Mme Lefèvre, les résultats SHALL mettre en avant deux listes : les fonctionnalités peu étoilées (3 étoiles ou moins) qui rapportent beaucoup (400 € ou plus par semaine), et les très étoilées (4 étoiles ou plus) qui ne rapportent presque rien (200 € ou moins), avec pour chacune l'intuition, les ventes réelles et, pour chaque manche ou équipe, quand elle a été mise en ligne (« Sprint 3 », « COPIL 5 » ou « — »). Les lignes « peu utilisées » et « demandes mises en ligne » des indicateurs SHALL nommer les fonctionnalités concernées avec leurs ventes. Le tableau complet « Intuition contre réalité » reste dans la vue d'ensemble.

#### Scenario: Sprint Reviews
- **GIVEN** les résultats, sur la question des Sprint Reviews
- **WHEN** le présentateur révèle les indicateurs
- **THEN** on lit, d'un côté, gâteaux, alerte, click & collect et plateaux, de l'autre livraison, paiement, version anglaise et promotions, avec le Sprint de mise en ligne de chacun côté Scrum

#### Scenario: Peu utilisées nommées
- **GIVEN** une manche Scrum qui a mis la livraison en ligne
- **WHEN** la ligne « Fonctionnalités en ligne peu utilisées » s'affiche
- **THEN** elle indique « 1 sur 5 » et « Livraison à domicile (100 €) »
