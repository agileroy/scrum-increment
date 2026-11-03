## Context

Le formateur lit déjà toute la salle (`watchRoom`), donc l'état de chaque équipe : cahier des charges, décisions, journal. Le journal du moteur contient déjà les faits utiles pour une équipe « projet » (validation du plan, demandes, décisions avec lots retirés, refus faute de décision, avancement, météo, sortie). Pour une équipe « Scrum », il manque l'ordre du Product Backlog au moment de chaque Sprint.

## Goals / Non-Goals

**Goals:**
- Un formateur qui sait, à tout moment, ce que chaque équipe a décidé, sans que la salle le voie.
- Un débrief qui s'appuie sur des faits datés (période par période).

**Non-Goals:**
- Montrer les ventes ou les courbes avant la révélation (même en coulisses : le formateur n'en a pas besoin pour animer, et elles s'afficheraient sur l'écran projeté par erreur).
- Historiser chaque clic : seul l'ordre au lancement de la période compte.

## Decisions

- **Neutralité garantie par défaut** : le panneau Coulisses est fermé à chaque chargement et se referme au lancement d'une période et à la révélation. Bouton « Coulisses (à ne pas projeter) », avec une icône d'œil barré. Alternative écartée : une seconde adresse pour un autre appareil du formateur ; elle exigerait de partager l'identité de formateur entre appareils (règles Firebase), plus lourd pour un gain faible.
- **Fil des décisions = faits du moteur** : `decisionTrail(state)` (pur, testé) renvoie, par période, des faits (`plan-validated`, `request`, `decision`, `order-change`, `release`, `live`), et `vocabulary.js` les met en phrases dans la langue de l'équipe. Les coulisses et les résultats utilisent la même fonction.
- **Ordre journalisé** : `playSprint` ajoute à l'entrée de période l'ordre de la liste au début de la période (`order`, tableau d'identifiants). `reviveRound` tolère son absence (parties en cours au moment de la mise à jour). Les changements d'ordre se calculent entre deux périodes : on n'affiche que les éléments qui ont gagné ou perdu au moins 2 rangs, plus les nouvelles entrées en tête, pour rester lisible.
- **Fil neutre de l'écran projeté** : 5 dernières lignes, sans mot d'approche (« Période 3 lancée pour toutes les équipes », « Croissant est prête »), déduites des changements de `ready` et de `meta.period` observés par le navigateur du formateur (non stockées).
- **Résultats** : section repliable par équipe, sous « Les indicateurs », avant « Intuition contre réalité ».

## Risks / Trade-offs

- [Coulisses ouvertes pendant la projection] → fermeture automatique et libellé explicite ; le formateur qui projette en mode « écran dupliqué » doit ouvrir les coulisses en sachant que la salle les voit, ce que dit le libellé.
- [Taille de l'état] → l'ordre ajoute 9 à 12 identifiants par période, négligeable.

## Open Questions

- Le récap doit-il vraiment rester caché à la salle ? (proposition : oui, sinon les équipes comprennent qu'elles ne jouent pas pareil)
