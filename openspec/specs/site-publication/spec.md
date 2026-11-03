# site-publication Specification

## Purpose
Publication sur GitHub Pages, interface (langue, appareils, thèmes) et absence de tout service tiers.

## Requirements

### Requirement: Publication automatique
Le site SHALL être publié sur GitHub Pages, à l'adresse https://agileroy.github.io/scrum-increment/, à chaque push sur `main`. Les tests automatiques SHALL être lancés avant la publication, et la publication MUST NOT avoir lieu si un test échoue. Les tests SHALL aussi être lancés sur chaque pull request, sans publication. Les fichiers publiés SHALL être versionnés (paramètre de version dans leurs adresses) pour éviter les styles et scripts périmés en cache après une mise à jour.

#### Scenario: Test en échec
- **GIVEN** un push sur `main` qui casse un test
- **WHEN** le workflow GitHub Actions s'exécute
- **THEN** le job de tests échoue et le site publié reste la version précédente

### Requirement: Interface et appareils
L'interface SHALL être en français. Elle SHALL être lisible projetée (écran de 1280 px et plus) et utilisable sur téléphone (largeur de 360 px et plus) sans défilement horizontal. Elle SHALL fonctionner en thème clair et en thème sombre, avec un bouton de bascule mémorisé dans le navigateur ; sans choix mémorisé, le thème suit le réglage du système. Les boutons SHALL être utilisables au clavier et au doigt (au moins 44 × 44 px pour monter et descendre une fonctionnalité sur téléphone).

#### Scenario: Joueur sur téléphone
- **GIVEN** un téléphone de 360 px de large
- **WHEN** le joueur consulte le Product Backlog, une fenêtre de fin de Sprint ou les résultats
- **THEN** tout tient dans la largeur de l'écran, sans défilement horizontal

### Requirement: Services tiers limités au mode collectif
Le site MUST NOT charger de police web, de CDN, de traceur ni de publicité. Le SDK Firebase et la base temps réel SHALL être les seuls services tiers, et seulement pour créer ou rejoindre une salle (y compris par le lien d'un QR code) : l'accueil et le jeu seul MUST NOT les charger. Si le service est injoignable, l'accueil SHALL l'indiquer et garder le jeu seul disponible.

#### Scenario: Jeu seul
- **GIVEN** la page d'accueil publiée
- **WHEN** le joueur joue seul une partie complète
- **THEN** toutes les requêtes visent https://agileroy.github.io/

#### Scenario: Service injoignable
- **GIVEN** un réseau qui bloque Firebase
- **WHEN** le formateur clique sur « Animer une partie »
- **THEN** un message indique que le service temps réel est injoignable et que le jeu seul reste disponible

### Requirement: Connexion au service temps réel
En partie collective, le site SHALL n'utiliser que des connexions HTTPS (port 443) vers Firebase, avec une connexion anonyme. Si la connexion est perdue, l'écran SHALL afficher « Connexion perdue, reconnexion… » et reprendre automatiquement à son retour, sans recharger la page.

#### Scenario: Coupure réseau
- **GIVEN** un participant dans une partie
- **WHEN** sa connexion est coupée puis rétablie
- **THEN** le message de connexion perdue s'affiche pendant la coupure, puis la partie se met à jour

### Requirement: Mode démo
Avec `?demo` dans l'adresse, le mode collectif SHALL fonctionner sans Firebase : les onglets d'un même navigateur partagent une même partie, ce qui permet d'essayer le jeu seul avec un onglet formateur et plusieurs onglets participants.

#### Scenario: Essai à plusieurs onglets
- **GIVEN** un onglet formateur et deux onglets participants ouverts avec `?demo`
- **WHEN** le formateur lance la partie
- **THEN** les trois onglets suivent la même partie

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
