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
L'écran de résultats SHALL commencer par le débrief, une question à la fois (« Question 2 sur 8 »), avant tout indicateur. Les questions SHALL être reliées au Scrum Guide 2020 : le premier euro et ce qui l'a permis, pourquoi un Increment doit être utilisable, ce qu'ont appris les Sprint Reviews, ce qui restait entre les mains de chacun à la coupure, ce que chacun aurait fait s'il avait été prévenu deux périodes plus tôt, l'écart entre l'intuition de Mme Lefèvre et l'avis de ses clients, la différence entre décider sur des opinions et sur des retours clients, et ce que le changement de vocabulaire a changé dans la façon de décider. Chaque question SHALL n'afficher que les indicateurs qui la concernent (courbe, lignes du tableau, « Intuition contre réalité »), cachés tant que le présentateur ne les a pas révélés ; une question sans indicateur le dit. Le présentateur SHALL passer à la question précédente ou suivante (les indicateurs se recachent) et révéler ou masquer les indicateurs ; après la dernière question, une vue d'ensemble affiche tout. En solo, le joueur est le présentateur.

#### Scenario: Débrief en formation
- **GIVEN** un formateur qui projette les résultats
- **WHEN** l'écran s'affiche
- **THEN** il voit la question 1 seule, sans courbe ni chiffre, avec « Révéler les indicateurs »

#### Scenario: Indicateurs de la question
- **GIVEN** la question sur le premier euro
- **WHEN** le présentateur révèle les indicateurs
- **THEN** s'affichent la courbe et les lignes « Premier euro encaissé » et « Investi avant le premier euro », et rien d'autre
