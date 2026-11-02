## Why

Fournée est conçu pour la formation : la comparaison prend tout son sens quand des équipes vivent les deux façons de livrer en même temps, sans savoir que les autres font autrement, et découvrent les courbes ensemble au débrief. Le mode solo a permis de régler le jeu ; ce changement ajoute le mode collectif en temps réel, sur le modèle des jeux frères `roles-responsabilites` et `scrum-events`.

## What Changes

- **Salle** : le formateur crée une partie depuis l'écran projeté (code de 4 lettres et QR code) ; les participants rejoignent depuis leur téléphone avec un prénom unique, sans compte. Le formateur règle le nombre d'équipes (2 à 6, 2 par défaut) et un chrono de réflexion facultatif (1, 2 ou 3 minutes). Chaque participant est placé dans l'équipe la moins nombreuse ; le formateur peut le changer d'équipe. Arrivée tardive, retrait d'un participant, salles supprimées au bout de 24 heures, comme dans les jeux frères.
- **Équipes en parallèle** : les équipes impaires jouent « projet » (manche 1 du solo), les équipes paires « Scrum » (manche 2), en même temps. Rien ne dit aux participants que les autres équipes jouent autrement : chaque équipe ne voit que son propre jeu, dans son propre vocabulaire, et l'écran projeté reste neutre (noms d'équipes, « Période 3 sur 6 », état prêt ou pas).
- **Chacun son téléphone** : tous les membres d'une équipe voient et modifient le même cahier des charges ou Product Backlog en temps réel ; toute action d'un membre (cocher, déplacer, valider, trancher une demande) s'applique pour toute l'équipe. Un bouton « Nous sommes prêts » signale au formateur que l'équipe a fini de réfléchir.
- **Tempo du formateur** : le formateur lance chaque période pour toutes les équipes en même temps, quand il le décide, avec un chrono facultatif affiché sur tous les écrans. Il ne peut lancer la première période que lorsque tous les cahiers des charges sont validés ; une demande de changement non tranchée au lancement est refusée d'office (« faute de décision »).
- **Bilans** : à chaque période, chaque téléphone affiche le bilan de son équipe (compte rendu de COPIL ou Sprint Review), la demande de changement éventuelle, puis la fin du projet après la coupure.
- **Révélation** : après la coupure, le formateur révèle les résultats sur l'écran projeté et sur les téléphones : une courbe par équipe, l'approche de chaque équipe dévoilée, les indicateurs par équipe, « intuition contre réalité » et les questions de débrief.
- **Mode démo** (`?demo`) : une partie partagée entre les onglets d'un même navigateur, sans Firebase.
- **Accueil** : « Animer une partie », « Rejoindre une partie » et « Jouer seul ».
- **Firebase** : nouvelle branche `incrementGame` dans les règles de la base partagée, recopiées à l'identique dans les 7 dépôts. Le SDK Firebase n'est chargé que pour créer ou rejoindre une salle : le jeu seul reste sans service tiers.

Hors périmètre : choix de l'approche de chaque équipe par le formateur, plus de 6 équipes, rejouer une partie dans la même salle, historique des parties.

## Capabilities

### New Capabilities

- `game-room` : salle, code et QR code, rejoindre, équipes, réglages, présence, retrait, retardataires, suppression au bout de 24 heures.
- `team-play` : jeu d'une équipe sur les téléphones de ses membres : état partagé, actions, « Nous sommes prêts », bilans de période, demandes de changement, fin du projet et attente de la révélation.
- `facilitation` : écran du formateur pendant la partie : tempo, chrono, lancement des périodes, suivi neutre des équipes, révélation.
- `team-results` : résultats collectifs : courbes de toutes les équipes, approches dévoilées, indicateurs par équipe, débrief.

### Modified Capabilities

- `site-publication` : Firebase autorisé pour le seul mode collectif, mode démo, règles de sécurité partagées.
- `solo-game` : l'accueil propose aussi d'animer ou de rejoindre une partie.

## Impact

- Ajoutés dans `scrum-increment` : `site/js/room-core.js`, `site/js/room-store.js`, `site/js/firebase-db.js`, `site/js/firebase-config.js`, `site/js/memory-db.js`, `site/js/room-ui.js`, `site/vendor/` (générateur de QR code), `database.rules.json`, `tests/room-*.test.mjs`, `tests/rules.test.mjs`.
- Modifiés : `site/index.html`, `site/app.css`, `site/js/ui.js`, `site/js/chart.js`, `site/js/game-core.js` (relecture d'un état venu de la base, bilan et résumé reconstruits depuis l'état), `README.md`, `openspec/config.yaml`.
- `database.rules.json` : nouvelle branche `incrementGame`, sans modifier les autres branches ; recopié dans `roles-responsabilites`, `scrum-events`, `poker-planning`, `matrice-competences`, `wheel-of-chance` et `moving-motivators`.
- Action manuelle de l'auteur : publier les nouvelles règles dans la console Firebase.
