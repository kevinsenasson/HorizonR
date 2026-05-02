const pool = require('../config/db');

async function getCongesAdmin() {
  const [rows] = await pool.query(`
    SELECT c.id, c.date_debut, c.date_fin, c.nb_jours, c.motif, c.statut, c.commentaire_rh,
           CONCAT(e.prenom,' ',e.nom) AS employe, e.id AS employe_id,
           t.libelle AS type_conge, c.type_conge_id,
           CONCAT(v.prenom,' ',v.nom) AS valideur
    FROM conges c
    JOIN employes e ON c.employe_id = e.id
    JOIN types_conges t ON c.type_conge_id = t.id
    LEFT JOIN employes v ON c.valideur_id = v.id
    ORDER BY c.created_at DESC
  `);

  return rows;
}

async function getCongesManager(id) {
  const [rows] = await pool.query(`
    SELECT c.id, c.date_debut, c.date_fin, c.nb_jours, c.motif, c.statut, c.commentaire_rh,
           CONCAT(e.prenom,' ',e.nom) AS employe, e.id AS employe_id,
           t.libelle AS type_conge, c.type_conge_id,
           CONCAT(v.prenom,' ',v.nom) AS valideur
    FROM conges c
    JOIN employes e ON c.employe_id = e.id
    JOIN types_conges t ON c.type_conge_id = t.id
    LEFT JOIN employes v ON c.valideur_id = v.id
    WHERE e.manager_id = ? OR e.id = ?
    ORDER BY c.created_at DESC
  `, [id, id]);

  return rows;
}

async function getCongesEmploye(id) {
  const [rows] = await pool.query(`
    SELECT c.id, c.date_debut, c.date_fin, c.nb_jours, c.motif, c.statut, c.commentaire_rh,
           t.libelle AS type_conge, c.type_conge_id
    FROM conges c
    JOIN types_conges t ON c.type_conge_id = t.id
    WHERE c.employe_id = ?
    ORDER BY c.created_at DESC
  `, [id]);

  return rows;
}

async function getSolde(employe_id) {
  const [rows] = await pool.query(
    'SELECT solde_conges FROM employes WHERE id = ?',
    [employe_id]
  );

  return rows[0];
}

async function insertConge(data) {
  const [result] = await pool.query(
    `INSERT INTO conges (employe_id, type_conge_id, date_debut, date_fin, nb_jours, motif, statut)
     VALUES (?, ?, ?, ?, ?, ?, 'EN_ATTENTE')`,
    data
  );

  return result.insertId;
}

async function getCongeById(id) {
  const [rows] = await pool.query(
    `SELECT c.*, e.manager_id, e.solde_conges, e.id AS emp_id
     FROM conges c JOIN employes e ON c.employe_id = e.id
     WHERE c.id = ?`,
    [id]
  );

  return rows[0];
}

async function updateCongeDecision(id, decision, valideurId, commentaire) {
  await pool.query(
    `UPDATE conges SET statut = ?, valideur_id = ?, commentaire_rh = ? WHERE id = ?`,
    [decision, valideurId, commentaire, id]
  );
}

async function updateSolde(employe_id, nb_jours) {
  await pool.query(
    'UPDATE employes SET solde_conges = GREATEST(0, solde_conges - ?) WHERE id = ?',
    [nb_jours, employe_id]
  );
}

async function deleteConge(id) {
  await pool.query('DELETE FROM conges WHERE id = ?', [id]);
}

async function getTypes() {
  const [rows] = await pool.query(
    'SELECT id, libelle FROM types_conges ORDER BY id'
  );

  return rows;
}

async function getCongeMinimal(id) {
  const [rows] = await pool.query(
    'SELECT employe_id, statut FROM conges WHERE id = ?',
    [id]
  );

  return rows[0];
}

module.exports = {
  getCongesAdmin,
  getCongesManager,
  getCongesEmploye,
  getSolde,
  insertConge,
  getCongeById,
  updateCongeDecision,
  updateSolde,
  deleteConge,
  getTypes,
  getCongeMinimal
};