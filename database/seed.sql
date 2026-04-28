-- ============================================================
-- HorizonR — Données initiales
-- NovaTech Solutions — BTS SIO SLAM 2026
-- ============================================================

SET NAMES utf8mb4;
USE horizonr_db;

-- ------------------------------------------------------------
-- Services
-- ------------------------------------------------------------
INSERT INTO services (nom, description) VALUES
('Développement',     'Pôle développement logiciel'),
('Infrastructure',    'Pôle infra systèmes et réseaux'),
('Commercial',        'Pôle commercial et gestion clients'),
('Direction & RH',    'Direction générale et ressources humaines'),
('Support Technique', 'Pôle support et assistance clients');

-- ------------------------------------------------------------
-- Rôles
-- ------------------------------------------------------------
INSERT INTO roles (nom) VALUES ('ADMIN'), ('MANAGER'), ('EMPLOYE');

-- ------------------------------------------------------------
-- Types de congés
-- ------------------------------------------------------------
INSERT INTO types_conges (libelle, description) VALUES
('Congés payés',          'Congés annuels légaux'),
('RTT',                   'Réduction du temps de travail'),
('Congé maladie',         'Arrêt maladie avec justificatif'),
('Congé exceptionnel',    'Événement familial ou personnel exceptionnel'),
('Congé sans solde',      'Congé non rémunéré');

-- ------------------------------------------------------------
-- Comptes de démonstration
-- admin@demo.fr    / admin123
-- manager@demo.fr  / manager123
-- employe@demo.fr  / employe123
-- ------------------------------------------------------------
INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id) VALUES
('Démo', 'Admin',   'admin@demo.fr',   '$2b$10$PUjvjZPS2YoNf.xgUkxLA.vxsEGnaLFhRdyMhwYpAG70CuCcmfbTi', '00 00 00 00 01', 'Administrateur Démo', '2024-01-01', 25.00, 1, 4),
('Démo', 'Manager', 'manager@demo.fr', '$2b$10$5LM1iiayGM8GKUdzs96IzuglShN47kyFLmXIG3B0tCWueESJNDJOC', '00 00 00 00 02', 'Manager Démo',        '2024-01-01', 25.00, 2, 1),
('Démo', 'Employé', 'employe@demo.fr', '$2b$10$Aaz6iJ8kFT9bPJE3uD3se.nKXJ6vqyEJ7J8FsqGObcZOXu1H9fjju', '00 00 00 00 03', 'Employé Démo',        '2024-01-01', 25.00, 3, 1);