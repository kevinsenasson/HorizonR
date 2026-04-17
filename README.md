# HorizonR

Application web de gestion RH interne pour **NovaTech Solutions** (47 employés — Nice).  
Développée dans le cadre du **BTS SIO option SLAM — 2ème année**.

---

## Stack technique

| Couche          | Technologie                       |
| --------------- | --------------------------------- |
| Frontend        | HTML5 / CSS3 / JavaScript vanilla |
| Backend         | Node.js 20 + Express 4            |
| Base de données | MySQL 8.0                         |
| Auth            | JWT (jsonwebtoken) + bcrypt       |
| Conteneurs      | Docker Compose                    |
| Proxy           | Nginx (Alpine)                    |
| Tests           | Jest 29                           |
| Visualisation   | Chart.js 4.4.2 (CDN)              |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Docker Network                  │
│                 horizonr_net                     │
│                                                  │
│  ┌──────────────┐    ┌──────────────────────┐   │
│  │  Frontend    │    │      Backend         │   │
│  │  nginx:alpine│───▶│  node:20-alpine      │   │
│  │  :80         │    │  :3000               │   │
│  └──────────────┘    └──────────┬───────────┘   │
│                                 │                │
│                    ┌────────────▼────────────┐   │
│                    │       MySQL 8.0         │   │
│                    │       :3306             │   │
│                    └─────────────────────────┘   │
│                                                  │
│  ┌──────────────┐                               │
│  │  phpMyAdmin  │                               │
│  │  :8080       │                               │
│  └──────────────┘                               │
└─────────────────────────────────────────────────┘
```

---

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré
- Ports libres : **80**, **3000**, **3306**, **8080**

---

## Lancement rapide

```bash
# 1. Cloner / se placer dans le dossier projet
cd horizonr

# 2. Copier les variables d'environnement (déjà présent dans le repo)
#    .env est présent à la racine

# 3. Construire et démarrer tous les services
docker compose up --build

# 4. Attendre que MySQL soit prêt (~30 secondes au premier démarrage)
#    Le backend attend automatiquement le healthcheck MySQL
```

Accès une fois démarré :

| Service     | URL                       |
| ----------- | ------------------------- |
| Application | http://localhost          |
| API REST    | http://localhost:3000/api |
| phpMyAdmin  | http://localhost:8080     |

---

## Identifiants de démonstration

| Rôle    | Email                     | Mot de passe |
| ------- | ------------------------- | ------------ |
| Admin   | sophie.martin@novatech.fr | Password1!   |
| Manager | thomas.leroy@novatech.fr  | Password1!   |
| Employé | antoine.petit@novatech.fr | Password1!   |

> Tous les 47 employés partagent le mot de passe `Password1!`

---

## Structure du projet

```
horizonr/
├── docker-compose.yml          # Orchestration 4 services
├── .env                        # Variables d'environnement (non commité en prod)
├── .gitignore
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js              # Point d'entrée Express
│       ├── config/db.js        # Pool mysql2
│       ├── middleware/
│       │   ├── auth.js         # Vérification JWT
│       │   └── role.js         # RBAC (ADMIN / MANAGER / EMPLOYE)
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── employesController.js
│       │   ├── congesController.js
│       │   ├── planningController.js
│       │   ├── dashboardController.js
│       │   └── profilController.js
│       └── routes/
│           ├── auth.js
│           ├── employes.js
│           ├── conges.js
│           ├── planning.js
│           ├── dashboard.js
│           └── profil.js
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── css/style.css           # Design system complet
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── employes.html
│   │   ├── conges.html
│   │   ├── planning.html
│   │   └── profil.html
│   └── js/
│       ├── auth.js             # Gestion session localStorage
│       ├── api.js              # Wrapper fetch centralisé
│       ├── toast.js            # Notifications
│       ├── sidebar.js          # Navigation dynamique par rôle
│       ├── login.js
│       ├── employes.js
│       ├── conges.js
│       ├── planning.js
│       ├── profil.js
│       └── dashboard.js        # 4 graphiques Chart.js
│
├── database/
│   ├── init.sql                # Schéma (6 tables + index)
│   └── seed.sql                # 47 employés réalistes + données démo
│
├── docs/
│   ├── MCD.md                  # Modèle Conceptuel de Données
│   ├── MLD.md                  # Modèle Logique de Données
│   ├── MPD.md                  # Modèle Physique (DDL MySQL)
│   └── guide-utilisateur.md   # Manuel d'utilisation
│
└── backend/
    └── tests/
        ├── auth.test.js             # Middleware JWT (5 tests)
        ├── role.test.js             # Middleware RBAC (5 tests)
        ├── conges.test.js           # Logique métier (11 tests)
        └── authController.test.js   # Contrôleur login (7 tests)
```

---

## Endpoints API

### Auth

| Méthode | Route            | Accès  | Description       |
| ------- | ---------------- | ------ | ----------------- |
| POST    | /api/auth/login  | Public | Connexion + JWT   |
| POST    | /api/auth/logout | Auth   | Déconnexion (ACK) |

### Employés

| Méthode | Route                  | Accès | Description              |
| ------- | ---------------------- | ----- | ------------------------ |
| GET     | /api/employes          | Auth  | Lister (filtré par rôle) |
| POST    | /api/employes          | ADMIN | Créer                    |
| PUT     | /api/employes/:id      | ADMIN | Modifier                 |
| DELETE  | /api/employes/:id      | ADMIN | Désactiver (soft-delete) |
| GET     | /api/employes/services | Auth  | Lister les services      |
| GET     | /api/employes/roles    | Auth  | Lister les rôles         |

### Congés

| Méthode | Route                   | Accès           | Description              |
| ------- | ----------------------- | --------------- | ------------------------ |
| GET     | /api/conges             | Auth            | Lister (filtré par rôle) |
| POST    | /api/conges             | Auth            | Demander un congé        |
| PUT     | /api/conges/:id/valider | ADMIN / MANAGER | Valider ou refuser       |
| DELETE  | /api/conges/:id         | Auth            | Annuler (EN_ATTENTE)     |

### Planning

| Méthode | Route             | Accès | Description              |
| ------- | ----------------- | ----- | ------------------------ |
| GET     | /api/planning     | Auth  | Lister (filtré par rôle) |
| POST    | /api/planning     | Auth  | Créer un événement       |
| DELETE  | /api/planning/:id | Auth  | Supprimer un événement   |

### Dashboard

| Méthode | Route                | Accès | Description     |
| ------- | -------------------- | ----- | --------------- |
| GET     | /api/dashboard/stats | ADMIN | Statistiques RH |

### Profil

| Méthode | Route                    | Accès | Description              |
| ------- | ------------------------ | ----- | ------------------------ |
| GET     | /api/profil              | Auth  | Voir son profil          |
| PUT     | /api/profil/mot-de-passe | Auth  | Changer son mot de passe |

---

## Tests

```bash
# Depuis backend/
npm install
npm test                    # Tous les tests
npm run test:coverage       # Avec rapport de couverture
```

Résultat : **28 tests passés** — couverture 100% sur middleware auth + RBAC.

---

## Variables d'environnement (`.env`)

```env
MYSQL_ROOT_PASSWORD=horizonr_root_2024
MYSQL_DATABASE=horizonr_db
MYSQL_USER=horizonr_user
MYSQL_PASSWORD=horizonr_pass_2024
DB_HOST=horizonr_mysql
DB_PORT=3306
DB_NAME=horizonr_db
DB_USER=horizonr_user
DB_PASSWORD=horizonr_pass_2024
JWT_SECRET=horizonr_jwt_super_secret_2024_novatech
JWT_EXPIRES_IN=8h
```

> En production, remplacez tous ces secrets par des valeurs fortes et uniques.

---

## Rôles et permissions

| Permission                     | ADMIN |  MANAGER   |  EMPLOYE  |
| ------------------------------ | :---: | :--------: | :-------: |
| Tableau de bord (stats)        |  ✅   |     ❌     |    ❌     |
| Voir tous les employés         |  ✅   |     ❌     |    ❌     |
| Créer / modifier un employé    |  ✅   |     ❌     |    ❌     |
| Voir son équipe (Manager)      |  ❌   |     ✅     |    ❌     |
| Demander un congé              |  ✅   |     ✅     |    ✅     |
| Valider un congé               |  ✅   | Son équipe |    ❌     |
| Voir tous les congés           |  ✅   | Son équipe | Les siens |
| Planning — tous les événements |  ✅   | Les siens  | Les siens |
| Modifier son profil / MP       |  ✅   |     ✅     |    ✅     |

---

## Arrêter l'application

```bash
docker compose down          # Arrête sans supprimer les données
docker compose down -v       # Arrête ET supprime les volumes (reset BDD)
```
