const bcrypt = require('bcrypt');
const repo = require('../repositories/employesRepository');

const SALT_ROUNDS = 10;
const REGEX_MDP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;

async function listerEmployes(role, utilisateurId) {
  if (role === 'ADMIN') return repo.findAll();
  return repo.findByManagerId(utilisateurId);
}

async function getEmploye(id) {
  const employe = await repo.findById(id);
  if (!employe) return { error: 'not found' };
  return employe;
}

async function creerEmploye(body) {
  const { nom, prenom, email, mot_de_passe, telephone, poste,
          date_embauche, solde_conges, role_id, service_id, manager_id } = body;

  if (!nom || !prenom || !email || !mot_de_passe || !role_id) {
    return { error: 'missing fields' };
  }

  if (!REGEX_MDP.test(mot_de_passe)) {
    return { error: 'weak password' };
  }

  const hash = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);

  try {
    const id = await repo.insert([
      nom, prenom, email, hash, telephone || null, poste || null,
      date_embauche || null, solde_conges || 25.00, role_id,
      service_id || null, manager_id || null
    ]);
    return { id };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return { error: 'duplicate email' };
    throw err;
  }
}

async function modifierEmploye(id, body) {
  const existing = await repo.findByIdSimple(id);
  if (!existing) return { error: 'not found' };

  try {
    await repo.update(id, body);
    return { ok: true };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return { error: 'duplicate email' };
    throw err;
  }
}

async function supprimerEmploye(id, utilisateurId) {
  if (parseInt(id) === utilisateurId) return { error: 'self delete' };

  const existing = await repo.findByIdSimple(id);
  if (!existing) return { error: 'not found' };

  await repo.deactivate(id);
  return { ok: true };
}

async function supprimerEmployeDefinitivement(id, utilisateurId) {
  if (parseInt(id) === utilisateurId) return { error: 'self delete' };

  const existing = await repo.findByIdSimple(id);
  if (!existing) return { error: 'not found' };
  if (existing.actif) return { error: 'still active' };

  await repo.deleteById(id);
  return { ok: true };
}

async function listerEmployesService(utilisateurId) {
  return repo.findByServiceOf(utilisateurId);
}

async function listerServices() {
  return repo.findServices();
}

async function listerRoles() {
  return repo.findRoles();
}

module.exports = {
  listerEmployes,
  getEmploye,
  creerEmploye,
  modifierEmploye,
  supprimerEmploye,
  supprimerEmployeDefinitivement,
  listerEmployesService,
  listerServices,
  listerRoles
};
