## MODIFIED Requirements

### Requirement: Plan de la manche 1
Avant le premier COPIL, l'écran du cahier des charges SHALL présenter la mission en briefing : le contexte (Mme Lefèvre, sa boulangerie, l'appli qu'elle vous confie, puis la démarche projet choisie), une réplique de Madame Lefèvre, puis la règle en quatre tuiles chiffrées (12 semaines avec un COPIL toutes les 2 semaines ; 360 j/h, une équipe de 6 personnes abattant 60 jours/homme tous les 15 jours ; 40 j/h de recette et de mise en production finales ; cahier des charges contractuel une fois validé, tout changement passant par un avenant), puis la mission en une phrase juste au-dessus de la jauge, suivie d'une légende qui explique l'intuition (ce que Mme Lefèvre pense que chaque lot va rapporter, de 1 à 5 étoiles : son avis, pas une mesure). L'écran MUST NOT présenter ces règles en paragraphe. Il SHALL lister les lots avec leur rang, leur coût, l'intuition de Mme Lefèvre et leur prérequis. Le joueur SHALL pouvoir retirer ou remettre un lot et changer son rang. Une jauge SHALL comparer la charge planifiée aux 320 jours/homme, et un message SHALL dire ce qui bloque ou que le cahier des charges tient. La validation SHALL rester inactive tant qu'il est invalide.

#### Scenario: Dépassement
- **GIVEN** le cahier des charges initial de 66 points
- **WHEN** l'écran s'affiche
- **THEN** la jauge est rouge, le message indique un dépassement de 10 jours/homme et la validation est impossible

#### Scenario: Prérequis retiré
- **GIVEN** un cahier des charges qui contient le paiement en ligne
- **WHEN** le joueur retire la réservation de pain
- **THEN** le message indique que « Paiement en ligne » nécessite « Réservation de pain » et la validation est impossible

#### Scenario: Briefing lisible d'un coup d'œil
- **GIVEN** un téléphone de 360 px de large
- **WHEN** l'écran du cahier des charges s'affiche
- **THEN** la réplique de Mme Lefèvre et les quatre tuiles (12 semaines, 360 j/h, 40 j/h, contrat) tiennent sans défilement horizontal, et la phrase de mission précède la jauge

#### Scenario: Intuition expliquée
- **GIVEN** l'écran du cahier des charges
- **WHEN** le joueur lit la mission
- **THEN** une légende sous la mission explique que les étoiles « Intuition » sont l'avis de Mme Lefèvre sur ce que chaque lot va rapporter, pas une mesure

### Requirement: Fenêtre de demande de changement (manche 1)
En manche 1, quand un COPIL annonce une demande de la boulangère, le compte rendu SHALL ensuite présenter la demande en deux temps. D'abord la situation : la réplique de Mme Lefèvre, la charge de la demande (jours/homme de lot et 10 jours/homme de recette pour l'avenant), l'intuition de Mme Lefèvre, puis deux choix côte à côte. « Si vous acceptez » SHALL dire combien de jours/homme de lots pas commencés il faudra retirer au moins, en distinguant ce qu'impose le budget signé (obligatoire) et ce qu'impose de finir dans les temps, travail découvert compris ; ou que rien n'est à retirer ; ou que c'est impossible. « Si vous refusez » SHALL dire si le projet tient dans les temps, ou de combien le travail découvert le dépasse déjà, le COPIL devant alors arbitrer quand même. Ensuite, si l'équipe accepte et qu'il faut retirer des lots : les lots pas commencés avec des cases à cocher, une jauge du retiré face à l'objectif, l'état du budget signé et des délais, « Signer l'avenant » (inactif tant que le budget signé n'est pas tenu ou qu'un prérequis manque) et « Revenir au choix ». « Refuser » SHALL toujours être possible ; fermer la fenêtre MUST NOT trancher la demande à la place du joueur.

#### Scenario: Situation au COPIL 2
- **GIVEN** le cahier des charges sans les avis clients, le paiement découvert, la demande « Promotions flash »
- **WHEN** la fenêtre s'affiche
- **THEN** « Si vous acceptez » demande de retirer au moins 55 jours/homme (25 pour le budget signé, 55 pour les délais), et « Si vous refusez » annonce que le travail découvert dépasse déjà le temps restant de 15 jours/homme

#### Scenario: Faire de la place
- **GIVEN** la même situation, le joueur ayant choisi d'accepter
- **WHEN** il coche la livraison et la fidélité (105 jours/homme)
- **THEN** le budget signé est tenu, le projet reste dans les temps, et « Signer l'avenant » est actif

#### Scenario: Touche Échap
- **GIVEN** la fenêtre d'une demande de changement
- **WHEN** le joueur appuie sur Échap
- **THEN** la fenêtre reste ouverte et la demande n'est ni acceptée ni refusée

### Requirement: Demandes visibles dans les listes
Une fonctionnalité issue d'une demande SHALL être signalée comme « Demande de la boulangère » dans le cahier des charges et comme « Demande de Mme Lefèvre » dans le Product Backlog. Le journal SHALL garder chaque demande et la décision prise : acceptée par avenant avec les lots retirés, refusée, ou ajoutée au Product Backlog.

#### Scenario: Journal de la manche 1
- **GIVEN** une demande refusée au COPIL 1
- **WHEN** le joueur lit les comptes rendus de COPIL
- **THEN** il y trouve la demande de la version anglaise et son refus

### Requirement: Annonce du travail sous-estimé
Le compte rendu de COPIL ou la Sprint Review de la période SHALL annoncer chaque découverte de travail sous-estimé dans le vocabulaire de la manche, avec un pictogramme, et l'élément concerné SHALL afficher son coût sous la forme « coût prévu + travail découvert » (par exemple « 40 + 30 j/h » en manche 1, « 8 + 6 pts » en manche 2).

#### Scenario: Découverte annoncée au COPIL
- **GIVEN** la manche 1, le paiement en ligne commencé pendant la période 2
- **WHEN** le compte rendu du COPIL 2 s'affiche
- **THEN** il annonce que la banque exige une sécurisation et une certification (+30 jours/homme), et le lot affiche « 40 + 30 j/h »

## ADDED Requirements

### Requirement: Répliques de Mme Lefèvre
Chaque réplique de Mme Lefèvre (briefings, attente de la salle, demande de changement) SHALL s'afficher en bulle, à côté d'un avatar de boulangère (👩‍🍳), entre un guillemet ouvrant et un guillemet fermant, et signée « Madame Lefèvre, la boulangère ».

#### Scenario: Guillemets fermés
- **GIVEN** l'écran du cahier des charges
- **WHEN** la réplique s'affiche
- **THEN** elle s'ouvre sur « et se termine par », avec la signature « Madame Lefèvre, la boulangère »

### Requirement: Annonces illustrées
Les comptes rendus et Sprint Reviews SHALL illustrer leurs annonces d'un émoji : sortie de l'appli (🎉) et mise en ligne (🚀), avec une courte animation désactivée si le système demande moins d'animations ; travail sous-estimé (🔍) ; imprévus (leur pictogramme) ; demande de changement (📨). Les listes, la fenêtre de demande et « Intuition contre réalité » SHALL afficher le pictogramme de chaque fonctionnalité devant son nom.

#### Scenario: Mise en ligne
- **GIVEN** la manche 2, la vitrine terminée au Sprint 1
- **WHEN** la Sprint Review s'affiche
- **THEN** elle annonce « Mis en ligne : 🏪 Vitrine en ligne » avec une fusée

### Requirement: Intuition expliquée dans le Product Backlog
Le tableau des deux manches SHALL rappeler, sous le titre de la liste, ce que représentent les étoiles « Intuition », dans le vocabulaire de la manche.

#### Scenario: Légende en manche 2
- **GIVEN** la manche 2
- **WHEN** le Product Backlog s'affiche
- **THEN** une légende précédée d'étoiles dit que l'intuition est l'avis de Mme Lefèvre, et que les Sprint Reviews diront ce qu'en pensent ses clients

### Requirement: Fenêtre d'arbitrage (manche 1)
Quand le projet est orageux, le tableau de la manche 1 SHALL afficher un bandeau d'orage qui exige l'arbitrage, avec « Arbitrer : retirer des lots » et « Maintenir le périmètre », et le bouton pour avancer au COPIL suivant SHALL rester inactif tant que le COPIL n'a pas arbitré. Le compte rendu du COPIL SHALL annoncer l'arbitrage à venir. La fenêtre d'arbitrage SHALL donner le reste à faire et le temps restant en jours/homme, lister les lots pas commencés avec des cases à cocher, montrer le reste à faire après arbitrage face au temps restant, et dire si le projet repasserait au soleil. « Retirer ces lots » SHALL rester inactif tant que rien n'est coché ou qu'un prérequis manque.

#### Scenario: Arbitrer au COPIL 2
- **GIVEN** le cahier des charges sans les avis clients, orageux au COPIL 2
- **WHEN** le joueur ouvre l'arbitrage et coche la livraison, la fidélité et le click & collect
- **THEN** la fenêtre annonce que le projet repasse au soleil, et après confirmation le tableau est ensoleillé et le joueur peut avancer

#### Scenario: Maintenir le périmètre
- **GIVEN** un projet orageux
- **WHEN** le joueur choisit « Maintenir le périmètre »
- **THEN** il peut avancer au COPIL suivant, le journal indique « périmètre maintenu malgré l'orage », et il peut encore retirer des lots

### Requirement: Revoir les décisions du COPIL
Tant que le COPIL suivant n'a pas eu lieu, le tableau de la manche 1 SHALL proposer, à côté du bouton pour avancer, « Revoir les décisions du COPIL » dès qu'une décision a été prise depuis le dernier COPIL ; la demande de changement éventuelle rouvre alors sa fenêtre. Avant le premier COPIL, le bouton s'appelle « Revoir le cahier des charges » et ramène au cahier des charges, à nouveau modifiable.

#### Scenario: Changer d'avis
- **GIVEN** la demande « Version anglaise » refusée au COPIL 1
- **WHEN** le joueur choisit « Revoir les décisions du COPIL »
- **THEN** la fenêtre de la demande se rouvre pour accepter ou refuser à nouveau

### Requirement: Valeur révélée en Sprint Review
En manche 2, quand des fonctionnalités sont mises en ligne, la Sprint Review SHALL dire, pour chacune, ce qu'elle rapporte vraiment par Sprint à côté de l'intuition de Mme Lefèvre, et le Product Backlog SHALL afficher cette valeur en badge (« 💶 Ventes réelles : 200 € / Sprint ») à la place de « Ventes réelles : ? ».

#### Scenario: Vitrine en ligne
- **GIVEN** la vitrine terminée au Sprint 1
- **WHEN** la Sprint Review s'affiche
- **THEN** elle indique que la vitrine rapporte 200 € par Sprint, pour une intuition de 3 étoiles, et le Product Backlog affiche le badge

#### Scenario: Revoir le cahier des charges
- **GIVEN** le cahier des charges validé, avant le premier COPIL
- **WHEN** le joueur choisit « Revoir le cahier des charges »
- **THEN** il retrouve l'écran du cahier des charges, peut retirer ou remettre des lots et le valider de nouveau

### Requirement: Éléments terminés en tête du Product Backlog
En manche 2, les éléments terminés SHALL se placer en tête du Product Backlog, dans l'ordre où ils ont été terminés. Aucun élément MUST NOT pouvoir passer au-dessus d'eux, ni par les flèches ni par le glisser-déposer. Un élément en cours SHALL pouvoir être redescendu : il ne reçoit alors du travail qu'une fois servis les éléments au-dessus de lui.

#### Scenario: Flèche bloquée sous les éléments terminés
- **GIVEN** la vitrine terminée au Sprint 1, en tête
- **WHEN** le joueur regarde l'élément suivant
- **THEN** sa flèche vers le haut est inactive, et le glisser au rang 1 le laisse au rang 2
