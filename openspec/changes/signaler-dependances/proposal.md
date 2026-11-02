## Why

Retour de l'auteur : les dépendances entre fonctionnalités ne se voient qu'au moment où ça bloque. Quand on décoche un lot du cahier des charges, rien ne montre les lots qui en dépendent et qui ne pourront donc plus être réalisés ; dans le Product Backlog, rien ne signale un élément placé au-dessus de celui dont il a besoin, que l'équipe sautera donc. À l'inverse, le badge rouge « Nécessite : … » s'affiche aujourd'hui dès qu'un prérequis n'est pas terminé, même quand l'ordre est bon : il alerte à tort.

## What Changes

- **Lots impossibles** (cahier des charges et fenêtre de demande de changement, manche 1) : un lot retenu dont un prérequis, direct ou en chaîne, est décoché ou retiré s'affiche en rouge, avec « Impossible sans « X » ». Décocher la vitrine met donc en rouge tous les autres lots.
- **Éléments mal placés** (Product Backlog en manche 2, et ordre du cahier des charges en manche 1) : un élément non terminé placé au-dessus d'un prérequis non terminé, ou qui dépend d'un élément déjà en rouge, s'affiche en rouge, avec le même badge court « Impossible sans « X » » (choix de l'auteur, plus clair qu'une explication).
- **Dépendance bien ordonnée** : badge neutre « Après « X » » tant que le prérequis n'est pas terminé, plus de rouge à tort. Une fois le prérequis terminé, plus de badge.
- Les règles de validation et de construction ne changent pas : seul l'affichage change.

## Capabilities

### New Capabilities

_Aucune._

### Modified Capabilities

- `solo-game` : signalement des lots impossibles, des éléments mal placés et des dépendances bien ordonnées dans le cahier des charges, le tableau et la fenêtre de demande de changement.

## Impact

- `site/js/game-core.js` (calcul des lots impossibles et des éléments mal placés, sans changer les règles), `site/js/vocabulary.js`, `site/js/ui.js`, `site/app.css`, `tests/`.
- Aucun chiffre ne change.
