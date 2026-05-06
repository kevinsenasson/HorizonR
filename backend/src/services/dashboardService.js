const repo = require('../repositories/dashboardRepository');

async function getStats() {
  const totalEmployes  = await repo.countEmployesActifs();
  const enAttente      = await repo.countCongesParStatut('EN_ATTENTE');
  const valides        = await repo.countCongesParStatut('VALIDE');
  const refuses        = await repo.countCongesParStatut('REFUSE');
  const parService     = await repo.getEmployesParService();
  const parRole        = await repo.getEmployesParRole();
  const parType        = await repo.getCongesParType();
  const parMois        = await repo.getCongesParMois();

  return {
    employes: {
      total: totalEmployes,
      parService,
      parRole
    },
    conges: {
      enAttente,
      valides,
      refuses,
      parType,
      parMois
    }
  };
}

module.exports = { getStats };
