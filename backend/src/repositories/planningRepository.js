const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.query(`
    SELECT p.id, p.titre, p.description, p.date_debut, p.date_fin, p.type,
           CONCAT(e.prenom,' ',e.nom) AS employe, e.id AS employe_id,
           s.nom AS service
    FROM planning p
    JOIN employes e ON p.employe_id = e.id
    LEFT JOIN services s ON e.service_id = s.id
    ORDER BY p.date_debut`);
  return rows;
}

async function findByService(managerId) {
  const [rows] = await pool.query(`
    SELECT p.id, p.titre, p.description, p.date_debut, p.date_fin, p.type,
           CONCAT(e.prenom,' ',e.nom) AS employe, e.id AS employe_id
    FROM planning p
    JOIN employes e ON p.employe_id = e.id
    WHERE e.service_id = (SELECT service_id FROM employes WHERE id = ?)
    ORDER BY p.date_debut`,
    [managerId]);
  return rows;
}

async function findByEmploye(employeId) {
  const [rows] = await pool.query(`
    SELECT p.id, p.titre, p.description, p.date_debut, p.date_fin, p.type
    FROM planning p
    WHERE p.employe_id = ?
    ORDER BY p.date_debut`,
    [employeId]);
  return rows;
}

async function insert(data) {
  const [result] = await pool.query(
    `INSERT INTO planning (employe_id, titre, description, date_debut, date_fin, type, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    data
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT id, employe_id FROM planning WHERE id = ?', [id]);
  return rows[0];
}

async function deleteById(id) {
  await pool.query('DELETE FROM planning WHERE id = ?', [id]);
}

module.exports = {
  findAll,
  findByService,
  findByEmploye,
  insert,
  findById,
  deleteById
};
