const bcrypt = require('bcrypt');
const repo = require('../repositories/profilRepository');

const SALT_ROUNDS = 10;
const REGEX_MDP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;

async function getProfil(utilisateurId) {
  const profil = await repo.findById(utilisateurId);
  if (!profil) return { error: 'not found' };
  return profil;
}

async function changerMotDePasse(utilisateurId, body) {
  const { ancien_mot_de_passe, nouveau_mot_de_passe } = body;

  if (!ancien_mot_de_passe || !nouveau_mot_de_passe) {
    return { error: 'missing fields' };
  }

  if (!REGEX_MDP.test(nouveau_mot_de_passe)) {
    return { error: 'weak password' };
  }

  const row = await repo.findPasswordById(utilisateurId);
  const valide = await bcrypt.compare(ancien_mot_de_passe, row.mot_de_passe);

  if (!valide) return { error: 'wrong password' };

  const hash = await bcrypt.hash(nouveau_mot_de_passe, SALT_ROUNDS);
  await repo.updatePassword(utilisateurId, hash);

  return { ok: true };
}

module.exports = { getProfil, changerMotDePasse };
