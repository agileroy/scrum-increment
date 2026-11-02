## MODIFIED Requirements

### Requirement: Courbes superposées
L'écran de résultats SHALL afficher les ventes cumulées sur 20 semaines, une courbe par manche, avec une légende qui nomme chaque façon de livrer. L'axe horizontal SHALL montrer les Sprints (S1, S2…) puis les semaines d'exploitation (« +2 sem. », « +4 sem. »…). Une ligne verticale « Fin du projet » et une zone « Exploitation, plus de développement » SHALL séparer les deux périodes. Chaque point SHALL donner sa valeur au survol. Les courbes MUST NOT se distinguer par la couleur seule.

#### Scenario: Manche 1 sans sortie
- **GIVEN** une manche 1 dont l'appli n'est jamais sortie
- **WHEN** les résultats s'affichent
- **THEN** sa courbe reste à 0 € sur les 20 semaines

#### Scenario: Frontière après une coupure
- **GIVEN** une partie avec la coupure budgétaire
- **WHEN** les résultats s'affichent
- **THEN** l'axe montre S1 à S5, la ligne « Fin du projet », puis « +2 sem. » à « +10 sem. » dans la zone d'exploitation

### Requirement: Indicateurs
L'écran de résultats SHALL comparer les deux manches : premier euro encaissé (« Sprint N », « N semaines après le projet » ou « Jamais »), argent investi avant le premier euro (points × 500 €, « sans retour » s'il n'y a jamais eu de vente), fonctionnalités en ligne à la fin du projet, fonctionnalités en ligne peu utilisées (100 € ou moins), demandes de Mme Lefèvre mises en ligne, et ventes cumulées après 20 semaines.

#### Scenario: Investi sans retour
- **GIVEN** une manche 1 dont l'appli n'est jamais sortie, avec 60 points dépensés
- **WHEN** les indicateurs s'affichent
- **THEN** la ligne « Investi avant le premier euro » affiche « 30 000 € (sans retour) »

#### Scenario: Premier euro après le projet
- **GIVEN** une manche 1 sans coupure dont l'appli sort à la fin du Sprint 6
- **WHEN** les indicateurs s'affichent
- **THEN** la ligne « Premier euro encaissé » affiche « 2 semaines après le projet »

### Requirement: Intuition contre réalité
L'écran de résultats SHALL lister toutes les fonctionnalités, y compris les trois demandes de changement signalées comme telles, triées par valeur réelle décroissante, avec l'intuition de Mme Lefèvre en étoiles et les ventes réelles par Sprint.

#### Scenario: Révélation
- **GIVEN** les résultats
- **WHEN** le joueur lit le tableau
- **THEN** la réservation de pain est en tête, et les avis clients et la version anglaise sont en dernier, à 0 €

### Requirement: Questions de débrief
L'écran de résultats SHALL proposer des questions de débrief reliées au Scrum Guide 2020 : le premier euro et ce qui l'a permis, pourquoi un Increment doit être utilisable, ce qu'ont appris les Sprint Reviews, ce qui restait entre les mains de chacun à la coupure, l'écart entre l'intuition de Mme Lefèvre et l'avis de ses clients, et la différence entre décider sur des opinions et décider sur des retours clients.

#### Scenario: Débrief en formation
- **GIVEN** un formateur qui projette les résultats
- **WHEN** il lance la discussion
- **THEN** les questions sont visibles sous les indicateurs, sans avoir à ouvrir d'autre écran
