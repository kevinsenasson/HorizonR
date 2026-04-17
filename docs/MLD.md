# MLD — Modèle Logique de Données

## Projet HorizonR — NovaTech Solutions

---

## Relations (notation relationnelle)

**services** (<u>id</u>, nom)

**roles** (<u>id</u>, nom)

**employes** (<u>id</u>, nom, prenom, email\*, mot_de_passe, date_embauche, solde_conges, actif, #role_id, #service_id, #manager_id)

> `*` = attribut unique  
> `#` = clé étrangère  
> `manager_id` est une auto-référence vers `employes.id` (NULL si pas de manager)

**types_conges** (<u>id</u>, nom)

**conges** (<u>id</u>, #employe_id, #type_id, date_debut, date_fin, nb_jours, statut, commentaire, date_demande, #valideur_id)

> `statut` : ENUM('EN_ATTENTE', 'VALIDE', 'REFUSE', 'ANNULE')  
> `valideur_id` NULL tant que le congé n'est pas traité

**planning** (<u>id</u>, #employe_id, titre, date_debut, date_fin, couleur, description, created_at)

---

## Détail des dépendances fonctionnelles

### Table `employes`

```
id → nom, prenom, email, mot_de_passe, date_embauche, solde_conges, actif
id → role_id, service_id, manager_id
email → id  (unicité)
```

### Table `conges`

```
id → employe_id, type_id, date_debut, date_fin, nb_jours, statut, commentaire, date_demande, valideur_id
employe_id, date_debut → (unicité métier conseillée)
```

### Table `planning`

```
id → employe_id, titre, date_debut, date_fin, couleur, description, created_at
```

---

## Contraintes d'intégrité référentielle

| Table    | Attribut    | Référence        | ON DELETE |
| -------- | ----------- | ---------------- | --------- |
| employes | role_id     | roles(id)        | RESTRICT  |
| employes | service_id  | services(id)     | SET NULL  |
| employes | manager_id  | employes(id)     | SET NULL  |
| conges   | employe_id  | employes(id)     | CASCADE   |
| conges   | type_id     | types_conges(id) | RESTRICT  |
| conges   | valideur_id | employes(id)     | SET NULL  |
| planning | employe_id  | employes(id)     | CASCADE   |

---

## Index définis

| Table    | Index                      | Type   | Colonnes               |
| -------- | -------------------------- | ------ | ---------------------- |
| employes | idx_employes_email         | UNIQUE | email                  |
| employes | idx_employes_role          | Normal | role_id                |
| employes | idx_employes_service       | Normal | service_id             |
| employes | idx_employes_manager       | Normal | manager_id             |
| conges   | idx_conges_employe         | Normal | employe_id             |
| conges   | idx_conges_statut          | Normal | statut                 |
| conges   | idx_conges_dates           | Normal | date_debut, date_fin   |
| planning | idx_planning_employe_dates | Normal | employe_id, date_debut |
