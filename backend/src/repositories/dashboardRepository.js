const pool = require('../config/db');

async function countEmployesActifs() {
  const [[row]] = await pool.query('SELECT COUNT(*) AS total FROM employes WHERE actif = 1');
  return row.total;
}

async function countCongesParStatut(statut) {
  const [[row]] = await pool.query(
    'SELECT COUNT(*) AS total FROM conges WHERE statut = ?',
    [statut]
  );
  return row.total;
}

async function getEmployesParService() {
  const [rows] = await pool.query(`
    SELECT s.nom AS service, COUNT(e.id) AS nb
    FROM employes e
    JOIN services s ON e.service_id = s.id
    WHERE e.actif = 1
    GROUP BY s.id, s.nom
    ORDER BY nb DESC`);
  return rows;
}

async function getEmployesParRole() {
  const [rows] = await pool.query(`
    SELECT r.nom AS role, COUNT(e.id) AS nb
    FROM employes e
    JOIN roles r ON e.role_id = r.id
    WHERE e.actif = 1
    GROUP BY r.id, r.nom`);
  return rows;
}

async function getCongesParType() {
  const [rows] = await pool.query(`
    SELECT t.libelle AS type, COUNT(c.id) AS nb
    FROM conges c
    JOIN types_conges t ON c.type_conge_id = t.id
    GROUP BY t.id, t.libelle
    ORDER BY nb DESC`);
  return rows;
}

async function getCongesParMois() {
  const [rows] = await pool.query(`
    SELECT DATE_FORMAT(date_debut, '%Y-%m') AS mois, COUNT(*) AS nb
    FROM conges
    WHERE statut = 'VALIDE' AND YEAR(date_debut) = YEAR(CURDATE())
    GROUP BY mois
    ORDER BY mois`);
  return rows;
}

module.exports = {
  countEmployesActifs,
  countCongesParStatut,
  getEmployesParService,
  getEmployesParRole,
  getCongesParType,
  getCongesParMois
};
