## Context

Le jeu solo est publié (changement archivé `2026-11-02-creer-jeu-fournee`). Le moteur pur (`game-core.js`) produit un état JSON et des comptes rendus que `ui.js` affiche ; `chart.js` dessine les courbes ; `scenario.js` porte les données. Les périodes après le développement sont aujourd'hui des « Sprints » 6 à 10, ce qui crée la confusion décrite dans la proposition.

## Goals / Non-Goals

**Goals:**
- Un seul vocabulaire temporel : des Sprints pendant le projet, des semaines d'exploitation après.
- Des décisions en manche 1 aussi prenantes que l'ordonnancement de la manche 2, prises sur des opinions.
- Les mêmes événements dans les deux manches, et les parcours de référence existants inchangés.

**Non-Goals:**
- Le tempo par le formateur (mode collectif).
- Retirer une fonctionnalité en manche 2 en réponse à une demande : le Product Backlog suffit.

## Decisions

- **Une période = 2 semaines** : `SPRINT_WEEKS = 2` et `HORIZON_WEEKS = 20` dans `scenario.js` ; le moteur garde 10 périodes numérotées (rien ne change dans le calcul des ventes ni dans les parcours de référence). Seul l'affichage nomme les périodes : `periodLabel(period, lastBuildSprint)` dans `game-core.js` renvoie « Sprint N » pendant le projet et « N semaines après le projet » ensuite, en version courte pour l'axe (« S3 », « +4 sem. »). Alternative écartée : allonger l'horizon en semaines réelles, qui changerait tous les chiffres.

- **Fin du projet commune aux deux manches** : elle ne dépend que de la coupure, et l'acceptation d'une demande ne peut pas allonger le projet (budget fixe, décision de l'auteur). Le graphique trace donc une seule frontière, après la période `lastBuildSprint`, avec une zone grisée à droite.

- **Demandes dans `scenario.js`** : `REQUESTS`, trois fonctionnalités au même format que `FEATURES` plus `after` (Sprint de la Review) et `ask` (texte de Mme Lefèvre). Le moteur les cherche dans un index commun aux deux listes ; `FEATURES` garde ses 9 fonctionnalités et son total de 66 points. Leurs retours clients rejoignent `QUOTES`, après les autres, pour ne pas changer l'ordre des Reviews existantes.

- **Manche 1 : demande en attente dans l'état** : à la fin du Sprint de l'annonce, `playSprint` place l'identifiant dans `state.pendingRequest` et le compte rendu le porte (`report.request`). `playSprint` refuse de jouer tant qu'une demande attend. `requestStatus(state, removeIds)` calcule le plan obtenu (total, budget, validité, message, fonctionnalités retirables) ; `decideRequest(state, { accept, remove })` l'applique ou refuse. L'avenant s'ajoute au coût de recette de la manche (`state.recetteCost`, 8 au départ), utilisé par `planStatus`, `planProgress` et la construction. La fonctionnalité acceptée est ajoutée à la fin de `order` et de `included` ; les retraits sortent de `included`. Les décisions vont dans `state.requests` et dans le journal.

- **Manche 2 : ajout direct** : à la même Review, la demande est ajoutée à la fin de `order` ; aucune décision, aucun avenant. Comme elle arrive en bas d'une liste déjà plus longue que la capacité, les parcours de référence qui ne la remontent pas gardent leurs chiffres.

- **Résultats** : `roundResults` ajoute `requestsLive` (demandes en ligne à la fin du projet) et `lastBuildSprint`. `truthTable` inclut les demandes avec `requested: true`, tri stable par valeur décroissante.

- **Interface de la demande (manche 1)** : la fenêtre de fin de Sprint propose « Voir la demande de Mme Lefèvre » au lieu de « Préparer le Sprint suivant », puis le même `<dialog>` affiche la demande, les cases des fonctionnalités retirables, une jauge et « Accepter » / « Refuser ». L'événement `cancel` (Échap) est neutralisé tant qu'une demande attend. Les listes affichent un badge « Demande de Mme Lefèvre ».

- **Graphique** : `chartSvg(series, { lastBuildSprint, compact })` ajoute un rectangle grisé et une ligne pointillée étiquetée « Fin du projet », avec « Exploitation, plus de développement » dans la zone. En mode compact (écran de moins de 560 px), le SVG est plus étroit (420 unités au lieu de 640), donc des libellés plus grands à l'écran, et l'étiquette de zone passe sur deux lignes.

## Risks / Trade-offs

- [Accepter une demande devient toujours perdant en manche 1] → c'est en partie voulu (coût du changement dans un plan figé), mais les plateaux rapportent 400 € par Sprint : un joueur qui a placé la livraison en fin de plan peut encore la retirer au Sprint 3 pour accepter les plateaux, et gagne alors plus qu'en refusant. Un parcours de référence le vérifie, pour que le choix reste réel.
- [Fenêtre de demande trop chargée sur téléphone] → liste des seules fonctionnalités retirables, jauge et message courts ; vérification à 360 px.
- [Libellés d'axe serrés] → mode compact et libellés courts (« +4 sem. »).

## Migration Plan

Aucune donnée à migrer : pas de sauvegarde de partie. Publication par push sur `main`.
