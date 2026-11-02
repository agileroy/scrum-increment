# team-results Specification

## Purpose
Les résultats d'une partie collective : courbes de toutes les équipes, approches dévoilées, indicateurs par équipe et débrief.

## Requirements

### Requirement: Approches dévoilées
Les résultats collectifs SHALL commencer par révéler la répartition : pour chaque équipe, son nom et son approche (« projet, une livraison à la fin » ou « Scrum, un incrément à chaque Sprint »).

#### Scenario: Révélation
- **GIVEN** 4 équipes
- **WHEN** les résultats s'affichent
- **THEN** Croissant et Brioche sont présentées comme « projet », Baguette et Éclair comme « Scrum »

### Requirement: Courbes de toutes les équipes
Le graphique SHALL afficher une courbe de ventes cumulées par équipe sur 20 semaines, avec l'axe en semaines, la ligne « Fin du projet » et la zone d'exploitation du solo. Chaque équipe SHALL avoir sa couleur ; les équipes « projet » SHALL avoir un trait pointillé et des marqueurs carrés, les équipes « Scrum » un trait plein et des marqueurs ronds. La légende SHALL nommer chaque équipe et son approche.

#### Scenario: Lecture du graphique
- **GIVEN** 2 équipes, une de chaque approche
- **WHEN** le graphique s'affiche
- **THEN** la légende indique « Croissant · projet » et « Baguette · Scrum », avec deux traits et deux marqueurs différents

### Requirement: Indicateurs par équipe
Le tableau des indicateurs SHALL avoir une colonne par équipe, avec les mêmes lignes qu'en solo (premier euro, investi avant le premier euro, fonctionnalités en ligne, peu utilisées, demandes de Mme Lefèvre en ligne, ventes cumulées après 20 semaines). « Intuition contre réalité » et les questions de débrief SHALL suivre, comme en solo.

#### Scenario: Tableau à 4 équipes
- **GIVEN** 4 équipes
- **WHEN** les indicateurs s'affichent
- **THEN** le tableau a 4 colonnes, tient sur l'écran projeté, et défile horizontalement dans son cadre sur un téléphone sans faire défiler la page
