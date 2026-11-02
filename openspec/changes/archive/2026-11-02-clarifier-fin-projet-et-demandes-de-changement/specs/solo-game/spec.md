## MODIFIED Requirements

### Requirement: Fin de Sprint
Après chaque Sprint, une fenêtre SHALL résumer le Sprint, puis un bouton SHALL mener au Sprint suivant ou, après le dernier Sprint de développement, à la fin du projet. Dans la manche 1, elle SHALL donner l'avancement du plan, un rapport rassurant au comité ou l'annonce de la sortie de l'appli, les ventes du Sprint, et l'absence de retour client tant que l'appli n'est pas sortie. Dans la manche 2, elle SHALL donner les fonctionnalités mises en ligne, les ventes et, sous « Sprint Review », au plus trois nouveaux retours clients. Les imprévus et la demande de changement du Sprint SHALL y être annoncés.

#### Scenario: Aucun retour avant la sortie
- **GIVEN** la manche 1, appli pas encore sortie
- **WHEN** la fenêtre de fin de Sprint s'affiche
- **THEN** elle indique qu'il n'y a aucun retour client, car l'appli n'est pas encore sortie

#### Scenario: Premiers retours dès le Sprint 1
- **GIVEN** la manche 2, quel que soit l'ordre du Product Backlog
- **WHEN** le Sprint 1 est joué
- **THEN** la vitrine, seule fonctionnalité sans prérequis, est en ligne et la Sprint Review affiche déjà des retours clients

#### Scenario: Demande annoncée en manche 2
- **GIVEN** la manche 2
- **WHEN** la fenêtre de fin du Sprint 1 s'affiche
- **THEN** elle cite la demande de Mme Lefèvre et indique que la version anglaise est ajoutée en bas du Product Backlog

### Requirement: Fin du développement et enchaînement
À la fin du développement, une fenêtre SHALL annoncer la fin du projet, dire ce qui est en ligne (ou, dans la manche 1 sans sortie, que l'appli n'est jamais sortie), expliquer que les semaines suivantes sont de l'exploitation sans développement, jusqu'à 20 semaines après le lancement, et donner les ventes cumulées. Elle MUST NOT parler de Sprints pour la période d'exploitation. Après la manche 1, un écran de transition SHALL présenter la manche 2 et ses règles ; après la manche 2, le jeu SHALL afficher les résultats. « Rejouer » SHALL ramener à l'accueil.

#### Scenario: Enchaînement des manches
- **GIVEN** la fin du développement de la manche 1
- **WHEN** le joueur continue
- **THEN** l'écran de la manche 2 s'affiche, puis le tableau du Sprint 1 avec le Product Backlog dans l'ordre initial

#### Scenario: Fin de projet après une coupure
- **GIVEN** une partie avec la coupure budgétaire
- **WHEN** la fenêtre de fin du projet s'affiche après le Sprint 5
- **THEN** elle annonce 10 semaines d'exploitation sans développement, et ne mentionne aucun Sprint après le Sprint 5

## ADDED Requirements

### Requirement: Fenêtre de demande de changement (manche 1)
Dans la manche 1, quand un Sprint annonce une demande, la fenêtre de fin de Sprint SHALL ensuite présenter la demande : texte de Mme Lefèvre, coût, intuition et avenant de 2 points. Elle SHALL lister les fonctionnalités retirables avec des cases à cocher, une jauge du plan par rapport au nouveau budget et un message sur ce qui bloque. « Accepter » SHALL rester inactif tant que le plan obtenu est invalide ; « Refuser » SHALL toujours être possible. Fermer la fenêtre MUST NOT trancher la demande à la place du joueur.

#### Scenario: Faire de la place
- **GIVEN** la demande « Version anglaise » avec le plan de 61 points
- **WHEN** le joueur coche la livraison à domicile (14 points, pas commencée)
- **THEN** la jauge passe à 52 points sur 62 et « Accepter » devient actif

#### Scenario: Touche Échap
- **GIVEN** la fenêtre d'une demande de changement
- **WHEN** le joueur appuie sur Échap
- **THEN** la fenêtre reste ouverte et la demande n'est ni acceptée ni refusée

### Requirement: Demandes visibles dans les listes
Dans le plan et le Product Backlog, une fonctionnalité issue d'une demande de changement SHALL être signalée comme « Demande de Mme Lefèvre ». Le journal SHALL garder chaque demande et la décision prise (acceptée avec les retraits, refusée, ou ajoutée au Product Backlog).

#### Scenario: Journal de la manche 1
- **GIVEN** une demande refusée au Sprint 1
- **WHEN** le joueur lit le journal
- **THEN** il y trouve la demande de la version anglaise et son refus
