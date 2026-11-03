## 1. Préparation (auteur)

- [ ] 1.1 Créer le projet Firebase de Fournée : Realtime Database en europe-west1 (mode verrouillé), connexion anonyme activée, `agileroy.github.io` dans les domaines autorisés, appli Web enregistrée. Vérification : configuration Web transmise.
- [ ] 1.2 Créer le secret `FIREBASE_SERVICE_ACCOUNT` (clé JSON d'un compte de service du projet) dans le dépôt `scrum-increment`. Vérification : secret listé dans les paramètres du dépôt.

## 2. Dépôt du jeu

- [ ] 2.1 Réduire `database.rules.json` à la branche `incrementGame` (règles inchangées) et adapter `tests/rules.test.mjs` (fichier limité à cette branche). Vérification : `npm test` au vert.
- [ ] 2.2 Ajouter `firebase.json` et `.firebaserc`, et un job `rules` dans `.github/workflows/pages.yml` (après les tests, sur `main` seulement, sauté avec avertissement sans secret). Vérification : workflow réussi et règles visibles dans la console du nouveau projet.
- [ ] 2.3 Pointer `site/js/firebase-config.js` vers le nouveau projet ; mettre à jour `README.md` et `openspec/config.yaml` (projet dédié, déploiement automatique). Vérification : partie collective jouée sur le site publié (formateur et deux participants, lancement d'une période, révélation).

## 3. Projet partagé

- [ ] 3.1 Retirer la branche `incrementGame` du fichier commun dans les 7 autres dépôts (et du test de `roti` qui la cite), lancer leurs tests, pousser. Vérification : 7 fichiers identiques, tests au vert.
- [ ] 3.2 Faire publier le fichier commun allégé dans la console du projet partagé par l'auteur. Vérification : la branche `incrementGame` n'apparaît plus dans les règles publiées.
