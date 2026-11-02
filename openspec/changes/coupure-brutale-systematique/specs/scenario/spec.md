## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Imprévus
**Reason**: La coupure budgétaire n'est plus facultative ni annoncée deux périodes à l'avance ; l'exigence est remplacée par « Concurrent » et « Coupure budgétaire sans préavis ».
**Migration**: Voir les deux exigences ajoutées ci-dessous ; le concurrent est inchangé.

## ADDED Requirements

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
