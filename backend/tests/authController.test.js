/**
 * Tests unitaires — Auth controller (login/logout)
 * Mock complet de mysql2 et bcrypt
 */

jest.mock('../src/config/db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const pool   = require('../src/config/db');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { login, logout } = require('../src/controllers/authController');

describe('authController.login()', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  test('Retourne 400 si email manquant', async () => {
    req.body = { mot_de_passe: 'Password1!' };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('Retourne 400 si mot de passe manquant', async () => {
    req.body = { email: 'test@test.fr' };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('Retourne 401 si employé introuvable', async () => {
    pool.query = jest.fn().mockResolvedValue([[]]);
    req.body = { email: 'inconnu@novatech.fr', mot_de_passe: 'Password1!' };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('Retourne 403 si compte inactif', async () => {
    pool.query = jest.fn().mockResolvedValue([[{
      id: 1, nom: 'Doe', prenom: 'John', email: 'john@test.fr',
      mot_de_passe: '$hash', actif: 0, role: 'EMPLOYE', service: 'Dev'
    }]]);
    req.body = { email: 'john@test.fr', mot_de_passe: 'Password1!' };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('Retourne 401 si mot de passe incorrect', async () => {
    pool.query = jest.fn().mockResolvedValue([[{
      id: 1, nom: 'Doe', prenom: 'John', email: 'john@test.fr',
      mot_de_passe: '$hash', actif: 1, role: 'EMPLOYE', service: 'Dev'
    }]]);
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    req.body = { email: 'john@test.fr', mot_de_passe: 'mauvais' };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('Retourne 200 avec token si identifiants valides', async () => {
    pool.query = jest.fn().mockResolvedValue([[{
      id: 1, nom: 'Martin', prenom: 'Sophie', email: 'sophie@novatech.fr',
      mot_de_passe: '$hash', actif: 1, role: 'ADMIN', service: 'Direction'
    }]]);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue('fake_jwt_token');
    req.body = { email: 'sophie@novatech.fr', mot_de_passe: 'Password1!' };
    await login(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: 'fake_jwt_token',
      utilisateur: expect.objectContaining({ role: 'ADMIN' })
    }));
  });
});

describe('authController.logout()', () => {
  test('Retourne un message de confirmation', () => {
    const res = { json: jest.fn() };
    logout({}, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Déconnexion réussie' });
  });
});
