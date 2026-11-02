## 1. Scénario et moteur

- [x] 1.1 Écrire `site/js/scenario.js` : fonctionnalités, retours clients, imprévus et constantes, repris du prototype. Vérification : `tests/scenario.test.mjs` (identifiants uniques, prérequis connus et sans cycle, total de 66 points, plan initial au-dessus du budget de 2 points, au moins un retour par fonctionnalité en ligne, retours qui visent des fonctionnalités connues, écart intuition / réalité du scénario « Intuition trompeuse »).
- [x] 1.2 Écrire `site/js/game-core.js` : état de manche en JSON simple, statut du plan, déplacement et retrait de fonctionnalités, Sprint (pertes de clients, ventes, construction dans l'ordre, prérequis, mise en ligne par manche, recette), retours clients, imprévus, coupure, fin du développement jusqu'au Sprint 10 et résultats de manche. Vérification : `tests/game-core.test.mjs` couvre chaque scénario de `sprint-simulation` et `solo-game` qui relève du moteur, dont les six parcours de référence à l’euro près, l'état sérialisable (`JSON.parse(JSON.stringify(état))` donne le même jeu) et le déterminisme.

## 2. Interface

- [x] 2.1 Écrire `site/index.html`, `site/app.css` et `site/js/theme.js` : écrans, variables de couleur et police des jeux frères, accent « croûte », thème clair et sombre mémorisé, `<dialog>` pour les fenêtres, mise en page projetée et téléphone. Vérification : aucune ressource externe dans le HTML et le CSS.
- [x] 2.2 Écrire `site/js/chart.js` : courbes SVG des ventes cumulées, graduations en euros, Sprints S1 à S10, valeur au survol, marqueurs et traits distincts par courbe. Vérification : rendu des courbes de référence dans les deux thèmes.
- [x] 2.3 Écrire `site/js/ui.js` et `site/js/app.js` : accueil, plan, tableau de Sprint, fenêtres de fin de Sprint et de fin de développement, transition, résultats (indicateurs, intuition contre réalité, débrief), rejouer. Vérification : liste de contrôle 4.1.

## 3. Publication

- [x] 3.1 Ajouter `package.json` (`npm test` avec `node --test`), `.github/workflows/pages.yml` (repris de `scrum-events` : tests, versionnement `__VERSION__`, publication de `site/`), `site/img/favicon.svg` et `README.md` (principe, déroulé, architecture, développement, méthode OpenSpec). Vérification : `npm test` au vert en local.

## 4. Vérification

- [x] 4.1 Jouer dans un navigateur automatisé : les deux manches avec et sans coupure, le plan refusé (dépassement, prérequis retiré), le Product Backlog réordonné, les Reviews, les résultats, rejouer. Vérification : aucune erreur dans la console, et ventes cumulées affichées égales aux parcours de référence joués à l'écran.
- [x] 4.2 Vérifier l'affichage à 360, 390, 1280 et 1440 px, en thème clair et sombre. Vérification : captures sans défilement horizontal, boutons de rang d'au moins 44 × 44 px sur téléphone.
- [x] 4.3 Pousser sur `main` et vérifier la publication GitHub Actions sur https://agileroy.github.io/scrum-increment/ (après réglage de la source Pages par l'auteur). Vérification : site publié et requêtes limitées au domaine du site. Fait le 2 novembre 2026 : workflow « Tests et publication » réussi, déploiement github-pages du commit 02e275f ; requêtes limitées au domaine du site vérifiées en local (Playwright).
- [x] 4.4 Faire jouer les deux manches par l'auteur et valider l'équilibre. Vérification : validation explicite de l'auteur. Fait le 2 novembre 2026 : deux manches jouées par l'auteur, qui valide l'archivage ; ses retours (fin de projet peu claire, manche 1 trop passive) sont traités dans le changement suivant.
