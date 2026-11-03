## MODIFIED Requirements

### Requirement: Indicateurs par équipe
Le tableau des indicateurs SHALL avoir une colonne par équipe, avec les mêmes lignes qu'en solo (premier euro, investi avant le premier euro, fonctionnalités en ligne, peu utilisées, demandes de Mme Lefèvre en ligne, ventes cumulées après 20 semaines). Comme en solo, les questions de débrief SHALL précéder la courbe, et le tableau SHALL être dans le panneau « Les indicateurs », plié par défaut, à côté d'« Intuition contre réalité ».

#### Scenario: Tableau à 4 équipes
- **GIVEN** 4 équipes
- **WHEN** le formateur déplie les indicateurs
- **THEN** le tableau a 4 colonnes, tient sur l'écran projeté, et défile horizontalement dans son cadre sur un téléphone sans faire défiler la page

### Requirement: Décisions des équipes
Après la révélation, les résultats collectifs SHALL afficher, pour chaque équipe, le fil de ses décisions période par période (le même que les coulisses du formateur), après les indicateurs.

#### Scenario: Débrief des demandes
- **GIVEN** une partie révélée à 2 équipes
- **WHEN** les résultats s'affichent
- **THEN** on lit les décisions de Croissant sur chaque demande de la boulangère et la place donnée par Baguette à chaque demande dans son Product Backlog
