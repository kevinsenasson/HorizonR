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
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table : types_conges
-- ------------------------------------------------------------
CREATE TABLE types_conges (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    libelle     VARCHAR(100) NOT NULL,
    description VARCHAR(255)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table : conges
-- ------------------------------------------------------------
CREATE TABLE conges (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employe_id      INT UNSIGNED NOT NULL,
    type_conge_id   INT UNSIGNED NOT NULL,
    date_debut      DATE NOT NULL,
    date_fin        DATE NOT NULL,
    nb_jours        DECIMAL(5,2) NOT NULL,
    motif           TEXT,
    statut          ENUM('EN_ATTENTE','VALIDE','REFUSE') DEFAULT 'EN_ATTENTE',
    valideur_id     INT UNSIGNED,
    commentaire_rh  TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_conge_employe   FOREIGN KEY (employe_id)    REFERENCES employes(id) ON DELETE CASCADE,
    CONSTRAINT fk_conge_type      FOREIGN KEY (type_conge_id) REFERENCES types_conges(id),
    CONSTRAINT fk_conge_valideur  FOREIGN KEY (valideur_id)   REFERENCES employes(id) ON DELETE SET NULL,
    CONSTRAINT chk_dates CHECK (date_fin >= date_debut)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table : planning
-- ------------------------------------------------------------
CREATE TABLE planning (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employe_id   INT UNSIGNED NOT NULL,
    titre        VARCHAR(200) NOT NULL,
    description  TEXT,
    date_debut   DATETIME NOT NULL,
    date_fin     DATETIME NOT NULL,
    type         ENUM('TELETRAVAIL','DEPLACEMENT','FORMATION','REUNION','AUTRE') DEFAULT 'AUTRE',
    created_by   INT UNSIGNED,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_planning_employe    FOREIGN KEY (employe_id) REFERENCES employes(id) ON DELETE CASCADE,
    CONSTRAINT fk_planning_created_by FOREIGN KEY (created_by) REFERENCES employes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Index utiles pour les performances
-- ------------------------------------------------------------
CREATE INDEX idx_conges_employe   ON conges(employe_id);
CREATE INDEX idx_conges_statut    ON conges(statut);
CREATE INDEX idx_conges_dates     ON conges(date_debut, date_fin);
CREATE INDEX idx_planning_employe ON planning(employe_id);
CREATE INDEX idx_employes_service ON employes(service_id);
CREATE INDEX idx_employes_manager ON employes(manager_id);
