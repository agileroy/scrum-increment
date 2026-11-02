## Why

Retour de l'auteur : déplacer un élément de plusieurs rangs avec les flèches demande de nombreux clics. Le glisser-déposer est le geste naturel pour ordonner une liste, au doigt comme à la souris, et c'est la façon dont on ordonne un vrai Product Backlog.

## What Changes

- **Glisser-déposer** dans les listes ordonnables : le cahier des charges avant validation (manche 1) et le Product Backlog (manche 2). On saisit un élément n'importe où sur sa carte (hors boutons ; au doigt, par un appui long, pour garder le défilement), on le fait glisser, une ligne d'insertion montre où il va tomber, et le relâcher le place à ce rang.
- Souris, stylet et doigt, avec la même technique que le jeu frère `scrum-events` (événements Pointer, pas de glisser-déposer HTML natif, qui ne marche pas au doigt).
- Les flèches restent, pour le clavier et pour un déplacement d'un rang.
- Les règles ne changent pas : on ne peut déplacer que ce qui se déplace déjà avec les flèches (rien en manche 1 après validation, rien de terminé en manche 2). Les badges de dépendance se mettent à jour au relâcher.

Hors périmètre : glisser-déposer dans la fenêtre de demande de changement (pas de liste à ordonner), réordonner à plusieurs.

## Capabilities

### New Capabilities

_Aucune._

### Modified Capabilities

- `solo-game` : déplacement par glisser-déposer dans le cahier des charges et le Product Backlog.

## Impact

- `site/js/game-core.js` (déplacement à un rang donné, mêmes règles), `site/js/ui.js` (geste et rendu), `site/app.css`, `tests/`.
- Aucun chiffre ne change.
