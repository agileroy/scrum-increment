## Context

Le jeu solo repose sur un moteur pur et déterministe (`game-core.js`) dont l'état est un objet JSON simple, et sur une interface (`ui.js`) qui met en page ses comptes rendus avec le vocabulaire de `vocabulary.js`. Les jeux frères `roles-responsabilites` et `scrum-events` ont déjà une architecture temps réel éprouvée : `firebase-db.js` (seul module qui parle à Firebase), `memory-db.js` (même interface en mémoire, pour les tests et le mode démo), un store d'actions testé sans Firebase, des réactions automatiques du navigateur du formateur, et une base Firebase partagée par 7 dépôts avec un fichier de règles commun.

## Goals / Non-Goals

**Goals:**
- Réutiliser le moteur tel quel : une équipe joue exactement une manche du solo.
- Reprendre l'architecture temps réel des jeux frères, pour que l'auteur n'ait rien de nouveau à apprendre.
- Garder le jeu seul sans service tiers.
- Une partie complète testable en mode démo, sans Firebase, avant même la publication des règles.

**Non-Goals:**
- Rejouer dans la même salle, choisir l'approche de chaque équipe, plus de 6 équipes.
- Tests automatiques des règles Firebase (émulateur et Java nécessaires) : cohérence vérifiée par un test sur le fichier, comme dans les jeux frères.

## Decisions

- **Fichiers** : `room-core.js` (logique de salle pure : code, prénoms, équipes, répartition, état « prêt », chrono), `room-store.js` (actions sur la base, réactions du formateur), `firebase-db.js`, `memory-db.js`, `firebase-config.js` (repris des jeux frères, clés de démo propres à ce jeu), `room-ui.js` (écrans du formateur et du participant), `vendor/qrcode-generator-1.4.4.js` (repris). `app.js` ne charge `room-ui.js`, la base et le QR code qu'à la création ou à l'arrivée dans une salle (import dynamique) : le jeu seul ne charge rien d'externe.

- **Modèle de données** (sous `/incrementGame`) :
  - `expiry/{code}` : `{ createdAt, hostUid }`, comme les jeux frères ;
  - `rooms/{code}/meta` : `{ hostUid, createdAt, status: lobby | playing | ended | revealed, teamCount, timerSeconds, period, periodOpenedAt, startedAt, endedAt }` ; `period` est le nombre de périodes jouées (0 avant la première) ;
  - `rooms/{code}/players/{uid}` : `{ name, joinedAt, team, removed, connections }` ; `rooms/{code}/names/{clé}` : `uid` ;
  - `rooms/{code}/teams/{n}` (n = 1 à 6) : `{ state, ready }`, où `state` est l'état du moteur de l'équipe et `ready` la période pour laquelle l'équipe s'est déclarée prête.

- **Approche par équipe** : `teamMode(n)` = « projet » (cascade) si n est impair, « Scrum » (increment) sinon. Fixe et simple à expliquer au débrief ; la moitié des équipes de chaque côté dès 2 équipes.

- **Actions d'équipe en transaction** : toute action d'un membre est une transaction sur `teams/{n}/state` qui applique la fonction du moteur (`toggleInPlan`, `moveFeatureTo`, `validatePlan`, `decideRequest`…) à l'état le plus récent ; deux actions simultanées ne s'écrasent donc pas. L'interface du solo est réutilisée : elle passe par une fonction `act(fn)` qui, en solo, applique `fn` à l'état local et, en salle, lance la transaction ; le rendu suit la mise à jour de la base.

- **Relecture d'un état venu de la base** : Firebase ne stocke ni tableaux vides ni `null`, et renvoie parfois un tableau sous forme d'objet. `reviveRound(raw)` (dans `game-core.js`) reconstruit un état complet à partir de `newRound(mode)` : tableaux vides, `null`, entrées du journal. Testé avec la base en mémoire, qui reproduit ce comportement.

- **Bilans reconstruits** : le moteur journalise déjà chaque période en faits. `reportFromState(state, sprint)` reconstruit le compte rendu d'une période (ventes, mises en ligne, sortie, météo, retours clients, imprévus, demande, fin du développement) à partir du journal, et `finishSummary(state)` le résumé de fin. Rien d'autre n'est stocké : un téléphone qui arrive en retard retrouve le dernier bilan. Un test vérifie que le bilan reconstruit est identique à celui renvoyé par `playSprint`.

- **Lancement d'une période** (navigateur du formateur) : pour chaque équipe, transaction qui refuse d'office une demande en attente (`decideRequest` avec `reason: 'timeout'`, journalisée « refusée faute de décision »), puis joue la période (`playSprint`) ; quand le développement est fini, `finishRound`. Puis `meta.period` + 1 et `periodOpenedAt` = maintenant ; après la cinquième période, `status: ended`. Le lancement de la période 1 exige que tous les cahiers des charges soient validés.

- **Prêt** : `teams/{n}/ready` = numéro de la prochaine période ; une équipe est « prête » si `ready === period + 1`. Le bouton est inactif pour une équipe « projet » tant que son cahier des charges n'est pas validé ou qu'une demande attend.

- **Chrono** : `periodOpenedAt` (heure du serveur) + `timerSeconds` ; chaque écran calcule le temps restant avec l'heure du serveur.

- **Neutralité** : l'écran du formateur n'utilise que des mots communs (« Période », « En réflexion », « Prête ») et ne lit jamais l'état des équipes sauf pour savoir si un cahier des charges est validé (« prépare encore »). Les téléphones utilisent le lexique de leur manche (`vocabulary.js`), déjà vérifié sans mélange.

- **Résultats collectifs** : `chart.js` accepte une couleur par série (6 couleurs d'équipe, tokens CSS dans les deux thèmes) en plus du style par approche (pointillé et carré, ou plein et rond). Le tableau des indicateurs a une colonne par équipe, dans un cadre qui défile horizontalement sur téléphone.

- **Règles de sécurité** (`incrementGame`, reprises de `eventsGame`) : expiration et suppression identiques ; `meta` écrit par le formateur seul (statut, nombre d'équipes 2 à 6, chrono 0, 60, 120 ou 180, période 0 à 10) ; fiche joueur : prénom, arrivée et présence par le joueur, équipe par le formateur ou par le joueur à sa première arrivée, retrait par le formateur ; `teams/{n}/state` écrit par le formateur, ou par un membre de l'équipe pendant la partie à condition de ne pas changer `sprint`, `mode`, `cumulative` ni `curve` (un participant ne peut pas jouer de période ni toucher aux ventes) ; `teams/{n}/ready` par un membre de l'équipe. Fichier recopié à l'identique dans les 7 dépôts, autres branches inchangées octet pour octet.

## Risks / Trade-offs

- [Règles pas encore publiées demain matin] → le mode démo (`?demo`) permet de tout tester sans Firebase ; la publication des règles dans la console est la seule action manuelle.
- [État d'équipe modifiable par un membre malveillant (cocher, déplacer)] → acceptable en formation, comme dans les jeux frères ; les règles empêchent de jouer une période ou de toucher aux ventes.
- [Deux membres tranchent la même demande en même temps] → la transaction applique la première décision ; la seconde trouve la demande déjà tranchée et ne fait rien.
- [Taille de l'état d'une équipe] → quelques kilo-octets, largement dans les limites de Firebase.

## Migration Plan

1. Pousser `scrum-increment` (le jeu seul et le mode démo marchent tout de suite).
2. Recopier `database.rules.json` dans les 6 autres dépôts, tests verts.
3. L'auteur publie les règles dans la console Firebase ; le mode collectif marche alors sur la vraie base.

## Open Questions

_Aucune._
