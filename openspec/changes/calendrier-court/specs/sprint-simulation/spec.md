## MODIFIED Requirements

### Requirement: Après le développement
Après le dernier Sprint de développement, le moteur SHALL simuler des périodes d'exploitation d'une semaine, sans construction, jusqu'à 10 semaines après le lancement : seules les ventes et, si rien n'est en ligne, les pertes de clients continuent. Le moteur SHALL fournir, pour la manche, la courbe des ventes cumulées sur les 10 périodes, la période de la première vente, les points dépensés avant elle, les fonctionnalités en ligne à la fin du développement, les demandes de changement mises en ligne et les ventes cumulées.

#### Scenario: Parcours de référence
- **GIVEN** les parcours suivants, où la manche 1 refuse toutes les demandes et où la manche 2 laisse les demandes en bas du Product Backlog
- **WHEN** chacun est joué jusqu'à 10 semaines
- **THEN** les ventes cumulées valent :
  - manche 1, cahier des charges de 61 points (tout sauf les avis clients) : 0 € ;
  - manche 1, cahier des charges resserré de 39 points (vitrine, réservation, alerte, gâteaux, click & collect, fidélité) : 0 €, le travail découvert empêchant la sortie ;
  - manche 1, tout petit cahier des charges de 26 points (vitrine, réservation, alerte, gâteaux) : 12 150 € ;
  - manche 2, Product Backlog dans l'ordre initial, jamais réordonné : 13 200 € ;
  - manche 2, ordre vitrine, réservation, alerte, gâteaux, click & collect, fidélité, paiement, livraison, avis : 22 800 €

### Requirement: Coupure sans préavis
À la fin du Sprint 5, dans les deux manches, le moteur SHALL arrêter le développement, sans aucun signe dans les comptes rendus des Sprints 1 à 4. Le plan et l'avancement SHALL rester en l'état : les fonctionnalités terminées mais pas encore en ligne de la manche 1 MUST NOT être mises en ligne.

#### Scenario: Appli jamais sortie
- **GIVEN** la manche 1 avec un plan de 61 points
- **WHEN** le Sprint 5 est joué
- **THEN** le développement s'arrête, aucune fonctionnalité n'est en ligne et les ventes restent à 0 € jusqu'à 10 semaines

#### Scenario: Comptes rendus muets
- **GIVEN** une manche quelconque
- **WHEN** les Sprints 1 à 4 sont joués
- **THEN** aucun compte rendu ne contient l'imprévu de coupure, et le développement prévu reste de 6 Sprints jusqu'au Sprint 5
