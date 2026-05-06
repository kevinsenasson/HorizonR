const request = require('supertest');
const app     = require('../../src/app');
const { loginAs, ADMIN_EMAIL, ADMIN_PASSWORD } = require('./helpers');

describe('Integration — Authentification', () => {

  // ── Santé ──────────────────────────────────────────────────────────────
  describe('GET /api/health', () => {
    it('200 — service en ligne', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'ok', app: 'HorizonR' });
    });
  });

  // ── Login ──────────────────────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('400 — corps vide (champs obligatoires manquants)', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.status).toBe(400);
    });

    it('401 — mot de passe incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: ADMIN_EMAIL, mot_de_passe: 'mauvais_mdp' });
      expect(res.status).toBe(401);
    });

    it('401 — email inexistant', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'inconnu@never.fr', mot_de_passe: 'quelconque' });
      expect(res.status).toBe(401);
    });

    it('200 — login admin réussi → token + utilisateur', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: ADMIN_EMAIL, mot_de_passe: ADMIN_PASSWORD });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
      expect(res.body.utilisateur).toMatchObject({
        email: ADMIN_EMAIL,
        role:  'ADMIN',
      });
    });
  });

  // ── Logout ─────────────────────────────────────────────────────────────
  describe('POST /api/auth/logout', () => {
    it('401 — sans token', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(401);
    });

    it('401 — token invalide', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer token_bidon');
      expect(res.status).toBe(401);
    });

    it('200 — logout avec token valide', async () => {
      const token = await loginAs(ADMIN_EMAIL, ADMIN_PASSWORD);
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });
});
