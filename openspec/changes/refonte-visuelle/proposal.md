## Why

Le jeu fonctionne, mais son habillage est celui, neutre, des jeux frères : fond beige, police système, cartes toutes identiques. Rien n'évoque la boulangerie de Mme Lefèvre, et l'ensemble ne donne pas envie. L'auteur donne carte blanche sur la direction artistique, à une condition : aucune fonctionnalité ne change.

## What Changes

- **Une identité de boulangerie de quartier** : l'en-tête devient la devanture (bandeau d'enseigne émaillée bleu nuit, lettres blanches) d'où pend un store banne rayé à festons ; c'est l'élément signature, présent sur tous les écrans.
- **Deux ambiances** : thème clair « comptoir » (blanc farine, bleu émail, doré croûte) ; thème sombre « ardoise » (le tableau noir de la boulangerie, écrit à la craie).
- **Typographie** : Bricolage Grotesque (fonderie française, variable) pour les titres et le texte ; Caveat, manuscrite, réservée à la voix de Mme Lefèvre (ses répliques, comme notées sur son carnet de commandes). Les deux polices sont hébergées avec le site, sous licence OFL : toujours aucune requête vers un tiers.
- **Composants** : les fonctionnalités deviennent des tickets (talon numéroté, pointillé de découpe) ; boutons « émaillés » avec épaisseur ; jauges, tuiles, fenêtres, tableaux et graphique repris dans la nouvelle palette.
- Aucun changement de règle, de texte de jeu, de parcours ni de mise en page fonctionnelle : mêmes écrans, mêmes boutons, mêmes largeurs (360 px à 1280 px et plus), mêmes thèmes clair et sombre.

## Capabilities

### New Capabilities
_Aucune._

### Modified Capabilities
- `site-publication` : identité visuelle (devanture, thèmes comptoir et ardoise, polices hébergées avec le site) ; l'interdiction des polices web devient l'interdiction des polices servies par un tiers.

## Impact

- `site/app.css` (réécrit), `site/index.html` (en-tête, chargement des polices), `site/fonts/` (deux fichiers woff2 et leurs licences), `site/img/favicon.svg`, README, `openspec/config.yaml`.
- Aucun changement dans `site/js/` hors classes de présentation éventuelles ; tests du moteur inchangés.
