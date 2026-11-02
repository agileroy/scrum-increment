## ADDED Requirements

### Requirement: Glisser-déposer
Dans le cahier des charges avant validation et dans le Product Backlog, chaque élément déplaçable SHALL avoir une poignée de saisie. Glisser la poignée (souris, stylet ou doigt) SHALL faire suivre l'élément au pointeur, afficher une ligne d'insertion à l'endroit où il tomberait, et le relâcher SHALL placer l'élément à ce rang, avec les mêmes règles que les flèches. Relâcher hors de la liste, ou appuyer sur Échap pendant le geste, SHALL annuler le déplacement. Un élément non déplaçable MUST NOT avoir de poignée. Les flèches SHALL rester disponibles.

#### Scenario: Remonter de plusieurs rangs
- **GIVEN** la manche 2, Product Backlog dans l'ordre initial
- **WHEN** le joueur glisse l'alerte « fournée chaude » (rang 9) et la relâche entre la réservation de pain et le paiement en ligne
- **THEN** l'alerte passe au rang 3 et les éléments suivants descendent d'un rang

#### Scenario: Badges mis à jour
- **GIVEN** la manche 2, Product Backlog dans l'ordre initial
- **WHEN** le joueur glisse le paiement en ligne tout en haut
- **THEN** le paiement passe au rang 1 et s'affiche en rouge avec « Impossible sans « Réservation de pain » »

#### Scenario: Au doigt
- **GIVEN** un téléphone, le Product Backlog affiché
- **WHEN** le joueur fait glisser une poignée du doigt
- **THEN** la page ne défile pas pendant le geste et l'élément se place là où il est relâché

#### Scenario: Geste annulé
- **GIVEN** un élément en cours de glissement
- **WHEN** le joueur le relâche hors de la liste
- **THEN** l'ordre ne change pas

#### Scenario: Élément terminé
- **GIVEN** la manche 2, vitrine en ligne
- **WHEN** le Product Backlog s'affiche
- **THEN** la vitrine n'a pas de poignée, mais les autres éléments peuvent être glissés au-dessus ou en dessous d'elle
