const repo = require('../src/repositories/dashboardRepository');
const pool = require('../src/config/db');

jest.mock('../src/config/db');

describe('dashboardRepository', () => {

  beforeEach(() => jest.clearAllMocks());

  it('countEmployesActifs', async () => {
    pool.query.mockResolvedValue([[{ total: 10 }]]);
    const res = await repo.countEmployesActifs();
    expect(res).toBe(10);
  });

  it('countCongesParStatut EN_ATTENTE', async () => {
    pool.query.mockResolvedValue([[{ total: 3 }]]);
    const res = await repo.countCongesParStatut('EN_ATTENTE');
    expect(res).toBe(3);
  });

  it('countCongesParStatut VALIDE', async () => {
    pool.query.mockResolvedValue([[{ total: 5 }]]);
    const res = await repo.countCongesParStatut('VALIDE');
    expect(res).toBe(5);
  });

  it('countCongesParStatut REFUSE', async () => {
    pool.query.mockResolvedValue([[{ total: 1 }]]);
    const res = await repo.countCongesParStatut('REFUSE');
    expect(res).toBe(1);
  });

  it('getEmployesParService', async () => {
    pool.query.mockResolvedValue([[{ service: 'IT', nb: 3 }]]);
    const res = await repo.getEmployesParService();
    expect(res[0].service).toBe('IT');
  });

  it('getEmployesParRole', async () => {
    pool.query.mockResolvedValue([[{ role: 'ADMIN', nb: 1 }]]);
    const res = await repo.getEmployesParRole();
    expect(res[0].role).toBe('ADMIN');
  });

  it('getCongesParType', async () => {
    pool.query.mockResolvedValue([[{ type: 'CP', nb: 4 }]]);
    const res = await repo.getCongesParType();
    expect(res[0].type).toBe('CP');
  });

  it('getCongesParMois', async () => {
    pool.query.mockResolvedValue([[{ mois: '2025-01', nb: 2 }]]);
    const res = await repo.getCongesParMois();
    expect(res[0].mois).toBe('2025-01');
  });

});
