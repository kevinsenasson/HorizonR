-- ============================================================
-- HorizonR — Schéma de base de données
-- NovaTech Solutions — BTS SIO SLAM 2026
-- ============================================================

CREATE DATABASE IF NOT EXISTS horizonr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE horizonr_db;

-- ------------------------------------------------------------
-- Table : services
-- ------------------------------------------------------------
CREATE TABLE services (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table : roles
-- ------------------------------------------------------------
CREATE TABLE roles (
    id  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom ENUM('ADMIN','MANAGER','EMPLOYE') NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table : employes
-- ------------------------------------------------------------
CREATE TABLE employes (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom            VARCHAR(100) NOT NULL,
    prenom         VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe   VARCHAR(255) NOT NULL,
    telephone      VARCHAR(20),
    poste          VARCHAR(100),
    date_embauche  DATE,
    solde_conges   DECIMAL(5,2) DEFAULT 25.00,
    actif          TINYINT(1) DEFAULT 1,
    role_id        INT UNSIGNED NOT NULL,
    service_id     INT UNSIGNED,
    manager_id     INT UNSIGNED,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_employe_role    FOREIGN KEY (role_id)    REFERENCES roles(id),
    CONSTRAINT fk_employe_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    CONSTRAINT fk_employe_manager FOREIGN KEY (manager_id) REFERENCES employes(id) ON DELETE SET NULL