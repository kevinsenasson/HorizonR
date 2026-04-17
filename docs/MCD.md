# MCD — Modèle Conceptuel de Données

## Projet HorizonR — NovaTech Solutions

---

## Entités et attributs

### EMPLOYE

| Attribut      | Type    | Contrainte          |
| ------------- | ------- | ------------------- |
| id            | Entier  | Identifiant (PK)    |
| nom           | Texte   | Obligatoire         |
| prenom        | Texte   | Obligatoire         |
| email         | Texte   | Unique, Obligatoire |
| mot_de_passe  | Texte   | Obligatoire (hash)  |
| date_embauche | Date    | Obligatoire         |
| solde_conges  | Décimal | Défaut : 25.0       |
| actif         | Booléen | Défaut : vrai       |

### SERVICE

| Attribut | Type   | Contrainte       |
| -------- | ------ | ---------------- |
| id       | Entier | Identifiant (PK) |
| nom      | Texte  | Unique           |

### ROLE

| Attribut | Type   | Contrainte                         |
| -------- | ------ | ---------------------------------- |
| id       | Entier | Identifiant (PK)                   |
| nom      | Texte  | Unique (ADMIN / MANAGER / EMPLOYE) |

### TYPE_CONGE

| Attribut | Type    | Contrainte       |
| -------- | ------- | ---------------- |
| id       | Entier  | Identifiant (PK) |
| nom      | Texte   | Unique           |
| plafonné | Booléen | Pour CP/RTT      |

### CONGE

| Attribut     | Type       | Contrainte                            |
| ------------ | ---------- | ------------------------------------- |
| id           | Entier     | Identifiant (PK)                      |
| date_debut   | Date       | Obligatoire                           |
| date_fin     | Date       | Obligatoire, ≥ date_debut             |
| nb_jours     | Décimal    | Calculé (jours ouvrés)                |
| statut       | Texte      | EN_ATTENTE / VALIDE / REFUSE / ANNULE |
| commentaire  | Texte      | Optionnel                             |
| date_demande | Horodatage | Auto                                  |

### PLANNING

| Attribut    | Type       | Contrainte       |
| ----------- | ---------- | ---------------- |
| id          | Entier     | Identifiant (PK) |
| titre       | Texte      | Obligatoire      |
| date_debut  | Horodatage | Obligatoire      |
| date_fin    | Horodatage | Obligatoire      |
| couleur     | Texte      | Code hex         |
| description | Texte      | Optionnel        |

---

## Associations

```
EMPLOYE ----appartient à----> SERVICE
         (N,1)               (1,N)

EMPLOYE ----possède----> ROLE
         (N,1)           (1,N)

EMPLOYE ----manage par----> EMPLOYE
         (N,0-1)             (1,N) [auto-référence : manager_id]

EMPLOYE ----demande----> CONGE ----concerne----> TYPE_CONGE
         (1,N)                    (N,1)

CONGE ----validé par----> EMPLOYE
      (N,0-1)              (1,N)

EMPLOYE ----crée----> PLANNING
         (1,N)        (N,1)

EMPLOYE ----participe à----> PLANNING
         (N,N)
```

---

## Cardinalités complètes

| Association           | Sens                        | Cardinalité   |
| --------------------- | --------------------------- | ------------- |
| EMPLOYE – SERVICE     | Un employé appartient à     | (1,1) – (0,N) |
| EMPLOYE – ROLE        | Un employé a exactement un  | (1,1) – (0,N) |
| EMPLOYE – EMPLOYE     | Un manager encadre          | (0,1) – (0,N) |
| EMPLOYE – CONGE       | Un employé fait             | (0,N) – (1,1) |
| CONGE – TYPE_CONGE    | Un congé est d'un type      | (1,1) – (0,N) |
| CONGE – EMPLOYE (val) | Validé par un seul valideur | (0,1) – (0,N) |
| EMPLOYE – PLANNING    | Un employé crée             | (0,N) – (1,1) |

---

## Règles de gestion

- RG1 : Un employé ne peut avoir qu'un seul rôle actif.
- RG2 : Le solde de congés est décrémenté uniquement lors de la validation de CP (type 1) ou RTT (type 2).
- RG3 : Un congé ne peut être validé/refusé que s'il est en statut EN_ATTENTE.
- RG4 : Un MANAGER ne peut valider que les congés des employés de son équipe.
- RG5 : Un employé désactivé (actif=0) ne peut pas se connecter (soft-delete).
- RG6 : date_fin d'un congé doit être supérieure ou égale à date_debut.
- RG7 : Le nombre de jours est calculé en jours ouvrés (hors samedis et dimanches).
