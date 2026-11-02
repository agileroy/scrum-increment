# scenario Specification

## Purpose
Le scénario de la boulangerie de Madame Lefèvre : fonctionnalités de l'appli (coût, prérequis, intuition, valeur réelle), retours clients de la Sprint Review et imprévus communs aux deux manches.

## Requirements

### Requirement: Fonctionnalités de l'appli
Le scénario SHALL proposer neuf fonctionnalités, dans cet ordre initial, avec un coût en points, l'intuition de Madame Lefèvre (de 1 à 5 étoiles, visible), la valeur réelle (ventes par Sprint une fois en ligne, cachée au départ) et un prérequis éventuel :

| Fonctionnalité | Coût | Intuition | Valeur réelle | Prérequis |
|---|---|---|---|---|
| Vitrine en ligne (produits, prix et horaires) | 5 | 3 | 200 € | — |
| Réservation de pain | 8 | 4 | 1 000 € | Vitrine |
| Paiement en ligne | 8 | 5 | 200 € | Réservation |
| Livraison à domicile | 14 | 5 | 100 € | Réservation |
| Carte de fidélité | 7 | 4 | 300 € | Vitrine |
| Avis clients | 5 | 3 | 0 € | Vitrine |
| Créneau click & collect | 6 | 3 | 500 € | Réservation |
| Gâteaux sur mesure | 9 | 2 | 700 € | Vitrine |
| Alerte « fournée chaude » | 4 | 2 | 600 € | Vitrine |

Le total des coûts SHALL être de 66 points. Chaque prérequis SHALL désigner une fonctionnalité du scénario, sans dépendance circulaire.

#### Scenario: Intuition trompeuse
- **GIVEN** le scénario
- **WHEN** on compare l'intuition et la valeur réelle
- **THEN** les deux fonctionnalités notées 5 étoiles (paiement et livraison) rapportent 200 € ou moins par Sprint, et les deux fonctionnalités notées 2 étoiles (gâteaux et alerte) font partie des trois qui rapportent le plus, avec la réservation de pain

### Requirement: Retours clients
Le scénario SHALL contenir des retours clients, chacun avec un texte, un client (prénom et une précision, par exemple « Karim, infirmier »), la fonctionnalité qui doit être en ligne pour qu'il apparaisse et, s'il s'agit d'un indice, la fonctionnalité qui MUST NOT être en ligne pour qu'il apparaisse encore. Les retours SHALL être classés : l'ordre du scénario fixe la priorité d'affichage. Ils SHALL donner des indices sur la valeur réelle (par exemple, après la réservation : « J'habite à 300 mètres, je passe en rentrant » pour la livraison ; « Si l'appli pouvait me prévenir quand les croissants sortent du four… » pour l'alerte) et confirmer la valeur des fonctionnalités en ligne. Chaque fonctionnalité SHALL avoir au moins un retour qui la concerne une fois en ligne.

#### Scenario: Indice qui disparaît
- **GIVEN** le retour « Vous faites des gâteaux d'anniversaire ? », qui demande la vitrine en ligne et les gâteaux hors ligne
- **WHEN** les gâteaux sur mesure sont en ligne
- **THEN** ce retour n'apparaît plus

### Requirement: Imprévus
Le scénario SHALL contenir deux imprévus, annoncés dans la Sprint Review d'un Sprint et applicables à partir du suivant, identiques dans les deux manches :
- **Concurrent** (Review du Sprint 2) : « La Mie Dorée » lance sa commande en ligne ; à partir du Sprint 3, tant qu'aucune fonctionnalité n'est en ligne, la boulangerie perd des clients potentiels à chaque Sprint.
- **Coupure budgétaire** (Review du Sprint 3, seulement si l'option est activée) : la banque réduit le prêt et le développement s'arrête après le Sprint 5.

#### Scenario: Coupure désactivée
- **GIVEN** une partie sans coupure budgétaire
- **WHEN** la Sprint Review du Sprint 3 s'affiche
- **THEN** elle n'annonce aucune coupure et le développement dure 6 Sprints
