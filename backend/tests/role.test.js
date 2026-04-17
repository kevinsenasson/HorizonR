/**
 * Tests unitaires — Middleware RBAC (role)
 * Couverture : 100% de la logique critique
 */

const roleMiddleware = require('../src/middleware/role');

describe('Middleware Role (RBAC)', () => {
  let res, next;

  beforeEach(() => {
    res  = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('Retourne 401 si req.utilisateur absent', () => {
    const req = {};
    roleMiddleware('ADMIN')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('Retourne 403 si rôle non autorisé', () => {
    const req = { utilisateur: { role: 'EMPLOYE' } };
    roleMiddleware('ADMIN')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('Appelle next() si rôle autorisé (1 rôle)', () => {
    const req = { utilisateur: { role: 'ADMIN' } };
    roleMiddleware('ADMIN')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Appelle next() si le rôle est dans la liste multi-rôles', () => {
    const req = { utilisateur: { role: 'MANAGER' } };
    roleMiddleware('ADMIN', 'MANAGER')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Retourne 403 si rôle pas dans la liste multi-rôles', () => {
    const req = { utilisateur: { role: 'EMPLOYE' } };
    roleMiddleware('ADMIN', 'MANAGER')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
