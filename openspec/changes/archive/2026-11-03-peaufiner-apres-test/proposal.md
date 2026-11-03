## Why

Deuxième test de l'auteur, après les briefings, les COPIL sans ventes, les coulisses et le travail sous-estimé :

- les participants arrivent dans la salle sans savoir pour qui ils travaillent ni pourquoi ;
- les étoiles « Intuition » ne sont expliquées nulle part ;
- l'ensemble reste austère : pas une image, pas un pictogramme ;
- au débrief, les indicateurs s'affichent avant les questions : les chiffres orientent la discussion avant qu'elle commence ;
- les répliques de Mme Lefèvre ouvrent un guillemet sans le fermer, et « la commanditaire » sonne jargon ;
- en manche 1, le premier COPIL annonce deux découvertes de travail sous-estimé d'un coup (vitrine et réservation) : le projet démarre sous l'orage, alors qu'un premier sprint doit bien se passer pour que la suite surprenne ;
- dans la fenêtre de demande de changement, la phrase « Il faut donc retirer… des lots » est fausse quand la demande tient déjà dans la marge.

## What Changes

- **Contexte de la mission** : dès l'attente de la salle, le téléphone de chaque participant raconte l'histoire (Mme Lefèvre, sa boulangerie, l'appli qu'elle confie à l'équipe) et donne la démarche de son équipe (démarche projet ou Scrum) ; le premier écran de l'équipe la reprend au lancement. L'écran projeté du formateur reste neutre jusqu'à la révélation.
- **Intuition expliquée** : une légende sous la mission (cahier des charges, Product Backlog) dit ce que représentent les étoiles : l'avis de Mme Lefèvre sur ce que chaque fonctionnalité va rapporter, pas une mesure.
- **Pictogrammes** : chaque fonctionnalité et chaque demande a son émoji (🥖 réservation, 🎂 gâteaux…), un avatar 👩‍🍳 accompagne les répliques de Mme Lefèvre, et les annonces (travail sous-estimé, nouvelles, demande, sortie de l'appli) ont leur pictogramme. Aucun fichier ni GIF externe : le jeu solo reste sans requête externe.
- **Débrief d'abord** : « Pour le débrief » passe en tête des résultats, avant la courbe ; « Les indicateurs » devient un panneau dépliable, plié par défaut.
- **Répliques** : guillemets ouvrants et fermants ; Mme Lefèvre est « la boulangère » partout où elle était « la commanditaire ».
- **Travail sous-estimé déplacé** : plus rien sur la vitrine ni la réservation ; les découvertes portent sur le paiement en ligne (+6), les gâteaux sur mesure (+6) et le créneau click & collect (+4), plus la recette (+4) en manche 1. Aucune découverte possible au premier COPIL ni au premier Sprint, quel que soit l'ordre.
- **Jours/homme en projet** : la manche 1 compte la charge en jours/homme (1 point du moteur = 5 jours/homme : une équipe de 6 personnes abat 60 jours/homme en 2 semaines, 360 au total, 40 de recette, 320 à répartir) ; la manche 2 garde les points. Aucun mot de l'une dans l'autre.
- **Arbitrage du COPIL** : quand le projet est orageux (reste à faire au-delà du temps restant), le COPIL peut retirer du cahier des charges des lots pas encore commencés, sans attendre une demande de la boulangère.
- **Ordinateur d'abord** : les textes ne présentent plus le téléphone comme le poste des participants ; ils jouent sur leur ordinateur, le téléphone restant un dépannage.
- **Arbitrage obligatoire et décisions révisables** : à chaque COPIL orageux, le COPIL doit arbitrer (retirer des lots ou maintenir le périmètre) avant d'avancer ou d'être prêt ; la fenêtre de demande montre la météo réelle qui résulterait de la décision ; les décisions d'un COPIL se revoient jusqu'au lancement suivant (« Nous ne sommes plus prêts » rouvre la demande).
- **Débrief question par question** : une question à la fois, avec seulement ses indicateurs, révélés par le présentateur après la discussion (le formateur en salle, pour tous les écrans) ; une vue d'ensemble à la fin.
- **Valeur révélée visible** : la Sprint Review dit ce que rapporte vraiment chaque fonctionnalité mise en ligne, et le Product Backlog l'affiche en badge.
- **Demande de changement** : la phrase sur l'avenant dépend de la marge : « la marge suffit, rien à retirer » quand la demande tient déjà, la phrase actuelle sinon.

## Capabilities

### New Capabilities
_Aucune._

### Modified Capabilities
- `scenario` : nouvelles découvertes de travail sous-estimé ; pictogramme de chaque fonctionnalité.
- `sprint-simulation` : aucune découverte au premier COPIL ou Sprint ; arbitrage du périmètre en manche 1.
- `solo-game` : contexte et légende de l'intuition sur le cahier des charges, répliques, phrase d'avenant selon la marge, annonce des découvertes, pictogrammes.
- `round-vocabulary` : Mme Lefèvre est la boulangère ; jours/homme en manche 1.
- `game-results` : débrief en tête, indicateurs pliés.
- `team-results` : même ordre en équipes ; vocabulaire.
- `facilitation` : vocabulaire des coulisses.
- `team-play` : contexte et démarche de l'équipe dès l'attente.
- `game-room` : la démarche de chaque équipe est donnée à ses membres dès l'attente (l'écran projeté reste neutre).

## Impact

- `site/js/scenario.js` (découvertes, émojis), `site/js/vocabulary.js` (la boulangère, contexte, légende), `site/js/ui.js` (pictogrammes, fenêtre de demande, ordre des résultats), `site/js/room-ui.js` (attente), `site/index.html`, `site/app.css`, tests et README.
- Nouveaux chiffres de référence (manche 2 surtout) : voir la conception.
