# game-room Specification

## Purpose
La salle d'une partie collective : création par le formateur, code et QR code, arrivée des participants, équipes, réglages, présence, retrait et suppression des salles anciennes.

## Requirements

### Requirement: Création de la salle
Depuis l'accueil, « Animer une partie » SHALL créer une salle avec un code libre de 4 lettres (sans I, L, O) et faire du navigateur appelant le formateur. L'écran du formateur SHALL afficher le code en grand, l'adresse à ouvrir et un QR code qui mène directement à la salle. Le formateur anime, il ne joue pas.

#### Scenario: Salle créée
- **GIVEN** l'accueil
- **WHEN** le formateur clique sur « Animer une partie »
- **THEN** une salle est créée, son code et son QR code s'affichent, et la liste des équipes est vide

### Requirement: Rejoindre une partie
Un participant SHALL rejoindre avec le code (ou le QR code) et un prénom de 1 à 20 caractères, unique dans la salle sans tenir compte des majuscules ni des accents. Aucun compte n'est demandé. Le prénom SHALL être retenu par le navigateur pour la prochaine fois. Une salle compte au plus 30 participants. Un participant qui recharge la page SHALL retrouver sa place et son équipe.

#### Scenario: Prénom déjà pris
- **GIVEN** une salle où « Julie » est déjà là
- **WHEN** un autre participant veut entrer sous le prénom « julie »
- **THEN** il est refusé avec « Ce prénom est déjà pris dans la salle. »

#### Scenario: Code inconnu
- **GIVEN** l'accueil
- **WHEN** un participant saisit un code qui ne correspond à aucune salle
- **THEN** il voit « Aucune partie avec ce code. »

### Requirement: Équipes
Le formateur SHALL régler le nombre d'équipes, de 2 à 6 (2 par défaut), tant que la partie n'est pas lancée. Chaque équipe a un nom de viennoiserie (Croissant, Baguette, Brioche, Éclair, Chouquette, Fougasse). Un participant qui arrive SHALL être placé dans l'équipe la moins nombreuse (la première en cas d'égalité) ; le formateur SHALL pouvoir le changer d'équipe à tout moment. Les équipes impaires (1, 3, 5) jouent « projet », les équipes paires (2, 4, 6) jouent « Scrum ». Chaque participant SHALL connaître la démarche de sa propre équipe dès l'attente ; l'écran projeté du formateur MUST NOT afficher la répartition avant la révélation.

#### Scenario: Répartition automatique
- **GIVEN** une salle à 2 équipes, avec 2 participants dans Croissant et 1 dans Baguette
- **WHEN** un participant rejoint
- **THEN** il est placé dans l'équipe Baguette

#### Scenario: Réduire le nombre d'équipes
- **GIVEN** une salle à 3 équipes, avec des participants dans Brioche
- **WHEN** le formateur passe à 2 équipes
- **THEN** les participants de Brioche sont replacés dans les équipes restantes, toujours dans la moins nombreuse

### Requirement: Réglage du chrono
Le formateur SHALL pouvoir régler un chrono de réflexion facultatif : sans, 1, 2 ou 3 minutes, modifiable à tout moment. Il s'applique à partir de la période suivante.

#### Scenario: Chrono choisi
- **GIVEN** la salle d'attente
- **WHEN** le formateur choisit 2 minutes
- **THEN** chaque période affichera un compte à rebours de 2 minutes sur tous les écrans

### Requirement: Présence, retrait et retardataires
Le formateur SHALL voir, pour chaque équipe, ses membres et s'ils sont connectés. Il SHALL pouvoir retirer un participant, qui ne peut plus revenir dans la salle. Un participant qui rejoint après le lancement SHALL être placé dans l'équipe la moins nombreuse et jouer aussitôt avec elle.

#### Scenario: Retardataire
- **GIVEN** une partie en cours à la période 3
- **WHEN** un participant rejoint
- **THEN** il voit le cahier des charges ou le Product Backlog de son équipe, dans l'état où l'équipe l'a laissé

### Requirement: Suppression des salles
Le formateur SHALL pouvoir supprimer sa salle. Les salles de plus de 24 heures SHALL être supprimées par le navigateur du prochain formateur qui crée une partie.

#### Scenario: Salle ancienne
- **GIVEN** une salle créée il y a 25 heures
- **WHEN** un formateur crée une nouvelle partie
- **THEN** l'ancienne salle est supprimée
