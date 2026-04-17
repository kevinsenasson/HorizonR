# MPD — Modèle Physique de Données

## Projet HorizonR — NovaTech Solutions (MySQL 8.0)

---

## Script DDL complet

```sql
-- ════════════════════════════════════════
-- TABLE : services
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS services (
  id  INT          NOT NULL AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  CONSTRAINT pk_services PRIMARY KEY (id),
  CONSTRAINT uq_services_nom UNIQUE (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ════════════════════════════════════════
-- TABLE : roles
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS roles (
  id  INT         NOT NULL AUTO_INCREMENT,
  nom VARCHAR(50) NOT NULL,
  CONSTRAINT pk_roles PRIMARY KEY (id),
  CONSTRAINT uq_roles_nom UNIQUE (nom),
  CONSTRAINT chk_roles_nom CHECK (nom IN ('ADMIN', 'MANAGER', 'EMPLOYE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ════════════════════════════════════════
-- TABLE : employes
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS employes (
  id             INT          NOT NULL AUTO_INCREMENT,
  nom            VARCHAR(100) NOT NULL,
  prenom         VARCHAR(100) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  mot_de_passe   VARCHAR(255) NOT NULL,
  date_embauche  DATE         NOT NULL,
  solde_conges   DECIMAL(5,1) NOT NULL  DEFAULT 25.0,
  actif          TINYINT(1)   NOT NULL  DEFAULT 1,
  role_id        INT          NOT NULL,
  service_id     INT              NULL,
  manager_id     INT              NULL,
  CONSTRAINT pk_employes     PRIMARY KEY (id),
  CONSTRAINT uq_employes_email UNIQUE (email),
  CONSTRAINT fk_employes_role     FOREIGN KEY (role_id)    REFERENCES roles(id)    ON DELETE RESTRICT,
  CONSTRAINT fk_employes_service  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  CONSTRAINT fk_employes_manager  FOREIGN KEY (manager_id) REFERENCES employes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_employes_role    ON employes (role_id);
CREATE INDEX idx_employes_service ON employes (service_id);
CREATE INDEX idx_employes_manager ON employes (manager_id);

-- ════════════════════════════════════════
-- TABLE : types_conges
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS types_conges (
  id  INT          NOT NULL AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  CONSTRAINT pk_types_conges PRIMARY KEY (id),
  CONSTRAINT uq_types_conges_nom UNIQUE (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ════════════════════════════════════════
-- TABLE : conges
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS conges (
  id           INT           NOT NULL AUTO_INCREMENT,
  employe_id   INT           NOT NULL,
  type_id      INT           NOT NULL,
  date_debut   DATE          NOT NULL,
  date_fin     DATE          NOT NULL,
  nb_jours     DECIMAL(4,1)  NOT NULL DEFAULT 0,
  statut       ENUM('EN_ATTENTE','VALIDE','REFUSE','ANNULE') NOT NULL DEFAULT 'EN_ATTENTE',
  commentaire  TEXT              NULL,
  date_demande TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valideur_id  INT               NULL,
  CONSTRAINT pk_conges      PRIMARY KEY (id),
  CONSTRAINT fk_conges_employe  FOREIGN KEY (employe_id)  REFERENCES employes(id)     ON DELETE CASCADE,
  CONSTRAINT fk_conges_type     FOREIGN KEY (type_id)     REFERENCES types_conges(id) ON DELETE RESTRICT,
  CONSTRAINT fk_conges_valideur FOREIGN KEY (valideur_id) REFERENCES employes(id)     ON DELETE SET NULL,
  CONSTRAINT chk_conges_dates   CHECK (date_fin >= date_debut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_conges_employe ON conges (employe_id);
CREATE INDEX idx_conges_statut  ON conges (statut);
CREATE INDEX idx_conges_dates   ON conges (date_debut, date_fin);

-- ════════════════════════════════════════
-- TABLE : planning
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS planning (
  id          INT           NOT NULL AUTO_INCREMENT,
  employe_id  INT           NOT NULL,
  titre       VARCHAR(200)  NOT NULL,
  date_debut  DATETIME      NOT NULL,
  date_fin    DATETIME      NOT NULL,
  couleur     VARCHAR(7)    NOT NULL DEFAULT '#2563eb',
  description TEXT              NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_planning PRIMARY KEY (id),
  CONSTRAINT fk_planning_employe FOREIGN KEY (employe_id) REFERENCES employes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_planning_employe_dates ON planning (employe_id, date_debut);
```

---

## Types utilisés

| Type SQL             | Usage                                             |
| -------------------- | ------------------------------------------------- |
| `INT AUTO_INCREMENT` | Clés primaires entières                           |
| `VARCHAR(n)`         | Chaînes de longueur variable bornée               |
| `TEXT`               | Commentaires / descriptions longues               |
| `DATE`               | Dates pures (congés, embauche)                    |
| `DATETIME`           | Horodatages planning (date + heure)               |
| `TIMESTAMP`          | date_demande, created_at — auto CURRENT_TIMESTAMP |
| `DECIMAL(5,1)`       | Solde congés avec 1 décimale (ex: 24.5)           |
| `TINYINT(1)`         | Booléen MySQL (actif = 0 ou 1)                    |
| `ENUM`               | Statut congé : valeurs strictement définies       |

---

## Paramètres du moteur

- **Moteur** : InnoDB (transactions ACID, FK supportées)
- **Charset** : utf8mb4 (support Unicode complet, emojis)
- **Collation** : utf8mb4_unicode_ci (comparaisons insensibles à la casse)
- **Version cible** : MySQL 8.0
