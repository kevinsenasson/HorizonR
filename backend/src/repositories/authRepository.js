const pool = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT e.id, e.nom, e.prenom, e.email, e.mot_de_passe, e.actif,
            r.nom AS role, s.nom AS service
     FROM employes e
     JOIN roles r ON e.role_id = r.id
     LEFT JOIN services s ON e.service_id = s.id
     WHERE e.email = ?`,
    [email]
  );

  return rows;
}

module.exports = { findUserByEmail };