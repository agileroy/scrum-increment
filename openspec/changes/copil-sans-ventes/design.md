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
- **Compte rendu de COPIL avant la sortie** : météo, temps écoulé contre travail fait (« 4 semaines sur 12 · 34 % du travail fait »), puis imprévus et demande. Plus de section « Retours clients ». Après la sortie : bandeau « L'appli est en ligne » et ventes de la période, toujours sans retours clients.
- **Tuiles du tableau (option C retenue par l'auteur sur maquette)** : un bloc « Temps contre travail » à deux barres, « Temps écoulé » (semaines écoulées sur 12, en %) et « Travail fait » (avancement du plan, recette comprise, en %), avec en légende « 6 semaines sur 12 · 36 points sur 72, recette comprise » ; puis les tuiles « Météo du projet » et « Capacité toutes les 2 semaines ». Sur téléphone, le bloc prend toute la largeur et les deux tuiles se partagent la ligne suivante. Après la sortie, une tuile « Ventes cumulées » s'ajoute, sans faire bouger les autres repères.
- **Lots** : en manche 1, plus de ligne « Ventes réelles » (la valeur réelle n'est de toute façon jamais révélée en manche 1).
- **Journal** : « COPIL 3 : avancement 51 %, météo ensoleillé. » sans ventes ; après la sortie, « appli en ligne, ventes : 1 200 € ».
- **Imprévu du concurrent** : le texte « elle perd des clients toutes les deux semaines » reste (c'est l'annonce de l'imprévu, la même pour les deux approches), mais aucun chiffre de clients ne suit dans la manche 1.

## Risks / Trade-offs

- [Le joueur de manche 1 ne voit plus l'effet du concurrent] → c'est voulu : il le découvrira au débrief, comme un vrai projet qui n'a pas de produit en ligne.
- [Les deux barres restent proches jusqu'à la coupure] → voulu : c'est le faux sentiment de maîtrise d'un projet « dans les temps », que la coupure brise.

## Open Questions

_Aucune : l'auteur a validé l'affichage des ventes après une sortie en manche 1 et l'option C des tuiles._
