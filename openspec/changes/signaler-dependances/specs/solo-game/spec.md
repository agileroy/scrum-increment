## ADDED Requirements

### Requirement: Lots impossibles
Dans l'écran du cahier des charges, un lot retenu dont un prérequis, direct ou en chaîne, n'est pas retenu SHALL s'afficher en rouge avec « Impossible sans « X » », X étant le premier lot manquant de la chaîne. Les lots décochés SHALL rester grisés, sans rouge. Le message et la validation SHALL continuer de refuser un cahier des charges qui contient un lot impossible.

#### Scenario: Décocher la réservation
- **GIVEN** le cahier des charges initial
- **WHEN** le joueur décoche la réservation de pain
- **THEN** le paiement en ligne, la livraison à domicile et le créneau click & collect s'affichent en rouge avec « Impossible sans « Réservation de pain » »

#### Scenario: Décocher la vitrine
- **GIVEN** le cahier des charges initial
- **WHEN** le joueur décoche la vitrine en ligne
- **THEN** les huit autres lots s'affichent en rouge avec « Impossible sans « Vitrine en ligne » », y compris ceux qui dépendent de la réservation

### Requirement: Éléments mal placés
Dans le Product Backlog (manche 2) et dans l'ordre du cahier des charges (manche 1, avant validation), un élément non terminé placé au-dessus d'un prérequis non terminé SHALL s'afficher en rouge avec « Placé avant « X » » et l'explication que l'équipe le sautera tant que X n'est pas terminé. Un élément placé sous son prérequis non terminé SHALL afficher un badge neutre « Après « X » ». Une fois le prérequis terminé, l'élément MUST NOT afficher de badge de dépendance.

#### Scenario: Paiement remonté trop haut
- **GIVEN** la manche 2, Product Backlog dans l'ordre initial
- **WHEN** le joueur remonte le paiement en ligne au-dessus de la réservation de pain
- **THEN** le paiement s'affiche en rouge avec « Placé avant « Réservation de pain » »

#### Scenario: Ordre initial
- **GIVEN** la manche 2, avant le Sprint 1
- **WHEN** le Product Backlog s'affiche dans l'ordre initial
- **THEN** aucun élément n'est en rouge, et le paiement affiche le badge neutre « Après « Réservation de pain » »

#### Scenario: Prérequis terminé
- **GIVEN** la manche 2, réservation de pain en ligne
- **WHEN** le Product Backlog s'affiche
- **THEN** le paiement, la livraison et le click & collect n'affichent plus de badge de dépendance

### Requirement: Retraits qui rendent des lots impossibles
Dans la fenêtre de demande de changement (manche 1), cocher un lot à retirer SHALL afficher en rouge la liste des lots retenus qui en dépendent (« Deviendraient impossibles : … »), et ceux de ces lots qui figurent dans la liste des retraits SHALL y être marqués en rouge avec « Impossible sans « X » ». Le message SHALL nommer le premier lot devenu impossible. « Accepter (avenant) » SHALL rester inactif tant qu'un lot est impossible.

#### Scenario: Retirer la réservation
- **GIVEN** une demande de changement, avec la réservation de pain retenue et pas encore commencée
- **WHEN** le joueur coche la réservation de pain dans les retraits
- **THEN** la fenêtre affiche en rouge « Deviendraient impossibles : Paiement en ligne, Livraison à domicile, Créneau click & collect », et « Accepter (avenant) » reste inactif
