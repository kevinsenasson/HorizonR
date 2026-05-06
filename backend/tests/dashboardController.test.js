const controller = require('../src/controllers/dashboardController');
const service    = require('../src/services/dashboardService');

jest.mock('../src/services/dashboardService');

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

describe('dashboardController', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('getStats - success', async () => {
    const req = {};
    const res = mockRes();

    const payload = {
      employes: { total: 10, parService: [], parRole: [] },
      conges: { enAttente: 3, valides: 5, refuses: 1, parType: [], parMois: [] }
    };

    service.getStats.mockResolvedValue(payload);

    await controller.getStats(req, res);

    expect(res.json).toHaveBeenCalledWith(payload);
  });

  it('getStats - server error (500)', async () => {
    const req = {};
    const res = mockRes();

    service.getStats.mockRejectedValue(new Error('db error'));

    await controller.getStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
  });

});
