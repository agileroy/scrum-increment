# scrum-increment

**Fournée**, un jeu de formation Scrum pour vivre la valeur de l'incrément (Increment), sans publicité. Jeu frère de [roles-responsabilites](https://github.com/agileroy/roles-responsabilites) et [scrum-events](https://github.com/agileroy/scrum-events), avec une mécanique de simulation plutôt que de cartes.

**Site : [https://agileroy.github.io/scrum-increment/](https://agileroy.github.io/scrum-increment/)**

## Principe

Madame Lefèvre tient la boulangerie du quartier. Elle veut une appli pour que ses clients commandent en ligne, avec un budget de 12 semaines de développement. Le joueur mène le même projet deux fois, avec le même budget, les mêmes fonctionnalités et les mêmes imprévus ; seule la façon de livrer change.

- **Manche 1, en chef de projet** : Mme Lefèvre, la boulangère, veut un cahier des charges complet et contractuel, découpé en lots et chiffré en jours/homme (12 semaines, un COPIL toutes les 2 semaines, une équipe de 6 personnes qui abat 60 jours/homme tous les 15 jours, dont 40 jours/homme de recette et de mise en production finales). Le cahier des charges proposé dépasse de 10 jours/homme : il faut renoncer à quelque chose. Quand le projet devient orageux, le COPIL doit arbitrer avant d'avancer : retirer des lots pas encore commencés, ou maintenir le périmètre. La fenêtre d'une demande de changement montre la météo réelle qui résulterait de la décision, et les décisions d'un COPIL (ou le cahier des charges, avant le premier) se revoient jusqu'au COPIL suivant. Ensuite, chaque COPIL fait ce que fait un vrai COPIL : il compare le temps écoulé au travail fait et donne la météo du projet (« Ensoleillé » tant que le reste tient dans le temps restant, « Orageux » sinon, « Livré » à la sortie). Ni ventes ni clients n'apparaissent en manche 1 avant la sortie de l'appli : c'est au débrief qu'on découvre ce qu'elle n'a pas rapporté.
- **Manche 2, en Product Owner** : un incrément à chaque Sprint de 2 semaines, 10 points pour construire et 2 pour respecter la Definition of Done. Avant chaque Sprint, le joueur réordonne le Product Backlog ; les éléments terminés restent en tête, dans l'ordre où ils ont été terminés. Chaque fonctionnalité terminée est en ligne et rapporte dès le Sprint suivant ; la Sprint Review apporte des retours clients qui révèlent la vraie valeur des fonctionnalités et donnent des indices.
- **Intuition contre réalité** : chaque fonctionnalité affiche l'intuition de Mme Lefèvre (étoiles, expliquées par une légende : son avis sur ce qu'elle va rapporter, pas une mesure) ; sa valeur réelle (ventes par Sprint) est cachée. La livraison et le paiement, jugés indispensables, rapportent peu ; la réservation de pain, les gâteaux sur mesure et l'alerte « fournée chaude » rapportent beaucoup.
- **Demandes de changement** : au bout de 2, 4 et 6 semaines (COPIL 1 à 3 en manche 1, Sprint Reviews 1 à 3 en manche 2), Mme Lefèvre demande une nouvelle fonctionnalité (version anglaise, promotions flash, plateaux pour les entreprises), avec son intuition et une valeur réelle cachée. En manche 1, l'équipe accepte ou refuse : le budget ne bouge pas, donc accepter coûte la fonctionnalité plus 2 points d'avenant (ajoutés à la recette) et oblige à retirer des fonctionnalités pas encore commencées. La décision se prend sur des opinions. En manche 2, la même demande arrive en bas du Product Backlog, sans avenant.
- **Imprévus** : au bout de 4 semaines, la boulangerie concurrente lance sa commande en ligne, et chaque quinzaine sans appli fait perdre 10 % des clients potentiels.
- **Travail sous-estimé** : comme dans la vraie vie, des éléments se révèlent plus gros que prévu quand l'équipe les commence, dans les deux manches : le paiement en ligne (+6 points, soit +30 jours/homme en manche 1 : sécurisation et certification bancaires), les gâteaux sur mesure (+6 points : photos, allergènes et délais) et le créneau click & collect (+4 points : commandes par créneau). Jamais pendant la première période : le premier COPIL et le premier Sprint se passent bien, et un élément commencé en période 1 révèle sa surprise à la suivante. En manche 1 seulement, la recette finale révèle en plus 20 jours/homme d'anomalies à l'intégration ; en manche 2, la Definition of Done de chaque Sprint absorbe ce travail au fil de l'eau. Les éléments affichent alors « 40 + 30 j/h » (manche 1) ou « 8 + 6 pts » (manche 2), la découverte est annoncée dans le bilan et la météo de la manche 1 en tient compte (orageuse dès le COPIL 2 pour un cahier des charges sans marge, ensoleillée jusqu'à la coupure pour un cahier des charges resserré).
- **Coupure sans préavis** : dans toutes les parties, à la fin de la cinquième période (COPIL 5 ou Sprint 5), la banque coupe le prêt et tout s'arrête immédiatement, en l'état : ce qui est en ligne y reste, ce qui attend la recette ne sortira pas. Rien ne l'annonce avant, ni l'accueil ni les bilans.
- **Deux vocabulaires** : la manche 1 parle gestion de projet (chef de projet, la boulangère qui signe, jours/homme, COPIL, cahier des charges, lots, avenant), la manche 2 parle Scrum (Product Owner, Sprint, Product Backlog, Sprint Review, Definition of Done, points). L'écran de transition fait la bascule, et aucune manche n'emploie les mots de l'autre (vérifié par les tests).
- **Fin du projet et exploitation** : la coupure arrête le développement après 10 semaines, au lieu des 12 prévues. Ensuite, ni COPIL ni Sprint : la boulangerie vit avec ce qui est en ligne pendant des semaines d'exploitation, jusqu'à 20 semaines après le lancement du projet.
- **Résultats** : l'écran commence par le débrief, une question à la fois, d'abord sur l'exercice, chiffres à l'appui, puis sur la théorie ; les indicateurs liés à la question (courbe, lignes du tableau, intuition contre réalité) restent cachés jusqu'à ce que le présentateur les révèle, après la discussion, et une vue d'ensemble conclut. Les résultats superposent les deux courbes de ventes cumulées sur 20 semaines (axe en semaines, commun aux deux manches), avec la ligne « Fin du projet » et la zone d'exploitation, comparent des indicateurs (premier euro, argent investi avant le premier euro, fonctionnalités en ligne et peu utilisées, demandes de Mme Lefèvre mises en ligne, ventes cumulées) et révèlent « intuition contre réalité ».

Ordres de grandeur, joués et vérifiés par les tests (ventes cumulées après 20 semaines ; demandes refusées en manche 1 et laissées en bas du Product Backlog en manche 2) :

| Parcours | Ventes |
|---|---|
| Manche 1, cahier des charges de 61 points (tout sauf les avis clients) | 0 € : l'appli ne sort jamais |
| Manche 1, cahier des charges resserré de 39 points (vitrine, réservation, alerte, gâteaux, click & collect, fidélité) | 0 € : le travail découvert (61 points avec la recette) empêche la sortie |
| Manche 1, tout petit cahier des charges de 26 points (vitrine, réservation, alerte, gâteaux) | 12 150 € : sortie au COPIL 4, avec 4 fonctionnalités |
| Manche 2, Product Backlog jamais réordonné | 13 200 € |
| Manche 2, à l'écoute des retours clients | 22 800 € |

Le moteur est déterministe : deux parties jouées de la même façon donnent les mêmes Reviews et les mêmes chiffres, ce qui permet au formateur de préparer son débrief.

## Deux façons de jouer

- **Jouer seul** : les deux manches l'une après l'autre, puis la comparaison. Rien n'est chargé hors du site.
- **En séance (mode collectif)** : le formateur clique sur « Animer une partie » et projette son écran (code de salle, adresse et QR code). Les participants rejoignent depuis leur ordinateur (ou, en dépannage, leur téléphone, par exemple quand le VPN bloque l'ordinateur) avec le code et leur prénom, et sont répartis dans 2 à 6 équipes (Croissant, Baguette, Brioche, Éclair, Chouquette, Fougasse) ; dès l'attente, leur écran raconte le contexte (Mme Lefèvre leur confie son appli) et la démarche de leur équipe. Les équipes jouent en parallèle : les impaires en « projet » (manche 1), les paires en « Scrum » (manche 2) ; l'écran projeté ne dévoile la répartition qu'à la révélation. Chaque membre agit sur le jeu de son équipe depuis son poste (état partagé en temps réel). Le formateur règle un chrono facultatif (1, 2 ou 3 minutes), voit quelles équipes sont prêtes, puis lance chaque période pour toutes les équipes en même temps ; une demande de changement non tranchée est refusée d'office. Son écran reste neutre (« Période 3 sur 6 », « Prête », « En réflexion », fil de la salle) jusqu'à la révélation ; un panneau « Coulisses (à ne pas projeter) », fermé par défaut et refermé à chaque lancement de période, lui donne le fil des décisions de chaque équipe (lots écartés, demandes acceptées ou refusées, arbitrages du COPIL, Product Backlog réordonné, travail découvert). Ce fil est repris dans les résultats pour le débrief. La révélation affiche sur tous les écrans les approches des équipes, puis le débrief question par question : seul le formateur avance et révèle les indicateurs, tous les écrans suivent. Une équipe projet ne peut se déclarer prête qu'après avoir tranché la demande et arbitré un projet orageux ; « Nous ne sommes plus prêts » rouvre ses décisions.
- **Mode démo** : avec `?demo` dans l'adresse (par exemple `http://localhost:8765/?demo`), le mode collectif tourne sans Firebase, sur une base locale partagée entre les onglets du même navigateur : un onglet formateur, plusieurs onglets participants.

## Réseau d'entreprise

Le VPN de l'entreprise (proxy Zscaler) bloque GitHub Pages : jouer hors VPN.

## Architecture

Site statique (HTML/CSS/JavaScript, sans build) publié sur GitHub Pages, polices système, ni CDN ni traceur. Seul le mode collectif utilise un service tiers : Firebase Realtime Database (connexion anonyme), dans un projet Firebase propre au jeu ; le jeu seul ne charge rien d'externe.

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
- `database.rules.json` : règles de sécurité de la base, limitées à la branche `incrementGame` ; `firebase.json` et `.firebaserc` désignent le projet. Les règles sont publiées automatiquement à chaque push sur `main`, après les tests, par le job `rules` du workflow (Firebase CLI avec le compte de service du secret `FIREBASE_SERVICE_ACCOUNT`) ; sans ce secret, le job est sauté avec un avertissement et les règles sont à publier à la main dans la console Firebase.

## Développement

```
npm test                                          # scénario, moteur, salle, base en mémoire et règles
python3 -m http.server 8765 --directory site      # puis http://localhost:8765/ (ou /?demo pour le mode collectif sans Firebase)
```

Chaque push sur `main` lance les tests, publie les règles Firebase puis publie `site/` sur GitHub Pages ; un test en échec bloque les deux publications. Une retouche du scénario qui change l'histoire racontée par les courbes fait échouer les tests des parcours de référence.

## Méthode

Le projet suit le développement piloté par les spécifications avec [OpenSpec](https://github.com/Fission-AI/OpenSpec) : `openspec/specs/` décrit le comportement attendu, `openspec/changes/` les changements en cours. Commandes Claude Code : `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:archive`.
