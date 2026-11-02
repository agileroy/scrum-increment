## MODIFIED Requirements

### Requirement: Plan de la manche 1
Avant le premier COPIL, l'écran du cahier des charges SHALL présenter la mission en briefing : une réplique de Madame Lefèvre, puis la règle en quatre tuiles chiffrées (12 semaines avec un COPIL toutes les 2 semaines ; 72 points, l'équipe abattant 12 points tous les 15 jours ; 8 points de recette et de mise en production finales ; cahier des charges contractuel une fois validé, tout changement passant par un avenant), puis la mission en une phrase juste au-dessus de la jauge. L'écran MUST NOT présenter ces règles en paragraphe. Il SHALL lister les lots avec leur rang, leur coût, l'intuition de la commanditaire et leur prérequis. Le joueur SHALL pouvoir retirer ou remettre un lot et changer son rang. Une jauge SHALL comparer les points planifiés aux 64 points, et un message SHALL dire ce qui bloque ou que le cahier des charges tient. La validation SHALL rester inactive tant qu'il est invalide.

#### Scenario: Dépassement
- **GIVEN** le cahier des charges initial de 66 points
- **WHEN** l'écran s'affiche
- **THEN** la jauge est rouge, le message indique un dépassement de 2 points et la validation est impossible

#### Scenario: Prérequis retiré
- **GIVEN** un cahier des charges qui contient le paiement en ligne
- **WHEN** le joueur retire la réservation de pain
- **THEN** le message indique que « Paiement en ligne » nécessite « Réservation de pain » et la validation est impossible

#### Scenario: Briefing lisible d'un coup d'œil
- **GIVEN** un téléphone de 360 px de large
- **WHEN** l'écran du cahier des charges s'affiche
- **THEN** la réplique de Mme Lefèvre et les quatre tuiles (12 semaines, 72 points, 8 points, contrat) tiennent sans défilement horizontal, et la phrase de mission précède la jauge

## ADDED Requirements

### Requirement: Briefing de la manche 2
L'écran de transition vers la manche 2 SHALL présenter la nouvelle mission avec la même mise en page que le cahier des charges : une réplique de Madame Lefèvre, quatre tuiles (Sprint de 2 semaines conclu par une Sprint Review ; 10 points pour construire et 2 pour la Definition of Done ; une fonctionnalité terminée est en ligne et rapporte dès le Sprint suivant ; chaque Sprint Review révèle la vraie valeur grâce aux retours clients) et la mission en une phrase. Le tableau des équivalences de vocabulaire SHALL rester sur cet écran.

#### Scenario: Transition
- **GIVEN** la fin de la manche 1
- **WHEN** le joueur ferme la fin du projet
- **THEN** il voit la réplique de Mme Lefèvre, les quatre tuiles de la manche 2, le tableau « Ce qui change » et « Commencer la manche 2 »
