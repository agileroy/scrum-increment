## 1. Moteur et lexique

- [x] 1.1 Faire évoluer `site/js/scenario.js` et `site/js/game-core.js` : imprévus rédigés dans les deux vocabulaires, journal en faits sans phrase, `projectWeather` et `report.weather`, `periodWeeks` à la place de `periodLabel`. Vérification : `tests/game-core.test.mjs` adapté (faits du journal, scénarios « Orage à l'annonce de la coupure » et « Soleil sans coupure », semaines), parcours de référence inchangés.
- [x] 1.2 Écrire `site/js/vocabulary.js` : lexique des deux manches et rédaction des faits du journal, des imprévus et des échéances. Vérification : `tests/vocabulary.test.mjs` (scénarios « Tableau de la manche 1 », « Capacité de la manche 2 », « Annonce de la coupure en manche 1 », et aucun mot interdit de l'autre manche dans toutes les chaînes produites).

## 2. Interface

- [x] 2.1 Faire évoluer `site/js/ui.js`, `site/index.html` et `site/app.css` : textes de chaque manche tirés du lexique (cahier des charges, tableau, comptes rendus de COPIL avec météo, Sprint Reviews, demandes, fin du projet, journal), accueil, écran de transition avec la bascule de vocabulaire, résultats (légendes, premier euro en semaines, question de débrief). Vérification : liste de contrôle 3.1.
- [x] 2.2 Faire évoluer `site/js/chart.js` : axe commun en semaines (« 2 sem. » à « 20 sem. »), frontière inchangée. Vérification : captures avec et sans coupure.

## 3. Vérification et publication

- [x] 3.1 Jouer dans un navigateur automatisé : parcours de référence, demandes, coupure, et relecture du texte de chaque écran et fenêtre de la manche 1 (aucun « Sprint », « Product Backlog », « Sprint Review », « Definition of Done », « Product Owner ») et de la manche 2 (aucun « COPIL », « cahier des charges », « chef de projet », « lot », « avenant »). Vérification : aucune erreur dans la console, aucun mot interdit, chiffres égaux aux tests.
- [x] 3.2 Vérifier l'affichage à 360, 390, 1280 et 1440 px, en thème clair et sombre. Vérification : captures sans défilement horizontal.
- [x] 3.3 Mettre à jour `README.md` (vocabulaire des manches, météo). Vérification : `npm test` au vert, `openspec validate` sans erreur.
- [x] 3.4 Pousser sur `main` et vérifier la publication GitHub Actions. Vérification : workflow réussi et déploiement du dernier commit. Fait le 2 novembre 2026 : workflow réussi, déploiement github-pages du commit 1e2e663.
- [ ] 3.5 Faire jouer les deux manches par l'auteur. Vérification : validation explicite de l'auteur.

## Workflow follow-up

- Archiver le changement avec `/opsx:archive` après la validation de l'auteur.
