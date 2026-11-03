## Why

Deuxième remarque du test de l'auteur : en manche 1, le compte rendu de COPIL affiche « Ventes pendant ces 2 semaines : 0 € » et « Retours clients : aucun, l'appli n'est pas encore sortie ». Une équipe projet ne suit ni ventes ni retours clients pendant le projet : ces lignes ne correspondent pas à ce que regarde un COPIL, et elles soufflent la leçon du débrief (« on n'a rien vendu, aucun client ne nous a parlé ») avant la révélation. Le même indice apparaît ailleurs dans la manche 1 : tuiles « Ventes cumulées » et « Clients potentiels » du tableau, « Ventes réelles : ? » sur chaque lot, « Ventes : 0 € » dans le journal.

## What Changes

- **Manche 1, tant que l'appli n'est pas sortie** : plus aucune mention des ventes ni des clients, ni dans le compte rendu de COPIL, ni dans le tableau, ni sur les lots, ni dans le journal. Le COPIL parle de ce qu'un COPIL suit : temps écoulé contre travail fait, météo, imprévus et demandes de la commanditaire.
- **Tuiles du tableau en manche 1** : un bloc « Temps contre travail » (deux barres : temps écoulé et travail fait), « Météo du projet » et « Capacité toutes les 2 semaines », à la place de « Avancement », « Clients potentiels » et « Ventes cumulées ».
- **Après la sortie de l'appli en manche 1** (cahier des charges resserré) : les ventes et la ligne « L'appli est en ligne » réapparaissent, puisque la commanditaire voit alors son chiffre d'affaires ; toujours pas de retours clients (le cadre projet n'organise pas de Review).
- **Fin du projet** : inchangée (ventes cumulées affichées), c'est le moment où le projet se termine et où la comparaison commence.
- **Manche 2** : inchangée.
- Le moteur continue de calculer les ventes et la part de clients (les résultats en ont besoin) : seul l'affichage change.

## Capabilities

### New Capabilities
_Aucune._

### Modified Capabilities
- `solo-game` : tableau et compte rendu de COPIL de la manche 1 sans ventes ni clients avant la sortie (valable aussi pour une équipe « projet » en mode collectif, qui réutilise ces écrans).
- `round-vocabulary` : journal de la manche 1 sans ventes avant la sortie.

## Impact

- `site/js/vocabulary.js` (tuiles, ligne de ventes, ligne de journal de la manche 1), `site/js/ui.js` (compte rendu de COPIL, valeur des lots en manche 1).
- Tests de vocabulaire : un compte rendu ou un tableau de manche 1 avant la sortie ne contient ni « vente » ni « client ».
- Aucun changement du moteur, des chiffres, des résultats ni du mode collectif côté formateur.
