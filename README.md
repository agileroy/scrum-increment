# scrum-increment

**Fournée**, un jeu de formation Scrum pour vivre la valeur de l'incrément (Increment), sans publicité. Jeu frère de [roles-responsabilites](https://github.com/agileroy/roles-responsabilites) et [scrum-events](https://github.com/agileroy/scrum-events), avec une mécanique de simulation plutôt que de cartes.

**Site : [https://agileroy.github.io/scrum-increment/](https://agileroy.github.io/scrum-increment/)**

## Principe

Madame Lefèvre tient la boulangerie du quartier. Elle veut une appli pour que ses clients commandent en ligne, avec un budget de 12 semaines de développement. Le joueur mène le même projet deux fois, avec le même budget, les mêmes fonctionnalités et les mêmes imprévus ; seule la façon de livrer change.

- **Manche 1, en chef de projet** : la commanditaire veut un cahier des charges complet et contractuel, découpé en lots (12 semaines, un COPIL toutes les 2 semaines, 12 points tous les 15 jours dont 8 points de recette et de mise en production finales). Le cahier des charges proposé dépasse de 2 points : il faut renoncer à quelque chose. Ensuite, chaque COPIL donne l'avancement et la météo du projet (« Ensoleillé » tant que le reste tient dans le temps restant, « Orageux » sinon, « Livré » à la sortie)… mais il n'y a ni vente ni retour client avant la sortie.
- **Manche 2, en Product Owner** : un incrément à chaque Sprint de 2 semaines, 10 points pour construire et 2 pour respecter la Definition of Done. Avant chaque Sprint, le joueur réordonne le Product Backlog. Chaque fonctionnalité terminée est en ligne et rapporte dès le Sprint suivant ; la Sprint Review apporte des retours clients qui révèlent la vraie valeur des fonctionnalités et donnent des indices.
- **Intuition contre réalité** : chaque fonctionnalité affiche l'intuition de Mme Lefèvre (étoiles) ; sa valeur réelle (ventes par Sprint) est cachée. La livraison et le paiement, jugés indispensables, rapportent peu ; la réservation de pain, les gâteaux sur mesure et l'alerte « fournée chaude » rapportent beaucoup.
- **Demandes de changement** : au bout de 2, 4 et 6 semaines (COPIL 1 à 3 en manche 1, Sprint Reviews 1 à 3 en manche 2), Mme Lefèvre demande une nouvelle fonctionnalité (version anglaise, promotions flash, plateaux pour les entreprises), avec son intuition et une valeur réelle cachée. En manche 1, l'équipe accepte ou refuse : le budget ne bouge pas, donc accepter coûte la fonctionnalité plus 2 points d'avenant (ajoutés à la recette) et oblige à retirer des fonctionnalités pas encore commencées. La décision se prend sur des opinions. En manche 2, la même demande arrive en bas du Product Backlog, sans avenant.
- **Imprévus** : au bout de 4 semaines, la boulangerie concurrente lance sa commande en ligne, et chaque quinzaine sans appli fait perdre 10 % des clients potentiels.
- **Coupure sans préavis** : dans toutes les parties, à la fin de la cinquième période (COPIL 5 ou Sprint 5), la banque coupe le prêt et tout s'arrête immédiatement, en l'état : ce qui est en ligne y reste, ce qui attend la recette ne sortira pas. Rien ne l'annonce avant, ni l'accueil ni les bilans : la météo de la manche 1 reste au soleil jusqu'au COPIL 4.
- **Deux vocabulaires** : la manche 1 parle gestion de projet (chef de projet, commanditaire, COPIL, cahier des charges, lots, avenant), la manche 2 parle Scrum (Product Owner, Sprint, Product Backlog, Sprint Review, Definition of Done). L'écran de transition fait la bascule, et aucune manche n'emploie les mots de l'autre (vérifié par les tests).
- **Fin du projet et exploitation** : la coupure arrête le développement après 10 semaines, au lieu des 12 prévues. Ensuite, ni COPIL ni Sprint : la boulangerie vit avec ce qui est en ligne pendant des semaines d'exploitation, jusqu'à 20 semaines après le lancement du projet.
- **Résultats** : l'écran superpose les deux courbes de ventes cumulées sur 20 semaines (axe en semaines, commun aux deux manches), avec la ligne « Fin du projet » et la zone d'exploitation, compare des indicateurs (premier euro, argent investi avant le premier euro, fonctionnalités en ligne et peu utilisées, demandes de Mme Lefèvre mises en ligne, ventes cumulées), révèle « intuition contre réalité » et propose des questions de débrief.

Ordres de grandeur, joués et vérifiés par les tests (ventes cumulées après 20 semaines ; demandes refusées en manche 1 et laissées en bas du Product Backlog en manche 2) :

| Parcours | Ventes |
|---|---|
| Manche 1, cahier des charges de 61 points (tout sauf les avis clients) | 0 € : l'appli ne sort jamais |
| Manche 1, cahier des charges resserré de 39 points (vitrine, réservation, alerte, gâteaux, click & collect, fidélité) | 16 038 € : sortie au COPIL 4, avant la coupure |
| Manche 2, Product Backlog jamais réordonné | 13 300 € |
| Manche 2, à l'écoute des retours clients | 25 300 € |

Le moteur est déterministe : deux parties jouées de la même façon donnent les mêmes Reviews et les mêmes chiffres, ce qui permet au formateur de préparer son débrief.

## Deux façons de jouer

- **Jouer seul** : les deux manches l'une après l'autre, puis la comparaison. Rien n'est chargé hors du site.
- **En séance (mode collectif)** : le formateur clique sur « Animer une partie » et projette son écran (code de salle, adresse et QR code). Les participants rejoignent depuis leur téléphone avec le code et leur prénom, et sont répartis dans 2 à 6 équipes (Croissant, Baguette, Brioche, Éclair, Chouquette, Fougasse). Les équipes jouent en parallèle : les impaires en « projet » (manche 1), les paires en « Scrum » (manche 2), sans le savoir. Chaque membre agit sur le jeu de son équipe depuis son téléphone (état partagé en temps réel). Le formateur règle un chrono facultatif (1, 2 ou 3 minutes), voit quelles équipes sont prêtes, puis lance chaque période pour toutes les équipes en même temps ; une demande de changement non tranchée est refusée d'office. Son écran reste neutre (« Période 3 sur 6 », « Prête », « En réflexion ») jusqu'à la révélation, qui affiche sur tous les écrans les courbes de toutes les équipes, leurs approches et les indicateurs par équipe.
- **Mode démo** : avec `?demo` dans l'adresse (par exemple `http://localhost:8765/?demo`), le mode collectif tourne sans Firebase, sur une base locale partagée entre les onglets du même navigateur : un onglet formateur, plusieurs onglets participants.

## Réseau d'entreprise

Le VPN de l'entreprise (proxy Zscaler) bloque GitHub Pages : jouer hors VPN.

## Architecture

Site statique (HTML/CSS/JavaScript, sans build) publié sur GitHub Pages, polices système, ni CDN ni traceur. Seul le mode collectif utilise un service tiers : Firebase Realtime Database (connexion anonyme), dans le projet partagé avec les jeux frères ; le jeu seul ne charge rien d'externe.

- `site/js/scenario.js` : données du scénario (fonctionnalités, demandes de changement, retours clients, imprévus, calendrier, constantes) ;
- `site/js/game-core.js` : logique métier pure et déterministe (plan, Sprints, construction dans l'ordre, prérequis, mises en ligne, demandes de changement et avenants, ventes, clients perdus, coupure, calendrier, résultats), testée avec Node.js ; l'état d'une manche est un objet JSON simple ;
- `site/js/vocabulary.js` : vocabulaire de chaque manche ; toutes les phrases propres à une manche sont ici, le moteur ne produit que des faits ;
- `site/js/chart.js` : graphique SVG des ventes cumulées ;
- `site/js/ui.js` : écrans et fenêtres, réutilisés par une équipe du mode collectif (toute action passe par `act(fn)`) ; `site/js/theme.js` : thème clair ou sombre ; `site/js/app.js` : point d'entrée, qui ne charge le mode collectif qu'à la demande ;
- `site/js/room-core.js` : logique pure de la salle (code, prénoms, équipes, état « prêt », chrono) ;
- `site/js/room-store.js` : actions sur la base (salle, équipes, transactions d'équipe, lancement des périodes, révélation) ;
- `site/js/room-ui.js` : écran du formateur et écrans des participants ;
- `site/js/firebase-db.js` (seul module qui parle à Firebase), `site/js/memory-db.js` (même interface en mémoire, pour les tests et le mode démo), `site/js/firebase-config.js` ;
- `site/vendor/qrcode-generator-1.4.4.js` : QR code de la salle (licence MIT) ;
- `database.rules.json` : règles de sécurité de la base partagée, branche `incrementGame` ; le fichier doit rester identique dans les 7 dépôts qui partagent le projet Firebase, et se publie à la main dans la console Firebase (Realtime Database, onglet Règles).

## Développement

```
npm test                                          # scénario, moteur, salle, base en mémoire et règles
python3 -m http.server 8765 --directory site      # puis http://localhost:8765/ (ou /?demo pour le mode collectif sans Firebase)
```

Chaque push sur `main` lance les tests puis publie `site/` sur GitHub Pages ; un test en échec bloque la publication. Une retouche du scénario qui change l'histoire racontée par les courbes fait échouer les tests des parcours de référence.

## Méthode

Le projet suit le développement piloté par les spécifications avec [OpenSpec](https://github.com/Fission-AI/OpenSpec) : `openspec/specs/` décrit le comportement attendu, `openspec/changes/` les changements en cours. Commandes Claude Code : `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:archive`.
