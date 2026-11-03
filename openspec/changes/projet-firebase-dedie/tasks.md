## 1. Préparation (auteur)

- [x] 1.1 Créer le projet Firebase de Fournée : Realtime Database en europe-west1 (mode verrouillé), connexion anonyme activée, `agileroy.github.io` dans les domaines autorisés, appli Web enregistrée. Vérification : configuration Web transmise. Fait le 3 novembre 2026 : projet `fournee-vleroy` (connexion anonyme activée après un premier essai refusé avec `auth/admin-restricted-operation`).
- [x] 1.2 Créer le secret `FIREBASE_SERVICE_ACCOUNT` (clé JSON d'un compte de service du projet) dans le dépôt `scrum-increment`. Vérification : secret listé dans les paramètres du dépôt.

## 2. Dépôt du jeu

- [x] 2.1 Réduire `database.rules.json` à la branche `incrementGame` (règles inchangées) et adapter `tests/rules.test.mjs` (fichier limité à cette branche). Vérification : `npm test` au vert.
- [x] 2.2 Ajouter `firebase.json` et `.firebaserc`, et un job `rules` dans `.github/workflows/pages.yml` (après les tests, sur `main` seulement, sauté avec avertissement sans secret). Vérification : workflow réussi et règles visibles dans la console du nouveau projet. Fait le 3 novembre 2026 : job `rules` « released successfully » (commit bac39d0), puis salle créée et supprimée sur le site publié.
- [ ] 2.3 Pointer `site/js/firebase-config.js` vers le nouveau projet ; mettre à jour `README.md` et `openspec/config.yaml` (projet dédié, déploiement automatique). Vérification : partie collective jouée sur le site publié (formateur et deux participants, lancement d'une période, révélation).

## 3. Projet partagé

- [x] 3.1 Retirer la branche `incrementGame` du fichier commun dans les 7 autres dépôts (et du test de `roti` qui la cite), lancer leurs tests, pousser. Vérification : 7 fichiers identiques, tests au vert. Fait le 3 novembre 2026 (le test de `roti` ne liste plus les branches des autres outils).
- [ ] 3.2 Faire publier le fichier commun allégé dans la console du projet partagé par l'auteur. Vérification : la branche `incrementGame` n'apparaît plus dans les règles publiées.
