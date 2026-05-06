const repo = require('../repositories/planningRepository');

async function listerPlanning(role, id) {
  if (role === 'ADMIN')   return repo.findAll();
  if (role === 'MANAGER') return repo.findByService(id);
  return repo.findByEmploye(id);
}

async function creerEvenement(body, utilisateur) {
  const { employe_id, titre, description, date_debut, date_fin, type } = body;

  if (!employe_id || !titre || !date_debut || !date_fin) {
    return { error: 'missing fields' };
  }

  if (utilisateur.role === 'EMPLOYE' && parseInt(employe_id) !== utilisateur.id) {
    return { error: 'forbidden' };
  }

  if (new Date(date_fin) < new Date(date_debut)) {
    return { error: 'invalid dates' };
  }

  const id = await repo.insert([
    employe_id, titre, description || null, date_debut, date_fin,
    type || 'AUTRE', utilisateur.id
  ]);

  return { id };
}

async function supprimerEvenement(id, utilisateur) {
  const evenement = await repo.findById(id);
  if (!evenement) return { error: 'not found' };

  if (utilisateur.role === 'EMPLOYE' && evenement.employe_id !== utilisateur.id) {
    return { error: 'forbidden' };
  }

  await repo.deleteById(id);
  return { ok: true };
}

module.exports = { listerPlanning, creerEvenement, supprimerEvenement };
