const controller = require('../src/controllers/congesController');
const service = require('../src/services/congesService');

jest.mock('../src/services/congesService', () => ({
  listerConges: jest.fn(),
  demanderConge: jest.fn(),
  validerConge: jest.fn(),
  annulerConge: jest.fn()
}));

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

describe('congesController - FULL STABLE COVERAGE', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  // =========================
  // LISTE CONGES
  // =========================
  describe('listerConges', () => {

    it('ADMIN', async () => {
      const req = { utilisateur: { role: 'ADMIN', id: 1 } };
      const res = mockRes();

      service.listerConges.mockResolvedValue([{ id: 1 }]);

      await controller.listerConges(req, res);

      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it('MANAGER', async () => {
      const req = { utilisateur: { role: 'MANAGER', id: 2 } };
      const res = mockRes();

      service.listerConges.mockResolvedValue([{ id: 2 }]);

      await controller.listerConges(req, res);

      expect(res.json).toHaveBeenCalledWith([{ id: 2 }]);
    });

    it('EMPLOYE', async () => {
      const req = { utilisateur: { role: 'EMPLOYE', id: 3 } };
      const res = mockRes();

      service.listerConges.mockResolvedValue([{ id: 3 }]);

      await controller.listerConges(req, res);

      expect(res.json).toHaveBeenCalledWith([{ id: 3 }]);
    });

    it('SERVER ERROR', async () => {
      const req = { utilisateur: { role: 'ADMIN', id: 1 } };
      const res = mockRes();

      service.listerConges.mockRejectedValue(new Error('fail'));

      await controller.listerConges(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

  });

  // =========================
  // DEMANDER CONGE
  // =========================
  describe('demanderConge', () => {

    it('validation error (400)', async () => {
      const req = { body: {}, utilisateur: {} };
      const res = mockRes();

      service.demanderConge.mockResolvedValue({ error: 'missing' });

      await controller.demanderConge(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('success (201)', async () => {
      const req = {
        body: { type_conge_id: 1, date_debut: '2025-01-01', date_fin: '2025-01-05' },
        utilisateur: { id: 1 }
      };
      const res = mockRes();

      service.demanderConge.mockResolvedValue({
        id: 10,
        nb_jours: 5
      });

      await controller.demanderConge(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('server error fallback', async () => {
      const req = {
        body: { type_conge_id: 1, date_debut: '2025-01-01', date_fin: '2025-01-05' },
        utilisateur: { id: 1 }
      };
      const res = mockRes();

      service.demanderConge.mockRejectedValue(new Error('fail'));

      await controller.demanderConge(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

  });

  // =========================
  // VALIDER CONGE
  // =========================
  describe('validerConge', () => {

    it('VALIDE success', async () => {
      const req = {
        params: { id: 1 },
        body: { decision: 'VALIDE' },
        utilisateur: { id: 1, role: 'ADMIN' }
      };
      const res = mockRes();

      service.validerConge.mockResolvedValue({ ok: true });

      await controller.validerConge(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('REFUSE success', async () => {
      const req = {
        params: { id: 1 },
        body: { decision: 'REFUSE' },
        utilisateur: { id: 1, role: 'ADMIN' }
      };
      const res = mockRes();

      service.validerConge.mockResolvedValue({ ok: true });

      await controller.validerConge(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('invalid decision (400)', async () => {
      const req = {
        params: { id: 1 },
        body: { decision: 'BAD' },
        utilisateur: { id: 1 }
      };
      const res = mockRes();

      service.validerConge.mockResolvedValue({ error: 'bad' });

      await controller.validerConge(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('not found (404)', async () => {
      const req = {
        params: { id: 1 },
        body: { decision: 'VALIDE' },
        utilisateur: { id: 1 }
      };
      const res = mockRes();

      service.validerConge.mockResolvedValue({ error: 'not found' });

      await controller.validerConge(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('forbidden branch', async () => {
      const req = {
        params: { id: 1 },
        body: { decision: 'VALIDE' },
        utilisateur: { id: 1, role: 'MANAGER' }
      };
      const res = mockRes();

      service.validerConge.mockResolvedValue({ error: 'forbidden' });

      await controller.validerConge(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    it('server error', async () => {
      const req = {
        params: { id: 1 },
        body: { decision: 'VALIDE' },
        utilisateur: { id: 1 }
      };
      const res = mockRes();

      service.validerConge.mockRejectedValue(new Error('fail'));

      await controller.validerConge(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

  });

  // =========================
  // ANNULER CONGE
  // =========================
  describe('annulerConge', () => {

    it('success', async () => {
      const req = {
        params: { id: 1 },
        utilisateur: { id: 1, role: 'EMPLOYE' }
      };
      const res = mockRes();

      service.annulerConge.mockResolvedValue({ ok: true });

      await controller.annulerConge(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('not found (404)', async () => {
      const req = {
        params: { id: 1 },
        utilisateur: { id: 1 }
      };
      const res = mockRes();

      service.annulerConge.mockResolvedValue({ error: 'not found' });

      await controller.annulerConge(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('forbidden', async () => {
      const req = {
        params: { id: 1 },
        utilisateur: { id: 99 }
      };
      const res = mockRes();

      service.annulerConge.mockResolvedValue({ error: 'forbidden' });

      await controller.annulerConge(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    it('server error', async () => {
      const req = {
        params: { id: 1 },
        utilisateur: { id: 1 }
      };
      const res = mockRes();

      service.annulerConge.mockRejectedValue(new Error('fail'));

      await controller.annulerConge(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

  });

});