## MODIFIED Requirements

### Requirement: Courbes de toutes les équipes
Le graphique SHALL afficher une courbe de ventes cumulées par équipe sur 10 semaines, avec l'axe en semaines, la ligne « Fin du projet » et la zone d'exploitation du solo. Chaque équipe SHALL avoir sa couleur ; les équipes « projet » SHALL avoir un trait pointillé et des marqueurs carrés, les équipes « Scrum » un trait plein et des marqueurs ronds. La légende SHALL nommer chaque équipe et son approche.

#### Scenario: Lecture du graphique
- **GIVEN** 2 équipes, une de chaque approche
- **WHEN** le graphique s'affiche
- **THEN** la légende indique « Croissant · projet » et « Baguette · Scrum », avec deux traits et deux marqueurs différents

### Requirement: Indicateurs par équipe
Le tableau des indicateurs SHALL avoir une colonne par équipe, avec les mêmes lignes qu'en solo (premier euro, investi avant le premier euro, fonctionnalités en ligne, peu utilisées, demandes de Mme Lefèvre en ligne, ventes cumulées après 10 semaines). Comme en solo, le débrief SHALL se dérouler question par question, avec les indicateurs liés à chaque question révélés après la discussion ; les questions du mode collectif ajoutent la façon dont chaque équipe a décidé ensemble.

#### Scenario: Tableau à 4 équipes
- **GIVEN** 4 équipes
- **WHEN** le formateur affiche la vue d'ensemble
- **THEN** le tableau a 4 colonnes, tient sur l'écran projeté, et défile horizontalement dans son cadre sur un téléphone sans faire défiler la page
