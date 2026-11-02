## Context

Aujourd'hui, `newRound(mode, { cut })` porte l'option, l'accueil a une case à cocher, et l'imprévu `coupure` de `scenario.js` est `optional`, annoncé à la fin de la période 3 avec `lastBuildSprint: 5`. La météo (`projectWeather`) compare le reste à faire à `(lastBuildSprint − sprint) × 12` : elle tient donc compte de la coupure dès qu'elle est annoncée.

## Goals / Non-Goals

**Goals:**
- Une coupure identique dans toutes les parties, invisible jusqu'à la fin de la période 5.
- Le moins de code possible : la coupure reste un imprévu du scénario, simplement déplacé.

**Non-Goals:**
- Garder une option cachée « sans coupure » pour les tests : les parcours de référence suivent le jeu réel.

## Decisions

- **Imprévu déplacé, pas de nouveau mécanisme** : `coupure` passe à `after: 5`, sans `optional`, avec `lastBuildSprint: 5`. À la fin du Sprint 5, `playSprint` applique l'imprévu, `lastBuildSprint` devient 5 et `developmentOver` est vrai dans le même compte rendu : le développement s'arrête en l'état, sans étape de plus. Les Sprints 1 à 4 ne voient jamais l'imprévu, et le tableau continue d'afficher « sur 6 » jusque-là.
- **Option supprimée** : `newRound(mode)` n'accepte plus `cut` ; le champ `cut` disparaît de l'état ; l'accueil perd sa case à cocher et `ui.js` sa variable `app.cut`.
- **Météo sans changement de règle** : comme `lastBuildSprint` reste à 6 jusqu'à la coupure, la météo reste au soleil tant que le plan tient en 6 périodes, puis passe à l'orage au COPIL 5 (reste à faire, capacité restante nulle) si l'appli n'est pas sortie.
- **Textes** : la coupure est rédigée dans les deux vocabulaires (« La banque coupe le prêt, sans préavis : le projet s'arrête maintenant, en l'état. » / « … le développement s'arrête maintenant, en l'état. ») ; la fin du projet de la manche 1 dit « Le projet s'arrête au COPIL 5, en l'état. »
- **Parcours de référence** : 61 points → 0 € ; 39 points resserrés → 16 038 € (sortie au COPIL 4) ; manche 2 13 300 € et 25 300 € ; ajout d'un parcours à 47 points (sortie au COPIL 5, clients à 0,9³) pour le scénario « Sortie tardive ». Le parcours « plateaux acceptés » est retiré : avec la coupure, ce cahier des charges ne sort plus.

## Risks / Trade-offs

- [Manche 1 toujours perdante, quoi qu'on fasse] → non : un cahier des charges resserré sort avant la coupure et rapporte plus que la manche 2 jouée sans écouter les clients ; c'est une piste de débrief, couverte par un parcours de référence.
- [Un joueur qui rejoue connaît la coupure] → acceptable : le jeu se joue une fois par formation, et le débrief porte justement sur ce qu'on aurait fait en le sachant.

## Migration Plan

Aucune donnée à migrer. Publication par push sur `main`.
