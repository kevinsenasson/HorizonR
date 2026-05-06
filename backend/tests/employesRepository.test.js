const repo = require('../src/repositories/employesRepository');
const pool = require('../src/config/db');

jest.mock('../src/config/db');

describe('employesRepository', () => {

  beforeEach(() => jest.clearAllMocks());

  it('findAll', async () => {
    pool.query.mockResolvedValue([[{ id: 1, nom: 'Doe' }]]);
    const res = await repo.findAll();
    expect(res[0].id).toBe(1);
  });

  it('findByManagerId', async () => {
    pool.query.mockResolvedValue([[{ id: 2 }]]);
    const res = await repo.findByManagerId(5);
    expect(res.length).toBe(1);
  });

  it('findById - trouvé', async () => {
    pool.query.mockResolvedValue([[{ id: 3, nom: 'Martin' }]]);
    const res = await repo.findById(3);
    expect(res.nom).toBe('Martin');
  });

  it('findById - non trouvé', async () => {
    pool.query.mockResolvedValue([[]]);
    const res = await repo.findById(99);
    expect(res).toBeUndefined();
  });

  it('findByIdSimple - actif', async () => {
    pool.query.mockResolvedValue([[{ id: 1, actif: 1 }]]);
    const res = await repo.findByIdSimple(1);
    expect(res.actif).toBe(1);
  });

  it('insert', async () => {
    pool.query.mockResolvedValue([{ insertId: 42 }]);
    const res = await repo.insert(['Doe', 'John', 'j@j.com', 'hash', null, null, null, 25, 1, null, null]);
    expect(res).toBe(42);
  });

  it('update', async () => {
    pool.query.mockResolvedValue([]);
    await repo.update(1, {
      nom: 'X', prenom: 'Y', email: 'e@e.com', telephone: null, poste: null,
      date_embauche: null, solde_conges: 25, role_id: 1,
      service_id: null, manager_id: null, actif: 1
    });
    expect(pool.query).toHaveBeenCalled();
  });

  it('deactivate', async () => {
    pool.query.mockResolvedValue([]);
    await repo.deactivate(1);
    expect(pool.query).toHaveBeenCalled();
  });

  it('deleteById', async () => {
    pool.query.mockResolvedValue([]);
    await repo.deleteById(1);
    expect(pool.query).toHaveBeenCalled();
  });

  it('findByServiceOf', async () => {
    pool.query.mockResolvedValue([[{ id: 5, nom: 'Dupont' }]]);
    const res = await repo.findByServiceOf(1);
    expect(res[0].nom).toBe('Dupont');
  });

  it('findServices', async () => {
    pool.query.mockResolvedValue([[{ id: 1, nom: 'IT' }]]);
    const res = await repo.findServices();
    expect(res[0].nom).toBe('IT');
  });

  it('findRoles', async () => {
    pool.query.mockResolvedValue([[{ id: 1, nom: 'ADMIN' }]]);
    const res = await repo.findRoles();
    expect(res[0].nom).toBe('ADMIN');
  });

});
