## Why

Fournée partage aujourd'hui un projet Firebase avec 7 autres outils. Sur l'offre gratuite (Spark), une Realtime Database accepte au plus 100 connexions simultanées, réparties entre tous ces outils : une formation de 30 personnes qui tombe en même temps qu'un poker planning ou un ROTI peut saturer la base, et les nouveaux arrivants ne se connectent alors plus, sans message clair. Le fichier de règles commun doit en plus être recopié dans 8 dépôts et publié à la main à chaque évolution, et une erreur dans la branche d'un outil peut casser les autres.

Fournée est le premier outil déplacé dans son propre projet, parce qu'il réunit le plus de monde en même temps ; les autres suivront un par un sur le même modèle.

## What Changes

- **Projet Firebase dédié** à Fournée (Realtime Database en europe-west1, connexion anonyme, domaine `agileroy.github.io` autorisé), créé par l'auteur ; `site/js/firebase-config.js` pointe vers ce projet.
- **Règles propres au jeu** : `database.rules.json` ne contient plus que la branche `incrementGame` (inchangée), sans les branches des outils frères ; il n'est plus recopié dans les autres dépôts.
- **Déploiement automatique des règles** : à chaque push sur `main`, après les tests, GitHub Actions publie `database.rules.json` dans le projet avec Firebase CLI et un compte de service gardé en secret (`FIREBASE_SERVICE_ACCOUNT`). Plus de publication à la main dans la console.
- **Projet partagé** : la branche `incrementGame` est retirée du fichier de règles commun des 7 autres dépôts, une fois Fournée en service sur son projet.

Aucune donnée à migrer : les salles de Fournée expirent après 24 heures. Une partie en cours au moment de la bascule est perdue ; la bascule se fait hors séance.

Hors périmètre : déplacement des autres outils (changements suivants, un par outil), passage à l'offre payante, Firestore.

## Capabilities

### New Capabilities

_Aucune._

### Modified Capabilities

- `site-publication` : la base n'est plus partagée ; règles propres au jeu, déployées automatiquement après les tests.

## Impact

- `scrum-increment` : `site/js/firebase-config.js`, `database.rules.json`, `firebase.json` et `.firebaserc` (nouveaux), `.github/workflows/pages.yml`, `tests/rules.test.mjs`, `README.md`, `openspec/config.yaml`.
- Les 7 autres dépôts (`poker-planning`, `matrice-competences`, `wheel-of-chance`, `moving-motivators`, `roles-responsabilites`, `scrum-events`, `roti`) : branche `incrementGame` retirée de `database.rules.json` (et du test de `roti` qui la mentionne).
- Actions manuelles de l'auteur : créer le projet (base, connexion anonyme, domaine autorisé, appli Web), créer le secret `FIREBASE_SERVICE_ACCOUNT` dans le dépôt, puis publier le fichier commun allégé dans la console du projet partagé.
