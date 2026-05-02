const repo = require('../src/repositories/congesRepository');
const pool = require('../src/config/db');

jest.mock('../src/config/db');

describe('congesRepository', () => {

  beforeEach(() => jest.clearAllMocks());

  it('getSolde', async () => {
    pool.query.mockResolvedValue([[{ solde_conges: 10 }]]);

    const res = await repo.getSolde(1);

    expect(res.solde_conges).toBe(10);
  });

  it('insertConge', async () => {
    pool.query.mockResolvedValue([{ insertId: 5 }]);

    const id = await repo.insertConge([1, 1, 'a', 'b', 2, null]);

    expect(id).toBe(5);
  });

  it('getCongesAdmin', async () => {
    pool.query.mockResolvedValue([[{ id: 1 }]]);

    const res = await repo.getCongesAdmin();

    expect(res.length).toBe(1);
  });

  it('deleteConge', async () => {
    pool.query.mockResolvedValue([]);

    await repo.deleteConge(1);

    expect(pool.query).toHaveBeenCalled();
  });

   it('getCongesAdmin', async () => {
    pool.query.mockResolvedValue([[{ id: 1 }]]);
    const res = await repo.getCongesAdmin();
    expect(res.length).toBe(1);
  });

  it('getCongesManager', async () => {
    pool.query.mockResolvedValue([[{ id: 2 }]]);
    const res = await repo.getCongesManager(1);
    expect(res.length).toBe(1);
  });

  it('getCongesEmploye', async () => {
    pool.query.mockResolvedValue([[{ id: 3 }]]);
    const res = await repo.getCongesEmploye(1);
    expect(res.length).toBe(1);
  });

  it('getSolde', async () => {
    pool.query.mockResolvedValue([[{ solde_conges: 5 }]]);
    const res = await repo.getSolde(1);
    expect(res.solde_conges).toBe(5);
  });

  it('insertConge', async () => {
    pool.query.mockResolvedValue([{ insertId: 10 }]);
    const res = await repo.insertConge([]);
    expect(res).toBe(10);
  });

  it('updateCongeDecision', async () => {
    pool.query.mockResolvedValue([]);
    await repo.updateCongeDecision(1, 'VALIDE', 1, null);
    expect(pool.query).toHaveBeenCalled();
  });

  it('updateSolde', async () => {
    pool.query.mockResolvedValue([]);
    await repo.updateSolde(1, 2);
    expect(pool.query).toHaveBeenCalled();
  });

  it('deleteConge', async () => {
    pool.query.mockResolvedValue([]);
    await repo.deleteConge(1);
    expect(pool.query).toHaveBeenCalled();
  });

  it('getTypes', async () => {
    pool.query.mockResolvedValue([[{ id: 1 }]]);
    const res = await repo.getTypes();
    expect(res.length).toBe(1);
  });

  it('getCongeMinimal', async () => {
    pool.query.mockResolvedValue([[{ employe_id: 1 }]]);
    const res = await repo.getCongeMinimal(1);
    expect(res.employe_id).toBe(1);
  });
});