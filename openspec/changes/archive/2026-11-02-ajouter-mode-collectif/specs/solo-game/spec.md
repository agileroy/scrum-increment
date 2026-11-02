## MODIFIED Requirements

### Requirement: Accueil sans option
L'accueil SHALL présenter l'histoire de Madame Lefèvre en quelques lignes et proposer trois entrées : « Animer une partie » (formateur), « Rejoindre une partie » (code de salle et prénom) et « Jouer seul », qui annonce deux manches sur le même projet (d'abord en chef de projet, puis en Product Owner) avec une comparaison à la fin. L'accueil MUST NOT proposer d'option de coupure, ni dévoiler les valeurs réelles ou les imprévus.

#### Scenario: Rien à régler
- **GIVEN** l'accueil
- **WHEN** il s'affiche
- **THEN** il ne contient ni case à cocher, ni mot sur la banque ou une coupure, et « Jouer seul » lance directement le cahier des charges de la manche 1
