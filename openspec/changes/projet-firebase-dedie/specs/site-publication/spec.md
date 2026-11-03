## REMOVED Requirements

### Requirement: Règles de sécurité partagées
**Reason**: Fournée a désormais son propre projet Firebase ; la base n'est plus partagée avec les jeux frères.
**Migration**: les contraintes de jeu sont reprises telles quelles dans « Règles de sécurité du jeu » ; la publication manuelle est remplacée par « Déploiement automatique des règles ».

## ADDED Requirements

### Requirement: Projet Firebase dédié
Le mode collectif SHALL utiliser un projet Firebase propre à Fournée, qu'aucun autre outil n'utilise. `database.rules.json` SHALL ne contenir que la branche `incrementGame`, et tout le reste de la base SHALL être fermé en lecture comme en écriture.

#### Scenario: Fichier commun recopié par erreur
- **GIVEN** un `database.rules.json` qui contient aussi la branche d'un autre outil
- **WHEN** les tests s'exécutent
- **THEN** un test échoue et ni les règles ni le site ne sont publiés

### Requirement: Règles de sécurité du jeu
Les règles SHALL appliquer les contraintes de l'interface : seul le formateur règle la salle, lance les périodes et change les équipes ; un participant ne modifie que sa fiche et le jeu de sa propre équipe, sans pouvoir jouer une période ; codes de salle, prénoms et nombre d'équipes validés ; suppression au-delà de 24 heures.

#### Scenario: Participant malveillant
- **GIVEN** un participant de l'équipe Croissant
- **WHEN** il tente d'écrire dans le jeu de l'équipe Baguette, ou de faire avancer la période de son équipe
- **THEN** les règles refusent l'écriture

### Requirement: Déploiement automatique des règles
À chaque push sur `main`, après la réussite des tests, GitHub Actions SHALL publier `database.rules.json` dans le projet Firebase du jeu, avec un compte de service gardé en secret (`FIREBASE_SERVICE_ACCOUNT`). Si un test échoue, les règles MUST NOT être publiées. Sans secret, le déploiement des règles SHALL être sauté avec un avertissement, sans empêcher la publication du site.

#### Scenario: Règles modifiées
- **GIVEN** un push sur `main` qui modifie `database.rules.json` et dont les tests réussissent
- **WHEN** le workflow s'exécute
- **THEN** les nouvelles règles sont actives dans le projet du jeu, sans action dans la console

#### Scenario: Secret absent
- **GIVEN** un dépôt sans secret `FIREBASE_SERVICE_ACCOUNT`
- **WHEN** le workflow s'exécute sur `main`
- **THEN** le job des règles signale qu'il est sauté et le site est publié quand même
