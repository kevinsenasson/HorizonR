const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.query(`
    SELECT e.id, e.nom, e.prenom, e.email, e.telephone, e.poste,
           e.date_embauche, e.solde_conges, e.actif,
           r.nom AS role, s.nom AS service,
           CONCAT(m.prenom,' ',m.nom) AS manager
    FROM employes e
    JOIN roles r ON e.role_id = r.id
    LEFT JOIN services s ON e.service_id = s.id
    LEFT JOIN employes m ON e.manager_id = m.id
    ORDER BY s.nom, e.nom`);
  return rows;
}

async function findByManagerId(managerId) {
  const [rows] = await pool.query(`
    SELECT e.id, e.nom, e.prenom, e.email, e.telephone, e.poste,
           e.date_embauche, e.solde_conges, e.actif,
           r.nom AS role, s.nom AS service
    FROM employes e
    JOIN roles r ON e.role_id = r.id
    LEFT JOIN services s ON e.service_id = s.id
    WHERE e.manager_id = ?
    ORDER BY e.nom`,
    [managerId]);
  return rows;
}

async function findById(id) {
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
  return rows[0];
}

async function findByIdSimple(id) {
  const [rows] = await pool.query('SELECT id, actif FROM employes WHERE id = ?', [id]);
  return rows[0];
}

async function insert(data) {
  const [result] = await pool.query(
    `INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste,
                           date_embauche, solde_conges, role_id, service_id, manager_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    data
  );
  return result.insertId;
}

async function update(id, fields) {
  const { nom, prenom, email, telephone, poste, date_embauche,
          solde_conges, role_id, service_id, manager_id, actif } = fields;
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
}

async function deactivate(id) {
  await pool.query('UPDATE employes SET actif = 0 WHERE id = ?', [id]);
}

async function deleteById(id) {
  await pool.query('DELETE FROM employes WHERE id = ?', [id]);
}

async function findByServiceOf(userId) {
  const [rows] = await pool.query(
    `SELECT e.id, e.nom, e.prenom, e.email, e.poste, r.nom AS role, s.nom AS service
     FROM employes e
     JOIN roles r ON e.role_id = r.id
     LEFT JOIN services s ON e.service_id = s.id
     WHERE e.service_id = (SELECT service_id FROM employes WHERE id = ?)
       AND e.actif = 1
     ORDER BY e.nom`,
    [userId]
  );
  return rows;
}

async function findServices() {
  const [rows] = await pool.query('SELECT id, nom FROM services ORDER BY nom');
  return rows;
}

async function findRoles() {
  const [rows] = await pool.query('SELECT id, nom FROM roles ORDER BY id');
  return rows;
}

module.exports = {
  findAll,
  findByManagerId,
  findById,
  findByIdSimple,
  insert,
  update,
  deactivate,
  deleteById,
  findByServiceOf,
  findServices,
  findRoles
};
