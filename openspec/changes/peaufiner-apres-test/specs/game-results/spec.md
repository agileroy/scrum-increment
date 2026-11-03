## MODIFIED Requirements

### Requirement: Indicateurs
L'écran de résultats SHALL comparer les deux manches dans un tableau « Les indicateurs », révélé ligne par ligne selon la question de débrief en cours (voir « Questions de débrief »), et en entier dans la vue d'ensemble : premier euro encaissé (« Dès la semaine N » ou « Jamais »), argent investi avant le premier euro (points × 500 €, « sans retour » s'il n'y a jamais eu de vente), fonctionnalités en ligne à la fin du projet, fonctionnalités en ligne peu utilisées (100 € ou moins), demandes de Mme Lefèvre mises en ligne, et ventes cumulées après 20 semaines.

#### Scenario: Investi sans retour
- **GIVEN** une manche 1 dont l'appli n'est jamais sortie, avec 60 points dépensés
- **WHEN** la vue d'ensemble s'affiche
- **THEN** la ligne « Investi avant le premier euro » affiche « 30 000 € (sans retour) »

#### Scenario: Premier euro après le projet
- **GIVEN** une manche 1 avec le cahier des charges resserré de 39 points, sortie au COPIL 4, et une manche 2 dont la vitrine est en ligne à la fin du Sprint 1
- **WHEN** la vue d'ensemble s'affiche
- **THEN** la ligne « Premier euro encaissé » affiche « Dès la semaine 9 » pour la manche 1 et « Dès la semaine 3 » pour la manche 2

#### Scenario: Indicateurs cachés à l'arrivée
- **GIVEN** la fin de la manche 2
- **WHEN** les résultats s'affichent
- **THEN** aucun indicateur n'est visible avant que le joueur les révèle

### Requirement: Questions de débrief
L'écran de résultats SHALL commencer par le débrief, une question à la fois (« Question 2 sur 8 »), avant tout indicateur. Les questions SHALL partir de l'exercice, chiffres à l'appui, avant la théorie, dans cet ordre : le premier euro et ce qui l'a permis ; ce qu'ont appris les Sprint Reviews ; l'écart entre l'intuition de Mme Lefèvre et l'avis de ses clients ; la différence entre décider sur des opinions et sur des retours clients ; ce qui restait entre les mains de chacun à la coupure ; ce que chacun aurait fait s'il avait été prévenu deux périodes plus tôt ; puis pourquoi le Scrum Guide demande un Increment utilisable, et ce que le changement de vocabulaire a changé dans la façon de décider. Chaque question SHALL n'afficher que les indicateurs qui la concernent (courbe, lignes du tableau, surprises de l'intuition), cachés tant que le présentateur ne les a pas révélés ; une question sans indicateur le dit. Le présentateur SHALL passer à la question précédente ou suivante (les indicateurs se recachent) et révéler ou masquer les indicateurs ; après la dernière question, une vue d'ensemble affiche tout. En solo, le joueur est le présentateur.

#### Scenario: Débrief en formation
- **GIVEN** un formateur qui projette les résultats
- **WHEN** l'écran s'affiche
- **THEN** il voit la question 1 seule, sans courbe ni chiffre, avec « Révéler les indicateurs »

#### Scenario: Indicateurs de la question
- **GIVEN** la question sur le premier euro
- **WHEN** le présentateur révèle les indicateurs
- **THEN** s'affichent la courbe et les lignes « Premier euro encaissé » et « Investi avant le premier euro », et rien d'autre

## ADDED Requirements

### Requirement: Surprises de l'intuition
Pour les questions sur les Sprint Reviews et sur l'intuition de Mme Lefèvre, les résultats SHALL mettre en avant deux listes : les fonctionnalités peu étoilées (3 étoiles ou moins) qui rapportent beaucoup (400 € ou plus toutes les 2 semaines), et les très étoilées (4 étoiles ou plus) qui ne rapportent presque rien (200 € ou moins), avec pour chacune l'intuition, les ventes réelles et, pour chaque manche ou équipe, quand elle a été mise en ligne (« Sprint 3 », « COPIL 5 » ou « — »). Les lignes « peu utilisées » et « demandes mises en ligne » des indicateurs SHALL nommer les fonctionnalités concernées avec leurs ventes. Le tableau complet « Intuition contre réalité » reste dans la vue d'ensemble.

#### Scenario: Sprint Reviews
- **GIVEN** les résultats, sur la question des Sprint Reviews
- **WHEN** le présentateur révèle les indicateurs
- **THEN** on lit, d'un côté, gâteaux, alerte, click & collect et plateaux, de l'autre livraison, paiement, version anglaise et promotions, avec le Sprint de mise en ligne de chacun côté Scrum

#### Scenario: Peu utilisées nommées
- **GIVEN** une manche Scrum qui a mis la livraison en ligne
- **WHEN** la ligne « Fonctionnalités en ligne peu utilisées » s'affiche
- **THEN** elle indique « 1 sur 5 » et « Livraison à domicile (100 €) »
