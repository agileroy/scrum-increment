## REMOVED Requirements

### Requirement: Aucun service tiers
**Reason**: Le mode collectif a besoin du service temps réel Firebase, comme les jeux frères.
**Migration**: Remplacée par « Services tiers limités au mode collectif » : le jeu seul reste sans service tiers.

## ADDED Requirements

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

### Requirement: Règles de sécurité partagées
La base Firebase est partagée avec les jeux frères : `database.rules.json` SHALL contenir une branche `incrementGame` pour ce jeu, sans modifier les autres branches, et SHALL rester identique dans les 7 dépôts qui partagent la base. Les règles SHALL appliquer les contraintes de l'interface : seul le formateur règle la salle, lance les périodes et change les équipes ; un participant ne modifie que sa fiche et le jeu de sa propre équipe, sans pouvoir jouer une période ; codes de salle, prénoms et nombre d'équipes validés ; suppression au-delà de 24 heures.

#### Scenario: Participant malveillant
- **GIVEN** un participant de l'équipe Croissant
- **WHEN** il tente d'écrire dans le jeu de l'équipe Baguette, ou de faire avancer la période de son équipe
- **THEN** les règles refusent l'écriture
