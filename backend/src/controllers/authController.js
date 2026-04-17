const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

const SECRET     = process.env.JWT_SECRET    || 'horizonr_dev_secret';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/**
 * POST /api/auth/login
 * Body : { email, mot_de_passe }
 */
async function login(req, res) {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT e.id, e.nom, e.prenom, e.email, e.mot_de_passe, e.actif,
              r.nom AS role, s.nom AS service
       FROM employes e
       JOIN roles r ON e.role_id = r.id
       LEFT JOIN services s ON e.service_id = s.id
       WHERE e.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const employe = rows[0];

    if (!employe.actif) {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    const mdpValide = await bcrypt.compare(mot_de_passe, employe.mot_de_passe);
    if (!mdpValide) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      {
        id:      employe.id,
        email:   employe.email,
        role:    employe.role,
        nom:     employe.nom,
        prenom:  employe.prenom,
        service: employe.service
      },
      SECRET,
      { expiresIn: EXPIRES_IN }
    );

    res.json({
      token,
      utilisateur: {
        id:      employe.id,
        nom:     employe.nom,
        prenom:  employe.prenom,
        email:   employe.email,
        role:    employe.role,
        service: employe.service
      }
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * POST /api/auth/logout
 * Côté stateless JWT : simple confirmation (invalidation gérée côté client)
 */
function logout(_req, res) {
  res.json({ message: 'Déconnexion réussie' });
}

module.exports = { login, logout };
