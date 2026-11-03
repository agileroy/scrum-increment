## MODIFIED Requirements

### Requirement: Équipes
Le formateur SHALL régler le nombre d'équipes, de 2 à 6 (2 par défaut), tant que la partie n'est pas lancée. Chaque équipe a un nom de viennoiserie (Croissant, Baguette, Brioche, Éclair, Chouquette, Fougasse). Un participant qui arrive SHALL être placé dans l'équipe la moins nombreuse (la première en cas d'égalité) ; le formateur SHALL pouvoir le changer d'équipe à tout moment. Les équipes impaires (1, 3, 5) jouent « projet », les équipes paires (2, 4, 6) jouent « Scrum ». Chaque participant SHALL connaître la démarche de sa propre équipe dès l'attente ; l'écran projeté du formateur MUST NOT afficher la répartition avant la révélation.

#### Scenario: Répartition automatique
- **GIVEN** une salle à 2 équipes, avec 2 participants dans Croissant et 1 dans Baguette
- **WHEN** un participant rejoint
- **THEN** il est placé dans l'équipe Baguette

#### Scenario: Réduire le nombre d'équipes
- **GIVEN** une salle à 3 équipes, avec des participants dans Brioche
- **WHEN** le formateur passe à 2 équipes
- **THEN** les participants de Brioche sont replacés dans les équipes restantes, toujours dans la moins nombreuse
