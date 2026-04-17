const bcrypt = require('bcrypt');
const pool   = require('../config/db');

const SALT_ROUNDS = 10;

/**
 * GET /api/profil
 * Retourne le profil de l'utilisateur connecté
 */
async function getProfil(req, res) {
  try {
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
      [req.utilisateur.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Profil non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur getProfil:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * PUT /api/profil/mot-de-passe
 * Permet à l'utilisateur connecté de changer son mot de passe
 */
async function changerMotDePasse(req, res) {
  const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;

  if (!ancien_mot_de_passe || !nouveau_mot_de_passe) {
    return res.status(400).json({ error: 'Ancien et nouveau mot de passe requis' });
  }

  if (nouveau_mot_de_passe.length < 8) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT mot_de_passe FROM employes WHERE id = ?',
      [req.utilisateur.id]
    );

    const valide = await bcrypt.compare(ancien_mot_de_passe, rows[0].mot_de_passe);
    if (!valide) {
      return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
    }

    const hash = await bcrypt.hash(nouveau_mot_de_passe, SALT_ROUNDS);
    await pool.query('UPDATE employes SET mot_de_passe = ? WHERE id = ?', [hash, req.utilisateur.id]);
    res.json({ message: 'Mot de passe mis à jour' });
  } catch (err) {
    console.error('Erreur changerMotDePasse:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getProfil, changerMotDePasse };
