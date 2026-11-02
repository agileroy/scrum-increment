## 1. Moteur

- [ ] 1.1 Ajouter `moveFeatureTo(state, id, index)` à `site/js/game-core.js`, avec les règles de `canMove`. Vérification : `tests/game-core.test.mjs` (scénarios « Remonter de plusieurs rangs » et « Badges mis à jour » côté moteur, bornes, élément terminé ou plan validé refusé, état reçu inchangé).

## 2. Interface

- [ ] 2.1 Ajouter la poignée et le geste de glisser-déposer dans `site/js/ui.js` et `site/app.css`, pour le cahier des charges et le Product Backlog : fantôme, ligne d'insertion, défilement automatique, annulation hors de la liste ou par Échap, focus après le dépôt. Vérification : liste de contrôle 3.1.

## 3. Vérification et publication

- [ ] 3.1 Jouer dans un navigateur automatisé : glisser à la souris et au doigt (événements tactiles), dans le cahier des charges et le Product Backlog ; remonter l'alerte au rang 3, le paiement en haut (badge rouge), relâcher hors de la liste (ordre inchangé), vérifier l'absence de poignée sur un élément terminé et que les flèches marchent toujours. Vérification : ordre attendu après chaque geste, aucune erreur dans la console.
- [ ] 3.2 Vérifier l'affichage à 360 et 1280 px, en thème clair et sombre. Vérification : captures sans défilement horizontal, poignée d'au moins 44 px sur téléphone.
- [ ] 3.3 Pousser sur `main` et vérifier la publication GitHub Actions. Vérification : workflow réussi et déploiement du dernier commit.
- [ ] 3.4 Faire jouer l'auteur. Vérification : validation explicite de l'auteur.

## Workflow follow-up

- Archiver le changement avec `/opsx:archive` après la validation de l'auteur.
