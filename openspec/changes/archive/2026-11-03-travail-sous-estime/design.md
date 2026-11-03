## Context

Le moteur construit les éléments dans l'ordre avec la capacité de la période, puis la recette (manche 1) quand tous les lots sont terminés. Coût total du cahier des charges resserré : 39 + 8 = 47 points, soit 4 périodes de 12 points ; la coupure tombe après 5 périodes (60 points).

## Goals / Non-Goals

**Goals:**
- Qu'aucun cahier des charges « raisonnable » ne sorte avant la coupure.
- Un mécanisme crédible pour un public de chefs de projet : le dérapage par sous-estimation et par intégration tardive.
- Équité entre les approches : mêmes découvertes sur les mêmes fonctionnalités.

**Non-Goals:**
- Hasard : les découvertes sont fixes, pour que deux parties identiques donnent les mêmes chiffres.
- Empêcher toute sortie en manche 1 (un plan minuscule reste possible).

## Decisions

- **Données** : `UNDERESTIMATES = [{ target: 'vitrine', extra: 4, text }, { target: 'resa', extra: 6, text }, { target: 'recette', extra: 4, mode: 'cascade', text }]` dans `scenario.js`, avec un texte par manche.
- **Moment de la découverte** : quand l'élément reçoit son premier point de travail (ou, pour la recette, quand elle commence). Le coût affiché passe alors de « 8 pts » à « 8 + 6 pts », et la découverte est journalisée pour la période.
- **Pourquoi la vitrine et la réservation** : tous les cahiers des charges et tous les Product Backlogs les contiennent (prérequis de presque tout), donc la découverte touche tout le monde de la même façon.
- **Recette** : la découverte « anomalies à l'intégration » n'existe qu'en manche 1 ; c'est la différence de fond entre une recette finale et une Definition of Done à chaque Sprint, à expliciter au débrief.
- **Météo** : calculée comme aujourd'hui sur le reste à faire réel ; elle devient « Orageux » dès que la découverte rend le plan intenable.
- **Recalibrage** : après la mise en œuvre, rejouer les parcours de référence ; si la manche 2 « à l'écoute » perd trop (cible : au moins 20 000 €), ajuster les extras plutôt que les valeurs des fonctionnalités.

## Risks / Trade-offs

- [Découverte vécue comme une punition arbitraire] → annonce réaliste et identique pour les deux approches ; le débrief montre que l'impact diffère selon la façon de livrer.
- [Chiffres de référence qui bougent] → recalculés et figés dans les tests, README mis à jour.

## Open Questions

- Les montants (+4, +6, +4) et les textes des découvertes conviennent-ils à l'auteur ?
