## ADDED Requirements

### Requirement: Adresse et sauvegarde de la partie seule
La partie seule SHALL avoir sa propre adresse (`#solo`) et SHALL être sauvegardée dans le navigateur à chaque action. Rafraîchir la page à cette adresse SHALL reprendre la partie à l'écran où elle en était ; une demande de changement non tranchée ou une fin de manche non affichée SHALL se rouvrir. L'enseigne « Fournée » et le bouton Précédent du navigateur SHALL ramener à l'accueil sans perdre la partie. En salle, l'enseigne MUST NOT être un lien.

#### Scenario: Rafraîchir pendant une demande
- **GIVEN** une partie seule au COPIL 2, la demande de changement affichée
- **WHEN** le joueur rafraîchit la page
- **THEN** il retrouve le tableau du COPIL 2 et la fenêtre de la demande

#### Scenario: Retour à l'accueil
- **GIVEN** une partie seule en cours
- **WHEN** le joueur clique sur l'enseigne « Fournée », puis sur Précédent
- **THEN** l'accueil s'affiche, puis la partie reprend où elle en était

### Requirement: Reprendre ou recommencer
Quand une partie seule est sauvegardée, l'accueil SHALL dire où elle en est (par exemple « Partie en cours : Manche 1 · Projet, COPIL 2 sur 6. ») et proposer « Reprendre la partie » et « Nouvelle partie ». « Rejouer », à la fin des résultats, SHALL effacer la sauvegarde.

#### Scenario: Accueil avec une partie en cours
- **GIVEN** une partie seule sauvegardée au COPIL 2
- **WHEN** l'accueil s'affiche
- **THEN** il indique « Partie en cours : Manche 1 · Projet, COPIL 2 sur 6. » avec « Reprendre la partie » en premier

### Requirement: Phrase d'accueil
L'accueil SHALL présenter Mme Lefèvre et finir par sa réplique « Je sais ce que je veux… enfin, je crois. », qui annonce le thème de l'intuition. L'accueil, lu aussi par les participants d'une salle, MUST NOT dévoiler la comparaison des deux façons de travailler.

#### Scenario: Accueil
- **GIVEN** la page d'accueil
- **WHEN** elle s'affiche
- **THEN** la présentation finit par « Elle l'avoue elle-même : « Je sais ce que je veux… enfin, je crois. » »
