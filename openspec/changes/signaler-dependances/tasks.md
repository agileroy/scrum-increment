## 1. Moteur

- [x] 1.1 Ajouter à `site/js/game-core.js` `impossibleLots` et `dependencyState`, exposer `impossible` dans `planStatus` et `requestStatus`, retirer l'état `'blocked'` de `featureState`. Vérification : `tests/game-core.test.mjs` couvre les scénarios « Décocher la réservation », « Décocher la vitrine », « Paiement remonté trop haut », « Ordre initial », « Prérequis terminé » et « Retirer la réservation » côté moteur ; parcours de référence inchangés.

## 2. Interface

- [x] 2.1 Faire évoluer `site/js/ui.js`, `site/js/vocabulary.js` et `site/app.css` : lots impossibles en rouge dans le cahier des charges, éléments mal placés en rouge avec le badge court « Impossible sans « X » », badge neutre « Après « X » », liste « Deviendraient impossibles » dans la fenêtre de demande. Vérification : liste de contrôle 3.1 et `tests/vocabulary.test.mjs` au vert.

## 3. Vérification et publication

- [x] 3.1 Jouer dans un navigateur automatisé : décocher la réservation puis la vitrine, remonter le paiement au-dessus de la réservation, vérifier les badges neutres puis leur disparition, retirer la réservation dans une demande ; relecture des mots interdits par manche. Vérification : rouge exactement sur les lots attendus, aucune erreur dans la console.
- [x] 3.2 Vérifier l'affichage à 360 et 1280 px, en thème clair et sombre. Vérification : captures sans défilement horizontal, rouge lisible dans les deux thèmes.
- [x] 3.3 Pousser sur `main` et vérifier la publication GitHub Actions. Vérification : workflow réussi et déploiement du dernier commit. Fait le 2 novembre 2026 : workflow réussi, déploiement github-pages du commit b75d129.
- [ ] 3.4 Faire jouer l'auteur. Vérification : validation explicite de l'auteur.

## Workflow follow-up

- Archiver le changement avec `/opsx:archive` après la validation de l'auteur.
