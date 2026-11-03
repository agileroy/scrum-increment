## MODIFIED Requirements

### Requirement: Travail sous-estimé
Le scénario SHALL prévoir quatre découvertes de travail sous-estimé, fixes : « Paiement en ligne » coûte 6 points de plus que prévu (sécurisation et certification bancaires), « Gâteaux sur mesure » 6 points de plus (photos, allergènes, délais de fabrication), « Créneau click & collect » 4 points de plus (nombre de commandes par créneau), et en manche 1 seulement, la recette et la mise en production finales 4 points de plus (anomalies découvertes à l'intégration). La vitrine et la réservation MUST NOT être concernées. Chaque découverte SHALL avoir un texte dans le vocabulaire de chaque manche concernée.

#### Scenario: Mêmes découvertes pour les deux approches
- **GIVEN** le scénario
- **WHEN** on liste les découvertes
- **THEN** le paiement, les gâteaux et le click & collect sont concernés dans les deux manches, et la recette seulement en manche 1

## ADDED Requirements

### Requirement: Pictogrammes
Chaque fonctionnalité et chaque demande de changement SHALL avoir son émoji, distinct des autres (🏪 vitrine, 🥖 réservation, 💳 paiement, 🛵 livraison, 🎁 fidélité, 💬 avis, ⏰ click & collect, 🎂 gâteaux, 🥐 alerte, 🌍 version anglaise, 📣 promotions, 🥪 plateaux), et chaque imprévu le sien (📰 concurrent, 🏦 coupure). Les pictogrammes sont décoratifs : ils MUST NOT remplacer les noms, ni être lus par les lecteurs d'écran.

#### Scenario: Liste illustrée
- **GIVEN** le cahier des charges ou le Product Backlog
- **WHEN** la liste s'affiche
- **THEN** chaque élément commence par son émoji, suivi de son nom
