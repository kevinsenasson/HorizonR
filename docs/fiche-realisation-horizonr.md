# Fiche de Réalisation Professionnelle – BTS SIO E5

## Intitulé du projet
**HorizonR** – Application de gestion des ressources humaines

## Contexte
Dans le cadre du BTS Services Informatiques aux Organisations (SIO), option SLAM, j'ai développé HorizonR, une application web Full-Stack destinée à la gestion des ressources humaines d'une PME.

## Objectifs
- Permettre aux administrateurs RH de gérer les employés, les congés et le planning
- Offrir aux employés un portail de consultation et de demande de congés
- Fournir un tableau de bord avec des indicateurs clés (KPI)

## Technologies utilisées

| Couche       | Technologie                        |
|--------------|------------------------------------|
| Frontend     | HTML5, CSS3, JavaScript Vanilla    |
| Visualisation| Chart.js 4.4                       |
| Backend      | Node.js 20, Express.js 4.18        |
| Base de données | MySQL 8.0                       |
| Auth         | JWT (jsonwebtoken), bcrypt         |
| Déploiement  | Docker, Docker Compose, nginx      |
| Tests        | Jest                               |

## Architecture
Application de type **MVC** en architecture **3 tiers** :
- Tier présentation : frontend HTML/CSS/JS servi par nginx
- Tier applicatif : API REST Express.js
- Tier données : base MySQL conteneurisée

## Fonctionnalités développées

### Administrateur
- Tableau de bord avec KPI (effectifs, taux d'absence, congés en attente)
- Gestion complète des employés (CRUD, désactivation)
- Validation ou refus des demandes de congés
- Gestion du planning hebdomadaire

### Employé
- Consultation de ses informations de profil
- Soumission de demandes de congés
- Suivi du solde et de l'historique des congés
- Consultation du planning

## Sécurité
- Authentification par JWT (token signé, expiration 8h)
- Middleware RBAC (Role-Based Access Control) pour les routes sensibles
- Mots de passe hashés avec bcrypt (salt rounds = 10)
- Requêtes SQL paramétrées (protection contre les injections SQL)

## Tests
- Tests unitaires Jest couvrant les middlewares JWT et RBAC
- Tests des contrôleurs (login, congés)
- Couverture de code via `jest --coverage`

## Difficultés rencontrées
- Gestion des tokens JWT côté client (localStorage) et synchronisation des rôles
- Mise en place du réseau Docker entre les conteneurs (healthcheck MySQL)
- Calcul du solde de congés lors des validations/refus

## Résultats
- Application fonctionnelle déployable en une commande (`docker compose up -d`)
- Suite de tests Jest avec couverture du code
- Interface responsive adaptée aux différents rôles utilisateurs

## Compétences du référentiel BTS SIO mobilisées
- B1.3 – Développer la présence en ligne de l'organisation
- B2.2 – Réaliser les tests d'intégration et d'acceptation d'un service
- B3.1 – Concevoir et développer une solution applicative
- B3.2 – Assurer la maintenance corrective et évolutive d'une solution applicative
