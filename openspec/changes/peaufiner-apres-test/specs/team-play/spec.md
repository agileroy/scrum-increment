## ADDED Requirements

### Requirement: Contexte de la mission
En attendant le lancement, l'écran d'un participant SHALL raconter le contexte commun : Mme Lefèvre tient la boulangerie du quartier, veut une appli pour que ses clients commandent en ligne et en confie la réalisation à l'équipe, avec sa réplique « Ma seule question : quand est-ce que ça me rapporte ? ». Il MUST NOT dire la façon de travailler de l'équipe (le formateur peut encore déplacer un participant, et la répartition reste secrète jusqu'à la révélation) ; il SHALL annoncer qu'elle sera donnée au lancement. Au lancement, le premier écran de l'équipe SHALL reprendre le contexte et ajouter la démarche : démarche projet (cahier des charges signé avant de commencer, COPIL toutes les deux semaines) pour une équipe projet, Scrum (Product Owner, un Increment utilisable à chaque Sprint, une Sprint Review pour montrer ce qui marche) pour une équipe Scrum.

#### Scenario: Attente sans démarche
- **GIVEN** un participant dans une salle pas encore lancée
- **WHEN** son écran d'attente s'affiche
- **THEN** il lit le contexte et la réplique de Mme Lefèvre, sans les mots « projet », « Scrum », « COPIL » ni « Sprint »

#### Scenario: Démarche au lancement
- **GIVEN** la partie lancée
- **WHEN** un membre de Baguette ouvre son téléphone
- **THEN** la présentation du rôle de Product Owner commence par le contexte, suivi de « Vous optez pour Scrum »
