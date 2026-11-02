## ADDED Requirements

### Requirement: Calendrier
Un Sprint SHALL durer 2 semaines. La partie SHALL couvrir 20 semaines à partir du lancement du projet, soit 10 périodes de 2 semaines : les Sprints de développement, puis des semaines d'exploitation sans développement.

#### Scenario: Coupure budgétaire
- **GIVEN** une partie avec la coupure budgétaire
- **WHEN** le développement s'arrête après le Sprint 5
- **THEN** la partie continue 10 semaines d'exploitation, jusqu'à 20 semaines après le lancement

### Requirement: Demandes de changement
Le scénario SHALL contenir trois demandes de Madame Lefèvre, chacune une nouvelle fonctionnalité avec un texte de Mme Lefèvre, un coût, un prérequis, l'intuition de Mme Lefèvre et une valeur réelle cachée, annoncée dans la Sprint Review d'un Sprint :

| Après le Sprint | Fonctionnalité | Coût | Intuition | Valeur réelle | Prérequis |
|---|---|---|---|---|---|
| 1 | Version anglaise | 5 | 4 | 0 € | Vitrine |
| 2 | Promotions flash | 6 | 4 | 100 € | Vitrine |
| 3 | Plateaux pour les entreprises | 6 | 2 | 400 € | Vitrine |

Les demandes MUST NOT faire partie du plan ni du Product Backlog avant leur annonce.

#### Scenario: Opinions trompeuses
- **GIVEN** les trois demandes
- **WHEN** on compare l'intuition et la valeur réelle
- **THEN** les deux demandes notées 4 étoiles rapportent 100 € ou moins par Sprint, et la demande notée 2 étoiles rapporte le plus

### Requirement: Retours clients des demandes
Le scénario SHALL contenir au moins un retour client pour chaque demande de changement, affiché une fois la fonctionnalité demandée en ligne, selon les mêmes règles que les autres retours.

#### Scenario: Version anglaise en ligne
- **GIVEN** la version anglaise en ligne dans la manche 2
- **WHEN** la Sprint Review suivante s'affiche
- **THEN** un retour client indique que personne ne l'utilise dans le quartier
