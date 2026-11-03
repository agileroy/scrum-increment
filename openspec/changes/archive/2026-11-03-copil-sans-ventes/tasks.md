## 1. Affichage de la manche 1

- [x] 1.1 `vocabulary.js` : indicateurs de la manche 1 (bloc « Temps contre travail », Météo, Capacité, et Ventes cumulées seulement après la sortie) ; ligne de journal sans ventes avant la sortie. Vérification : tests de vocabulaire.
- [x] 1.2 `ui.js` : compte rendu de COPIL sans ventes ni retours clients avant la sortie, avec le temps écoulé et le travail fait ; bloc « Temps contre travail » dans `ui.js` et `app.css` (deux barres, pleine largeur sur téléphone) ; ventes après la sortie ; plus de « Ventes réelles » sur les lots de la manche 1. Vérification : test qui vérifie qu'un compte rendu, un tableau et un journal de manche 1 avant la sortie ne contiennent ni « vente » ni « client » (hors annonce de l'imprévu).

## 2. Vérification et publication

- [x] 2.1 Parcours de référence inchangés (moteur intact), relecture à l'écran en solo et en mode démo. Vérification : `npm test`, captures du compte rendu de COPIL avant et après la sortie.
- [x] 2.2 Pousser sur `main` et vérifier la publication. Vérification : workflow réussi.
