## MODIFIED Requirements

### Requirement: Une seule livraison à la fin (manche 1)
Dans la manche 1, la capacité SHALL être de 12 points par Sprint sur 6 Sprints. Le plan SHALL contenir au moins une fonctionnalité, respecter les prérequis et tenir dans le budget : 72 points moins la recette. La recette et la mise en production SHALL coûter 8 points, plus 2 points par avenant. Le plan validé ne change ensuite que par les demandes de changement. La recette SHALL commencer une fois tout le plan terminé ; les fonctionnalités SHALL alors passer en ligne toutes en même temps, à la fin du Sprint qui termine la recette.

#### Scenario: Plan par défaut
- **GIVEN** le plan initial avec les neuf fonctionnalités
- **WHEN** le joueur veut le valider
- **THEN** la validation est refusée, car le plan fait 66 points pour un budget de 64

#### Scenario: Sortie au Sprint 6
- **GIVEN** un plan de 61 points (toutes les fonctionnalités sauf les avis clients), sans coupure budgétaire, toutes les demandes refusées
- **WHEN** les 6 Sprints sont joués
- **THEN** l'appli sort à la fin du Sprint 6 avec 8 fonctionnalités, et les premières ventes arrivent 2 semaines après la fin du projet

### Requirement: Après le développement
Après le dernier Sprint de développement, le moteur SHALL simuler des périodes d'exploitation de 2 semaines, sans construction, jusqu'à 20 semaines après le lancement : seules les ventes et, si rien n'est en ligne, les pertes de clients continuent. Le moteur SHALL fournir, pour la manche, la courbe des ventes cumulées sur les 10 périodes, la période de la première vente, les points dépensés avant elle, les fonctionnalités en ligne à la fin du développement, les demandes de changement mises en ligne et les ventes cumulées.

#### Scenario: Parcours de référence
- **GIVEN** les parcours suivants, où la manche 1 refuse toutes les demandes et où la manche 2 laisse les demandes en bas du Product Backlog
- **WHEN** chacun est joué jusqu'à 20 semaines
- **THEN** les ventes cumulées valent :
  - manche 1, plan sans les avis clients : 9 448 € sans coupure, 0 € avec coupure ;
  - manche 2, Product Backlog dans l'ordre initial, jamais réordonné : 15 300 € sans coupure, 13 300 € avec coupure ;
  - manche 2, ordre vitrine, réservation, alerte, gâteaux, click & collect, fidélité, paiement, livraison, avis : 25 300 € avec ou sans coupure

## ADDED Requirements

### Requirement: Demande de changement en manche 1
Dans la manche 1, la demande annoncée à la Sprint Review SHALL être tranchée avant le Sprint suivant. Refuser SHALL laisser le plan inchangé. Accepter SHALL ajouter la fonctionnalité à la fin du plan, ajouter 2 points d'avenant à la recette et retirer du plan les fonctionnalités choisies par le joueur. L'acceptation MUST NOT être possible si le plan obtenu dépasse le budget ou viole un prérequis.

#### Scenario: Accepter en retirant
- **GIVEN** le plan de 61 points, au moment de la demande « Plateaux pour les entreprises » (6 points), avec les gâteaux sur mesure pas encore commencés
- **WHEN** le joueur accepte en retirant les gâteaux sur mesure
- **THEN** le plan fait 58 points pour un budget de 62, la recette passe à 10 points, et les plateaux sont la dernière fonctionnalité du plan

#### Scenario: Accepter sans faire de place
- **GIVEN** le plan de 61 points, au moment de la demande « Version anglaise » (5 points)
- **WHEN** le joueur veut accepter sans rien retirer
- **THEN** l'acceptation est refusée, car le plan ferait 66 points pour un budget de 62

### Requirement: Retraits possibles
Seules les fonctionnalités du plan qui n'ont reçu aucun point SHALL pouvoir être retirées lors d'une acceptation. Une fonctionnalité commencée ou terminée MUST NOT être retirée.

#### Scenario: Fonctionnalité commencée
- **GIVEN** la carte de fidélité commencée
- **WHEN** le joueur examine une demande de changement
- **THEN** la carte de fidélité ne peut pas être retirée

### Requirement: Demande de changement en manche 2
Dans la manche 2, la demande annoncée à la Sprint Review SHALL s'ajouter en bas du Product Backlog, sans avenant ni décision à prendre. Elle se déplace, se construit et révèle sa valeur réelle comme les autres fonctionnalités.

#### Scenario: Demande dans le Product Backlog
- **GIVEN** la manche 2 après la Sprint Review du Sprint 1
- **WHEN** le joueur prépare le Sprint 2
- **THEN** la version anglaise est en dernière position du Product Backlog et peut être remontée
