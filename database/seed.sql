-- ============================================================
-- HorizonR — Données de démonstration
-- NovaTech Solutions — BTS SIO SLAM 2026
-- ============================================================

USE horizonr_db;

-- ------------------------------------------------------------
-- Services de NovaTech Solutions
-- ------------------------------------------------------------
INSERT INTO services (nom, description) VALUES
('Développement',       'Pôle développement logiciel — 15 développeurs'),
('Infrastructure',      'Pôle infra systèmes et réseaux — 8 administrateurs'),
('Commercial',          'Pôle commercial et gestion clients — 10 chargés de compte'),
('Direction & RH',      'Direction générale et ressources humaines — 4 personnes'),
('Support Technique',   'Pôle support et assistance clients — 10 techniciens');

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
-- Employés
-- Mots de passe hashés bcrypt de "Password1!" pour tous les comptes de demo
-- Hash généré avec bcrypt saltRounds=10
-- ------------------------------------------------------------

-- ============================================================
-- COMPTES DE DÉMONSTRATION (accès rapide)
-- ============================================================
-- admin@demo.fr    / admin123
-- manager@demo.fr  / manager123
-- employe@demo.fr  / employe123
INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id) VALUES
('Démo',  'Admin',    'admin@demo.fr',    '$2b$10$PUjvjZPS2YoNf.xgUkxLA.vxsEGnaLFhRdyMhwYpAG70CuCcmfbTi', '00 00 00 00 01', 'Administrateur Démo',  '2024-01-01', 25.00, 1, 4),
('Démo',  'Manager',  'manager@demo.fr',  '$2b$10$5LM1iiayGM8GKUdzs96IzuglShN47kyFLmXIG3B0tCWueESJNDJOC', '00 00 00 00 02', 'Manager Démo',         '2024-01-01', 25.00, 2, 1),
('Démo',  'Employé',  'employe@demo.fr',  '$2b$10$Aaz6iJ8kFT9bPJE3uD3se.nKXJ6vqyEJ7J8FsqGObcZOXu1H9fjju', '00 00 00 00 03', 'Employé Démo',         '2024-01-01', 25.00, 3, 1);

-- ADMINS (service Direction & RH)
INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id) VALUES
('Martin',    'Sophie',  'sophie.martin@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 10 11 12 13', 'Directrice RH',        '2015-03-01', 25.00, 1, 4),
('Bernard',   'Luc',     'luc.bernard@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 10 11 12 14', 'DSI',                  '2015-03-01', 25.00, 1, 4);

-- MANAGERS
INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id) VALUES
('Leroy',     'Thomas',  'thomas.leroy@novatech.fr',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 20 21 22 23', 'Lead Développeur',     '2016-06-15', 28.00, 2, 1),
('Dubois',    'Claire',  'claire.dubois@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 20 21 22 24', 'Responsable Infra',    '2016-09-01', 25.00, 2, 2),
('Moreau',    'Pierre',  'pierre.moreau@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 20 21 22 25', 'Directeur Commercial', '2017-01-10', 25.00, 2, 3),
('Garcia',    'Maria',   'maria.garcia@novatech.fr',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 20 21 22 26', 'Responsable Support',  '2017-04-01', 25.00, 2, 5);

-- Mise à jour des manager_id pour les équipes
-- Pôle Développement → manager id=3 (Leroy Thomas)
-- Pôle Infrastructure → manager id=4 (Dubois Claire)
-- Pôle Commercial → manager id=5 (Moreau Pierre)
-- Pôle Support → manager id=6 (Garcia Maria)

-- EMPLOYES — Pôle Développement (manager: Leroy Thomas id=3)
INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id, manager_id) VALUES
('Petit',     'Antoine',  'antoine.petit@novatech.fr',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 01', 'Développeur Full Stack',    '2018-02-01', 25.00, 3, 1, 3),
('Simon',     'Laura',    'laura.simon@novatech.fr',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 02', 'Développeuse Backend',      '2018-05-14', 25.00, 3, 1, 3),
('Laurent',   'Maxime',   'maxime.laurent@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 03', 'Développeur Frontend',      '2019-01-07', 25.00, 3, 1, 3),
('Michel',    'Julie',    'julie.michel@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 04', 'Développeuse Mobile',       '2019-09-02', 23.00, 3, 1, 3),
('Lefebvre',  'Nicolas',  'nicolas.lefebvre@novatech.fr', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 05', 'Développeur DevOps',        '2020-03-16', 25.00, 3, 1, 3),
('Roux',      'Emma',     'emma.roux@novatech.fr',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 06', 'Développeuse Full Stack',   '2020-07-01', 25.00, 3, 1, 3),
('Dupont',    'Alexis',   'alexis.dupont@novatech.fr',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 07', 'Développeur Backend',       '2021-01-04', 25.00, 3, 1, 3),
('Robert',    'Céline',   'celine.robert@novatech.fr',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 08', 'Ingénieure QA',             '2021-06-14', 25.00, 3, 1, 3),
('Richard',   'Hugo',     'hugo.richard@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 09', 'Développeur Frontend',      '2022-02-28', 22.00, 3, 1, 3),
('Durand',    'Manon',    'manon.durand@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 10', 'Développeuse Data',         '2022-09-05', 25.00, 3, 1, 3),
('Girard',    'Kevin',    'kevin.girard@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 11', 'Développeur Junior',        '2023-01-09', 25.00, 3, 1, 3),
('Boyer',     'Léa',      'lea.boyer@novatech.fr',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 12', 'Développeuse Junior',       '2023-09-04', 25.00, 3, 1, 3),
('Moreau',    'Julien',   'julien.moreau@novatech.fr',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 13', 'Développeur Full Stack',    '2024-01-15', 25.00, 3, 1, 3),
('Fontaine',  'Camille',  'camille.fontaine@novatech.fr', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 30 31 32 14', 'Architecte Logiciel',       '2024-06-03', 25.00, 3, 1, 3);

-- EMPLOYES — Pôle Infrastructure (manager: Dubois Claire id=4)
INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id, manager_id) VALUES
('Chevalier', 'Marc',     'marc.chevalier@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 40 41 42 01', 'Administrateur Systèmes',   '2017-11-01', 25.00, 3, 2, 4),
('Legrand',   'Aurélie',  'aurelie.legrand@novatech.fr',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 40 41 42 02', 'Administratrice Réseaux',   '2018-08-20', 25.00, 3, 2, 4),
('Garnier',   'Romain',   'romain.garnier@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 40 41 42 03', 'Ingénieur Cloud',           '2019-04-08', 25.00, 3, 2, 4),
('Faure',     'Isabelle', 'isabelle.faure@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 40 41 42 04', 'Administratrice Linux',     '2020-01-13', 25.00, 3, 2, 4),
('Rousseau',  'Baptiste', 'baptiste.rousseau@novatech.fr','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 40 41 42 05', 'Ingénieur Sécurité',        '2020-09-07', 25.00, 3, 2, 4),
('Blanc',     'Elodie',   'elodie.blanc@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 40 41 42 06', 'Administratrice Réseaux',   '2021-05-17', 24.00, 3, 2, 4),
('Guerin',    'Florian',  'florian.guerin@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 40 41 42 07', 'Ingénieur Virtualisation',  '2022-02-14', 25.00, 3, 2, 4);

-- EMPLOYES — Pôle Commercial (manager: Moreau Pierre id=5)
INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id, manager_id) VALUES
('Muller',    'Sandrine', 'sandrine.muller@novatech.fr',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 50 51 52 01', 'Chargée de compte Senior',  '2016-11-14', 28.00, 3, 3, 5),
('Colin',     'Sébastien','sebastien.colin@novatech.fr',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 50 51 52 02', 'Chargé de compte',          '2018-03-05', 25.00, 3, 3, 5),
('Mercier',   'Charlotte','charlotte.mercier@novatech.fr','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 50 51 52 03', 'Business Developer',        '2018-10-22', 25.00, 3, 3, 5),
('Pires',     'David',    'david.pires@novatech.fr',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 50 51 52 04', 'Chargé de compte',          '2019-07-01', 25.00, 3, 3, 5),
('Lambert',   'Émilie',   'emilie.lambert@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 50 51 52 05', 'Chargée de compte',         '2020-02-17', 25.00, 3, 3, 5),
('Bonnet',    'Thibaut',  'thibaut.bonnet@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 50 51 52 06', 'Avant-Vente Technique',     '2020-08-31', 25.00, 3, 3, 5),
('Perrin',    'Lucie',    'lucie.perrin@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 50 51 52 07', 'Chargée de compte Junior',  '2021-09-13', 25.00, 3, 3, 5),
('Roy',       'Stéphane', 'stephane.roy@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 50 51 52 08', 'Account Manager',           '2022-01-03', 25.00, 3, 3, 5),
('Morin',     'Pauline',  'pauline.morin@novatech.fr',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 50 51 52 09', 'Chargée de compte',         '2022-11-21', 25.00, 3, 3, 5);

-- EMPLOYES — Direction & RH (les 2 autres membres)
INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id) VALUES
('Fournier',  'Amélie',   'amelie.fournier@novatech.fr',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 60 61 62 01', 'Assistante RH',             '2019-03-11', 25.00, 3, 4),
('Giraud',    'Paul',     'paul.giraud@novatech.fr',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 60 61 62 02', 'Contrôleur de Gestion',     '2019-07-22', 25.00, 3, 4);

-- EMPLOYES — Pôle Support (manager: Garcia Maria id=6)
INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id, manager_id) VALUES
('Andre',     'Kevin',    'kevin.andre@novatech.fr',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 70 71 72 01', 'Technicien Support N1',     '2019-01-14', 25.00, 3, 5, 6),
('Mercier',   'Nathalie', 'nathalie.mercier@novatech.fr', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 70 71 72 02', 'Technicienne Support N2',   '2019-05-06', 25.00, 3, 5, 6),
('Lemaire',   'Dylan',    'dylan.lemaire@novatech.fr',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 70 71 72 03', 'Technicien Support N1',     '2020-02-03', 25.00, 3, 5, 6),
('Renard',    'Alice',    'alice.renard@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 70 71 72 04', 'Technicienne Support N2',   '2020-08-17', 25.00, 3, 5, 6),
('Girard',    'Mathieu',  'mathieu.girard@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 70 71 72 05', 'Technicien Helpdesk',       '2021-01-25', 25.00, 3, 5, 6),
('Perez',     'Marine',   'marine.perez@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 70 71 72 06', 'Technicienne Support N1',   '2021-06-07', 24.00, 3, 5, 6),
('Clement',   'Thomas',   'thomas.clement@novatech.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 70 71 72 07', 'Technicien Réseau',         '2022-03-14', 25.00, 3, 5, 6),
('Gauthier',  'Inès',     'ines.gauthier@novatech.fr',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 70 71 72 08', 'Technicienne Support N2',   '2022-10-03', 25.00, 3, 5, 6),
('Morel',     'Damien',   'damien.morel@novatech.fr',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '06 70 71 72 09', 'Technicien Support N1',     '2023-04-17', 25.00, 3, 5, 6);

-- ------------------------------------------------------------
-- Congés réalistes (données de démo)
-- ------------------------------------------------------------
INSERT INTO conges (employe_id, type_conge_id, date_debut, date_fin, nb_jours, motif, statut, valideur_id) VALUES
-- Congés validés
(7,  1, '2026-04-14', '2026-04-17', 4,  'Vacances de printemps',             'VALIDE', 3),
(8,  1, '2026-04-21', '2026-04-24', 4,  'Vacances de printemps',             'VALIDE', 3),
(21, 1, '2026-04-14', '2026-04-18', 5,  'Vacances familiales',               'VALIDE', 4),
(28, 2, '2026-04-14', '2026-04-15', 2,  'RTT hebdomadaire',                  'VALIDE', 5),
(30, 1, '2026-07-07', '2026-07-18', 10, 'Vacances été',                      'VALIDE', 6),
(9,  1, '2026-07-14', '2026-07-25', 10, 'Vacances été',                      'VALIDE', 3),
(10, 2, '2026-05-02', '2026-05-02', 1,  'RTT pont du 1er mai',               'VALIDE', 3),
(15, 1, '2026-08-03', '2026-08-14', 10, 'Vacances annuelles',                'VALIDE', 3),
-- Congés en attente
(11, 1, '2026-05-11', '2026-05-15', 5,  'Week-end prolongé',                 'EN_ATTENTE', NULL),
(22, 2, '2026-05-04', '2026-05-04', 1,  'RTT',                               'EN_ATTENTE', NULL),
(31, 4, '2026-04-28', '2026-04-28', 1,  'Mariage d\'un proche',              'EN_ATTENTE', NULL),
(36, 1, '2026-06-01', '2026-06-05', 5,  'Vacances',                          'EN_ATTENTE', NULL),
(37, 3, '2026-04-14', '2026-04-16', 3,  'Arrêt médical',                     'EN_ATTENTE', NULL),
-- Congés refusés
(12, 1, '2026-04-07', '2026-04-10', 4,  'Vacances',                          'REFUSE',    3),
(23, 2, '2026-04-21', '2026-04-22', 2,  'RTT',                               'REFUSE',    5);

-- ------------------------------------------------------------
-- Événements planning de démo
-- ------------------------------------------------------------
INSERT INTO planning (employe_id, titre, description, date_debut, date_fin, type, created_by) VALUES
(3,  'Sprint Planning Q2',        'Planification du sprint avril-mai',    '2026-04-14 09:00:00', '2026-04-14 11:00:00', 'REUNION',    1),
(7,  'Formation Docker avancé',   'Formation interne conteneurisation',   '2026-04-15 14:00:00', '2026-04-15 17:00:00', 'FORMATION',  3),
(4,  'Maintenance serveurs prod', 'Maintenance planifiée nuit',           '2026-04-18 22:00:00', '2026-04-19 02:00:00', 'AUTRE',      4),
(21, 'Télétravail',               'Télétravail hebdomadaire',             '2026-04-16 09:00:00', '2026-04-16 18:00:00', 'TELETRAVAIL',4),
(5,  'RDV Client Azurtech',       'Présentation offre Cloud',             '2026-04-15 10:00:00', '2026-04-15 12:00:00', 'DEPLACEMENT',5),
(28, 'RDV Client MedSoft',        'Renouvellement contrat maintenance',   '2026-04-16 14:00:00', '2026-04-16 16:00:00', 'DEPLACEMENT',5),
(6,  'Réunion équipe Support',    'Point hebdomadaire équipe',            '2026-04-14 08:30:00', '2026-04-14 09:30:00', 'REUNION',    6),
(1,  'Comité de direction',       'Suivi indicateurs RH Q1 2026',        '2026-04-17 09:00:00', '2026-04-17 12:00:00', 'REUNION',    1);
