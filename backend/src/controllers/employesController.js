const bcrypt = require('bcrypt');
const pool   = require('../config/db');

const SALT_ROUNDS = 10;

/**
 * GET /api/employes
 * ADMIN : tous les employés
 * MANAGER : uniquement son équipe
 */
async function listerEmployes(req, res) {
  try {
    let query, params;

    if (req.utilisateur.role === 'ADMIN') {
      query = `
        SELECT e.id, e.nom, e.prenom, e.email, e.telephone, e.poste,
               e.date_embauche, e.solde_conges, e.actif,
               r.nom AS role, s.nom AS service,
               CONCAT(m.prenom,' ',m.nom) AS manager
        FROM employes e
        JOIN roles r ON e.role_id = r.id
        LEFT JOIN services s ON e.service_id = s.id
        LEFT JOIN employes m ON e.manager_id = m.id
        ORDER BY s.nom, e.nom`;
      params = [];
    } else {
      query = `
        SELECT e.id, e.nom, e.prenom, e.email, e.telephone, e.poste,
               e.date_embauche, e.solde_conges, e.actif,
               r.nom AS role, s.nom AS service
        FROM employes e
        JOIN roles r ON e.role_id = r.id
        LEFT JOIN services s ON e.service_id = s.id
        WHERE e.manager_id = ?
        ORDER BY e.nom`;
      params = [req.utilisateur.id];
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerEmployes:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * GET /api/employes/:id
 */
async function getEmploye(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT e.id, e.nom, e.prenom, e.email, e.telephone, e.poste,
              e.date_embauche, e.solde_conges, e.actif,
              r.nom AS role, r.id AS role_id,
              s.nom AS service, s.id AS service_id,
              e.manager_id
       FROM employes e
       JOIN roles r ON e.role_id = r.id
       LEFT JOIN services s ON e.service_id = s.id
       WHERE e.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Employé non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur getEmploye:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * POST /api/employes
 * ADMIN uniquement
 */
async function creerEmploye(req, res) {
  const { nom, prenom, email, mot_de_passe, telephone, poste,
          date_embauche, solde_conges, role_id, service_id, manager_id } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe || !role_id) {
    return res.status(400).json({ error: 'Champs obligatoires manquants (nom, prenom, email, mot_de_passe, role_id)' });
  }

  const regexMdp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;
  if (!regexMdp.test(mot_de_passe)) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&_-#)' });
  }

  try {
    const hash = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);
    const [result] = await pool.query(
      `INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste,
                             date_embauche, solde_conges, role_id, service_id, manager_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, prenom, email, hash, telephone || null, poste || null,
       date_embauche || null, solde_conges || 25.00, role_id,
       service_id || null, manager_id || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Employé créé avec succès' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }
    console.error('Erreur creerEmploye:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * PUT /api/employes/:id
 * ADMIN uniquement
 */
async function modifierEmploye(req, res) {
  const { id } = req.params;
  const { nom, prenom, email, telephone, poste, date_embauche,
          solde_conges, role_id, service_id, manager_id, actif } = req.body;

  try {
    const [existing] = await pool.query('SELECT id FROM employes WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Employé non trouvé' });

    await pool.query(
      `UPDATE employes SET nom=?, prenom=?, email=?, telephone=?, poste=?,
              date_embauche=?, solde_conges=?, role_id=?, service_id=?,
              manager_id=?, actif=?
       WHERE id = ?`,
      [nom, prenom, email, telephone || null, poste || null,
       date_embauche || null, solde_conges, role_id,
       service_id || null, manager_id || null,
       actif !== undefined ? actif : 1, id]
    );
    res.json({ message: 'Employé mis à jour' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }
    console.error('Erreur modifierEmploye:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * DELETE /api/employes/:id
 * ADMIN uniquement — désactivation logique (actif = 0)
 */
async function supprimerEmploye(req, res) {
  const { id } = req.params;

  // Empêcher l'auto-suppression
  if (parseInt(id) === req.utilisateur.id) {
    return res.status(400).json({ error: 'Impossible de désactiver votre propre compte' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM employes WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Employé non trouvé' });

    await pool.query('UPDATE employes SET actif = 0 WHERE id = ?', [id]);
    res.json({ message: 'Employé désactivé' });
  } catch (err) {
    console.error('Erreur supprimerEmploye:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * GET /api/employes/services
 * Retourne la liste des services (utilisé dans les formulaires)
 */
async function listerServices(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, nom FROM services ORDER BY nom');
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerServices:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * GET /api/employes/roles
 * Retourne la liste des rôles
 */
async function listerRoles(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, nom FROM roles ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerRoles:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * DELETE /api/employes/:id/force
 * ADMIN uniquement — suppression physique (uniquement si inactif)
 */
async function supprimerEmployeDefinitivement(req, res) {
  const { id } = req.params;

  if (parseInt(id) === req.utilisateur.id) {
    return res.status(400).json({ error: 'Impossible de supprimer votre propre compte' });
  }

  try {
    const [existing] = await pool.query('SELECT id, actif FROM employes WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Employé non trouvé' });
    if (existing[0].actif) {
      return res.status(400).json({ error: 'Désactiver l\'employé avant de le supprimer définitivement' });
    }

    await pool.query('DELETE FROM employes WHERE id = ?', [id]);
    res.json({ message: 'Employé supprimé définitivement' });
  } catch (err) {
    console.error('Erreur supprimerEmployeDefinitivement:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  listerEmployes,
  getEmploye,
  creerEmploye,
  modifierEmploye,
  supprimerEmploye,
  supprimerEmployeDefinitivement,
  listerServices,
  listerRoles
};
