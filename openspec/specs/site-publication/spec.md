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

### Requirement: Aucun service tiers
Le site MUST NOT charger de ressource externe (police web, CDN, traceur, publicité) : polices système, scripts et styles servis par le site lui-même. Il SHALL fonctionner sans compte et sans connexion à un service temps réel.

#### Scenario: Chargement de la page
- **GIVEN** la page d'accueil publiée
- **WHEN** elle se charge
- **THEN** toutes les requêtes visent https://agileroy.github.io/
