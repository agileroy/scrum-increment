## Why

Troisième remarque du test de l'auteur : pendant la partie, l'écran du formateur est presque vide (période, équipes, « En réflexion »). Le formateur ne sait pas ce qui se passe dans les équipes : quelles demandes de la commanditaire ont été acceptées ou refusées, quels lots ont été retirés en échange, comment les Product Backlogs ont été réordonnés. Il en a besoin pour animer (relancer une équipe, préparer ses questions de débrief) et pour raconter la partie au débrief.

Contrainte : cet écran est projeté et doit rester neutre jusqu'à la révélation (les équipes ne savent pas qu'elles ne travaillent pas de la même façon). Un récap des décisions sur l'écran projeté trahirait les approches : seules les équipes « projet » acceptent ou refusent une demande et retirent des lots.

## What Changes

- **Coulisses du formateur** : sur l'écran du formateur, un panneau « Coulisses », fermé par défaut et signalé « À ne pas projeter », qui donne pour chaque équipe le fil de ses décisions dans son vocabulaire :
  - équipe « projet » : cahier des charges validé (points, lots écartés), chaque demande de la commanditaire et sa décision (acceptée par avenant en retirant tel lot, refusée, refusée faute de décision), avancement et météo du dernier COPIL, sortie de l'appli ;
  - équipe « Scrum » : ordre du Product Backlog joué à chaque Sprint et ce qui a bougé depuis le Sprint précédent (« Alerte fournée chaude remontée de 5 à 2 »), fonctionnalités mises en ligne, demandes de Mme Lefèvre ajoutées et où elles ont été placées ;
  - pour toutes : depuis combien de temps l'équipe est prête, membres actifs.
  Le panneau se referme tout seul quand le formateur lance une période, pour ne pas rester affiché par mégarde.
- **Écran projeté** : la vue neutre gagne un fil neutre sans approche (« Période 3 lancée », « Croissant est prête », « Baguette n'est plus prête ») pour qu'il ne paraisse plus vide.
- **Après la révélation** : le même fil, par équipe, s'affiche dans les résultats (section « Ce qu'ont décidé les équipes »), pour nourrir le débrief.
- **Moteur** : chaque période jouée retient l'ordre de la liste à son début, pour pouvoir dire ce qui a bougé (le journal ne le garde pas aujourd'hui).

## Capabilities

### New Capabilities
_Aucune._

### Modified Capabilities
- `facilitation` : coulisses du formateur, fil neutre sur l'écran projeté ; le suivi neutre autorise désormais le formateur à lire l'état des équipes pour ses coulisses.
- `team-results` : fil des décisions de chaque équipe après la révélation.
- `sprint-simulation` : l'ordre de la liste au début de chaque période est journalisé.

## Impact

- `site/js/game-core.js` (ordre journalisé à chaque période ; fonction pure `decisionTrail(state)` qui produit le fil des décisions en faits), `site/js/vocabulary.js` (phrases du fil, par manche), `site/js/room-ui.js` (panneau Coulisses, fil neutre, section des résultats), `site/app.css`.
- Aucune nouvelle donnée en base ni changement des règles Firebase : tout se déduit de l'état des équipes, déjà lisible par le formateur.
