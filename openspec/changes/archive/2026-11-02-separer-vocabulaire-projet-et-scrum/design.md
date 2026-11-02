## Context

Les textes du jeu sont aujourd'hui répartis entre `ui.js` (écrans, fenêtres) et `game-core.js`, qui rédige les lignes du journal (« Plan de 61 points validé… », « … ajoutée en bas du Product Backlog. ») et dont les imprévus de `scenario.js` portent un seul texte. `periodLabel` nomme les périodes « Sprint N ». Le moteur lui-même (Sprints de 2 semaines, chiffres) ne change pas.

## Goals / Non-Goals

**Goals:**
- Un seul endroit pour le vocabulaire de chaque manche, vérifiable par un test.
- Un moteur qui ne rédige plus de phrases : il produit des faits, l'interface les met en mots selon la manche.

**Non-Goals:**
- Traduire les noms de fonctionnalités (« Réservation de pain » reste le même nom de lot ou d'élément).
- Changer les identifiants internes (`playSprint`, `sprint-simulation`…), qui gardent le mot « Sprint » par convention.

## Decisions

- **Module `site/js/vocabulary.js`** : `LEXICON.cascade` et `LEXICON.increment`, avec les mêmes clés : rôle, partie prenante, nom de l'échéance (`deadline(n, total)` → « COPIL 3 sur 6 » / « Sprint 3 sur 6 »), bouton (`play(n)`), liste, élément (« lot » / « élément »), bilan (« Compte rendu du COPIL 3 » / « Sprint Review du Sprint 3 »), fin propre, badge de demande, titre du journal, textes de capacité et phrases du journal. `ui.js` ne contient plus aucun mot propre à une manche. Alternative écartée : des conditions `cascade ? … : …` dispersées dans `ui.js`, impossibles à vérifier d'un coup.

- **Journal en faits** : les entrées du journal deviennent des faits (`{ sprint, kind: 'plan' | 'sprint' | 'quote' | 'event' | 'request' | 'decision', … }` avec les identifiants, points et décisions), sans phrase. `vocabulary.js` les rédige. Les tests du moteur vérifient les faits, plus les textes.

- **Imprévus dans les deux vocabulaires** : chaque imprévu de `scenario.js` porte `text` et `log` par manche (`{ cascade, increment }`). Exemple, coupure : « La banque réduit le prêt : le projet s'arrêtera au COPIL 5. » / « … le développement s'arrêtera après le Sprint 5. »

- **Météo dans le moteur** : `projectWeather(state)` renvoie `'delivered'` si l'appli est sortie, sinon `'sunny'` si le reste à faire (lots du plan non terminés, recette avenants compris) tient dans `(lastBuildSprint - sprint) × 12`, sinon `'stormy'`. Le compte rendu de Sprint la porte (`report.weather`). C'est une règle, donc testée côté moteur.

- **Semaines** : `periodLabel` est remplacé par `periodWeeks(period)` → `[2p − 1, 2p]`. L'axe affiche la fin de chaque période (« 2 sem. »… « 20 sem. ») ; le premier euro affiche « Dès la semaine 2p − 1 » ; l'échéance affiche « semaines 5 et 6 ». La frontière du graphique reste après la période `lastBuildSprint`.

- **Vérification du « pas de mélange »** : `tests/vocabulary.test.mjs` parcourt toutes les chaînes produites par le lexique de chaque manche (avec des faits d'exemple de chaque type) et refuse les mots interdits de l'autre manche ; la vérification dans le navigateur relit le texte de chaque écran et fenêtre de la manche 1 complète.

## Risks / Trade-offs

- [Un texte oublié dans `ui.js`] → la relecture du DOM pendant une manche 1 complète, dans le navigateur automatisé, échoue sur le premier mot interdit.
- [« Lot » et « fonctionnalité » coexistent dans les résultats] → voulu : les résultats comparent les deux manches et parlent de fonctionnalités.

## Migration Plan

Aucune donnée à migrer. Publication par push sur `main`.
