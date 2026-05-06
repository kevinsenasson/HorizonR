const controller = require('../src/controllers/profilController');
const service    = require('../src/services/profilService');

jest.mock('../src/services/profilService');

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

describe('profilController', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  // --- getProfil ---
  it('getProfil - succès', async () => {
    const req = { utilisateur: { id: 1 } };
    const res = mockRes();
    service.getProfil.mockResolvedValue({ id: 1, nom: 'Doe' });
    await controller.getProfil(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: 1, nom: 'Doe' });
  });

  it('getProfil - 404', async () => {
    const req = { utilisateur: { id: 99 } };
    const res = mockRes();
    service.getProfil.mockResolvedValue({ error: 'not found' });
    await controller.getProfil(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('getProfil - server error (500)', async () => {
    const req = { utilisateur: { id: 1 } };
    const res = mockRes();
    service.getProfil.mockRejectedValue(new Error('fail'));
    await controller.getProfil(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // --- changerMotDePasse ---
  it('changerMotDePasse - champs manquants (400)', async () => {
    const req = { utilisateur: { id: 1 }, body: {} };
    const res = mockRes();
    service.changerMotDePasse.mockResolvedValue({ error: 'missing fields' });
    await controller.changerMotDePasse(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('changerMotDePasse - mot de passe faible (400)', async () => {
    const req = { utilisateur: { id: 1 }, body: {} };
    const res = mockRes();
    service.changerMotDePasse.mockResolvedValue({ error: 'weak password' });
    await controller.changerMotDePasse(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('changerMotDePasse - mauvais ancien mdp (401)', async () => {
    const req = { utilisateur: { id: 1 }, body: {} };
    const res = mockRes();
    service.changerMotDePasse.mockResolvedValue({ error: 'wrong password' });
    await controller.changerMotDePasse(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('changerMotDePasse - succès', async () => {
    const req = { utilisateur: { id: 1 }, body: {} };
    const res = mockRes();
    service.changerMotDePasse.mockResolvedValue({ ok: true });
    await controller.changerMotDePasse(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe mis à jour' });
  });

  it('changerMotDePasse - server error (500)', async () => {
    const req = { utilisateur: { id: 1 }, body: {} };
    const res = mockRes();
    service.changerMotDePasse.mockRejectedValue(new Error('fail'));
    await controller.changerMotDePasse(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

});
