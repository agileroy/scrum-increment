## ADDED Requirements

### Requirement: Glisser-déposer
Dans le cahier des charges avant validation et dans le Product Backlog, chaque élément déplaçable SHALL pouvoir être saisi sur toute sa carte, hors boutons et cases à cocher : à la souris ou au stylet dès qu'on le fait glisser, au doigt après un appui long, pour qu'un glissé direct fasse toujours défiler la page. Le geste SHALL faire suivre l'élément au pointeur, afficher une ligne d'insertion à l'endroit où il tomberait, et le relâcher SHALL placer l'élément à ce rang, avec les mêmes règles que les flèches. Relâcher hors de la liste, ou appuyer sur Échap pendant le geste, SHALL annuler le déplacement. Un élément non déplaçable MUST NOT pouvoir être saisi. Les flèches SHALL rester disponibles.

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
- **WHEN** le joueur appuie longuement sur une carte puis la fait glisser
- **THEN** la page ne défile pas pendant le geste et l'élément se place là où il est relâché

#### Scenario: Défilement au doigt
- **GIVEN** un téléphone, le Product Backlog affiché
- **WHEN** le joueur fait glisser une carte du doigt sans appui long
- **THEN** la page défile et l'ordre ne change pas

#### Scenario: Geste annulé
- **GIVEN** un élément en cours de glissement
- **WHEN** le joueur le relâche hors de la liste
- **THEN** l'ordre ne change pas

#### Scenario: Élément terminé
- **GIVEN** la manche 2, vitrine en ligne
- **WHEN** le Product Backlog s'affiche
- **THEN** la vitrine ne peut pas être saisie, mais les autres éléments peuvent être glissés au-dessus ou en dessous d'elle
