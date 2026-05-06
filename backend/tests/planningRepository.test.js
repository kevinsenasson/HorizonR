const repo = require('../src/repositories/planningRepository');
const pool = require('../src/config/db');

jest.mock('../src/config/db');

describe('planningRepository', () => {

  beforeEach(() => jest.clearAllMocks());

  it('findAll', async () => {
    pool.query.mockResolvedValue([[{ id: 1, titre: 'Réunion' }]]);
    const res = await repo.findAll();
    expect(res[0].titre).toBe('Réunion');
  });

  it('findByService', async () => {
    pool.query.mockResolvedValue([[{ id: 2 }]]);
    const res = await repo.findByService(3);
    expect(res.length).toBe(1);
  });

  it('findByEmploye', async () => {
    pool.query.mockResolvedValue([[{ id: 3 }]]);
    const res = await repo.findByEmploye(1);
    expect(res.length).toBe(1);
  });

  it('insert', async () => {
    pool.query.mockResolvedValue([{ insertId: 7 }]);
    const id = await repo.insert([1, 'Titre', null, '2025-01-01', '2025-01-02', 'AUTRE', 1]);
    expect(id).toBe(7);
  });

  it('findById - trouvé', async () => {
    pool.query.mockResolvedValue([[{ id: 5, employe_id: 2 }]]);
    const res = await repo.findById(5);
    expect(res.employe_id).toBe(2);
  });

  it('findById - non trouvé', async () => {
    pool.query.mockResolvedValue([[]]);
    const res = await repo.findById(99);
    expect(res).toBeUndefined();
  });

  it('deleteById', async () => {
    pool.query.mockResolvedValue([]);
    await repo.deleteById(1);
    expect(pool.query).toHaveBeenCalled();
  });

});
