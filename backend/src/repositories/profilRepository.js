const pool = require('../config/db');

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT e.id, e.nom, e.prenom, e.email, e.telephone, e.poste,
            e.date_embauche, e.solde_conges,
            r.nom AS role,
            s.nom AS service,
            CONCAT(m.prenom,' ',m.nom) AS manager
     FROM employes e
     JOIN roles r ON e.role_id = r.id
     LEFT JOIN services s ON e.service_id = s.id
     LEFT JOIN employes m ON e.manager_id = m.id
     WHERE e.id = ?`,
    [id]
  );
  return rows[0];
}

async function findPasswordById(id) {
  const [rows] = await pool.query(
    'SELECT mot_de_passe FROM employes WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function updatePassword(id, hash) {
  await pool.query(
    'UPDATE employes SET mot_de_passe = ? WHERE id = ?',
    [hash, id]
  );
}

module.exports = { findById, findPasswordById, updatePassword };
