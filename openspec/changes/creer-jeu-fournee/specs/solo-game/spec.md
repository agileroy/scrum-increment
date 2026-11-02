## ADDED Requirements

### Requirement: Accueil
L'accueil SHALL présenter l'histoire de Madame Lefèvre en quelques lignes, annoncer deux manches sur le même projet avec une comparaison à la fin, proposer l'option « Coupure budgétaire en cours de projet » (activée par défaut) et un bouton pour commencer la manche 1. L'accueil MUST NOT dévoiler les valeurs réelles ni les imprévus.

#### Scenario: Partie sans coupure
- **GIVEN** l'accueil
- **WHEN** le joueur décoche la coupure budgétaire puis commence
- **THEN** les deux manches se jouent sur 6 Sprints de développement

### Requirement: Plan de la manche 1
Avant le Sprint 1, l'écran du plan SHALL expliquer la règle (6 Sprints de 12 points, dont 8 points de recette et de mise en production finales, plan contractuel une fois validé) et lister les fonctionnalités avec leur rang, leur coût, l'intuition de Mme Lefèvre et leur prérequis. Le joueur SHALL pouvoir retirer ou remettre une fonctionnalité dans le plan et changer son rang. Une jauge SHALL montrer les points planifiés par rapport aux 64 points, et un message SHALL dire ce qui bloque (dépassement, prérequis absent) ou que le plan tient. Le bouton de validation SHALL rester inactif tant que le plan est invalide.

#### Scenario: Dépassement
- **GIVEN** le plan initial de 66 points
- **WHEN** l'écran s'affiche
- **THEN** la jauge est rouge, le message indique un dépassement de 2 points et la validation est impossible

#### Scenario: Prérequis retiré
- **GIVEN** un plan qui contient le paiement en ligne
- **WHEN** le joueur retire la réservation de pain
- **THEN** le message indique que « Paiement en ligne » nécessite « Réservation de pain » et la validation est impossible

### Requirement: Tableau de Sprint
Pendant le développement, l'écran SHALL afficher la manche, le Sprint à jouer sur le nombre de Sprints de développement, la capacité, le nombre de fonctionnalités en ligne, la part de clients potentiels, les ventes cumulées, la liste ordonnée des fonctionnalités et un journal des Sprints, des imprévus et des retours clients. Chaque fonctionnalité SHALL afficher son avancement en points et en barre, l'intuition, la valeur réelle si elle est révélée (« ? » sinon) et son état : en ligne, terminée en attente de recette (manche 1), en cours, ou prérequis manquant. Dans la manche 1, la liste SHALL être figée et finir par la ligne « Recette et mise en production ». Dans la manche 2, chaque fonctionnalité non terminée SHALL avoir des boutons pour monter et descendre d'un rang.

#### Scenario: Plan figé
- **GIVEN** la manche 1 en cours
- **WHEN** le tableau s'affiche
- **THEN** aucune fonctionnalité ne peut changer de rang, et le texte rappelle que le plan est figé par contrat

### Requirement: Fin de Sprint
Après chaque Sprint, une fenêtre SHALL résumer le Sprint, puis un bouton SHALL mener au Sprint suivant ou, après le dernier Sprint de développement, à la fin du développement. Dans la manche 1, elle SHALL donner l'avancement du plan en pourcentage, un rapport rassurant au comité (« tout se déroule comme prévu ») ou l'annonce de la sortie de l'appli, les ventes du Sprint, et indiquer qu'il n'y a aucun retour client tant que l'appli n'est pas sortie. Dans la manche 2, elle SHALL donner les fonctionnalités mises en ligne, les ventes du Sprint et, sous le titre « Sprint Review », au plus trois nouveaux retours clients dont les conditions sont remplies, dans l'ordre du scénario et sans répéter un retour déjà affiché. Les imprévus SHALL être annoncés dans cette fenêtre.

#### Scenario: Review sans rien en ligne
- **GIVEN** la manche 2, aucune fonctionnalité en ligne
- **WHEN** la fenêtre de fin de Sprint s'affiche
- **THEN** elle indique qu'aucun retour n'est possible, car rien n'est encore en ligne

### Requirement: Fin du développement et enchaînement
À la fin du développement, une fenêtre SHALL dire ce qui est en ligne (ou, dans la manche 1 sans sortie, que l'appli n'est jamais sortie et que ses fonctionnalités terminées ne servent à aucun client), expliquer que les Sprints suivants se jouent sans développement jusqu'au Sprint 10 et donner les ventes cumulées. Après la manche 1, un écran de transition SHALL présenter la manche 2 (même budget, mêmes fonctionnalités, mêmes imprévus, mais un incrément utilisable à chaque Sprint) et ses règles. Après la manche 2, le jeu SHALL afficher les résultats. Depuis les résultats, « Rejouer » SHALL ramener à l'accueil.

#### Scenario: Enchaînement des manches
- **GIVEN** la fin du développement de la manche 1
- **WHEN** le joueur continue
- **THEN** l'écran de la manche 2 s'affiche, puis le tableau du Sprint 1 avec le Product Backlog dans l'ordre initial
