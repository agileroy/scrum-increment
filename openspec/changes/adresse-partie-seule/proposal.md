## Why

En partie seule, tout se passe à la même adresse que l'accueil. Une fois « Commencer la manche 1 » cliqué, rien ne ramène à l'accueil ; à l'inverse, rafraîchir la page y ramène et fait perdre la partie. Par ailleurs, la phrase d'accueil prêtée à Mme Lefèvre ne reflétait pas l'esprit de l'exercice.

## What Changes

- La partie seule a son adresse (`#solo`) et se sauvegarde dans le navigateur à chaque action. Rafraîchir la reprend là où elle en était, demande de changement ou fin de manche comprises.
- L'enseigne « Fournée » et le bouton Précédent du navigateur ramènent à l'accueil, qui propose « Reprendre la partie » (avec où elle en est) ou « Nouvelle partie ». « Rejouer », à la fin, efface la sauvegarde.
- En salle, l'enseigne n'est pas un lien : la quitter ferait sortir de la partie collective.
- Accueil : « Elle l'avoue elle-même : « Je sais ce que je veux… enfin, je crois. » », qui annonce le thème de l'intuition sans dévoiler la comparaison des deux façons de travailler.

## Capabilities

### New Capabilities
_Aucune._

### Modified Capabilities
- `solo-game` : adresse, sauvegarde et reprise de la partie seule ; retour à l'accueil ; phrase d'accueil.

## Impact

- `site/js/ui.js`, `site/js/app.js`, `site/js/room-ui.js`, `site/index.html`, `site/app.css`, README.
