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

### Requirement: Calendrier
Une période de développement SHALL durer 2 semaines : un Sprint en manche 2, l'intervalle entre deux COPIL en manche 1. Le budget prévoit 6 périodes de développement, mais la coupure budgétaire arrête toujours le développement après la cinquième. La partie SHALL couvrir 20 semaines à partir du lancement du projet, soit 10 périodes de 2 semaines : les périodes de développement, puis des semaines d'exploitation sans développement. Les textes d'imprévus SHALL exister dans le vocabulaire de chaque manche.

#### Scenario: Coupure budgétaire
- **GIVEN** une partie
- **WHEN** le développement s'arrête après la cinquième période
- **THEN** la partie continue 10 semaines d'exploitation, jusqu'à 20 semaines après le lancement

#### Scenario: Annonce de la coupure en manche 1
- **GIVEN** la manche 1
- **WHEN** la coupure tombe, au COPIL 5
- **THEN** le texte dit que la banque coupe le prêt sans préavis et que le projet s'arrête maintenant, en l'état, sans parler de Sprint

### Requirement: Demandes de changement
Le scénario SHALL contenir trois demandes de Madame Lefèvre, chacune une nouvelle fonctionnalité avec un texte de Mme Lefèvre, un coût, un prérequis, l'intuition de Mme Lefèvre et une valeur réelle cachée, annoncée dans la Sprint Review d'un Sprint :

| Après le Sprint | Fonctionnalité | Coût | Intuition | Valeur réelle | Prérequis |
|---|---|---|---|---|---|
| 1 | Version anglaise | 5 | 4 | 0 € | Vitrine |
| 2 | Promotions flash | 6 | 4 | 100 € | Vitrine |
| 3 | Plateaux pour les entreprises | 6 | 2 | 400 € | Vitrine |

Les demandes MUST NOT faire partie du plan ni du Product Backlog avant leur annonce.

#### Scenario: Opinions trompeuses
- **GIVEN** les trois demandes
- **WHEN** on compare l'intuition et la valeur réelle
- **THEN** les deux demandes notées 4 étoiles rapportent 100 € ou moins par Sprint, et la demande notée 2 étoiles rapporte le plus

### Requirement: Retours clients des demandes
Le scénario SHALL contenir au moins un retour client pour chaque demande de changement, affiché une fois la fonctionnalité demandée en ligne, selon les mêmes règles que les autres retours.

#### Scenario: Version anglaise en ligne
- **GIVEN** la version anglaise en ligne dans la manche 2
- **WHEN** la Sprint Review suivante s'affiche
- **THEN** un retour client indique que personne ne l'utilise dans le quartier

### Requirement: Concurrent
Le scénario SHALL contenir l'imprévu du concurrent, identique dans les deux manches : à la fin de la deuxième période, « La Mie Dorée » lance sa commande en ligne ; à partir de la troisième période, tant qu'aucune fonctionnalité n'est en ligne, la boulangerie perd des clients potentiels toutes les deux semaines.

#### Scenario: Annonce du concurrent
- **GIVEN** une partie
- **WHEN** la deuxième période se termine
- **THEN** le bilan (COPIL 2 ou Sprint Review du Sprint 2) annonce que La Mie Dorée lance sa commande en ligne

### Requirement: Coupure budgétaire sans préavis
Le scénario SHALL contenir la coupure budgétaire, dans toutes les parties et dans les deux manches : à la fin de la cinquième période, la banque coupe le prêt et le développement s'arrête immédiatement, en l'état. L'accueil et les bilans des périodes 1 à 4 MUST NOT l'annoncer ni la laisser deviner.

#### Scenario: Aucun préavis
- **GIVEN** une partie
- **WHEN** les quatre premières périodes se terminent
- **THEN** aucun bilan ne parle de la banque ni d'une coupure

#### Scenario: La coupure tombe
- **GIVEN** une partie
- **WHEN** la cinquième période se termine
- **THEN** le bilan annonce que la banque coupe le prêt sans préavis et que tout s'arrête maintenant, en l'état

### Requirement: Travail sous-estimé
Le scénario SHALL prévoir trois découvertes de travail sous-estimé, fixes : « Vitrine en ligne » coûte 4 points de plus que prévu, « Réservation de pain » 6 points de plus, et en manche 1 seulement, la recette et la mise en production finales 4 points de plus (anomalies découvertes à l'intégration). Chaque découverte SHALL avoir un texte dans le vocabulaire de chaque manche concernée.

#### Scenario: Mêmes découvertes pour les deux approches
- **GIVEN** le scénario
- **WHEN** on liste les découvertes
- **THEN** la vitrine et la réservation sont concernées dans les deux manches, et la recette seulement en manche 1
