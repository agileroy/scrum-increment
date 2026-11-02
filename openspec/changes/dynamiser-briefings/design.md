## Context

Les trois écrans d'introduction (plan de la manche 1, transition vers la manche 2, rôle de Product Owner en équipe) sont aujourd'hui un titre, un paragraphe `.lead` de 60 à 80 mots, puis éventuellement une liste à puces. Sur téléphone, le paragraphe du cahier des charges fait plus d'un écran avant le premier lot.

## Goals / Non-Goals

**Goals:**
- Comprendre la mission en 5 secondes : on lit la bulle, on balaie les tuiles, on agit.
- Les chiffres clés sautent aux yeux (grands, isolés).
- Un composant unique réutilisé par les trois écrans, cohérent avec l'identité des jeux frères (thèmes clair et sombre).

**Non-Goals:**
- Changer les règles ou les chiffres.
- Ajouter des illustrations ou des polices web (le site reste sans ressource externe).

## Decisions

- **Composant « briefing »** : `.briefing` = bulle de Mme Lefèvre (`.speech`, avec son nom en signature) + grille de tuiles (`.tiles`, 4 colonnes au-delà de 900 px, 2 sur téléphone) + phrase de mission (`.mission`, en gras, avec une flèche vers la zone d'action). Tuile = icône dessinée en SVG en ligne (comme les glyphes de la boîte à outils), grand chiffre ou mot-clé, une ligne d'explication.
- **Contenu, manche 1 (cahier des charges)** :
  - bulle : « Je veux savoir exactement ce que j'aurai, et quand. Tout doit être prêt dans 12 semaines. »
  - tuiles : « 12 semaines » (un COPIL toutes les 2 semaines) ; « 72 points » (l'équipe abat 12 points tous les 15 jours) ; « 8 points » (réservés à la recette et à la mise en production, à la fin) ; « Contrat » (une fois validé, tout changement passe par un avenant) ;
  - mission : « Choisissez les lots et leur ordre : 64 points à répartir. » juste au-dessus de la jauge.
- **Contenu, manche 2 (transition en solo et rôle en équipe)** :
  - bulle : « Je veux vendre le plus tôt possible. Montrez-moi ce qui marche, et on ajustera. »
  - tuiles : « 2 semaines » (un Sprint, conclu par une Sprint Review) ; « 10 + 2 points » (10 pour construire, 2 pour la Definition of Done) ; « En ligne » (une fonctionnalité terminée rapporte dès le Sprint suivant) ; « Retours clients » (chaque Sprint Review révèle la vraie valeur) ;
  - mission : « Ordonnez le Product Backlog : l'équipe prend les éléments par le haut. » ; en équipe, une ligne de plus sur « Nous sommes prêts ».
  - la transition du solo garde en plus son tableau « Ce qui change » (seul endroit où les deux vocabulaires se côtoient), replié sous les tuiles.
- **Où vivent les textes** : dans `index.html` (textes fixes des trois écrans ; l'écran du rôle en équipe existe déjà). Un test vérifiera qu'aucun briefing n'emploie les mots de l'autre manche, comme les tests de `vocabulary.js`.
- **Accessibilité** : bulle en `<blockquote>` avec `<footer>`, tuiles en liste (`<ul>`), icônes `aria-hidden`.

## Risks / Trade-offs

- [Répliques de Mme Lefèvre qui orientent trop le joueur] → elles décrivent ce que veut la commanditaire dans chaque cadre, sans dire quoi faire ; à relire par l'auteur.
- [Quatre tuiles serrées à 360 px] → 2 colonnes, chiffres à 1,5 rem, texte à 0,85 rem ; vérification par captures.

## Open Questions

- Les répliques proposées conviennent-elles à l'auteur ?
