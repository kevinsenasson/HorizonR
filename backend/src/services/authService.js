const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

const SECRET     = process.env.JWT_SECRET    || 'horizonr_dev_secret';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

async function login(email, mot_de_passe) {
  const rows = await authRepository.findUserByEmail(email);

  if (rows.length === 0) {
    return { status: 401, error: 'Identifiants incorrects' };
  }

  const employe = rows[0];

  if (!employe.actif) {
    return { status: 403, error: 'Compte désactivé' };
  }

  const mdpValide = await bcrypt.compare(mot_de_passe, employe.mot_de_passe);

  if (!mdpValide) {
    return { status: 401, error: 'Identifiants incorrects' };
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

  return {
    status: 200,
    data: {
      token,
      utilisateur: {
        id:      employe.id,
        nom:     employe.nom,
        prenom:  employe.prenom,
        email:   employe.email,
        role:    employe.role,
        service: employe.service
      }
    }
  };
}

module.exports = { login };