## Why

Retour de l'auteur : la manche 1 parle de Sprints, alors qu'elle représente un projet classique. Le vocabulaire Agile y brouille le contraste que le jeu veut faire vivre. Chaque manche doit parler sa propre langue : celle de la gestion de projet en manche 1, celle de Scrum en manche 2, avec un écran de transition qui fait la bascule.

## What Changes

- **Lexique par manche**, appliqué à tous les textes de la manche :

  | Élément | Manche 1 (projet) | Manche 2 (Scrum) |
  |---|---|---|
  | Rôle du joueur | Chef de projet | Product Owner |
  | Mme Lefèvre | La commanditaire | Partie prenante, cliente de l'équipe |
  | Rythme de 2 semaines | COPIL toutes les 2 semaines (« COPIL 2 sur 6 ») | Sprint (« Sprint 2 sur 6 ») |
  | Bouton | « Avancer jusqu'au COPIL N » | « Lancer le Sprint N » |
  | Liste | Cahier des charges, en lots | Product Backlog |
  | Bilan des 2 semaines | Compte rendu de COPIL, avec une météo du projet | Sprint Review, avec les retours clients |
  | Finir proprement | Recette et mise en production, à la fin | Definition of Done, à chaque Sprint |
  | Changement | Demande de changement, avenant | Nouvel élément du Product Backlog |
  | Journal | Comptes rendus de COPIL | Journal des Sprints |

- **Météo du projet** en manche 1 : « Ensoleillé » tant que le reste à faire tient dans la capacité restante, « Orageux » sinon. Avec la coupure, l'orage n'éclate qu'au COPIL qui l'annonce : jusque-là, tout va bien sur le papier.
- **Écran de transition** : il annonce le changement de rôle et de vocabulaire (chef de projet → Product Owner, cahier des charges → Product Backlog, COPIL → Sprint Review).
- **Résultats en semaines** : l'axe du graphique est commun et neutre (« 2 sem. » à « 20 sem. »), avec la ligne « Fin du projet » ; le premier euro s'exprime en semaines (« Dès la semaine 3 ») ; les légendes nomment les approches (« Manche 1 : projet, une livraison à la fin », « Manche 2 : Scrum, un incrément à chaque Sprint »).
- **Débrief** : une question sur ce que le changement de vocabulaire a changé dans la façon de décider.
- Les points restent l'unité de travail des deux manches, pour garder la comparaison.

Hors périmètre : changer les règles du moteur (seuls les textes et l'affichage changent), d'autres unités que les points, d'autres rôles (Scrum Master, Developers).

## Capabilities

### New Capabilities

- `round-vocabulary` : le lexique de chaque manche (rôle, rythme, liste, bilan, fin propre, changement, journal), la météo du projet et la bascule de vocabulaire entre les manches.

### Modified Capabilities

- `scenario` : le calendrier parle de périodes de 2 semaines, Sprints en manche 2 et intervalles entre deux COPIL en manche 1.
- `solo-game` : plan, tableau, fenêtres, demande de changement, fin du projet et transition rédigés avec le lexique de chaque manche.
- `game-results` : axe en semaines, premier euro en semaines, légendes et question de débrief.

## Impact

- `site/js/ui.js`, `site/js/chart.js`, `site/js/game-core.js` (libellés de période et météo), `site/index.html`, `site/app.css`, `tests/`, `README.md`.
- Aucun chiffre ne change : les parcours de référence restent identiques.
