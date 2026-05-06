const repo = require('../src/repositories/profilRepository');
const pool = require('../src/config/db');

jest.mock('../src/config/db');

describe('profilRepository', () => {

  beforeEach(() => jest.clearAllMocks());

  it('findById - trouvé', async () => {
    pool.query.mockResolvedValue([[{ id: 1, nom: 'Doe' }]]);
    const res = await repo.findById(1);
    expect(res.nom).toBe('Doe');
  });

  it('findById - non trouvé', async () => {
    pool.query.mockResolvedValue([[]]);
    const res = await repo.findById(99);
    expect(res).toBeUndefined();
  });

  it('findPasswordById', async () => {
    pool.query.mockResolvedValue([[{ mot_de_passe: 'hashed' }]]);
    const res = await repo.findPasswordById(1);
    expect(res.mot_de_passe).toBe('hashed');
  });

  it('updatePassword', async () => {
    pool.query.mockResolvedValue([]);
    await repo.updatePassword(1, 'newHash');
    expect(pool.query).toHaveBeenCalled();
  });

});
