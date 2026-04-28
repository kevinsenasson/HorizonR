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

-- ------------------------------------------------------------
-- Employés de démonstration — mot de passe : Horizon@1
-- 3 par service
-- ------------------------------------------------------------
INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id) VALUES
-- Développement (service_id = 1)
('Martin',   'Sophie',   'sophie.martin@novatech.fr',   '$2b$10$3TyExlcrKqmgxwb5bxJe9eMT82IQAu88jeIxzCJOb/FOOmbiLi3cm', '06 11 00 01 01', 'Développeuse Full Stack',  '2023-03-15', 25.00, 3, 1),
('Bernard',  'Lucas',    'lucas.bernard@novatech.fr',   '$2b$10$3.auXNI9iwJeDaiZ3ukvFu0mszd1uNixzuQDczYwfhE3BiWgnR.jS', '06 11 00 01 02', 'Développeur Back-end',     '2022-09-01', 25.00, 3, 1),
('Petit',    'Emma',     'emma.petit@novatech.fr',      '$2b$10$y4EQflcWEDHsSQWg9f5yq.rKPzJApkwdNKu3L3VeeC8mHtKlURj5C', '06 11 00 01 03', 'Développeuse Front-end',   '2024-01-08', 25.00, 3, 1),
-- Infrastructure (service_id = 2)
('Dubois',   'Thomas',   'thomas.dubois@novatech.fr',   '$2b$10$xecuEmZhPvwGFUAeIFnUzur.OYkHMKJQ6lcLbba5mThAB/g7Q6ime', '06 11 00 02 01', 'Administrateur Systèmes',  '2021-06-01', 25.00, 3, 2),
('Moreau',   'Julie',    'julie.moreau@novatech.fr',    '$2b$10$v4wr8T5Pa/xXbj0VHKXcNePamPAaYERwpTQf4.JhQxcKM2lsO2E.i', '06 11 00 02 02', 'Ingénieure Réseau',        '2022-04-11', 25.00, 3, 2),
('Simon',    'Nicolas',  'nicolas.simon@novatech.fr',   '$2b$10$ri9n2s48QffwXjTxKLFOFuJEnCfqnUI5zduUlijpUwJ4xI1AnOeyO', '06 11 00 02 03', 'Technicien Infrastructure','2023-11-20', 25.00, 3, 2),
-- Commercial (service_id = 3)
('Laurent',  'Marie',    'marie.laurent@novatech.fr',   '$2b$10$UAqjXGIgAJGlpyjafH0Mde1mBfZtayCwIT9pws/jZrfy28qDjGo9q', '06 11 00 03 01', 'Commerciale',              '2022-02-14', 25.00, 3, 3),
('Michel',   'Pierre',   'pierre.michel@novatech.fr',   '$2b$10$3Mn6BoBfyfzpUbfuAzdZ3O8qVlHioZ3WC0MwC801ueGvCFkqMVM.W', '06 11 00 03 02', 'Chargé de clientèle',      '2023-07-03', 25.00, 3, 3),
('Lefebvre', 'Camille',  'camille.lefebvre@novatech.fr','$2b$10$4FLinbRrlzadg9BJ2wfZUu73foJIiQHGmPwMdm4fVnzH1juedpAvy', '06 11 00 03 03', 'Assistante Commerciale',   '2024-04-01', 25.00, 3, 3),
-- Direction & RH (service_id = 4)
('Durand',   'Isabelle', 'isabelle.durand@novatech.fr', '$2b$10$PnMJ1FSbI.rNDczDiK7oMOoKtZ1bbz1IkahHw9ap0HqtgqPSrTTIm', '06 11 00 04 01', 'Chargée RH',               '2020-09-01', 25.00, 3, 4),
('Leroy',    'Antoine',  'antoine.leroy@novatech.fr',   '$2b$10$u0XomeGfSjVPg77qB9cwZ.KhNGCmXGtzQfxu0fm9cuZK3.4MYeGFq', '06 11 00 04 02', 'Responsable Paie',         '2021-01-15', 25.00, 3, 4),
('Robert',   'Nathalie', 'nathalie.robert@novatech.fr', '$2b$10$WsQLBskaJrlsCMloFAPDle6uQA5A9K.FmGYFB.aF39ge7sYZub9eO', '06 11 00 04 03', 'Assistante Direction',     '2022-05-23', 25.00, 3, 4),
-- Support Technique (service_id = 5)
('Girard',   'Maxime',   'maxime.girard@novatech.fr',   '$2b$10$SgH6do7u/qiy0pEv9E0BG.Rj9SpKHkHMQwT8KKdLV6X5.kRgDLh/6', '06 11 00 05 01', 'Technicien Support N1',    '2023-02-06', 25.00, 3, 5),
('Bonnet',   'Lucie',    'lucie.bonnet@novatech.fr',    '$2b$10$Pnr5mKtu5LlkX2LUzbFEOe7zZAAF5EeSk9Efrr32brY6jibHKIwP2', '06 11 00 05 02', 'Technicienne Support N2',  '2022-10-17', 25.00, 3, 5),
('Dupont',   'Alexis',   'alexis.dupont@novatech.fr',   '$2b$10$BLix6/zQGq62.dogxV0Pte3QBec8zGxeycMgY8SkcuGcT8rC2cVfC', '06 11 00 05 03', 'Technicien Support N3',    '2021-08-30', 25.00, 3, 5);

-- ------------------------------------------------------------
-- Planning — Simulation calendrier entreprise NovaTech
-- Semaines du 28 avril au 22 mai 2026
-- IDs employés :
--  1=Admin Démo (RH/4)        2=Manager Démo (Dév/1)     3=Employé Démo (Dév/1)
--  4=Sophie Martin (Dév/1)    5=Lucas Bernard (Dév/1)    6=Emma Petit (Dév/1)
--  7=Thomas Dubois (Infra/2)  8=Julie Moreau (Infra/2)   9=Nicolas Simon (Infra/2)
-- 10=Marie Laurent (Com/3)   11=Pierre Michel (Com/3)   12=Camille Lefebvre (Com/3)
-- 13=Isabelle Durand (RH/4)  14=Antoine Leroy (RH/4)   15=Nathalie Robert (RH/4)
-- 16=Maxime Girard (Sup/5)   17=Lucie Bonnet (Sup/5)   18=Alexis Dupont (Sup/5)
-- ------------------------------------------------------------
INSERT INTO planning (employe_id, titre, description, date_debut, date_fin, type, created_by) VALUES

-- ================================================================
-- DÉVELOPPEMENT (service 1 — IDs 2,3,4,5,6)
-- ================================================================
-- Semaine 28 avril – 2 mai
(2,  'Sprint Review S18',          'Démo des fonctionnalités terminées du sprint 18',      '2026-04-28 09:00:00', '2026-04-28 10:30:00', 'REUNION',     1),
(3,  'Sprint Review S18',          'Démo des fonctionnalités terminées du sprint 18',      '2026-04-28 09:00:00', '2026-04-28 10:30:00', 'REUNION',     1),
(4,  'Sprint Review S18',          'Démo des fonctionnalités terminées du sprint 18',      '2026-04-28 09:00:00', '2026-04-28 10:30:00', 'REUNION',     1),
(5,  'Sprint Review S18',          'Démo des fonctionnalités terminées du sprint 18',      '2026-04-28 09:00:00', '2026-04-28 10:30:00', 'REUNION',     1),
(6,  'Sprint Review S18',          'Démo des fonctionnalités terminées du sprint 18',      '2026-04-28 09:00:00', '2026-04-28 10:30:00', 'REUNION',     1),
(4,  'Télétravail',                NULL,                                                   '2026-04-29 09:00:00', '2026-04-29 18:00:00', 'TELETRAVAIL', 1),
(6,  'Télétravail',                NULL,                                                   '2026-04-30 09:00:00', '2026-04-30 18:00:00', 'TELETRAVAIL', 1),
(5,  'Déplacement client TechCorp','Présentation solution chez le client TechCorp Lyon',   '2026-04-29 13:00:00', '2026-04-29 17:00:00', 'DEPLACEMENT', 1),
(3,  'Formation React 18',         'Mise à niveau sur React 18 et hooks avancés',          '2026-04-30 09:00:00', '2026-04-30 17:00:00', 'FORMATION',   1),
(2,  'Planning sprint 19',         'Définition et estimation des user stories S19',        '2026-05-01 10:00:00', '2026-05-01 12:00:00', 'REUNION',     1),
(4,  'Planning sprint 19',         'Définition et estimation des user stories S19',        '2026-05-01 10:00:00', '2026-05-01 12:00:00', 'REUNION',     1),
(5,  'Planning sprint 19',         'Définition et estimation des user stories S19',        '2026-05-01 10:00:00', '2026-05-01 12:00:00', 'REUNION',     1),
(6,  'Planning sprint 19',         'Définition et estimation des user stories S19',        '2026-05-01 10:00:00', '2026-05-01 12:00:00', 'REUNION',     1),
-- Semaine 5 – 9 mai
(2,  'Stand-up hebdo Dev',         'Point avancement blocages et synchronisation équipe',  '2026-05-05 09:30:00', '2026-05-05 10:00:00', 'REUNION',     1),
(3,  'Stand-up hebdo Dev',         'Point avancement blocages et synchronisation équipe',  '2026-05-05 09:30:00', '2026-05-05 10:00:00', 'REUNION',     1),
(4,  'Stand-up hebdo Dev',         'Point avancement blocages et synchronisation équipe',  '2026-05-05 09:30:00', '2026-05-05 10:00:00', 'REUNION',     1),
(5,  'Stand-up hebdo Dev',         'Point avancement blocages et synchronisation équipe',  '2026-05-05 09:30:00', '2026-05-05 10:00:00', 'REUNION',     1),
(6,  'Stand-up hebdo Dev',         'Point avancement blocages et synchronisation équipe',  '2026-05-05 09:30:00', '2026-05-05 10:00:00', 'REUNION',     1),
(3,  'Formation Docker avancé',    'Orchestration avec Docker Compose et Swarm',           '2026-05-06 09:00:00', '2026-05-06 17:00:00', 'FORMATION',   1),
(4,  'Télétravail',                NULL,                                                   '2026-05-07 09:00:00', '2026-05-07 18:00:00', 'TELETRAVAIL', 1),
(6,  'Télétravail',                NULL,                                                   '2026-05-08 09:00:00', '2026-05-08 18:00:00', 'TELETRAVAIL', 1),
(5,  'Code review & pair coding',  'Session de relecture de code en binôme',              '2026-05-07 14:00:00', '2026-05-07 16:00:00', 'REUNION',     1),
(4,  'Code review & pair coding',  'Session de relecture de code en binôme',              '2026-05-07 14:00:00', '2026-05-07 16:00:00', 'REUNION',     1),
(2,  'Déploiement v2.4 en prod',   'Mise en production de la version 2.4',                '2026-05-08 18:00:00', '2026-05-08 20:00:00', 'AUTRE',       1),
(5,  'Déploiement v2.4 en prod',   'Mise en production de la version 2.4',                '2026-05-08 18:00:00', '2026-05-08 20:00:00', 'AUTRE',       1),
-- Semaine 12 – 16 mai
(2,  'Atelier architecture',       'Refonte architecture microservices — décisions',       '2026-05-12 14:00:00', '2026-05-12 16:00:00', 'REUNION',     1),
(4,  'Atelier architecture',       'Refonte architecture microservices — décisions',       '2026-05-12 14:00:00', '2026-05-12 16:00:00', 'REUNION',     1),
(5,  'Atelier architecture',       'Refonte architecture microservices — décisions',       '2026-05-12 14:00:00', '2026-05-12 16:00:00', 'REUNION',     1),
(6,  'Formation TypeScript',       'Migration codebase projet vers TypeScript strict',     '2026-05-13 09:00:00', '2026-05-14 17:00:00', 'FORMATION',   1),
(3,  'Télétravail',                NULL,                                                   '2026-05-14 09:00:00', '2026-05-14 18:00:00', 'TELETRAVAIL', 1),
(4,  'Télétravail',                NULL,                                                   '2026-05-15 09:00:00', '2026-05-15 18:00:00', 'TELETRAVAIL', 1),
(2,  'Démo client HorizonR',       'Présentation démo produit chez le client final',       '2026-05-16 10:00:00', '2026-05-16 12:00:00', 'DEPLACEMENT', 1),
(5,  'Démo client HorizonR',       'Présentation démo produit chez le client final',       '2026-05-16 10:00:00', '2026-05-16 12:00:00', 'DEPLACEMENT', 1),

-- ================================================================
-- INFRASTRUCTURE (service 2 — IDs 7,8,9)
-- ================================================================
-- Semaine 28 avril – 2 mai
(7,  'Maintenance serveurs nuit',  'MAJ OS et correctifs sécurité — fenêtre nuit',        '2026-04-28 22:00:00', '2026-04-29 02:00:00', 'AUTRE',       1),
(9,  'Maintenance serveurs nuit',  'MAJ OS et correctifs sécurité — fenêtre nuit',        '2026-04-28 22:00:00', '2026-04-29 02:00:00', 'AUTRE',       1),
(8,  'Télétravail',                NULL,                                                   '2026-04-29 09:00:00', '2026-04-29 18:00:00', 'TELETRAVAIL', 1),
(7,  'Réunion sécurité IT',        'Analyse nouvelles vulnérabilités CVE avril 2026',      '2026-04-30 10:00:00', '2026-04-30 11:30:00', 'REUNION',     1),
(8,  'Réunion sécurité IT',        'Analyse nouvelles vulnérabilités CVE avril 2026',      '2026-04-30 10:00:00', '2026-04-30 11:30:00', 'REUNION',     1),
(9,  'Réunion sécurité IT',        'Analyse nouvelles vulnérabilités CVE avril 2026',      '2026-04-30 10:00:00', '2026-04-30 11:30:00', 'REUNION',     1),
(7,  'Déplacement datacenter Lyon','Intervention matérielle remplacement disques SAN',     '2026-05-02 08:00:00', '2026-05-02 18:00:00', 'DEPLACEMENT', 1),
-- Semaine 5 – 9 mai
(7,  'Réunion hebdo Infra',        'Point availabilité services et tickets ouverts',       '2026-05-05 09:00:00', '2026-05-05 09:30:00', 'REUNION',     1),
(8,  'Réunion hebdo Infra',        'Point availabilité services et tickets ouverts',       '2026-05-05 09:00:00', '2026-05-05 09:30:00', 'REUNION',     1),
(9,  'Réunion hebdo Infra',        'Point availabilité services et tickets ouverts',       '2026-05-05 09:00:00', '2026-05-05 09:30:00', 'REUNION',     1),
(8,  'Formation Kubernetes CKA',   'Préparation certification CKA — formation 2 jours',   '2026-05-06 09:00:00', '2026-05-07 17:00:00', 'FORMATION',   1),
(9,  'Audit topologie réseau',     'Cartographie complète et audit de la topologie',       '2026-05-07 14:00:00', '2026-05-07 17:00:00', 'AUTRE',       1),
(7,  'Télétravail',                NULL,                                                   '2026-05-08 09:00:00', '2026-05-08 18:00:00', 'TELETRAVAIL', 1),
(9,  'Télétravail',                NULL,                                                   '2026-05-09 09:00:00', '2026-05-09 18:00:00', 'TELETRAVAIL', 1),
-- Semaine 12 – 16 mai
(7,  'Formation cybersécurité',    'ANSSI — bonnes pratiques hygiène informatique',        '2026-05-12 09:00:00', '2026-05-13 17:00:00', 'FORMATION',   1),
(8,  'Intervention urgente',       'Panne réseau — dépannage sur site client Nice',        '2026-05-13 08:00:00', '2026-05-13 14:00:00', 'DEPLACEMENT', 1),
(9,  'Déploiement firewall',       'Mise en prod nouvelles règles pare-feu périmétrique',  '2026-05-15 20:00:00', '2026-05-15 22:00:00', 'AUTRE',       1),
(7,  'Bilan mensuel Infra',        'Bilan disponibilité SLA et incidents mai',             '2026-05-16 10:00:00', '2026-05-16 11:00:00', 'REUNION',     1),
(8,  'Bilan mensuel Infra',        'Bilan disponibilité SLA et incidents mai',             '2026-05-16 10:00:00', '2026-05-16 11:00:00', 'REUNION',     1),
(9,  'Bilan mensuel Infra',        'Bilan disponibilité SLA et incidents mai',             '2026-05-16 10:00:00', '2026-05-16 11:00:00', 'REUNION',     1),

-- ================================================================
-- COMMERCIAL (service 3 — IDs 10,11,12)
-- ================================================================
-- Semaine 28 avril – 2 mai
(10, 'Déplacement Sopra Steria',   'Présentation offre logicielle — site Lyon',            '2026-04-28 08:00:00', '2026-04-28 18:00:00', 'DEPLACEMENT', 1),
(10, 'Réunion pipeline commercial','Revue des opportunités en cours et prévisions',        '2026-04-29 10:00:00', '2026-04-29 11:00:00', 'REUNION',     1),
(11, 'Réunion pipeline commercial','Revue des opportunités en cours et prévisions',        '2026-04-29 10:00:00', '2026-04-29 11:00:00', 'REUNION',     1),
(12, 'Réunion pipeline commercial','Revue des opportunités en cours et prévisions',        '2026-04-29 10:00:00', '2026-04-29 11:00:00', 'REUNION',     1),
(12, 'Formation CRM Salesforce',   'Prise en main des nouvelles fonctionnalités CRM',     '2026-04-30 09:00:00', '2026-04-30 17:00:00', 'FORMATION',   1),
(11, 'Télétravail',                NULL,                                                   '2026-05-02 09:00:00', '2026-05-02 18:00:00', 'TELETRAVAIL', 1),
-- Semaine 5 – 9 mai
(10, 'Réunion hebdo Commercial',   'Suivi objectifs mensuel et pipeline deals',            '2026-05-05 09:00:00', '2026-05-05 10:00:00', 'REUNION',     1),
(11, 'Réunion hebdo Commercial',   'Suivi objectifs mensuel et pipeline deals',            '2026-05-05 09:00:00', '2026-05-05 10:00:00', 'REUNION',     1),
(12, 'Réunion hebdo Commercial',   'Suivi objectifs mensuel et pipeline deals',            '2026-05-05 09:00:00', '2026-05-05 10:00:00', 'REUNION',     1),
(12, 'Formation techniques vente', 'Closing et négociation avancée — 1 journée',          '2026-05-06 09:00:00', '2026-05-06 17:00:00', 'FORMATION',   1),
(10, 'Salon Vivatech Paris',       'Représentation NovaTech au salon Vivatech 2026',       '2026-05-07 08:00:00', '2026-05-08 18:00:00', 'DEPLACEMENT', 1),
(11, 'Salon Vivatech Paris',       'Représentation NovaTech au salon Vivatech 2026',       '2026-05-07 08:00:00', '2026-05-08 18:00:00', 'DEPLACEMENT', 1),
(12, 'Télétravail',                NULL,                                                   '2026-05-09 09:00:00', '2026-05-09 18:00:00', 'TELETRAVAIL', 1),
-- Semaine 12 – 16 mai
(10, 'Prospection client Marseille','RDV prospect secteur industrie — trajet inclus',      '2026-05-12 08:00:00', '2026-05-12 18:00:00', 'DEPLACEMENT', 1),
(11, 'Revue contrats clients',     'Analyse et renouvellement des contrats Q2',            '2026-05-13 14:00:00', '2026-05-13 16:00:00', 'REUNION',     1),
(12, 'Revue contrats clients',     'Analyse et renouvellement des contrats Q2',            '2026-05-13 14:00:00', '2026-05-13 16:00:00', 'REUNION',     1),
(10, 'Revue contrats clients',     'Analyse et renouvellement des contrats Q2',            '2026-05-13 14:00:00', '2026-05-13 16:00:00', 'REUNION',     1),
(11, 'Télétravail',                NULL,                                                   '2026-05-14 09:00:00', '2026-05-14 18:00:00', 'TELETRAVAIL', 1),
(10, 'Télétravail',                NULL,                                                   '2026-05-15 09:00:00', '2026-05-15 18:00:00', 'TELETRAVAIL', 1),
(11, 'Bilan mensuel Commercial',   'Analyse résultats mai et objectifs juin',              '2026-05-16 10:00:00', '2026-05-16 11:30:00', 'REUNION',     1),
(12, 'Bilan mensuel Commercial',   'Analyse résultats mai et objectifs juin',              '2026-05-16 10:00:00', '2026-05-16 11:30:00', 'REUNION',     1),
(10, 'Bilan mensuel Commercial',   'Analyse résultats mai et objectifs juin',              '2026-05-16 10:00:00', '2026-05-16 11:30:00', 'REUNION',     1),

-- ================================================================
-- DIRECTION & RH (service 4 — IDs 1,13,14,15)
-- ================================================================
-- Semaine 28 avril – 2 mai
(1,  'Réunion direction mensuelle','Bilan avril — orientations stratégiques mai',          '2026-04-28 14:00:00', '2026-04-28 16:00:00', 'REUNION',     1),
(13, 'Réunion direction mensuelle','Bilan avril — orientations stratégiques mai',          '2026-04-28 14:00:00', '2026-04-28 16:00:00', 'REUNION',     1),
(14, 'Réunion direction mensuelle','Bilan avril — orientations stratégiques mai',          '2026-04-28 14:00:00', '2026-04-28 16:00:00', 'REUNION',     1),
(15, 'Réunion direction mensuelle','Bilan avril — orientations stratégiques mai',          '2026-04-28 14:00:00', '2026-04-28 16:00:00', 'REUNION',     1),
(13, 'Entretiens annuels — Dév',   'Entretiens de performance Q1-Q2 pôle Développement',  '2026-04-29 09:00:00', '2026-04-29 18:00:00', 'AUTRE',       1),
(14, 'Clôture paie avril',         'Validation et envoi des bulletins de paie avril',     '2026-04-30 09:00:00', '2026-04-30 17:00:00', 'AUTRE',       1),
(15, 'Télétravail',                NULL,                                                   '2026-05-02 09:00:00', '2026-05-02 18:00:00', 'TELETRAVAIL', 1),
-- Semaine 5 – 9 mai
(13, 'Onboarding nouveau Dev',     'Accueil et intégration nouveau collaborateur Dev',     '2026-05-05 09:00:00', '2026-05-05 17:00:00', 'AUTRE',       1),
(15, 'Onboarding nouveau Dev',     'Remise matériel et présentation équipes',              '2026-05-05 14:00:00', '2026-05-05 17:00:00', 'AUTRE',       1),
(1,  'Réunion budget Q2',          'Révision budgétaire T2 et re-prévisions',             '2026-05-06 10:00:00', '2026-05-06 12:00:00', 'REUNION',     1),
(13, 'Réunion budget Q2',          'Révision budgétaire T2 et re-prévisions',             '2026-05-06 10:00:00', '2026-05-06 12:00:00', 'REUNION',     1),
(14, 'Formation droit du travail', 'Mise à jour réglementation du travail 2026',          '2026-05-07 09:00:00', '2026-05-07 17:00:00', 'FORMATION',   1),
(13, 'Formation RGPD avancé',      'Conformité traitement des données personnelles RGPD', '2026-05-08 09:00:00', '2026-05-08 17:00:00', 'FORMATION',   1),
(15, 'Télétravail',                NULL,                                                   '2026-05-07 09:00:00', '2026-05-07 18:00:00', 'TELETRAVAIL', 1),
-- Semaine 12 – 16 mai
(1,  'Réunion politique télétravail','Refonte charte et politique télétravail NovaTech',  '2026-05-12 10:00:00', '2026-05-12 12:00:00', 'REUNION',     1),
(13, 'Réunion politique télétravail','Refonte charte et politique télétravail NovaTech',  '2026-05-12 10:00:00', '2026-05-12 12:00:00', 'REUNION',     1),
(14, 'Réunion politique télétravail','Refonte charte et politique télétravail NovaTech',  '2026-05-12 10:00:00', '2026-05-12 12:00:00', 'REUNION',     1),
(13, 'Entretiens annuels — Support','Entretiens de performance Q1-Q2 pôle Support',       '2026-05-13 09:00:00', '2026-05-13 18:00:00', 'AUTRE',       1),
(14, 'Traitement paie mai',        'Préparation et contrôle des bulletins de salaire mai','2026-05-14 09:00:00', '2026-05-14 17:00:00', 'AUTRE',       1),
(15, 'Formation Excel avancé',     'Tableaux croisés et macros VBA pour reporting RH',    '2026-05-15 09:00:00', '2026-05-15 17:00:00', 'FORMATION',   1),
(1,  'Réunion stratégie H2 2026',  'Définition objectifs et stratégie second semestre',   '2026-05-16 14:00:00', '2026-05-16 17:00:00', 'REUNION',     1),
(13, 'Réunion stratégie H2 2026',  'Définition objectifs et stratégie second semestre',   '2026-05-16 14:00:00', '2026-05-16 17:00:00', 'REUNION',     1),
(14, 'Réunion stratégie H2 2026',  'Définition objectifs et stratégie second semestre',   '2026-05-16 14:00:00', '2026-05-16 17:00:00', 'REUNION',     1),

-- ================================================================
-- SUPPORT TECHNIQUE (service 5 — IDs 16,17,18)
-- ================================================================
-- Semaine 28 avril – 2 mai
(16, 'Réunion hebdo Support',      'Point tickets ouverts et incidents de la semaine',    '2026-04-28 09:00:00', '2026-04-28 09:30:00', 'REUNION',     1),
(17, 'Réunion hebdo Support',      'Point tickets ouverts et incidents de la semaine',    '2026-04-28 09:00:00', '2026-04-28 09:30:00', 'REUNION',     1),
(18, 'Réunion hebdo Support',      'Point tickets ouverts et incidents de la semaine',    '2026-04-28 09:00:00', '2026-04-28 09:30:00', 'REUNION',     1),
(18, 'Déplacement client Aix',     'Intervention et résolution incident P1 bloquant',     '2026-04-29 08:00:00', '2026-04-29 17:00:00', 'DEPLACEMENT', 1),
(17, 'Formation ITIL 4',           'Certification ITIL 4 Foundation — 2 jours',          '2026-04-30 09:00:00', '2026-05-01 17:00:00', 'FORMATION',   1),
(16, 'Télétravail',                NULL,                                                   '2026-05-02 09:00:00', '2026-05-02 18:00:00', 'TELETRAVAIL', 1),
-- Semaine 5 – 9 mai
(16, 'Réunion hebdo Support',      'Point tickets ouverts et incidents de la semaine',    '2026-05-05 09:00:00', '2026-05-05 09:30:00', 'REUNION',     1),
(17, 'Réunion hebdo Support',      'Point tickets ouverts et incidents de la semaine',    '2026-05-05 09:00:00', '2026-05-05 09:30:00', 'REUNION',     1),
(18, 'Réunion hebdo Support',      'Point tickets ouverts et incidents de la semaine',    '2026-05-05 09:00:00', '2026-05-05 09:30:00', 'REUNION',     1),
(18, 'Formation ticketing Jira',   'Optimisation workflow et automatisations Jira',       '2026-05-06 09:00:00', '2026-05-06 17:00:00', 'FORMATION',   1),
(16, 'Déplacement client Cannes',  'Audit post-incident et préconisations techniques',    '2026-05-07 09:00:00', '2026-05-07 17:00:00', 'DEPLACEMENT', 1),
(17, 'Télétravail',                NULL,                                                   '2026-05-08 09:00:00', '2026-05-08 18:00:00', 'TELETRAVAIL', 1),
(18, 'Télétravail',                NULL,                                                   '2026-05-09 09:00:00', '2026-05-09 18:00:00', 'TELETRAVAIL', 1),
-- Semaine 12 – 16 mai
(16, 'Réunion escalade incidents', 'Analyse incidents P1 et P2 — plan d\'action',        '2026-05-12 14:00:00', '2026-05-12 15:30:00', 'REUNION',     1),
(17, 'Réunion escalade incidents', 'Analyse incidents P1 et P2 — plan d\'action',        '2026-05-12 14:00:00', '2026-05-12 15:30:00', 'REUNION',     1),
(18, 'Réunion escalade incidents', 'Analyse incidents P1 et P2 — plan d\'action',        '2026-05-12 14:00:00', '2026-05-12 15:30:00', 'REUNION',     1),
(17, 'Formation sécurité utilisateurs','Sensibilisation phishing et ingénierie sociale', '2026-05-13 09:00:00', '2026-05-13 17:00:00', 'FORMATION',   1),
(16, 'Télétravail',                NULL,                                                   '2026-05-14 09:00:00', '2026-05-14 18:00:00', 'TELETRAVAIL', 1),
(18, 'Déplacement client Nice',    'Formation utilisateurs sur nouveaux outils CRM',      '2026-05-15 09:00:00', '2026-05-15 17:00:00', 'DEPLACEMENT', 1),
(16, 'Astreinte weekend mai',      'Astreinte technique weekend 16-17 mai',               '2026-05-16 08:00:00', '2026-05-17 18:00:00', 'AUTRE',       1),
(17, 'Bilan mensuel Support',      'KPIs satisfaction et SLA — rapport mensuel mai',      '2026-05-16 10:00:00', '2026-05-16 11:00:00', 'REUNION',     1),
(18, 'Bilan mensuel Support',      'KPIs satisfaction et SLA — rapport mensuel mai',      '2026-05-16 10:00:00', '2026-05-16 11:00:00', 'REUNION',     1);