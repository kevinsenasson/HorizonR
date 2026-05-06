const service = require('../src/services/planningService');
const repo    = require('../src/repositories/planningRepository');

jest.mock('../src/repositories/planningRepository');

describe('planningService', () => {

  const adminUser   = { id: 1, role: 'ADMIN' };
  const managerUser = { id: 2, role: 'MANAGER' };
  const employeUser = { id: 3, role: 'EMPLOYE' };

  beforeEach(() => jest.clearAllMocks());

  // listerPlanning
  it('listerPlanning - ADMIN appelle findAll', async () => {
    repo.findAll.mockResolvedValue([{ id: 1 }]);
    const res = await service.listerPlanning('ADMIN', 1);
    expect(repo.findAll).toHaveBeenCalled();
    expect(res.length).toBe(1);
  });

  it('listerPlanning - MANAGER appelle findByService', async () => {
    repo.findByService.mockResolvedValue([{ id: 2 }]);
    const res = await service.listerPlanning('MANAGER', 2);
    expect(repo.findByService).toHaveBeenCalledWith(2);
  });

  it('listerPlanning - EMPLOYE appelle findByEmploye', async () => {
    repo.findByEmploye.mockResolvedValue([{ id: 3 }]);
    const res = await service.listerPlanning('EMPLOYE', 3);
    expect(repo.findByEmploye).toHaveBeenCalledWith(3);
  });

  // creerEvenement
  it('creerEvenement - champs manquants', async () => {
    const res = await service.creerEvenement({}, adminUser);
    expect(res.error).toBe('missing fields');
  });

  it('creerEvenement - EMPLOYE forbidden (autre employe)', async () => {
    const res = await service.creerEvenement(
      { employe_id: 99, titre: 'X', date_debut: '2025-01-01', date_fin: '2025-01-02' },
      employeUser
    );
    expect(res.error).toBe('forbidden');
  });

  it('creerEvenement - dates invalides', async () => {
    const res = await service.creerEvenement(
      { employe_id: 1, titre: 'X', date_debut: '2025-01-10', date_fin: '2025-01-05' },
      adminUser
    );
    expect(res.error).toBe('invalid dates');
  });

  it('creerEvenement - EMPLOYE peut créer pour lui-même', async () => {
    repo.insert.mockResolvedValue(5);
    const res = await service.creerEvenement(
      { employe_id: 3, titre: 'X', date_debut: '2025-01-01', date_fin: '2025-01-02' },
      employeUser
    );
    expect(res.id).toBe(5);
  });

  it('creerEvenement - succès ADMIN', async () => {
    repo.insert.mockResolvedValue(10);
    const res = await service.creerEvenement(
      { employe_id: 1, titre: 'X', date_debut: '2025-01-01', date_fin: '2025-01-02' },
      adminUser
    );
    expect(res.id).toBe(10);
  });

  // supprimerEvenement
  it('supprimerEvenement - not found', async () => {
    repo.findById.mockResolvedValue(undefined);
    const res = await service.supprimerEvenement(99, adminUser);
    expect(res.error).toBe('not found');
  });

  it('supprimerEvenement - EMPLOYE forbidden', async () => {
    repo.findById.mockResolvedValue({ id: 5, employe_id: 99 });
    const res = await service.supprimerEvenement(5, employeUser);
    expect(res.error).toBe('forbidden');
  });

  it('supprimerEvenement - EMPLOYE peut supprimer le sien', async () => {
    repo.findById.mockResolvedValue({ id: 5, employe_id: 3 });
    repo.deleteById.mockResolvedValue();
    const res = await service.supprimerEvenement(5, employeUser);
    expect(res.ok).toBe(true);
  });

  it('supprimerEvenement - succès ADMIN', async () => {
    repo.findById.mockResolvedValue({ id: 1, employe_id: 5 });
    repo.deleteById.mockResolvedValue();
    const res = await service.supprimerEvenement(1, adminUser);
    expect(res.ok).toBe(true);
  });

});
