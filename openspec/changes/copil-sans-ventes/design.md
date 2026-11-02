## Context

Le compte rendu de COPIL (`reportHtml` dans `ui.js`) affiche toujours les ventes et une section « Retours clients ». Les tuiles du tableau (`stats` du lexique `cascade`) affichent clients potentiels et ventes cumulées. Les lots du cahier des charges affichent « Ventes réelles : ? ». Le journal (`periodLog`/ligne de période) ajoute « Ventes : 0 € ».

## Goals / Non-Goals

**Goals:**
- Qu'un COPIL ressemble à un vrai COPIL : on y pilote un plan, pas un produit.
- Ne rien laisser deviner de la leçon (absence de ventes et de retours) avant la fin du projet.

**Non-Goals:**
- Changer le moteur ou les chiffres ; masquer les imprévus (le concurrent est une nouvelle du quartier, annoncée aux deux approches).

## Decisions

- **Règle d'affichage** : en manche 1, ventes et clients ne s'affichent que si `state.launched`. Le moteur n'est pas touché ; les résultats et la fin du projet continuent de les utiliser.
- **Compte rendu de COPIL avant la sortie** : météo, avancement du cahier des charges, budget consommé (« 24 points sur 72 »), puis imprévus et demande. Plus de section « Retours clients ». Après la sortie : bandeau « L'appli est en ligne » et ventes de la période, toujours sans retours clients.
- **Tuiles du tableau** : Avancement, Météo du projet, Capacité toutes les 2 semaines, Budget consommé (points sur 72, avenants compris dans la recette), Semaines écoulées (sur 12). Après la sortie, « Ventes cumulées » s'ajoute en sixième tuile, sans faire bouger les autres repères.
- **Lots** : en manche 1, plus de ligne « Ventes réelles » (la valeur réelle n'est de toute façon jamais révélée en manche 1).
- **Journal** : « COPIL 3 : avancement 51 %, météo ensoleillé. » sans ventes ; après la sortie, « appli en ligne, ventes : 1 200 € ».
- **Imprévu du concurrent** : le texte « elle perd des clients toutes les deux semaines » reste (c'est l'annonce de l'imprévu, la même pour les deux approches), mais aucun chiffre de clients ne suit dans la manche 1.

## Risks / Trade-offs

- [Le joueur de manche 1 ne voit plus l'effet du concurrent] → c'est voulu : il le découvrira au débrief, comme un vrai projet qui n'a pas de produit en ligne.
- [« Budget consommé » proche de « Avancement »] → l'un compte les points dépensés (recette comprise), l'autre le pourcentage du plan terminé ; l'auteur pourra n'en garder qu'un.

## Open Questions

- Garder les ventes après la sortie en manche 1, ou les masquer jusqu'à la fin du projet ? (proposition : les afficher, c'est ce que voit la commanditaire)
