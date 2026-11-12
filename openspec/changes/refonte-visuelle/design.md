## Context

Site statique sans build, une seule feuille de style (`site/app.css`) pilotée par des variables CSS et `data-theme`. Les écrans sont produits par `index.html` et par du HTML généré dans `ui.js` et `room-ui.js` : les noms de classes sont le contrat, on les garde.

## Goals / Non-Goals

**Goals :** une identité propre au sujet (la boulangerie), lisible projetée et sur téléphone, dans les deux thèmes ; aucune régression fonctionnelle.

**Non-Goals :** pas de changement de règles, de textes de jeu ni de structure d'écran ; pas d'image ni de dépendance externe.

## Decisions

### Le sujet dicte la forme : la devanture
Ce qu'on voit d'abord d'une boulangerie, c'est son enseigne et son store. L'en-tête reprend donc une enseigne émaillée (bleu nuit, lettres blanches) et un store banne rayé à festons, en CSS pur (dégradés répétés et masque). C'est le seul geste fort ; tout le reste reste sobre. Alternatives écartées : fond crème, serif et terre cuite (le poncif du « chaleureux ») ; illustration de pains (lourde, et les émojis jouent déjà ce rôle).

### Palette
| Rôle | Comptoir (clair) | Ardoise (sombre) |
|---|---|---|
| Fond | farine `#F3F5F8` | ardoise `#1B2421` |
| Surface | `#FFFFFF` | `#232E2A` |
| Texte | encre `#141C3A` | craie `#EEF1EA` |
| Accent | bleu émail `#1F3FA6` | craie bleue `#A9C1FF` |
| Croûte | doré `#B8741A` | craie jaune `#F3CF6B` |
| En ligne | `#1F7A55` | `#8FDDB0` |
| Alerte | `#C0271D` | `#FFB9B0` |

Les couleurs d'état gardent leur sens (vert en ligne, rouge alerte, doré en cours). Les contrastes texte/fond visent 4,5:1 au moins.

### Typographie
Bricolage Grotesque variable (graisse, largeur, taille optique) : étroite et grasse pour les titres, façon lettrage d'enseigne ; normale pour le texte. Caveat pour les répliques de Mme Lefèvre seulement : la police encode qui parle. Fichiers woff2 (sous-ensemble latin, 131 Ko et 75 Ko) servis depuis `site/fonts/`, `font-display: swap`, repli sur les polices système.

### Tickets
Un élément de liste a un rang, qui est une vraie séquence (l'ordre de travail) : le talon numéroté du ticket le porte, séparé par un pointillé de découpe. Les états (en ligne, impossible, hors plan) restent portés par la couleur de bordure et les pastilles, comme avant.

## Risks / Trade-offs

- Polices : 206 Ko de plus au premier chargement, mises en cache ensuite ; le texte s'affiche tout de suite en police système (swap).
- Le jeu ne ressemble plus aux jeux frères : c'est voulu.
