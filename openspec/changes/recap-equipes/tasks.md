## 1. Moteur

- [x] 1.1 `game-core.js` : ordre de la liste journalisé au début de chaque période ; `reviveRound` tolère son absence ; `decisionTrail(state)` renvoie les faits par période. Vérification : tests (fil d'une équipe projet avec demande acceptée en retirant un lot, refus, refus faute de décision ; fil d'une équipe Scrum avec réordonnancement et demande ajoutée ; parcours de référence inchangés).
- [x] 1.2 `vocabulary.js` : phrases du fil dans chaque manche. Vérification : tests de vocabulaire (aucun mot de l'autre manche).

## 2. Interface

- [x] 2.1 `room-ui.js` : panneau Coulisses fermé par défaut, refermé au lancement d'une période et à la révélation ; fil neutre de l'écran projeté. Vérification : en mode démo, aucun mot propre à une approche sur l'écran projeté coulisses fermées ; décisions visibles coulisses ouvertes.
- [x] 2.2 Résultats : section « Ce qu'ont décidé les équipes ». Vérification : captures à 2 et 4 équipes, 390 et 1280 px.

## 3. Vérification et publication

- [x] 3.1 Partie complète en mode démo, thèmes clair et sombre. Vérification : console sans erreur, captures.
- [x] 3.2 Pousser sur `main` et vérifier la publication. Vérification : workflow réussi.
