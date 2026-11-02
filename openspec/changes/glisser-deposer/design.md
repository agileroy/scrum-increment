## Context

Les listes sont rendues par `ui.js` (`renderPlan`, `renderBoard`) ; les flèches appellent `moveFeature(state, id, ±1)`, qui échange deux voisins. `canMove` dit ce qui est déplaçable. Le jeu frère `scrum-events` fait déjà du glisser-déposer au doigt avec les événements Pointer, un fantôme qui suit le pointeur et `elementFromPoint`.

## Goals / Non-Goals

**Goals:**
- Déplacer un élément de plusieurs rangs en un geste, au doigt comme à la souris.
- Garder les règles dans le moteur : le geste ne fait que choisir un rang.

**Non-Goals:**
- Glisser-déposer HTML natif (pas de support au doigt), bibliothèque tierce (interdite par le contexte du projet).

## Decisions

- **`moveFeatureTo(state, id, index)`** dans `game-core.js` : retire l'élément de `order` et l'insère au rang `index` (0 = en haut, borné), si `canMove` l'autorise ; renvoie l'état inchangé si le rang ne change pas. Les éléments terminés restent où ils sont et peuvent être enjambés, comme avec les flèches. Sur l'écran du cahier des charges, l'index vise `order` complet (lots retenus ou non), car la liste affiche tous les lots.
- **Saisie sur toute la carte** (retour de l'auteur, plutôt qu'une petite poignée) : la ligne déplaçable porte `data-drag` ; le geste démarre partout sauf sur un bouton, une case à cocher ou son libellé. À la souris et au stylet, au-delà de 6 px. Au doigt, après un appui long de 350 ms sans bouger de plus de 8 px ; un glissé avant ce délai annule le geste et laisse la page défiler (`touch-action: pan-y` sur la carte). Une fois le geste lancé au doigt, un écouteur `touchmove` non passif bloque le défilement. Sélection de texte et menu contextuel d'appui long désactivés sur les cartes déplaçables. Au clavier, les flèches restent le moyen de déplacer.
- **Geste** (Pointer, comme `scrum-events`) : `pointerdown` sur la poignée capture le pointeur ; au-delà de 6 px, un fantôme (copie de la ligne, semi-transparente) suit le pointeur, la ligne d'origine est estompée, et une ligne d'insertion est placée avant ou après la ligne survolée selon la moitié haute ou basse de celle-ci (`elementFromPoint`). Défilement automatique de la fenêtre quand le pointeur approche du haut ou du bas de l'écran. `pointerup` dans la liste appelle `moveFeatureTo` puis le rendu ; hors de la liste, `pointercancel` ou Échap annulent.
- **Après le relâcher**, le rendu complet de la liste met à jour rangs et badges de dépendance ; le focus revient sur une flèche de l'élément déplacé.

## Risks / Trade-offs

- [Glissement involontaire au doigt en voulant défiler] → au doigt, seul un appui long lance le geste ; un glissé direct fait défiler la page.
- [Ligne d'insertion ambiguë sur une ligne haute] → moitié haute = avant, moitié basse = après, avec une ligne bien visible dans les deux thèmes.

## Migration Plan

Aucune donnée à migrer. Publication par push sur `main`.
