# Guide Utilisateur — HorizonR

## Application de gestion RH — NovaTech Solutions

---

## Connexion

Accédez à l'application à l'adresse **http://localhost** (ou http://localhost:80).

### Identifiants de démonstration

| Rôle    | Email                     | Mot de passe |
| ------- | ------------------------- | ------------ |
| Admin   | sophie.martin@novatech.fr | Password1!   |
| Manager | thomas.leroy@novatech.fr  | Password1!   |
| Employé | antoine.petit@novatech.fr | Password1!   |

---

## Navigation par rôle

La barre latérale gauche s'adapte automatiquement à votre rôle :

| Menu            | Admin | Manager | Employé |
| --------------- | :---: | :-----: | :-----: |
| Tableau de bord |  ✅   |   ❌    |   ❌    |
| Employés        |  ✅   |   ❌    |   ❌    |
| Congés          |  ✅   |   ✅    |   ✅    |
| Planning        |  ✅   |   ✅    |   ✅    |
| Mon profil      |  ✅   |   ✅    |   ✅    |

---

## Tableau de bord (ADMIN uniquement)

La page d'accueil ADMIN affiche :

- **Effectif total** et répartition par service
- **Congés en attente** (badge d'alerte rouge si > 0)
- **4 graphiques Chart.js** :
  1. Empleoyés par service (barres horizontales)
  2. Répartition des rôles (donut)
  3. Types de congés validés (camembert)
  4. Congés par mois sur 12 mois (courbe)

---

## Gestion des employés (ADMIN uniquement)

### Consulter la liste

La page **Employés** affiche tous les employés actifs dans un tableau filtrable par :

- Nom / prénom (recherche textuelle)
- Service
- Rôle

### Ajouter un employé

1. Cliquez sur le bouton **+ Nouvel employé**
2. Remplissez le formulaire (nom, prénom, email, mot de passe, service, rôle, manager, date d'embauche)
3. Cliquez sur **Enregistrer**

> Le mot de passe est haché avec bcrypt avant stockage.

### Modifier un employé

Cliquez sur l'icône **crayon** sur la ligne de l'employé. Le formulaire se pré-remplit avec les données existantes.

> Laisser le champ mot de passe vide conserve l'ancien mot de passe.

### Désactiver un employé

Cliquez sur l'icône **corbeille**. L'employé est désactivé (soft-delete) et ne peut plus se connecter. Ses données historiques sont conservées.

---

## Gestion des congés

### Demander un congé (tout rôle)

1. Accédez à la page **Congés**
2. Cliquez sur **+ Nouvelle demande**
3. Sélectionnez le type de congé, les dates de début et fin
4. Le calcul en jours ouvrés s'affiche automatiquement
5. Ajoutez un commentaire optionnel
6. Cliquez sur **Envoyer**

> Les CP (Congés Payés) et RTT déduisent le solde. Les autres types (maladie, exceptionnel...) sont sans déduction.

### Consulter ses demandes

Le tableau affiche toutes vos demandes avec leur statut coloré :

- 🟡 **EN ATTENTE** — En cours de traitement
- 🟢 **VALIDÉ** — Approuvé
- 🔴 **REFUSÉ** — Non accordé
- ⚫ **ANNULÉ** — Annulé par vous

### Annuler une demande

Seules les demandes EN_ATTENTE peuvent être annulées. Cliquez sur **Annuler** sur la ligne concernée.

### Valider/Refuser (ADMIN et MANAGER)

1. Les demandes EN_ATTENTE apparaissent dans votre vue avec un bouton **Traiter**
2. Cliquez sur **Traiter** pour ouvrir la fenêtre de décision
3. Choisissez **Valider** ou **Refuser**

> Un MANAGER ne peut traiter que les congés des membres de son équipe.

---

## Planning

### Vue hebdomadaire

Le planning affiche la semaine courante. Utilisez les flèches **←** **→** pour naviguer. Le bouton **Aujourd'hui** revient à la semaine en cours.

### Ajouter un événement

1. Cliquez sur **+ Ajouter un événement**
2. Remplissez le titre, les dates/heures de début et fin, une couleur et une description optionnelle
3. Cliquez sur **Enregistrer**

### Supprimer un événement

Cliquez sur la **✕** dans la carte de l'événement.

> Les ADMIN voient tous les événements. Les MANAGER et EMPLOYE voient uniquement leurs propres événements.

---

## Mon profil

La page profil affiche :

- Vos informations personnelles (nom, email, service, rôle, solde de congés)
- Vos 5 dernières demandes de congés

### Changer de mot de passe

1. Saisissez votre **mot de passe actuel**
2. Saisissez et confirmez votre **nouveau mot de passe**
3. Cliquez sur **Mettre à jour**

---

## Messages d'erreur fréquents

| Message                 | Cause                                 | Solution                           |
| ----------------------- | ------------------------------------- | ---------------------------------- |
| Identifiants incorrects | Email ou mot de passe erroné          | Vérifiez vos identifiants          |
| Compte désactivé        | Votre compte a été désactivé          | Contactez l'administrateur         |
| Solde insuffisant       | Pas assez de jours CP/RTT disponibles | Vérifiez votre solde sur le profil |
| Email déjà utilisé      | Un employé avec cet email existe déjà | Utilisez un autre email            |
| Accès non autorisé      | Votre rôle ne permet pas cette action | Contactez l'administrateur         |
| Session expirée         | Le token JWT a expiré (après 8h)      | Reconnectez-vous                   |
