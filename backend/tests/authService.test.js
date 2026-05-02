const authService = require('../src/services/authService');
const authRepository = require('../src/repositories/authRepository');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../src/repositories/authRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authService - login', () => {

  const userMock = {
    id: 1,
    email: 'test@test.com',
    mot_de_passe: 'hashed',
    actif: 1,
    nom: 'Doe',
    prenom: 'John',
    role: 'admin',
    service: 'IT'
  };

  it('user not found', async () => {
    authRepository.findUserByEmail.mockResolvedValue([]);

    const res = await authService.login('a', 'b');

    expect(res.status).toBe(401);
  });

  it('inactive user', async () => {
    authRepository.findUserByEmail.mockResolvedValue([{ ...userMock, actif: 0 }]);

    const res = await authService.login('a', 'b');

    expect(res.status).toBe(403);
  });

  it('wrong password', async () => {
    authRepository.findUserByEmail.mockResolvedValue([userMock]);
    bcrypt.compare.mockResolvedValue(false);

    const res = await authService.login('a', 'b');

    expect(res.status).toBe(401);
  });

  it('success login', async () => {
    authRepository.findUserByEmail.mockResolvedValue([userMock]);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake-token');

    const res = await authService.login('a', 'b');

    expect(res.status).toBe(200);
    expect(res.data.token).toBe('fake-token');
  });
});