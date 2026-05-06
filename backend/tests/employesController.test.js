const controller = require('../src/controllers/employesController');
const service    = require('../src/services/employesService');

jest.mock('../src/services/employesService');

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

describe('employesController', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  // --- listerEmployes ---
  it('listerEmployes - ADMIN success', async () => {
    const req = { utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.listerEmployes.mockResolvedValue([{ id: 1 }]);
    await controller.listerEmployes(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('listerEmployes - server error', async () => {
    const req = { utilisateur: { role: 'ADMIN', id: 1 } };
    const res = mockRes();
    service.listerEmployes.mockRejectedValue(new Error('fail'));
    await controller.listerEmployes(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // --- getEmploye ---
  it('getEmploye - trouvé', async () => {
    const req = { params: { id: 1 }, utilisateur: {} };
    const res = mockRes();
    service.getEmploye.mockResolvedValue({ id: 1, nom: 'Doe' });
    await controller.getEmploye(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('getEmploye - 404', async () => {
    const req = { params: { id: 99 }, utilisateur: {} };
    const res = mockRes();
    service.getEmploye.mockResolvedValue({ error: 'not found' });
    await controller.getEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('getEmploye - server error', async () => {
    const req = { params: { id: 1 }, utilisateur: {} };
    const res = mockRes();
    service.getEmploye.mockRejectedValue(new Error('fail'));
    await controller.getEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // --- creerEmploye ---
  it('creerEmploye - champs manquants (400)', async () => {
    const req = { body: {}, utilisateur: {} };
    const res = mockRes();
    service.creerEmploye.mockResolvedValue({ error: 'missing fields' });
    await controller.creerEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creerEmploye - mot de passe faible (400)', async () => {
    const req = { body: {}, utilisateur: {} };
    const res = mockRes();
    service.creerEmploye.mockResolvedValue({ error: 'weak password' });
    await controller.creerEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creerEmploye - email dupliqué (409)', async () => {
    const req = { body: {}, utilisateur: {} };
    const res = mockRes();
    service.creerEmploye.mockResolvedValue({ error: 'duplicate email' });
    await controller.creerEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('creerEmploye - succès (201)', async () => {
    const req = { body: {}, utilisateur: {} };
    const res = mockRes();
    service.creerEmploye.mockResolvedValue({ id: 10 });
    await controller.creerEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('creerEmploye - server error (500)', async () => {
    const req = { body: {}, utilisateur: {} };
    const res = mockRes();
    service.creerEmploye.mockRejectedValue(new Error('fail'));
    await controller.creerEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // --- modifierEmploye ---
  it('modifierEmploye - 404', async () => {
    const req = { params: { id: 99 }, body: {}, utilisateur: {} };
    const res = mockRes();
    service.modifierEmploye.mockResolvedValue({ error: 'not found' });
    await controller.modifierEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('modifierEmploye - 409', async () => {
    const req = { params: { id: 1 }, body: {}, utilisateur: {} };
    const res = mockRes();
    service.modifierEmploye.mockResolvedValue({ error: 'duplicate email' });
    await controller.modifierEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('modifierEmploye - succès', async () => {
    const req = { params: { id: 1 }, body: {}, utilisateur: {} };
    const res = mockRes();
    service.modifierEmploye.mockResolvedValue({ ok: true });
    await controller.modifierEmploye(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Employé mis à jour' });
  });

  it('modifierEmploye - server error', async () => {
    const req = { params: { id: 1 }, body: {}, utilisateur: {} };
    const res = mockRes();
    service.modifierEmploye.mockRejectedValue(new Error('fail'));
    await controller.modifierEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // --- supprimerEmploye ---
  it('supprimerEmploye - self delete (400)', async () => {
    const req = { params: { id: '1' }, utilisateur: { id: 1 } };
    const res = mockRes();
    service.supprimerEmploye.mockResolvedValue({ error: 'self delete' });
    await controller.supprimerEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('supprimerEmploye - 404', async () => {
    const req = { params: { id: '99' }, utilisateur: { id: 1 } };
    const res = mockRes();
    service.supprimerEmploye.mockResolvedValue({ error: 'not found' });
    await controller.supprimerEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('supprimerEmploye - succès', async () => {
    const req = { params: { id: '2' }, utilisateur: { id: 1 } };
    const res = mockRes();
    service.supprimerEmploye.mockResolvedValue({ ok: true });
    await controller.supprimerEmploye(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Employé désactivé' });
  });

  it('supprimerEmploye - server error', async () => {
    const req = { params: { id: '2' }, utilisateur: { id: 1 } };
    const res = mockRes();
    service.supprimerEmploye.mockRejectedValue(new Error('fail'));
    await controller.supprimerEmploye(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // --- supprimerEmployeDefinitivement ---
  it('supprimerEmployeDefinitivement - self delete (400)', async () => {
    const req = { params: { id: '1' }, utilisateur: { id: 1 } };
    const res = mockRes();
    service.supprimerEmployeDefinitivement.mockResolvedValue({ error: 'self delete' });
    await controller.supprimerEmployeDefinitivement(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('supprimerEmployeDefinitivement - 404', async () => {
    const req = { params: { id: '99' }, utilisateur: { id: 1 } };
    const res = mockRes();
    service.supprimerEmployeDefinitivement.mockResolvedValue({ error: 'not found' });
    await controller.supprimerEmployeDefinitivement(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('supprimerEmployeDefinitivement - encore actif (400)', async () => {
    const req = { params: { id: '2' }, utilisateur: { id: 1 } };
    const res = mockRes();
    service.supprimerEmployeDefinitivement.mockResolvedValue({ error: 'still active' });
    await controller.supprimerEmployeDefinitivement(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('supprimerEmployeDefinitivement - succès', async () => {
    const req = { params: { id: '2' }, utilisateur: { id: 1 } };
    const res = mockRes();
    service.supprimerEmployeDefinitivement.mockResolvedValue({ ok: true });
    await controller.supprimerEmployeDefinitivement(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Employé supprimé définitivement' });
  });

  it('supprimerEmployeDefinitivement - server error', async () => {
    const req = { params: { id: '2' }, utilisateur: { id: 1 } };
    const res = mockRes();
    service.supprimerEmployeDefinitivement.mockRejectedValue(new Error('fail'));
    await controller.supprimerEmployeDefinitivement(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // --- helpers ---
  it('listerEmployesService - succès', async () => {
    const req = { utilisateur: { id: 1 } };
    const res = mockRes();
    service.listerEmployesService.mockResolvedValue([{ id: 5 }]);
    await controller.listerEmployesService(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 5 }]);
  });

  it('listerEmployesService - server error', async () => {
    const req = { utilisateur: { id: 1 } };
    const res = mockRes();
    service.listerEmployesService.mockRejectedValue(new Error('fail'));
    await controller.listerEmployesService(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('listerServices - succès', async () => {
    const req = {};
    const res = mockRes();
    service.listerServices.mockResolvedValue([{ id: 1, nom: 'IT' }]);
    await controller.listerServices(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('listerServices - server error', async () => {
    const req = {};
    const res = mockRes();
    service.listerServices.mockRejectedValue(new Error('fail'));
    await controller.listerServices(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('listerRoles - succès', async () => {
    const req = {};
    const res = mockRes();
    service.listerRoles.mockResolvedValue([{ id: 1, nom: 'ADMIN' }]);
    await controller.listerRoles(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('listerRoles - server error', async () => {
    const req = {};
    const res = mockRes();
    service.listerRoles.mockRejectedValue(new Error('fail'));
    await controller.listerRoles(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

});
