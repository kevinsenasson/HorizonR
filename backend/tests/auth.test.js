/**
 * Tests unitaires — Middleware Auth JWT
 * Couverture : 100% de la logique critique
 */

const jwt = require('jsonwebtoken');

// Mock de l'environnement
process.env.JWT_SECRET = 'test_secret_jest';

const authMiddleware = require('../src/middleware/auth');

describe('Middleware Auth', () => {
  let req, res, next;

  beforeEach(() => {
    req  = { headers: {} };
    res  = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();
  });

  test('Retourne 401 si aucun header Authorization', () => {
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentification requise' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Retourne 401 si header mal formé (sans Bearer)', () => {
    req.headers['authorization'] = 'token_sans_bearer';
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('Retourne 401 si token invalide', () => {
    req.headers['authorization'] = 'Bearer token_invalide_non_signe';
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide ou expiré' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Retourne 401 si token expiré', () => {
    const tokenExpire = jwt.sign(
      { id: 1, role: 'EMPLOYE' },
      'test_secret_jest',
      { expiresIn: '-1s' }
    );
    req.headers['authorization'] = `Bearer ${tokenExpire}`;
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('Appelle next() et injecte req.utilisateur avec un token valide', () => {
    const payload = { id: 5, email: 'test@novatech.fr', role: 'ADMIN' };
    const token = jwt.sign(payload, 'test_secret_jest', { expiresIn: '1h' });
    req.headers['authorization'] = `Bearer ${token}`;
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.utilisateur).toMatchObject({ id: 5, role: 'ADMIN' });
  });
});
