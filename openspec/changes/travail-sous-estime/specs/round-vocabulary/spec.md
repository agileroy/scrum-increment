## MODIFIED Requirements

### Requirement: Météo du projet sans préavis
Chaque compte rendu de COPIL de la manche 1 SHALL donner une météo du projet : « Ensoleillé » tant que le reste à faire (lots, recette, avenants et travail découvert compris) tient dans la capacité restante jusqu'à la fin prévue du projet, « Orageux » sinon, et « Livré » une fois l'appli sortie. Comme la coupure n'est jamais annoncée, la météo MUST NOT en tenir compte avant qu'elle tombe.

#### Scenario: Soleil jusqu'à la coupure
- **GIVEN** la manche 1 avec le cahier des charges resserré de 39 points, demandes refusées
- **WHEN** les COPIL 1 à 5 ont lieu
- **THEN** la météo est « Ensoleillé » aux COPIL 1 à 4, puis « Orageux » au COPIL 5, quand la recette révèle ses anomalies et que la coupure tombe

#### Scenario: Livré avant la coupure
- **GIVEN** la manche 1 avec un tout petit cahier des charges de 26 points (vitrine, réservation, alerte, gâteaux), demandes refusées
- **WHEN** les COPIL 1 à 5 ont lieu
- **THEN** la météo est « Ensoleillé » aux COPIL 1 à 3, puis « Livré » aux COPIL 4 et 5

#### Scenario: Cahier des charges sans marge
- **GIVEN** la manche 1 avec le cahier des charges de 61 points, demandes refusées
- **WHEN** le travail découvert sur la vitrine et la réservation est annoncé au COPIL 1
- **THEN** la météo passe à « Orageux » dès le COPIL 1
