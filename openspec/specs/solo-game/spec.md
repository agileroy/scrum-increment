# solo-game Specification

## Purpose
Parcours du joueur seul, de l'accueil aux résultats : plan de la manche 1, tableau de Sprint, fenêtres de fin de Sprint, manche 2 et enchaînement.

## Requirements

### Requirement: Plan de la manche 1
Avant le premier COPIL, l'écran du cahier des charges SHALL présenter la mission en briefing : une réplique de Madame Lefèvre, puis la règle en quatre tuiles chiffrées (12 semaines avec un COPIL toutes les 2 semaines ; 72 points, l'équipe abattant 12 points tous les 15 jours ; 8 points de recette et de mise en production finales ; cahier des charges contractuel une fois validé, tout changement passant par un avenant), puis la mission en une phrase juste au-dessus de la jauge. L'écran MUST NOT présenter ces règles en paragraphe. Il SHALL lister les lots avec leur rang, leur coût, l'intuition de la commanditaire et leur prérequis. Le joueur SHALL pouvoir retirer ou remettre un lot et changer son rang. Une jauge SHALL comparer les points planifiés aux 64 points, et un message SHALL dire ce qui bloque ou que le cahier des charges tient. La validation SHALL rester inactive tant qu'il est invalide.

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

### Requirement: Tableau de Sprint
Pendant le développement, l'écran SHALL afficher la manche, la prochaine échéance (« COPIL N sur M » ou « Sprint N sur M ») et ses semaines, la capacité, la liste ordonnée et le journal. En manche 1, les indicateurs SHALL être ceux d'un pilotage de projet : temps écoulé contre travail fait (deux barres en pourcentage : semaines écoulées sur 12, avancement du plan recette comprise), météo du projet et capacité ; les ventes cumulées n'y apparaissent qu'après la sortie de l'appli, et l'écran MUST NOT afficher de part de clients ni de ligne « Ventes réelles » sur les lots. En manche 2, les indicateurs SHALL être les ventes cumulées, la capacité, les fonctionnalités en ligne et les clients potentiels. Chaque élément SHALL afficher son avancement, l'intuition et son état, et en manche 2 sa valeur réelle si elle est révélée. En manche 1, la liste « Cahier des charges » SHALL être figée et finir par « Recette et mise en production ». En manche 2, chaque élément non terminé du Product Backlog SHALL pouvoir monter ou descendre d'un rang.

#### Scenario: Plan figé
- **GIVEN** la manche 1 en cours
- **WHEN** le tableau s'affiche
- **THEN** aucun lot ne peut changer de rang, et le texte rappelle que le cahier des charges est contractuel

#### Scenario: Échéance et semaines
- **GIVEN** la manche 1, avant le troisième COPIL
- **WHEN** le tableau s'affiche
- **THEN** il indique « COPIL 3 sur 6 · semaines 5 et 6 »

#### Scenario: Pilotage sans ventes
- **GIVEN** la manche 1 au COPIL 2, appli pas encore sortie
- **WHEN** le tableau s'affiche
- **THEN** il montre le temps écoulé contre le travail fait, la météo et la capacité, et aucun mot sur les ventes ou les clients

### Requirement: Fin de Sprint
Après chaque période, une fenêtre SHALL faire le bilan, puis un bouton SHALL mener à la période suivante ou à la fin du projet. En manche 1, c'est le compte rendu de COPIL : météo du projet, temps écoulé et travail fait ; il MUST NOT parler de ventes ni de clients avant la sortie de l'appli, puis il SHALL annoncer la sortie et donner les ventes de la période. En manche 2, c'est la Sprint Review : fonctionnalités mises en ligne, ventes et au plus trois nouveaux retours clients. Les imprévus et la demande de changement de la période SHALL y être annoncés, dans le vocabulaire de la manche.

#### Scenario: Aucun retour avant la sortie
- **GIVEN** la manche 1, appli pas encore sortie
- **WHEN** le compte rendu du COPIL 2 s'affiche
- **THEN** il donne la météo, le temps écoulé et le travail fait, et ne contient ni ventes ni retours clients, ni phrase qui en signale l'absence

#### Scenario: COPIL après la sortie
- **GIVEN** la manche 1 avec un cahier des charges resserré, appli sortie au COPIL 4
- **WHEN** le compte rendu du COPIL 5 s'affiche
- **THEN** il indique que l'appli est en ligne et donne les ventes de ces 2 semaines, sans retours clients

#### Scenario: Premiers retours dès le Sprint 1
- **GIVEN** la manche 2, quel que soit l'ordre du Product Backlog
- **WHEN** le Sprint 1 est joué
- **THEN** la vitrine, seule fonctionnalité sans prérequis, est en ligne et la Sprint Review affiche déjà des retours clients

#### Scenario: Demande annoncée en manche 2
- **GIVEN** la manche 2
- **WHEN** la Sprint Review du Sprint 1 s'affiche
- **THEN** elle cite la demande de Mme Lefèvre et indique que la version anglaise est ajoutée en bas du Product Backlog

### Requirement: Fin du développement et enchaînement
À la fin du développement, une fenêtre SHALL annoncer la fin du projet, dire ce qui est en ligne (ou, en manche 1 sans sortie, que l'appli n'est jamais sortie), expliquer que les semaines suivantes sont de l'exploitation sans développement, jusqu'à 20 semaines après le lancement, et donner les ventes cumulées. Elle MUST NOT parler de Sprints ni de COPIL pour la période d'exploitation. Après la manche 1, l'écran de transition SHALL présenter la manche 2 ; après la manche 2, le jeu SHALL afficher les résultats. « Rejouer » SHALL ramener à l'accueil.

#### Scenario: Enchaînement des manches
- **GIVEN** la fin du développement de la manche 1
- **WHEN** le joueur continue
- **THEN** l'écran de transition s'affiche, puis le tableau du Sprint 1 avec le Product Backlog dans l'ordre initial

#### Scenario: Fin de projet après une coupure
- **GIVEN** la manche 1, au COPIL 5
- **WHEN** la fenêtre de fin du projet s'affiche, juste après le compte rendu qui annonce la coupure
- **THEN** elle dit que le projet s'arrête au COPIL 5, en l'état, annonce 10 semaines d'exploitation sans développement, et ne parle d'aucun Sprint

### Requirement: Fenêtre de demande de changement (manche 1)
En manche 1, quand un COPIL annonce une demande de la commanditaire, le compte rendu SHALL ensuite présenter la demande : texte de Mme Lefèvre, coût, intuition et avenant de 2 points. La fenêtre SHALL lister les lots retirables avec des cases à cocher, une jauge du cahier des charges par rapport au nouveau budget et un message sur ce qui bloque. « Accepter (avenant) » SHALL rester inactif tant que le résultat est invalide ; « Refuser » SHALL toujours être possible. Fermer la fenêtre MUST NOT trancher la demande à la place du joueur.

#### Scenario: Faire de la place
- **GIVEN** la demande « Version anglaise » avec le cahier des charges de 61 points
- **WHEN** le joueur coche la livraison à domicile (14 points, pas commencée)
- **THEN** la jauge passe à 52 points sur 62 et « Accepter (avenant) » devient actif

#### Scenario: Touche Échap
- **GIVEN** la fenêtre d'une demande de changement
- **WHEN** le joueur appuie sur Échap
- **THEN** la fenêtre reste ouverte et la demande n'est ni acceptée ni refusée

### Requirement: Demandes visibles dans les listes
Une fonctionnalité issue d'une demande SHALL être signalée comme « Demande de la commanditaire » dans le cahier des charges et comme « Demande de Mme Lefèvre » dans le Product Backlog. Le journal SHALL garder chaque demande et la décision prise : acceptée par avenant avec les lots retirés, refusée, ou ajoutée au Product Backlog.

#### Scenario: Journal de la manche 1
- **GIVEN** une demande refusée au COPIL 1
- **WHEN** le joueur lit les comptes rendus de COPIL
- **THEN** il y trouve la demande de la version anglaise et son refus

### Requirement: Accueil sans option
L'accueil SHALL présenter l'histoire de Madame Lefèvre en quelques lignes et proposer trois entrées : « Animer une partie » (formateur), « Rejoindre une partie » (code de salle et prénom) et « Jouer seul », qui annonce deux manches sur le même projet (d'abord en chef de projet, puis en Product Owner) avec une comparaison à la fin. L'accueil MUST NOT proposer d'option de coupure, ni dévoiler les valeurs réelles ou les imprévus.

#### Scenario: Rien à régler
- **GIVEN** l'accueil
- **WHEN** il s'affiche
- **THEN** il ne contient ni case à cocher, ni mot sur la banque ou une coupure, et « Jouer seul » lance directement le cahier des charges de la manche 1

### Requirement: Lots impossibles
Dans l'écran du cahier des charges, un lot retenu dont un prérequis, direct ou en chaîne, n'est pas retenu SHALL s'afficher en rouge avec « Impossible sans « X » », X étant le premier lot manquant de la chaîne. Les lots décochés SHALL rester grisés, sans rouge. Le message et la validation SHALL continuer de refuser un cahier des charges qui contient un lot impossible.

#### Scenario: Décocher la réservation
- **GIVEN** le cahier des charges initial
- **WHEN** le joueur décoche la réservation de pain
- **THEN** le paiement en ligne, la livraison à domicile et le créneau click & collect s'affichent en rouge avec « Impossible sans « Réservation de pain » »

#### Scenario: Décocher la vitrine
- **GIVEN** le cahier des charges initial
- **WHEN** le joueur décoche la vitrine en ligne
- **THEN** les huit autres lots s'affichent en rouge avec « Impossible sans « Vitrine en ligne » », y compris ceux qui dépendent de la réservation

### Requirement: Éléments mal placés
Dans le Product Backlog (manche 2) et dans l'ordre du cahier des charges (manche 1, avant validation), un élément non terminé placé au-dessus d'un prérequis non terminé, ou dont le prérequis est lui-même en rouge, SHALL s'afficher en rouge avec le badge court « Impossible sans « X » », X étant son prérequis direct, sans autre explication. Un élément placé sous son prérequis non terminé SHALL afficher un badge neutre « Après « X » ». Une fois le prérequis terminé, l'élément MUST NOT afficher de badge de dépendance.

#### Scenario: Paiement remonté trop haut
- **GIVEN** la manche 2, Product Backlog dans l'ordre initial
- **WHEN** le joueur remonte le paiement en ligne au-dessus de la réservation de pain
- **THEN** le paiement s'affiche en rouge avec « Impossible sans « Réservation de pain » »

#### Scenario: Rouge en chaîne
- **GIVEN** la manche 2, Product Backlog réordonné en réservation, paiement, livraison, puis vitrine
- **WHEN** le Product Backlog s'affiche
- **THEN** la réservation s'affiche en rouge avec « Impossible sans « Vitrine en ligne » », et le paiement et la livraison, placés pourtant sous la réservation, s'affichent aussi en rouge avec « Impossible sans « Réservation de pain » »

#### Scenario: Ordre initial
- **GIVEN** la manche 2, avant le Sprint 1
- **WHEN** le Product Backlog s'affiche dans l'ordre initial
- **THEN** aucun élément n'est en rouge, et le paiement affiche le badge neutre « Après « Réservation de pain » »

#### Scenario: Prérequis terminé
- **GIVEN** la manche 2, réservation de pain en ligne
- **WHEN** le Product Backlog s'affiche
- **THEN** le paiement, la livraison et le click & collect n'affichent plus de badge de dépendance

### Requirement: Retraits qui rendent des lots impossibles
Dans la fenêtre de demande de changement (manche 1), cocher un lot à retirer SHALL afficher en rouge la liste des lots retenus qui en dépendent (« Deviendraient impossibles : … »), et ceux de ces lots qui figurent dans la liste des retraits SHALL y être marqués en rouge avec « Impossible sans « X » ». Le message SHALL nommer le premier lot devenu impossible. « Accepter (avenant) » SHALL rester inactif tant qu'un lot est impossible.

#### Scenario: Retirer la réservation
- **GIVEN** une demande de changement, avec la réservation de pain retenue et pas encore commencée
- **WHEN** le joueur coche la réservation de pain dans les retraits
- **THEN** la fenêtre affiche en rouge « Deviendraient impossibles : Paiement en ligne, Livraison à domicile, Créneau click & collect », et « Accepter (avenant) » reste inactif

### Requirement: Glisser-déposer
Dans le cahier des charges avant validation et dans le Product Backlog, chaque élément déplaçable SHALL pouvoir être saisi sur toute sa carte, hors boutons et cases à cocher : à la souris ou au stylet dès qu'on le fait glisser, au doigt après un appui long, pour qu'un glissé direct fasse toujours défiler la page. Le geste SHALL faire suivre l'élément au pointeur, afficher une ligne d'insertion à l'endroit où il tomberait, et le relâcher SHALL placer l'élément à ce rang, avec les mêmes règles que les flèches. Relâcher hors de la liste, ou appuyer sur Échap pendant le geste, SHALL annuler le déplacement. Un élément non déplaçable MUST NOT pouvoir être saisi. Les flèches SHALL rester disponibles.

#### Scenario: Remonter de plusieurs rangs
- **GIVEN** la manche 2, Product Backlog dans l'ordre initial
- **WHEN** le joueur glisse l'alerte « fournée chaude » (rang 9) et la relâche entre la réservation de pain et le paiement en ligne
- **THEN** l'alerte passe au rang 3 et les éléments suivants descendent d'un rang

#### Scenario: Badges mis à jour
- **GIVEN** la manche 2, Product Backlog dans l'ordre initial
- **WHEN** le joueur glisse le paiement en ligne tout en haut
- **THEN** le paiement passe au rang 1 et s'affiche en rouge avec « Impossible sans « Réservation de pain » »

#### Scenario: Au doigt
- **GIVEN** un téléphone, le Product Backlog affiché
- **WHEN** le joueur appuie longuement sur une carte puis la fait glisser
- **THEN** la page ne défile pas pendant le geste et l'élément se place là où il est relâché

#### Scenario: Défilement au doigt
- **GIVEN** un téléphone, le Product Backlog affiché
- **WHEN** le joueur fait glisser une carte du doigt sans appui long
- **THEN** la page défile et l'ordre ne change pas

#### Scenario: Geste annulé
- **GIVEN** un élément en cours de glissement
- **WHEN** le joueur le relâche hors de la liste
- **THEN** l'ordre ne change pas

#### Scenario: Élément terminé
- **GIVEN** la manche 2, vitrine en ligne
- **WHEN** le Product Backlog s'affiche
- **THEN** la vitrine ne peut pas être saisie, mais les autres éléments peuvent être glissés au-dessus ou en dessous d'elle

### Requirement: Annonce du travail sous-estimé
Le compte rendu de COPIL ou la Sprint Review de la période SHALL annoncer chaque découverte de travail sous-estimé dans le vocabulaire de la manche, et l'élément concerné SHALL afficher son coût sous la forme « coût prévu + travail découvert » (par exemple « 8 + 6 pts »).

#### Scenario: Découverte annoncée au COPIL
- **GIVEN** la manche 1, la réservation commencée pendant la période 2
- **WHEN** le compte rendu du COPIL 2 s'affiche
- **THEN** il annonce que la réservation doit être reliée au logiciel de caisse (+6 points), et le lot affiche « 8 + 6 pts »

### Requirement: Briefing de la manche 2
L'écran de transition vers la manche 2 SHALL présenter la nouvelle mission avec la même mise en page que le cahier des charges : une réplique de Madame Lefèvre, quatre tuiles (Sprint de 2 semaines conclu par une Sprint Review ; 10 points pour construire et 2 pour la Definition of Done ; une fonctionnalité terminée est en ligne et rapporte dès le Sprint suivant ; chaque Sprint Review révèle la vraie valeur grâce aux retours clients) et la mission en une phrase. Le tableau des équivalences de vocabulaire SHALL rester sur cet écran.

#### Scenario: Transition
- **GIVEN** la fin de la manche 1
- **WHEN** le joueur ferme la fin du projet
- **THEN** il voit la réplique de Mme Lefèvre, les quatre tuiles de la manche 2, le tableau « Ce qui change » et « Commencer la manche 2 »
