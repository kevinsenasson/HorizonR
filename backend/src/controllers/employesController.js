const bcrypt = require('bcrypt');
const pool   = require('../config/db');

const SALT_ROUNDS = 10;

async function listerEmployes(req, res) {
  try {
    let query, params;
    if (req.utilisateur.role === 'ADMIN') {
      query = SELECT e.id, e.nom, e.prenom, e.email, e.telephone, e.poste, e.date_embauche, e.solde_conges, e.actif, r.nom AS role, s.nom AS service, CONCAT(m.prenom,' ',m.nom) AS manager FROM employes e JOIN roles r ON e.role_id = r.id LEFT JOIN services s ON e.service_id = s.id LEFT JOIN employes m ON e.manager_id = m.id ORDER BY s.nom, e.nom;
      params = [];
    } else {
      query = SELECT e.id, e.nom, e.prenom, e.email, e.telephone, e.poste, e.date_embauche, e.solde_conges, e.actif, r.nom AS role, s.nom AS service FROM employes e JOIN roles r ON e.role_id = r.id LEFT JOIN services s ON e.service_id = s.id WHERE e.manager_id = ? ORDER BY e.nom;
      params = [req.utilisateur.id];
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Erreur serveur' }); }
}

async function getEmploye(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(SELECT e.id, e.nom, e.prenom, e.email, e.telephone, e.poste, e.date_embauche, e.solde_conges, e.actif, r.nom AS role, r.id AS role_id, s.nom AS service, s.id AS service_id, e.manager_id FROM employes e JOIN roles r ON e.role_id = r.id LEFT JOIN services s ON e.service_id = s.id WHERE e.id = ?, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Employe non trouve' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Erreur serveur' }); }
}

async function creerEmploye(req, res) {
  const { nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id, manager_id } = req.body;
  if (!nom || !prenom || !email || !mot_de_passe || !role_id) return res.status(400).json({ error: 'Champs obligatoires manquants' });
  try {
    const hash = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);
    const [result] = await pool.query(INSERT INTO employes (nom, prenom, email, mot_de_passe, telephone, poste, date_embauche, solde_conges, role_id, service_id, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?), [nom, prenom, email, hash, telephone||null, poste||null, date_embauche||null, solde_conges||25.00, role_id, service_id||null, manager_id||null]);
    res.status(201).json({ id: result.insertId, message: 'Employe cree' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email deja utilise' });
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function modifierEmploye(req, res) {
  const { id } = req.params;
  const { nom, prenom, email, telephone, poste, date_embauche, solde_conges, role_id, service_id, manager_id, actif } = req.body;
  try {
    const [existing] = await pool.query('SELECT id FROM employes WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Employe non trouve' });
    await pool.query(UPDATE employes SET nom=?, prenom=?, email=?, telephone=?, poste=?, date_embauche=?, solde_conges=?, role_id=?, service_id=?, manager_id=?, actif=? WHERE id = ?, [nom, prenom, email, telephone||null, poste||null, date_embauche||null, solde_conges, role_id, service_id||null, manager_id||null, actif!==undefined?actif:1, id]);
    res.json({ message: 'Employe mis a jour' });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur' }); }
}

module.exports = { listerEmployes, getEmploye, creerEmploye, modifierEmploye };