## Context

`planStatus` et `requestStatus` détectent déjà un prérequis absent (`missing`), mais seulement direct et pour le message. `featureState` renvoie `'blocked'` dès qu'un prérequis n'est pas terminé, quel que soit l'ordre, et `ui.js` l'affiche en rouge. Le moteur saute déjà, à la construction, un élément dont le prérequis n'est pas terminé.

## Goals / Non-Goals

**Goals:**
- Des calculs de dépendance dans le moteur, testés, que l'interface se contente d'afficher.
- Le rouge réservé aux vrais problèmes : lot impossible ou élément mal placé.

**Non-Goals:**
- Réordonner automatiquement, ou empêcher de placer un élément au-dessus de son prérequis : l'erreur doit rester possible, et visible.
- Changer les règles de validation ou de construction.

## Decisions

- **`impossibleLots(items)`** dans `game-core.js` : pour une liste de lots retenus, renvoie `{ id → premier lot manquant }` en remontant la chaîne des prérequis (vitrine ← réservation ← paiement). Utilisé par `planStatus` (pour l'affichage) et par `requestStatus` (avec les retraits), qui renvoient chacun `impossible`. Le message existant s'appuie dessus, pour nommer un lot devenu impossible en chaîne aussi.
- **`dependencyState(state, id)`** : `'misplaced'` si l'élément n'est pas terminé et que son prérequis, non terminé, est plus bas dans la liste ordonnée (`workItems`, ou `order` filtré par `included` sur l'écran du cahier des charges) ; `'after'` si le prérequis non terminé est plus haut ; `null` sinon. Un seul niveau suffit : chaque maillon de la chaîne est vérifié pour lui-même.
- **`featureState` ne renvoie plus `'blocked'`** : l'état de dépendance est séparé de l'état d'avancement, pour ne plus afficher de rouge à tort.
- **Affichage** (`ui.js`, `app.css`) : classe `is-impossible` ou `is-misplaced` sur la ligne (bordure et fond rouges), badge rouge « Impossible sans « X » » ou « Placé avant « X » » avec l'explication en dessous, badge neutre « Après « X » ». Les textes, communs aux deux manches et sans mot interdit, restent dans `ui.js` ; l'explication « l'équipe le sautera… » vient de `vocabulary.js`, qui dit « lot » ou « élément ».

## Risks / Trade-offs

- [Trop de rouge quand on décoche la vitrine] → c'est l'information attendue : huit lots impossibles ; le message reste unique.
- [Un joueur ignore le rouge et lance le Sprint] → autorisé : le moteur saute l'élément, comme aujourd'hui, et la Review le montrera.

## Migration Plan

Aucune donnée à migrer. Publication par push sur `main`.
