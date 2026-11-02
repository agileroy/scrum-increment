## Why

En formation, l'incrément reste une notion abstraite : on récite qu'il doit être « utilisable » et « Done » à chaque Sprint, sans ressentir ce que ça change. Les jeux frères (« Rôles et responsabilités », « Les événements Scrum ») révisent des connaissances avec des cartes à placer ; il manque un atelier où l'on **vit** la différence. « Fournée » la fait vivre par une simulation : la même boulangerie, le même budget, les mêmes imprévus, et deux façons de livrer qui produisent deux courbes de valeur très différentes. Le jeu montre aussi que livrer souvent ne suffit pas : il faut écouter les retours de la Sprint Review et réordonner le Product Backlog.

Cette première version est jouable seul, dans le navigateur. Elle sert à valider les sensations et l'équilibre des chiffres avant le mode collectif en temps réel.

## What Changes

- **Scénario de la boulangerie** : Madame Lefèvre veut une appli de commande en ligne, avec un budget de 6 Sprints. Neuf fonctionnalités (vitrine, réservation de pain, paiement, livraison, fidélité, avis, click & collect, gâteaux sur mesure, alerte « fournée chaude »), chacune avec un coût, des prérequis, l'**intuition** de Mme Lefèvre (étoiles visibles) et sa **valeur réelle** (ventes par Sprint, cachée). L'intuition et la réalité divergent volontairement : la livraison et le paiement, jugés indispensables, rapportent peu ; la réservation, les gâteaux et l'alerte rapportent beaucoup.
- **Manche 1, une seule livraison** : le joueur compose un plan figé dans un budget de 64 points (6 Sprints de 12 points, moins 8 points de recette et de mise en production finales). Le plan proposé par défaut dépasse de 2 points : il faut renoncer à quelque chose. Pendant les Sprints, l'avancement progresse, le comité est rassuré, aucune vente et aucun retour client avant la sortie.
- **Manche 2, un incrément à chaque Sprint** : 10 points par Sprint pour construire (2 points consacrés à finir proprement) ; le joueur réordonne le Product Backlog avant chaque Sprint ; chaque fonctionnalité terminée est en ligne et rapporte dès le Sprint suivant ; la Sprint Review apporte des retours clients qui révèlent la valeur réelle et donnent des indices.
- **Imprévus communs** : un concurrent lance sa commande en ligne (annoncé à la Review du Sprint 2), et la boulangerie perd 10 % de ses clients potentiels à chaque Sprint sans appli ; coupure budgétaire facultative (annoncée à la Review du Sprint 3 : le développement s'arrête après le Sprint 5).
- **Fin de partie** : les ventes continuent sans développement jusqu'au Sprint 10, puis l'écran de résultats superpose les deux courbes de ventes cumulées, compare des indicateurs (premier euro, argent investi avant le premier euro, fonctionnalités en ligne, fonctionnalités peu utilisées, ventes cumulées), révèle « intuition contre réalité » et propose des questions de débrief reliées au Scrum Guide 2020.
- **Moteur déterministe et pur** (`game-core.js`), avec des parcours de référence figés dans les tests.
- Site statique sur GitHub Pages, publié après les tests, avec l'identité visuelle des jeux frères (polices système, thème clair et sombre).

Hors périmètre de cette première version : **mode collectif en temps réel** (salle, code, QR code, équipes, comparaison cachée entre équipes : prochain changement), imprévu « mention allergènes », scénario paramétrable par le formateur, autres produits que la boulangerie, sauvegarde ou reprise d'une partie, export des résultats, encart dans la boîte à outils (https://agileroy.github.io/outils/).

## Capabilities

### New Capabilities

- `scenario` : la boulangerie, les fonctionnalités (coût, prérequis, intuition, valeur réelle), les retours clients et les imprévus.
- `sprint-simulation` : règles du moteur pour les deux façons de livrer : capacité, financement dans l'ordre, prérequis, mise en ligne, ventes, clients perdus face au concurrent, coupure budgétaire, Sprints après le développement.
- `solo-game` : parcours du joueur seul, de l'accueil aux résultats : option de coupure, plan de la manche 1, Sprints, Sprint Reviews, journal, manche 2, rejouer.
- `game-results` : courbes superposées, indicateurs, « intuition contre réalité », questions de débrief.
- `site-publication` : publication GitHub Pages, interface (langue, appareils, thèmes), sans service tiers.

### Modified Capabilities

_Aucune._

## Impact

- Ajoutés dans `scrum-increment` : `site/` (page, styles, scripts, favicon), `tests/`, `.github/workflows/pages.yml`, `package.json`, `README.md`, `openspec/` et les commandes OpenSpec de `.claude/` (reprises de `scrum-events`, générées par OpenSpec 1.14.1).
- Aucune base de données ni règle Firebase dans cette version.
- Actions manuelles de l'auteur : régler GitHub Pages sur « GitHub Actions » dans les paramètres du dépôt ; jouer les deux manches et valider l'équilibre.
