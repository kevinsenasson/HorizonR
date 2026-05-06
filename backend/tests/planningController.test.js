const controller = require('../src/controllers/planningController');
const service    = require('../src/services/planningService');

jest.mock('../src/services/planningService');

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

describe('planningController', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  // --- listerPlanning ---
  it('listerPlanning - ADMIN success', async () => {
    const req = { utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.listerPlanning.mockResolvedValue([{ id: 1 }]);
    await controller.listerPlanning(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('listerPlanning - server error', async () => {
    const req = { utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.listerPlanning.mockRejectedValue(new Error('fail'));
    await controller.listerPlanning(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // --- creerEvenement ---
  it('creerEvenement - champs manquants (400)', async () => {
    const req = { body: {}, utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.creerEvenement.mockResolvedValue({ error: 'missing fields' });
    await controller.creerEvenement(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creerEvenement - forbidden (403)', async () => {
    const req = { body: {}, utilisateur: { role: 'EMPLOYE', id: 3 } };
    const res = mockRes();
    service.creerEvenement.mockResolvedValue({ error: 'forbidden' });
    await controller.creerEvenement(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('creerEvenement - dates invalides (400)', async () => {
    const req = { body: {}, utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.creerEvenement.mockResolvedValue({ error: 'invalid dates' });
    await controller.creerEvenement(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creerEvenement - succès (201)', async () => {
    const req = { body: {}, utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.creerEvenement.mockResolvedValue({ id: 5 });
    await controller.creerEvenement(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 5, message: 'Événement créé' });
  });

  it('creerEvenement - server error (500)', async () => {
    const req = { body: {}, utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.creerEvenement.mockRejectedValue(new Error('fail'));
    await controller.creerEvenement(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // --- supprimerEvenement ---
  it('supprimerEvenement - not found (404)', async () => {
    const req = { params: { id: 99 }, utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.supprimerEvenement.mockResolvedValue({ error: 'not found' });
    await controller.supprimerEvenement(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('supprimerEvenement - forbidden (403)', async () => {
    const req = { params: { id: 5 }, utilisateur: { role: 'EMPLOYE', id: 3 } };
    const res = mockRes();
    service.supprimerEvenement.mockResolvedValue({ error: 'forbidden' });
    await controller.supprimerEvenement(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('supprimerEvenement - succès', async () => {
    const req = { params: { id: 1 }, utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.supprimerEvenement.mockResolvedValue({ ok: true });
    await controller.supprimerEvenement(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Événement supprimé' });
  });

  it('supprimerEvenement - server error (500)', async () => {
    const req = { params: { id: 1 }, utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.supprimerEvenement.mockRejectedValue(new Error('fail'));
    await controller.supprimerEvenement(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

});
