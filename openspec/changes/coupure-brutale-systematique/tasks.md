## 1. Scénario et moteur

- [x] 1.1 Faire évoluer `site/js/scenario.js` et `site/js/game-core.js` : coupure systématique à la fin du Sprint 5, sans option ni annonce préalable, textes dans les deux vocabulaires ; suppression de l'option `cut`. Vérification : `tests/game-core.test.mjs` et `tests/scenario.test.mjs` adaptés (scénarios « Aucun préavis », « La coupure tombe », « Comptes rendus muets », « Appli jamais sortie », « Cahier des charges resserré », « Sortie tardive », « Soleil jusqu'à la coupure », « Livré avant la coupure », parcours de référence).

## 2. Interface et textes

- [x] 2.1 Faire évoluer `site/js/vocabulary.js`, `site/js/ui.js` et `site/index.html` : accueil sans case à cocher, fin du projet « en l'état », question de débrief sur le préavis. Vérification : `tests/vocabulary.test.mjs` au vert (aucun mot de l'autre manche) et liste de contrôle 3.1.

## 3. Vérification et publication

- [x] 3.1 Jouer dans un navigateur automatisé : parcours de référence (dont le cahier des charges resserré), relecture des écrans des périodes 1 à 4 (aucune mention de banque ni de coupure), coupure au COPIL 5 et au Sprint 5, accueil sans option, mots interdits par manche. Vérification : aucune erreur dans la console, chiffres égaux aux tests.
- [x] 3.2 Vérifier l'affichage à 360 et 1280 px, en thème clair et sombre. Vérification : captures sans défilement horizontal.
- [x] 3.3 Mettre à jour `README.md` et `openspec/config.yaml` (coupure systématique et sans préavis). Vérification : `npm test` au vert, `openspec validate` sans erreur.
- [ ] 3.4 Pousser sur `main` et vérifier la publication GitHub Actions. Vérification : workflow réussi et déploiement du dernier commit.
- [ ] 3.5 Faire jouer les deux manches par l'auteur. Vérification : validation explicite de l'auteur.

## Workflow follow-up

- Archiver le changement avec `/opsx:archive` après la validation de l'auteur.
