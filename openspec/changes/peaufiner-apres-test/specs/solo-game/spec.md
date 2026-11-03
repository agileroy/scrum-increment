## MODIFIED Requirements

### Requirement: Plan de la manche 1
Avant le premier COPIL, l'écran du cahier des charges SHALL présenter la mission en briefing : le contexte (Mme Lefèvre, sa boulangerie, l'appli qu'elle vous confie, puis la démarche projet choisie), une réplique de Madame Lefèvre, puis la règle en quatre tuiles chiffrées (12 semaines avec un COPIL toutes les 2 semaines ; 72 points, l'équipe abattant 12 points tous les 15 jours ; 8 points de recette et de mise en production finales ; cahier des charges contractuel une fois validé, tout changement passant par un avenant), puis la mission en une phrase juste au-dessus de la jauge, suivie d'une légende qui explique l'intuition (ce que Mme Lefèvre pense que chaque lot va rapporter, de 1 à 5 étoiles : son avis, pas une mesure). L'écran MUST NOT présenter ces règles en paragraphe. Il SHALL lister les lots avec leur rang, leur coût, l'intuition de Mme Lefèvre et leur prérequis. Le joueur SHALL pouvoir retirer ou remettre un lot et changer son rang. Une jauge SHALL comparer les points planifiés aux 64 points, et un message SHALL dire ce qui bloque ou que le cahier des charges tient. La validation SHALL rester inactive tant qu'il est invalide.

#### Scenario: Dépassement
- **GIVEN** le cahier des charges initial de 66 points
- **WHEN** l'écran s'affiche
- **THEN** la jauge est rouge, le message indique un dépassement de 2 points et la validation est impossible

#### Scenario: Prérequis retiré
- **GIVEN** un cahier des charges qui contient le paiement en ligne
- **WHEN** le joueur retire la réservation de pain
- **THEN** le message indique que « Paiement en ligne » nécessite « Réservation de pain » et la validation est impossible

#### Scenario: Briefing lisible d'un coup d'œil
- **GIVEN** un téléphone de 360 px de large
- **WHEN** l'écran du cahier des charges s'affiche
- **THEN** la réplique de Mme Lefèvre et les quatre tuiles (12 semaines, 72 points, 8 points, contrat) tiennent sans défilement horizontal, et la phrase de mission précède la jauge

#### Scenario: Intuition expliquée
- **GIVEN** l'écran du cahier des charges
- **WHEN** le joueur lit la mission
- **THEN** une légende sous la mission explique que les étoiles « Intuition » sont l'avis de Mme Lefèvre sur ce que chaque lot va rapporter, pas une mesure

### Requirement: Fenêtre de demande de changement (manche 1)
En manche 1, quand un COPIL annonce une demande de la boulangère, le compte rendu SHALL ensuite présenter la demande : réplique de Mme Lefèvre, coût, intuition de Mme Lefèvre et avenant de 2 points. La phrase sur l'avenant SHALL dépendre de la marge : si la demande tient déjà dans le budget sans rien retirer, elle dit que le cahier des charges garde assez de marge et qu'il n'y a rien à retirer ; sinon, qu'il faut retirer des lots pas encore commencés. La fenêtre SHALL lister les lots retirables avec des cases à cocher, une jauge du cahier des charges par rapport au nouveau budget et un message sur ce qui bloque. « Accepter (avenant) » SHALL rester inactif tant que le résultat est invalide ; « Refuser » SHALL toujours être possible. Fermer la fenêtre MUST NOT trancher la demande à la place du joueur.

#### Scenario: Faire de la place
- **GIVEN** la demande « Version anglaise » avec le cahier des charges de 61 points
- **WHEN** le joueur coche la livraison à domicile (14 points, pas commencée)
- **THEN** la jauge passe à 52 points sur 62 et « Accepter (avenant) » devient actif

#### Scenario: Touche Échap
- **GIVEN** la fenêtre d'une demande de changement
- **WHEN** le joueur appuie sur Échap
- **THEN** la fenêtre reste ouverte et la demande n'est ni acceptée ni refusée

#### Scenario: Demande qui tient dans la marge
- **GIVEN** un cahier des charges de 26 points et la demande « Version anglaise » (5 points)
- **WHEN** la fenêtre s'affiche
- **THEN** elle dit que le cahier des charges garde assez de marge, qu'il n'y a rien à retirer, et « Accepter (avenant) » est actif sans rien cocher

### Requirement: Demandes visibles dans les listes
Une fonctionnalité issue d'une demande SHALL être signalée comme « Demande de la boulangère » dans le cahier des charges et comme « Demande de Mme Lefèvre » dans le Product Backlog. Le journal SHALL garder chaque demande et la décision prise : acceptée par avenant avec les lots retirés, refusée, ou ajoutée au Product Backlog.

#### Scenario: Journal de la manche 1
- **GIVEN** une demande refusée au COPIL 1
- **WHEN** le joueur lit les comptes rendus de COPIL
- **THEN** il y trouve la demande de la version anglaise et son refus

### Requirement: Annonce du travail sous-estimé
Le compte rendu de COPIL ou la Sprint Review de la période SHALL annoncer chaque découverte de travail sous-estimé dans le vocabulaire de la manche, avec un pictogramme, et l'élément concerné SHALL afficher son coût sous la forme « coût prévu + travail découvert » (par exemple « 8 + 6 pts »).

#### Scenario: Découverte annoncée au COPIL
- **GIVEN** la manche 1, le paiement en ligne commencé pendant la période 2
- **WHEN** le compte rendu du COPIL 2 s'affiche
- **THEN** il annonce que la banque exige une sécurisation et une certification (+6 points), et le lot affiche « 8 + 6 pts »

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
- **THEN** une légende dit que l'intuition est l'avis de Mme Lefèvre, et que les Sprint Reviews diront ce qu'en pensent ses clients
