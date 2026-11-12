## MODIFIED Requirements

### Requirement: Services tiers limités au mode collectif
Le site MUST NOT charger de police, de script ni de feuille de style servis par un tiers (CDN), ni de traceur, ni de publicité ; ses polices SHALL être hébergées avec le site. Le SDK Firebase et la base temps réel SHALL être les seuls services tiers, et seulement pour créer ou rejoindre une salle (y compris par le lien d'un QR code) : l'accueil et le jeu seul MUST NOT les charger. Si le service est injoignable, l'accueil SHALL l'indiquer et garder le jeu seul disponible.

#### Scenario: Jeu seul
- **GIVEN** la page d'accueil publiée
- **WHEN** le joueur joue seul une partie complète
- **THEN** toutes les requêtes visent https://agileroy.github.io/, polices comprises

#### Scenario: Service injoignable
- **GIVEN** un réseau qui bloque Firebase
- **WHEN** le formateur clique sur « Animer une partie »
- **THEN** un message indique que le service temps réel est injoignable et que le jeu seul reste disponible

## ADDED Requirements

### Requirement: Identité visuelle
L'interface SHALL avoir l'identité d'une boulangerie de quartier : un en-tête en devanture (enseigne et store banne rayé à festons) sur tous les écrans, un thème clair « comptoir » et un thème sombre « ardoise ». Les titres et le texte SHALL utiliser une même famille de caractères ; une police manuscrite SHALL être réservée aux répliques de Mme Lefèvre. Les éléments du cahier des charges et du Product Backlog SHALL se présenter comme des tickets dont le talon porte le rang. Les couleurs d'état SHALL garder leur sens dans les deux thèmes (vert : en ligne ; rouge : alerte ; doré : en cours), avec un contraste d'au moins 4,5:1 entre le texte et son fond. Les animations MUST respecter le réglage « moins d'animations » du système. L'habillage MUST NOT changer les règles, les textes de jeu ni les parcours.

#### Scenario: Devanture
- **GIVEN** n'importe quel écran du jeu
- **WHEN** il s'affiche
- **THEN** l'en-tête montre l'enseigne « Fournée » et, dessous, le store rayé à festons

#### Scenario: Voix de Mme Lefèvre
- **GIVEN** l'écran du cahier des charges
- **WHEN** la réplique de Mme Lefèvre s'affiche
- **THEN** elle est en écriture manuscrite, et aucun autre texte de l'écran ne l'est

#### Scenario: Police indisponible
- **GIVEN** un navigateur qui ne charge pas les polices du site
- **WHEN** un écran s'affiche
- **THEN** le texte reste lisible dans une police du système, sans décalage bloquant
