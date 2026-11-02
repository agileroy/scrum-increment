## Context

Dépôt neuf. Un prototype jouable existe déjà : une page HTML unique, écrite pendant la conception du jeu, qui a servi à régler les chiffres du scénario (les parcours de référence de `sprint-simulation` en sont tirés). Ce changement le reprend dans l'organisation des jeux frères `roles-responsabilites` et `scrum-events` : site statique vanilla en modules ES, sans build, logique métier pure testée avec `node --test`, publication GitHub Pages bloquée par les tests, identité visuelle commune. Le mode collectif viendra dans un changement suivant ; ce changement prépare le terrain sans l'anticiper au-delà du nécessaire.

## Goals / Non-Goals

**Goals:**
- Une simulation qui fait ressentir la valeur de l'incrément en 15 à 20 minutes de jeu seul, et 30 à 45 minutes en formation avec le débrief.
- Un moteur pur, déterministe et sérialisable, réutilisable tel quel par le futur mode collectif.
- Des chiffres réglés une fois pour toutes, protégés par des tests de parcours de référence.
- La même allure que les jeux frères, utilisable projetée et sur téléphone.

**Non-Goals:**
- Mode collectif, Firebase et règles de sécurité (changement suivant).
- Scénario modifiable depuis l'interface, autres produits, autres imprévus.
- Sauvegarde d'une partie en cours : un rechargement de page repart de l'accueil.

## Decisions

- **Organisation des fichiers** (`site/`) : `index.html`, `app.css`, `img/favicon.svg`, et dans `js/` : `scenario.js` (données), `game-core.js` (moteur pur), `chart.js` (graphique SVG), `ui.js` (écrans et fenêtres), `theme.js` (bascule de thème, reprise de `scrum-events` avec sa clé `scrum-increment.theme`), `app.js` (point d'entrée). Alternative écartée : garder la page unique du prototype, que les tests Node ne peuvent pas importer.

- **Scénario dans un module JavaScript plutôt qu'en JSON** : `scenario.js` exporte `FEATURES`, `QUOTES`, `EVENTS` et les constantes (`EURO_PER_POINT = 100`, `COST_PER_POINT = 500`, capacités, `RECETTE = 8`, `LAST_SPRINT = 10`, `CLIENT_LOSS = 0.9`). Importé directement par le navigateur et par Node, sans `fetch` ni lecture de fichier. Contrairement au paquet de cartes des jeux frères, le scénario est réglé avec le moteur et ses tests, pas relu à part.

- **État de partie en JSON simple** : `newRound(mode, { cut })` renvoie un objet de tableaux et de nombres (`order`, `included`, `progress`, `done`, `live`, `revealed`, `shownQuotes`, `recette`, `clientele`, `cumulative`, `curve`, `spent`, `firstSale`, `spentBeforeFirstSale`, `lastBuildSprint`, `log`), sans `Set` ni classe. Les fonctions du moteur prennent un état et renvoient un nouvel état avec le compte rendu du Sprint (`playSprint(state) → { state, report }`, `finishRound(state) → { state, summary }`, `planStatus(state)`, `moveFeature(state, id, direction)`, `toggleInPlan(state, id)`, `roundResults(state)`). Le futur mode collectif pourra stocker cet état dans Firebase tel quel et faire jouer le moteur par le navigateur du formateur, comme `game-store.js` dans les jeux frères.

- **Compte rendu de Sprint** (`report`) : ventes du Sprint, fonctionnalités terminées et mises en ligne, sortie de l'appli (manche 1), avancement du plan, retours clients choisis, imprévus annoncés, fin du développement atteinte. L'interface n'a qu'à l'afficher : aucune règle de jeu dans `ui.js`.

- **Ordre dans un Sprint** : pertes de clients, ventes avec ce qui était en ligne au début, construction, mise en ligne à la fin. Une fonctionnalité livrée rapporte donc à partir du Sprint suivant, ce qui laisse à la Sprint Review le temps de « recueillir » les retours ; c'est aussi ce qui rend le premier euro de la manche 2 visible au Sprint 2.

- **Coût du Done** : 2 points par Sprint dans la manche 2, 8 points de recette d'un bloc dans la manche 1. Sur 6 Sprints, les deux façons de faire dépensent à peu près autant pour finir proprement (12 et 8 points) : la manche 1 n'est pas désavantagée par une règle artificielle, elle perd « normalement » par le délai et l'absence de retours.

- **Retours clients déterministes** : les retours sont pris dans l'ordre du scénario, au plus trois par Review, selon les fonctionnalités en ligne et sans répétition. Pas de hasard : deux parties identiques donnent les mêmes Reviews, et le formateur peut préparer son débrief.

- **Graphique en SVG fait main** (`chart.js`) : deux polylignes, une grille de cinq graduations arrondies, des points avec `<title>` pour la valeur au survol, des marqueurs différents par courbe (rond et carré) et un trait plein ou pointillé, pour ne pas dépendre de la couleur seule. Couleurs tirées des variables CSS, donc justes dans les deux thèmes. Alternative écartée : une bibliothèque de graphiques, qui ajouterait un CDN ou un fichier tiers pour deux courbes.

- **Identité visuelle** : variables de couleur, rayon, ombre et police système reprises de `scrum-events/site/app.css` ; une couleur d'accent « croûte » (`--crust`, ambre) propre au jeu, pour les rangs, les barres d'avancement et l'intuition, comme les couleurs d'événements du jeu frère. Fenêtres de fin de Sprint en `<dialog>` natif (focus et touche Échap gérés par le navigateur).

- **Écrans** : sections `accueil`, `plan`, `tableau`, `transition`, `résultats`, une seule visible à la fois ; retour en haut de page à chaque changement d'écran. Sur téléphone, le journal passe sous la liste.

## Risks / Trade-offs

- [Chiffres qui ne racontent plus l'histoire après une retouche] → les trois parcours de référence et l'écart intuition / réalité sont testés : toute retouche du scénario qui change le récit fait échouer `npm test`.
- [Manche 1 vécue comme un piège] → le plan tient dans le budget sans imprévu, l'appli sort au Sprint 6, et le choix de la coupure est laissé au formateur ; le débrief porte sur le délai et l'apprentissage, pas sur une règle cachée.
- [Joueur qui ne réordonne jamais le Product Backlog] → le parcours « ordre initial jamais réordonné » est justement la troisième courbe du débrief : livrer souvent sans écouter rapporte moins.
- [Manche 2 trop facile une fois le jeu connu] → acceptable : le jeu se joue une fois par formation, et le mode collectif cachera la comparaison.
- [Prototype et version publiée qui divergent] → le prototype n'est pas versionné ; le dépôt est la seule référence.

## Migration Plan

Aucune migration : premier contenu du dépôt. Réglage manuel unique : source de GitHub Pages sur « GitHub Actions ».

## Open Questions

_Aucune._
