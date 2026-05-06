const service = require('../src/services/dashboardService');
const repo    = require('../src/repositories/dashboardRepository');

jest.mock('../src/repositories/dashboardRepository');

describe('dashboardService', () => {

  beforeEach(() => jest.clearAllMocks());

  it('getStats - construit la structure attendue', async () => {
    repo.countEmployesActifs.mockResolvedValue(10);
    repo.countCongesParStatut.mockImplementation((statut) => {
      if (statut === 'EN_ATTENTE') return Promise.resolve(3);
      if (statut === 'VALIDE')     return Promise.resolve(5);
      if (statut === 'REFUSE')     return Promise.resolve(1);
    });
    repo.getEmployesParService.mockResolvedValue([{ service: 'IT', nb: 3 }]);
    repo.getEmployesParRole.mockResolvedValue([{ role: 'ADMIN', nb: 1 }]);
    repo.getCongesParType.mockResolvedValue([{ type: 'CP', nb: 4 }]);
    repo.getCongesParMois.mockResolvedValue([{ mois: '2025-01', nb: 2 }]);

    const res = await service.getStats();

    expect(res.employes.total).toBe(10);
    expect(res.conges.enAttente).toBe(3);
    expect(res.conges.valides).toBe(5);
    expect(res.conges.refuses).toBe(1);
    expect(res.employes.parService[0].service).toBe('IT');
    expect(res.employes.parRole[0].role).toBe('ADMIN');
    expect(res.conges.parType[0].type).toBe('CP');
    expect(res.conges.parMois[0].mois).toBe('2025-01');
  });

  it('getStats - appelle les 8 fonctions du repo', async () => {
    repo.countEmployesActifs.mockResolvedValue(0);
    repo.countCongesParStatut.mockResolvedValue(0);
    repo.getEmployesParService.mockResolvedValue([]);
    repo.getEmployesParRole.mockResolvedValue([]);
    repo.getCongesParType.mockResolvedValue([]);
    repo.getCongesParMois.mockResolvedValue([]);

    await service.getStats();

    expect(repo.countEmployesActifs).toHaveBeenCalledTimes(1);
    expect(repo.countCongesParStatut).toHaveBeenCalledTimes(3);
    expect(repo.getEmployesParService).toHaveBeenCalledTimes(1);
    expect(repo.getEmployesParRole).toHaveBeenCalledTimes(1);
    expect(repo.getCongesParType).toHaveBeenCalledTimes(1);
    expect(repo.getCongesParMois).toHaveBeenCalledTimes(1);
  });

});
