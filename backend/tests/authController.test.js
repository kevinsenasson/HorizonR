const authController = require('../src/controllers/authController');
const authService = require('../src/services/authService');

jest.mock('../src/services/authService');

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

describe('authController', () => {

  it('missing fields', async () => {
    const req = { body: {} };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('service error', async () => {
    const req = { body: { email: 'a', mot_de_passe: 'b' } };
    const res = mockRes();

    authService.login.mockResolvedValue({ status: 401, error: 'error' });

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('success', async () => {
    const req = { body: { email: 'a', mot_de_passe: 'b' } };
    const res = mockRes();

    authService.login.mockResolvedValue({
      data: { token: 'ok' }
    });

    await authController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: 'ok' });
  });

  it('exception', async () => {
    const req = { body: { email: 'a', mot_de_passe: 'b' } };
    const res = mockRes();

    authService.login.mockRejectedValue(new Error());

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});