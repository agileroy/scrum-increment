## ADDED Requirements

### Requirement: Courbes superposées
L'écran de résultats SHALL afficher un graphique des ventes cumulées du Sprint 1 au Sprint 10, avec une courbe par manche, de couleurs distinctes, et une légende qui nomme chaque façon de livrer (« Manche 1 : une seule livraison à la fin », « Manche 2 : un incrément à chaque Sprint »). L'axe des ventes SHALL être gradué en euros, l'axe horizontal en Sprints (S1 à S10). Chaque point SHALL donner sa valeur au survol. Le graphique SHALL rester lisible dans les deux thèmes et sur un téléphone de 360 px. La différence entre les courbes MUST NOT reposer sur la couleur seule.

#### Scenario: Manche 1 sans sortie
- **GIVEN** une manche 1 dont l'appli n'est jamais sortie
- **WHEN** les résultats s'affichent
- **THEN** sa courbe reste à 0 € sur les dix Sprints

### Requirement: Indicateurs
L'écran de résultats SHALL comparer les deux manches dans un tableau : premier euro encaissé (« Sprint N » ou « Jamais »), argent investi avant le premier euro (points dépensés × 500 €, avec la mention « sans retour » s'il n'y a jamais eu de vente), nombre de fonctionnalités en ligne à la fin du développement, fonctionnalités en ligne peu utilisées (valeur réelle de 100 € ou moins, « N sur M »), et ventes cumulées au Sprint 10.

#### Scenario: Investi sans retour
- **GIVEN** une manche 1 dont l'appli n'est jamais sortie, avec 60 points dépensés
- **WHEN** les indicateurs s'affichent
- **THEN** la ligne « Investi avant le premier euro » affiche « 30 000 € (sans retour) »

### Requirement: Intuition contre réalité
L'écran de résultats SHALL lister toutes les fonctionnalités, triées par valeur réelle décroissante, avec l'intuition de Mme Lefèvre en étoiles et les ventes réelles par Sprint.

#### Scenario: Révélation
- **GIVEN** les résultats
- **WHEN** le joueur lit le tableau
- **THEN** la réservation de pain est en tête et les avis clients en dernier, avec 0 €

### Requirement: Questions de débrief
L'écran de résultats SHALL proposer des questions de débrief reliées au Scrum Guide 2020 : le moment du premier euro et ce qui l'a permis, pourquoi un Increment doit être utilisable, ce qu'ont appris les Sprint Reviews et comment elles ont changé l'ordre du Product Backlog, ce qui restait entre les mains de chacun à la coupure budgétaire, et l'écart entre l'intuition de Mme Lefèvre et l'avis de ses clients.

#### Scenario: Débrief en formation
- **GIVEN** un formateur qui projette les résultats
- **WHEN** il lance la discussion
- **THEN** les questions sont visibles sous les indicateurs, sans avoir à ouvrir d'autre écran
