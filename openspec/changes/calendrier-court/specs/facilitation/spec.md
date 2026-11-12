## MODIFIED Requirements

### Requirement: Suivi neutre des équipes
Pendant la partie, l'écran du formateur SHALL afficher la période en cours (« Période 3 sur 6 · semaine 3 »), le chrono s'il y en a un, et pour chaque équipe son nom, ses membres connectés et son état : « Prête » ou « En réflexion ». Il SHALL aussi afficher un fil neutre des derniers événements de la salle (périodes lancées, équipes prêtes ou plus prêtes). Hors du panneau Coulisses, il MUST NOT afficher l'approche, les ventes, l'avancement, les cahiers des charges ou les Product Backlogs des équipes, ni de mot propre à une approche (COPIL, Sprint, cahier des charges, Product Backlog).

#### Scenario: Écran projeté
- **GIVEN** une partie à la période 2, coulisses fermées
- **WHEN** les participants regardent l'écran projeté
- **THEN** ils voient « Période 2 sur 6 », les équipes, leur état et le fil neutre, et rien qui distingue l'approche d'une équipe
