## Why

Premier test de l'auteur : l'écran du cahier des charges s'ouvre sur un pavé de six lignes qui mélange l'histoire, les chiffres et la règle. Ça ne donne pas envie de lire, et les participants (surtout en séance, sur téléphone) vont sauter l'explication et rater les chiffres qui comptent (12 semaines, 72 points, 8 points de recette, contrat). Les écrans d'introduction de la manche 2 (transition en solo, présentation du rôle de Product Owner en équipe) ont le même défaut.

## What Changes

- Les écrans qui présentent une mission (cahier des charges de la manche 1, présentation du rôle de Product Owner d'une équipe Scrum, transition vers la manche 2 en solo) suivent une même mise en page « briefing » :
  - une réplique de Madame Lefèvre en bulle, qui donne le ton en une phrase ;
  - les règles en 4 tuiles chiffrées, une idée par tuile (un grand chiffre ou un mot-clé, une ligne d'explication) ;
  - la mission en une phrase, juste au-dessus de ce sur quoi on agit (la jauge du cahier des charges, le Product Backlog).
- Le texte long disparaît : aucune information n'est perdue, elle est répartie dans les tuiles.
- Vocabulaire inchangé et toujours séparé par manche (aucun mot de l'autre manche dans un briefing).

## Capabilities

### New Capabilities
_Aucune._

### Modified Capabilities
- `solo-game` : le plan de la manche 1 et la transition présentent la mission en briefing (réplique, tuiles, mission) au lieu d'un paragraphe.
- `team-play` : la présentation du rôle de Product Owner d'une équipe Scrum suit la même mise en page.

## Impact

- `site/index.html` (écrans `plan`, `transition`, `role`), `site/app.css` (bulle, tuiles), éventuellement `site/js/vocabulary.js` si les textes de briefing y sont rangés.
- Aucun changement du moteur, des chiffres ni du mode collectif.
