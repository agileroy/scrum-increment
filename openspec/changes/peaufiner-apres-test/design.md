## Context

Le moteur est déterministe, et les parcours de référence de `tests/game-core.test.mjs` fixent l'histoire. Le travail sous-estimé avait été placé sur la vitrine et la réservation pour empêcher les cahiers des charges resserrés de sortir avant la coupure ; or ce sont les deux premiers éléments de tout ordre possible, d'où deux annonces dès la première période.

## Goals / Non-Goals

**Goals :** un premier COPIL (et un premier Sprint) sans surprise ; garder l'effet recherché sur les cahiers des charges resserrés ; rendre le jeu plus engageant sans dépendance externe ; un débrief qui commence par les questions.

**Non-Goals :** pas de nouvelle mécanique, pas d'image ni de GIF hébergés.

## Decisions

### Découvertes : paiement +6, gâteaux +6, click & collect +4, recette +4

Simulées sur les parcours de référence (ventes cumulées sur 20 semaines, demandes refusées) :

| Parcours | Avant | Après | Découvertes (par période) |
|---|---|---|---|
| Manche 1, 61 points | 0 € | 0 € | paiement au COPIL 2, click & collect et gâteaux au COPIL 5 |
| Manche 1, resserré 39 points | 0 € | 0 € | click & collect au COPIL 2, gâteaux au COPIL 3, recette au COPIL 5 |
| Manche 1, 32 points | 10 935 € | 10 935 € | sortie au COPIL 5 |
| Manche 1, 26 points | 12 150 € | 12 150 € | sortie au COPIL 4 |
| Manche 2, ordre initial | 10 500 € | 13 200 € | paiement au Sprint 2 |
| Manche 2, à l'écoute | 21 200 € | 22 800 € | gâteaux, click & collect, paiement aux Sprints 2, 4 et 5 |

Alternatives écartées : seulement des fonctionnalités chères et adorées (paiement, livraison) : les cahiers des charges resserrés les évitent tous et sortent (12 029 € pour 39 points) ; alerte et gâteaux seuls : l'ordre initial de la manche 2 n'en rencontre aucune. Le cahier des charges resserré garde exactement 61 points de travail (39 + 6 + 4 + 8 + 4), pour 60 réalisables. Le paiement en ligne, le lot le plus cher aux yeux de Mme Lefèvre, devient celui qui coûte le plus en surprise : c'est cohérent avec le propos.

Une découverte arrive quand l'élément reçoit son premier point. En première période, seuls la vitrine et la réservation peuvent commencer (tout le reste dépend de la vitrine, qui coûte 5 points, et la capacité est de 12 ou 10) ; sauf la vitrine retirée, ce qui rend tout impossible. La première période est donc toujours sans découverte.

### Démarche annoncée dès l'attente

Choix de l'auteur : chaque équipe connaît sa démarche dès l'attente de la salle, pour se mettre dans le rôle. Le contexte et la démarche ouvrent aussi le premier écran de l'équipe au lancement. L'écran projeté du formateur reste neutre. Un participant déplacé d'équipe pendant l'attente voit sa démarche changer : c'est accepté. En solo, le contexte ouvre le cahier des charges (la transition explique déjà la manche 2).

### Jours/homme : un affichage, pas un changement de moteur

Le moteur compte toujours en points ; la manche 1 les affiche multipliés par 5 (`MAN_DAYS_PER_POINT`). Le facteur 5 donne une équipe crédible (6 personnes × 10 jours = 60 jours/homme par COPIL) et des nombres ronds (vitrine 25 j/h, livraison 70 j/h, avenant 10 j/h). Les tests de vocabulaire interdisent « point » en manche 1 et « jours/homme » en manche 2.

### Arbitrage du COPIL

Ouvert seulement quand la météo est orageuse et qu'au moins un lot n'est pas commencé, entre deux COPIL. Le joueur coche des lots pas commencés ; la fenêtre montre le reste à faire après arbitrage face au temps restant jusqu'à la fin prévue, et refuse un retrait qui casse un prérequis. Pas d'avenant ni de coût : retirer du périmètre est une décision du COPIL avec la boulangère. Exemple : cahier des charges de 61 points, orageux au COPIL 2 ; retirer livraison, fidélité et click & collect le remet au soleil et l'appli sort au COPIL 5 (9 842 €). Retirer la seule livraison le remet au soleil… jusqu'à la coupure, qui tombe avant la fin prévue : 0 €. Les parcours de référence n'arbitrent pas et ne changent pas.

### Émojis plutôt qu'images

Les émojis s'affichent partout sans fichier ni requête, suivent la taille du texte et les deux thèmes. Ils sont décoratifs (`aria-hidden`) : les noms restent le texte lu. Le drapeau britannique est évité (rendu en lettres sous Windows) : 🌍 pour la version anglaise.

### Débrief en tête, indicateurs pliés

Ordre des résultats : présentation des approches (en équipes), questions de débrief, courbe, puis « Les indicateurs » (élément `details` plié) à côté d'« Intuition contre réalité », puis les décisions des équipes et « Rejouer ». La courbe reste visible : c'est le support de la première question (le premier euro).

## Risks / Trade-offs

- La manche 2 rapporte un peu plus qu'avant (13 200 € et 22 800 €) : l'écart avec la manche 1 se creuse légèrement, ce qui reste le propos.
- Un cahier des charges de 3 lots (vitrine, réservation, alerte) sort désormais au COPIL 3 (11 340 € au lieu de 8 748 €) : cas marginal, il laisse de côté la plupart des envies de Mme Lefèvre.
