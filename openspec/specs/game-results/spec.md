# game-results Specification

## Purpose
Écran de résultats : courbes de ventes cumulées superposées, indicateurs comparés, « intuition contre réalité » et questions de débrief.

## Requirements

### Requirement: Courbes superposées
L'écran de résultats SHALL afficher les ventes cumulées sur 20 semaines, une courbe par manche, avec une légende qui nomme chaque approche : « Manche 1 : projet, une livraison à la fin » et « Manche 2 : Scrum, un incrément à chaque Sprint ». L'axe horizontal SHALL être commun et gradué en semaines (« 2 sem. » à « 20 sem. »). Une ligne verticale « Fin du projet » et une zone « Exploitation, plus de développement » SHALL séparer les deux périodes. Chaque point SHALL donner sa valeur au survol. Les courbes MUST NOT se distinguer par la couleur seule.

#### Scenario: Manche 1 sans sortie
- **GIVEN** une manche 1 dont l'appli n'est jamais sortie
- **WHEN** les résultats s'affichent
- **THEN** sa courbe reste à 0 € sur les 20 semaines

#### Scenario: Frontière après une coupure
- **GIVEN** une partie, coupée comme toujours après la cinquième période
- **WHEN** les résultats s'affichent
- **THEN** l'axe va de « 2 sem. » à « 20 sem. », avec la ligne « Fin du projet » entre « 10 sem. » et « 12 sem. »

### Requirement: Indicateurs
L'écran de résultats SHALL comparer les deux manches : premier euro encaissé (« Dès la semaine N » ou « Jamais »), argent investi avant le premier euro (points × 500 €, « sans retour » s'il n'y a jamais eu de vente), fonctionnalités en ligne à la fin du projet, fonctionnalités en ligne peu utilisées (100 € ou moins), demandes de Mme Lefèvre mises en ligne, et ventes cumulées après 20 semaines.

#### Scenario: Investi sans retour
- **GIVEN** une manche 1 dont l'appli n'est jamais sortie, avec 60 points dépensés
- **WHEN** les indicateurs s'affichent
- **THEN** la ligne « Investi avant le premier euro » affiche « 30 000 € (sans retour) »

#### Scenario: Premier euro après le projet
- **GIVEN** une manche 1 avec le cahier des charges resserré de 39 points, sortie au COPIL 4, et une manche 2 dont la vitrine est en ligne à la fin du Sprint 1
- **WHEN** les indicateurs s'affichent
- **THEN** la ligne « Premier euro encaissé » affiche « Dès la semaine 9 » pour la manche 1 et « Dès la semaine 3 » pour la manche 2

### Requirement: Intuition contre réalité
L'écran de résultats SHALL lister toutes les fonctionnalités, y compris les trois demandes de changement signalées comme telles, triées par valeur réelle décroissante, avec l'intuition de Mme Lefèvre en étoiles et les ventes réelles par Sprint.

#### Scenario: Révélation
- **GIVEN** les résultats
- **WHEN** le joueur lit le tableau
- **THEN** la réservation de pain est en tête, et les avis clients et la version anglaise sont en dernier, à 0 €

### Requirement: Questions de débrief
L'écran de résultats SHALL proposer des questions de débrief reliées au Scrum Guide 2020 : le premier euro et ce qui l'a permis, pourquoi un Increment doit être utilisable, ce qu'ont appris les Sprint Reviews, ce qui restait entre les mains de chacun à la coupure, ce que chacun aurait fait s'il avait été prévenu deux périodes plus tôt, l'écart entre l'intuition de Mme Lefèvre et l'avis de ses clients, la différence entre décider sur des opinions et sur des retours clients, et ce que le changement de vocabulaire a changé dans la façon de décider.

#### Scenario: Débrief en formation
- **GIVEN** un formateur qui projette les résultats
- **WHEN** il lance la discussion
- **THEN** les questions sont visibles sous les indicateurs, sans avoir à ouvrir d'autre écran
