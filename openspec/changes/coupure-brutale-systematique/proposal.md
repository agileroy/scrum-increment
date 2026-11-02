## Why

Retours de l'auteur. La coupure budgétaire est le moment fort du jeu, mais elle était facultative (case à cocher à l'accueil), ce qui la dévoile avant de jouer. Elle était aussi annoncée deux périodes à l'avance (Review du Sprint 3, COPIL 3) : prévenue, l'équipe « projet » pourrait déplacer la recette pour pousser en production ce qui est prêt, ce qui affaiblit la leçon. Dans la vraie vie, un financement s'arrête souvent sans préavis.

## What Changes

- **BREAKING** **Coupure systématique** : plus d'option à l'accueil ; toutes les parties subissent la coupure, sans qu'aucun écran ne l'annonce avant.
- **BREAKING** **Coupure brutale** : à la fin de la cinquième période (COPIL 5 en manche 1, Sprint 5 en manche 2), la banque coupe le prêt et tout s'arrête immédiatement, en l'état : ce qui est en ligne reste en ligne, ce qui n'est pas sorti ne sortira pas. Aucun préavis, donc aucune annonce aux COPIL ou Sprint Reviews 3 et 4.
- **Météo du projet** : sans préavis, elle reste « Ensoleillé » jusqu'au COPIL 4, puis « Orageux » au COPIL 5, quand la coupure tombe (ou « Livré » si l'appli est déjà sortie).
- **Nouveaux parcours de référence** (sans la variante « sans coupure ») : manche 1 avec le cahier des charges complet de 61 points, 0 € ; manche 1 avec un cahier des charges resserré de 39 points (vitrine, réservation, alerte, gâteaux, click & collect, fidélité), sortie au COPIL 4 et 16 038 € ; manche 2 inchangée, 13 300 € et 25 300 €.
- **Débrief** : une question sur le préavis (« Prévenus deux COPIL plus tôt, qu'auriez-vous fait ? »).
- Le moteur perd l'option `cut`.

Hors périmètre : un préavis paramétrable par le formateur, d'autres dates de coupure.

## Capabilities

### New Capabilities

_Aucune._

### Modified Capabilities

- `scenario` : l'imprévu de coupure devient systématique, sans annonce, à la fin de la cinquième période ; le calendrier et ses textes suivent.
- `sprint-simulation` : coupure sans préavis à la fin du Sprint 5 dans les deux manches ; scénarios et parcours de référence sans variante « sans coupure ».
- `solo-game` : accueil sans option de coupure ; fin du projet annoncée par la coupure elle-même.
- `game-results` : scénarios des indicateurs sans coupure facultative, nouvelle question de débrief.
- `round-vocabulary` : règles et scénarios de la météo du projet avec une coupure sans préavis.

## Impact

- `site/js/scenario.js`, `site/js/game-core.js`, `site/js/vocabulary.js`, `site/js/ui.js`, `site/index.html`, `tests/`, `README.md`, `openspec/config.yaml` (la coupure n'est plus facultative).
- Les tests et parcours de référence « sans coupure » disparaissent ou sont remplacés.
