## MODIFIED Requirements

### Requirement: Indicateurs par équipe
Le tableau des indicateurs SHALL avoir une colonne par équipe, avec les mêmes lignes qu'en solo (premier euro, investi avant le premier euro, fonctionnalités en ligne, peu utilisées, demandes de Mme Lefèvre en ligne, ventes cumulées après 20 semaines). Comme en solo, le débrief SHALL se dérouler question par question, avec les indicateurs liés à chaque question révélés après la discussion ; les questions du mode collectif ajoutent la façon dont chaque équipe a décidé ensemble.

#### Scenario: Tableau à 4 équipes
- **GIVEN** 4 équipes
- **WHEN** le formateur affiche la vue d'ensemble
- **THEN** le tableau a 4 colonnes, tient sur l'écran projeté, et défile horizontalement dans son cadre sur un téléphone sans faire défiler la page

### Requirement: Décisions des équipes
Après la révélation, les résultats collectifs SHALL afficher, pour chaque équipe, le fil de ses décisions période par période (le même que les coulisses du formateur), révélé avec les questions qui portent sur les décisions (Sprint Reviews, demandes de Mme Lefèvre, décider ensemble) et dans la vue d'ensemble.

#### Scenario: Débrief des demandes
- **GIVEN** une partie révélée à 2 équipes
- **WHEN** le formateur révèle les indicateurs de la question sur les demandes de Mme Lefèvre
- **THEN** on lit les décisions de Croissant sur chaque demande de la boulangère et la place donnée par Baguette à chaque demande dans son Product Backlog
