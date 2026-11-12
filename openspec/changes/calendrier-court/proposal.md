## Why

Les durées et les charges ne collent pas avec un vrai projet d'appli de boulangerie : 25 jours/homme pour traduire l'appli en anglais, 360 jours/homme au total, 12 semaines de développement. L'auteur demande un projet de 6 semaines, des Sprints d'une semaine et des charges (avenants compris) à l'échelle.

## What Changes

- **Calendrier divisé par deux** : 6 semaines de développement prévues (un COPIL ou un Sprint chaque semaine), coupure à la fin de la semaine 5, exploitation jusqu'à 10 semaines après le lancement. Une période dure une semaine : « COPIL 3 sur 6 · semaine 3 ».
- **Charges à l'échelle** : un point du moteur vaut un jour/homme. Une petite équipe abat 12 jours/homme par semaine ; 72 jours/homme au total, dont 8 de recette ; 64 à répartir ; la version anglaise coûte 5 jours/homme, l'avenant 2 jours/homme, le paiement découvre 6 jours/homme de plus.
- **Ventes par semaine** : les valeurs restent les mêmes par période, donc par semaine (« 200 € / semaine », « 100 € ou moins par semaine »). Le concurrent fait perdre des clients chaque semaine.
- Le moteur ne change pas : mêmes périodes, mêmes points, mêmes parcours de référence et mêmes ventes cumulées (sur 10 semaines au lieu de 20).
- Sur téléphone, l'axe du graphique affiche les numéros de semaine (1 à 10) avec une seule légende « semaines ».

## Capabilities

### New Capabilities
_Aucune._

### Modified Capabilities
- `scenario`, `sprint-simulation` : durée d'une période, horizon.
- `solo-game`, `round-vocabulary`, `game-results`, `team-results`, `team-play`, `facilitation` : textes et chiffres de durée et de charge.

## Impact

- `site/js/scenario.js` (`SPRINT_WEEKS`, `HORIZON_WEEKS`, `MAN_DAYS_PER_POINT`), `game-core.js` (`periodWeeks`, `weeksLabel`), `vocabulary.js`, `ui.js`, `room-ui.js`, `chart.js`, `index.html`, tests, README, contexte OpenSpec.
