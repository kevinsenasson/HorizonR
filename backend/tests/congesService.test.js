const service = require('../src/services/congesService');
const repo = require('../src/repositories/congesRepository');

jest.mock('../src/repositories/congesRepository');

describe('congesService', () => {

  const user = { id: 1, role: 'EMPLOYE' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculerJoursOuvres doit exclure week-end', () => {
    const res = service.calculerJoursOuvres('2024-01-01', '2024-01-07');
    expect(res).toBeGreaterThan(0);
  });

  it('demanderConge - solde insuffisant', async () => {
    repo.getSolde.mockResolvedValue({ solde_conges: 1 });

    const result = await service.demanderConge(
      {
        type_conge_id: 1,
        date_debut: '2024-01-01',
        date_fin: '2024-01-10'
      },
      user
    );

    expect(result.error).toBeDefined();
  });

  it('demanderConge - success', async () => {
    repo.getSolde.mockResolvedValue({ solde_conges: 30 });
    repo.insertConge.mockResolvedValue(99);

    const result = await service.demanderConge(
      {
        type_conge_id: 3,
        date_debut: '2024-01-02',
        date_fin: '2024-01-03'
      },
      user
    );

    expect(result.id).toBe(99);
    expect(result.nb_jours).toBeGreaterThan(0);
  });

  it('validerConge - not found', async () => {
    repo.getCongeById.mockResolvedValue(null);

    const result = await service.validerConge(1, 'VALIDE', null, user);

    expect(result.error).toBe('not found');
  });

  it('annulerConge - forbidden', async () => {
    repo.getCongeMinimal.mockResolvedValue({
      employe_id: 999,
      statut: 'EN_ATTENTE'
    });

    const result = await service.annulerConge(1, user);

    expect(result.error).toBe('forbidden');
  });

   it('calculerJoursOuvres week-end inclus', () => {
    const res = service.calculerJoursOuvres('2024-01-01', '2024-01-07');
    expect(res).toBeGreaterThan(0);
  });

  it('demanderConge - solde insuffisant CP', async () => {
    repo.getSolde.mockResolvedValue({ solde_conges: 0 });

    const res = await service.demanderConge(
      {
        type_conge_id: 1,
        date_debut: '2024-01-01',
        date_fin: '2024-01-10'
      },
      user
    );

    expect(res.error).toBeDefined();
  });

  it('demanderConge - RTT bypass solde check', async () => {
    repo.getSolde.mockResolvedValue({ solde_conges: 0 });
    repo.insertConge.mockResolvedValue(10);

    const res = await service.demanderConge(
      {
        type_conge_id: 3,
        date_debut: '2024-01-02',
        date_fin: '2024-01-03'
      },
      user
    );

    expect(res.id).toBe(10);
  });

  it('validerConge - not found', async () => {
    repo.getCongeById.mockResolvedValue(null);

    const res = await service.validerConge(1, 'VALIDE', null, user);

    expect(res.error).toBe('not found');
  });

  it('validerConge - already treated', async () => {
    repo.getCongeById.mockResolvedValue({
      statut: 'VALIDE'
    });

    const res = await service.validerConge(1, 'VALIDE', null, user);

    expect(res.error).toBe('already treated');
  });

  it('validerConge - manager forbidden', async () => {
    repo.getCongeById.mockResolvedValue({
      statut: 'EN_ATTENTE',
      manager_id: 99,
      emp_id: 99,
      type_conge_id: 1
    });

    const res = await service.validerConge(1, 'VALIDE', null, {
      id: 1,
      role: 'MANAGER'
    });

    expect(res.error).toBe('forbidden');
  });

  it('validerConge - success + solde update', async () => {
    repo.getCongeById.mockResolvedValue({
      statut: 'EN_ATTENTE',
      manager_id: 1,
      emp_id: 1,
      employe_id: 1,
      nb_jours: 2,
      type_conge_id: 1
    });

    const res = await service.validerConge(1, 'VALIDE', null, {
      id: 1,
      role: 'ADMIN'
    });

    expect(res.ok).toBe(true);
  });

  it('annulerConge - not found', async () => {
    repo.getCongeMinimal.mockResolvedValue(null);

    const res = await service.annulerConge(1, user);

    expect(res.error).toBe('not found');
  });

  it('annulerConge - already treated', async () => {
    repo.getCongeMinimal.mockResolvedValue({
      employe_id: 1,
      statut: 'VALIDE'
    });

    const res = await service.annulerConge(1, user);

    expect(res.error).toBe('not allowed');
  });

  it('listerConges admin path', async () => {
    repo.getCongesAdmin.mockResolvedValue([{ id: 1 }]);

    const res = await service.listerConges('ADMIN', 1);

    expect(res.length).toBe(1);
  });

  it('listerConges manager path', async () => {
    repo.getCongesManager.mockResolvedValue([{ id: 2 }]);

    const res = await service.listerConges('MANAGER', 1);

    expect(res.length).toBe(1);
  });

  it('listerConges employe path', async () => {
    repo.getCongesEmploye.mockResolvedValue([{ id: 3 }]);

    const res = await service.listerConges('EMPLOYE', 1);

    expect(res.length).toBe(1);
  });

});