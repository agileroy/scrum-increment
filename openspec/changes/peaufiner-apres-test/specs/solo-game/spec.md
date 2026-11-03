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
En manche 1, quand un COPIL annonce une demande de la boulangère, le compte rendu SHALL ensuite présenter la demande : réplique de Mme Lefèvre, coût, intuition de Mme Lefèvre et avenant de 10 jours/homme. La phrase sur l'avenant SHALL dépendre de la marge : si la demande tient déjà dans le budget sans rien retirer, elle dit que le cahier des charges garde assez de marge et qu'il n'y a rien à retirer ; sinon, qu'il faut retirer des lots pas encore commencés. La fenêtre SHALL lister les lots retirables avec des cases à cocher, une jauge du cahier des charges par rapport au nouveau budget et un message sur ce qui bloque. « Accepter (avenant) » SHALL rester inactif tant que le résultat est invalide ; « Refuser » SHALL toujours être possible. Fermer la fenêtre MUST NOT trancher la demande à la place du joueur.

#### Scenario: Faire de la place
- **GIVEN** la demande « Version anglaise » avec le cahier des charges de 61 points
- **WHEN** le joueur coche la livraison à domicile (14 points, pas commencée)
- **THEN** la jauge passe à 260 sur 310 jours/homme et « Accepter (avenant) » devient actif

#### Scenario: Touche Échap
- **GIVEN** la fenêtre d'une demande de changement
- **WHEN** le joueur appuie sur Échap
- **THEN** la fenêtre reste ouverte et la demande n'est ni acceptée ni refusée

#### Scenario: Demande qui tient dans la marge
- **GIVEN** un cahier des charges de 130 jours/homme et la demande « Version anglaise » (25 jours/homme)
- **WHEN** la fenêtre s'affiche
- **THEN** elle dit que le cahier des charges garde assez de marge, qu'il n'y a rien à retirer, et « Accepter (avenant) » est actif sans rien cocher

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
Quand l'arbitrage est possible, le tableau de la manche 1 SHALL l'annoncer dans un bandeau d'orage avec un bouton « Arbitrer : retirer des lots », et le compte rendu du COPIL SHALL le rappeler. La fenêtre SHALL donner le reste à faire et le temps restant en jours/homme, lister les lots pas commencés avec des cases à cocher, montrer une jauge du reste à faire après arbitrage face au temps restant, et dire si le projet repasserait au soleil ou combien il manquerait encore. « Retirer ces lots » SHALL rester inactif tant que rien n'est coché ou qu'un prérequis manque ; « Annuler » ne change rien.

#### Scenario: Arbitrer au COPIL 2
- **GIVEN** le cahier des charges sans les avis clients, orageux au COPIL 2
- **WHEN** le joueur ouvre l'arbitrage et coche la livraison, la fidélité et le click & collect
- **THEN** la fenêtre annonce que le projet repasse au soleil, et après confirmation le tableau est ensoleillé, sans bandeau d'arbitrage

### Requirement: Valeur révélée en Sprint Review
En manche 2, quand des fonctionnalités sont mises en ligne, la Sprint Review SHALL dire, pour chacune, ce qu'elle rapporte vraiment par Sprint à côté de l'intuition de Mme Lefèvre, et le Product Backlog SHALL afficher cette valeur en badge (« 💶 Ventes réelles : 200 € / Sprint ») à la place de « Ventes réelles : ? ».

#### Scenario: Vitrine en ligne
- **GIVEN** la vitrine terminée au Sprint 1
- **WHEN** la Sprint Review s'affiche
- **THEN** elle indique que la vitrine rapporte 200 € par Sprint, pour une intuition de 3 étoiles, et le Product Backlog affiche le badge
