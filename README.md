# scrum-increment

**Fournée**, un jeu de formation Scrum pour vivre la valeur de l'incrément (Increment), sans publicité. Jeu frère de [roles-responsabilites](https://github.com/agileroy/roles-responsabilites) et [scrum-events](https://github.com/agileroy/scrum-events), avec une mécanique de simulation plutôt que de cartes.

**Site : [https://agileroy.github.io/scrum-increment/](https://agileroy.github.io/scrum-increment/)**

## Principe

Madame Lefèvre tient la boulangerie du quartier. Elle veut une appli pour que ses clients commandent en ligne, avec un budget de 6 Sprints. Le joueur mène le même projet deux fois, avec le même budget, les mêmes fonctionnalités et les mêmes imprévus ; seule la façon de livrer change.

- **Manche 1, une seule livraison à la fin** : le comité veut un plan complet et contractuel (6 Sprints de 12 points, dont 8 points de recette et de mise en production finales). Le plan proposé dépasse de 2 points : il faut renoncer à quelque chose. Ensuite, l'avancement progresse, le comité est rassuré… mais il n'y a ni vente ni retour client avant la sortie.
- **Manche 2, un incrément à chaque Sprint** : 10 points pour construire et 2 pour finir proprement. Avant chaque Sprint, le joueur réordonne le Product Backlog. Chaque fonctionnalité terminée est en ligne et rapporte dès le Sprint suivant ; la Sprint Review apporte des retours clients qui révèlent la vraie valeur des fonctionnalités et donnent des indices.
- **Intuition contre réalité** : chaque fonctionnalité affiche l'intuition de Mme Lefèvre (étoiles) ; sa valeur réelle (ventes par Sprint) est cachée. La livraison et le paiement, jugés indispensables, rapportent peu ; la réservation de pain, les gâteaux sur mesure et l'alerte « fournée chaude » rapportent beaucoup.
- **Imprévus** : à la Review du Sprint 2, la boulangerie concurrente lance sa commande en ligne, et chaque Sprint sans appli fait perdre 10 % des clients potentiels. Facultatif (case à cocher à l'accueil) : à la Review du Sprint 3, la banque réduit le prêt et le développement s'arrête après le Sprint 5.
- **Résultats** : les ventes continuent sans développement jusqu'au Sprint 10, puis l'écran superpose les deux courbes de ventes cumulées, compare des indicateurs (premier euro, argent investi avant le premier euro, fonctionnalités en ligne et peu utilisées, ventes cumulées), révèle « intuition contre réalité » et propose des questions de débrief.

Ordres de grandeur, joués et vérifiés par les tests (ventes cumulées au Sprint 10) :

| Parcours | Sans coupure | Avec coupure |
|---|---|---|
| Manche 1, plan sans les avis clients | 9 448 € | 0 € |
| Manche 2, Product Backlog jamais réordonné | 15 300 € | 13 300 € |
| Manche 2, à l'écoute des retours clients | 25 300 € | 25 300 € |

Le moteur est déterministe : deux parties jouées de la même façon donnent les mêmes Reviews et les mêmes chiffres, ce qui permet au formateur de préparer son débrief.

Cette première version se joue seul. Un mode collectif en temps réel (salle, code, équipes, comparaison cachée jusqu'à la fin) est prévu, sur le modèle des jeux frères.

## Réseau d'entreprise

Le VPN de l'entreprise (proxy Zscaler) bloque GitHub Pages : jouer hors VPN.

## Architecture

Site statique (HTML/CSS/JavaScript, sans build) publié sur GitHub Pages, sans aucun service tiers (polices système, ni CDN, ni traceur).

- `site/js/scenario.js` : données du scénario (fonctionnalités, retours clients, imprévus, constantes) ;
- `site/js/game-core.js` : logique métier pure et déterministe (plan, Sprints, construction dans l'ordre, prérequis, mises en ligne, ventes, clients perdus, coupure, résultats), testée avec Node.js ; l'état d'une manche est un objet JSON simple ;
- `site/js/chart.js` : graphique SVG des ventes cumulées ;
- `site/js/ui.js` : écrans et fenêtres ; `site/js/theme.js` : thème clair ou sombre ; `site/js/app.js` : point d'entrée.

## Développement

```
npm test                                          # scénario et moteur, dont les parcours de référence
python3 -m http.server 8765 --directory site      # puis http://localhost:8765/
```

Chaque push sur `main` lance les tests puis publie `site/` sur GitHub Pages ; un test en échec bloque la publication. Une retouche du scénario qui change l'histoire racontée par les courbes fait échouer les tests des parcours de référence.

## Méthode

Le projet suit le développement piloté par les spécifications avec [OpenSpec](https://github.com/Fission-AI/OpenSpec) : `openspec/specs/` décrit le comportement attendu, `openspec/changes/` les changements en cours. Commandes Claude Code : `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:archive`.
