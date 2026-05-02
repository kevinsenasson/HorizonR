const repo = require('../repositories/congesRepository');

/**
 * business util to calculate working days between 2 dates (inclusive)
 * ignores week-ends, does not handle holidays
 */
function calculerJoursOuvres(dateDebut, dateFin) {
  let jours = 0;
  const d = new Date(dateDebut);
  const fin = new Date(dateFin);

  while (d <= fin) {
    const jour = d.getDay();
    if (jour !== 0 && jour !== 6) jours++;
    d.setDate(d.getDate() + 1);
  }

  return jours;
}

async function listerConges(role, id) {
  if (role === 'ADMIN') return repo.getCongesAdmin();
  if (role === 'MANAGER') return repo.getCongesManager(id);
  return repo.getCongesEmploye(id);
}

async function demanderConge(data, user) {
  const { type_conge_id, date_debut, date_fin, motif } = data;

  const nb_jours = calculerJoursOuvres(date_debut, date_fin);

  const solde = await repo.getSolde(user.id);

  if (solde.solde_conges < nb_jours && [1, 2].includes(Number(type_conge_id))) {
    return { error: `Solde insuffisant (${solde.solde_conges})` };
  }

  const id = await repo.insertConge([
    user.id,
    type_conge_id,
    date_debut,
    date_fin,
    nb_jours,
    motif || null
  ]);

  return { id, nb_jours };
}

async function validerConge(id, decision, commentaire, user) {
  const conge = await repo.getCongeById(id);

  if (!conge) return { error: 'not found' };
  if (conge.statut !== 'EN_ATTENTE') return { error: 'already treated' };

  if (user.role === 'MANAGER' &&
      conge.manager_id !== user.id &&
      conge.emp_id !== user.id) {
    return { error: 'forbidden' };
  }

  await repo.updateCongeDecision(id, decision, user.id, commentaire);

  if (decision === 'VALIDE' && [1, 2].includes(Number(conge.type_conge_id))) {
    await repo.updateSolde(conge.employe_id, conge.nb_jours);
  }

  return { ok: true };
}

async function annulerConge(id, user) {
  const conge = await repo.getCongeMinimal(id);

  if (!conge) return { error: 'not found' };

  if (conge.employe_id !== user.id && user.role !== 'ADMIN') {
    return { error: 'forbidden' };
  }

  if (conge.statut !== 'EN_ATTENTE') {
    return { error: 'not allowed' };
  }

  await repo.deleteConge(id);

  return { ok: true };
}

async function listerTypes() {
  return repo.getTypes();
}

module.exports = {
  calculerJoursOuvres,
  listerConges,
  demanderConge,
  validerConge,
  annulerConge,
  listerTypes
};