## MODIFIED Requirements

### Requirement: Indicateurs
L'écran de résultats SHALL comparer les deux manches dans un panneau « Les indicateurs » dépliable, plié à chaque arrivée sur les résultats, pour que les chiffres n'orientent pas le débat avant les questions : premier euro encaissé (« Dès la semaine N » ou « Jamais »), argent investi avant le premier euro (points × 500 €, « sans retour » s'il n'y a jamais eu de vente), fonctionnalités en ligne à la fin du projet, fonctionnalités en ligne peu utilisées (100 € ou moins), demandes de Mme Lefèvre mises en ligne, et ventes cumulées après 20 semaines.

#### Scenario: Investi sans retour
- **GIVEN** une manche 1 dont l'appli n'est jamais sortie, avec 60 points dépensés
- **WHEN** les indicateurs s'affichent
- **THEN** la ligne « Investi avant le premier euro » affiche « 30 000 € (sans retour) »

#### Scenario: Premier euro après le projet
- **GIVEN** une manche 1 avec le cahier des charges resserré de 39 points, sortie au COPIL 4, et une manche 2 dont la vitrine est en ligne à la fin du Sprint 1
- **WHEN** les indicateurs s'affichent
- **THEN** la ligne « Premier euro encaissé » affiche « Dès la semaine 9 » pour la manche 1 et « Dès la semaine 3 » pour la manche 2

#### Scenario: Indicateurs pliés
- **GIVEN** la fin de la manche 2
- **WHEN** les résultats s'affichent
- **THEN** « Les indicateurs » est plié, et un clic sur son titre l'ouvre

### Requirement: Questions de débrief
L'écran de résultats SHALL commencer par les questions de débrief, avant la courbe et les indicateurs. Il SHALL proposer des questions reliées au Scrum Guide 2020 : le premier euro et ce qui l'a permis, pourquoi un Increment doit être utilisable, ce qu'ont appris les Sprint Reviews, ce qui restait entre les mains de chacun à la coupure, ce que chacun aurait fait s'il avait été prévenu deux périodes plus tôt, l'écart entre l'intuition de Mme Lefèvre et l'avis de ses clients, la différence entre décider sur des opinions et sur des retours clients, et ce que le changement de vocabulaire a changé dans la façon de décider.

#### Scenario: Débrief en formation
- **GIVEN** un formateur qui projette les résultats
- **WHEN** il lance la discussion
- **THEN** les questions sont la première chose visible, au-dessus de la courbe et des indicateurs pliés
