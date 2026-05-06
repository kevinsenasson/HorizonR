const request = require('supertest');
const app  = require('../../src/app');
const pool = require('../../src/config/db');
const {
  loginAs,
  ADMIN_EMAIL, ADMIN_PASSWORD,
  EMP_EMAIL,   EMP_PASSWORD,
} = require('./helpers');

describe('Integration — Congés', () => {
  let adminToken, employeToken;
  let createdCongeId;

  beforeAll(async () => {
    adminToken   = await loginAs(ADMIN_EMAIL, ADMIN_PASSWORD);
    employeToken = await loginAs(EMP_EMAIL,   EMP_PASSWORD);
  });

  afterAll(async () => {
    if (createdCongeId) {
      await pool.query('DELETE FROM conges WHERE id = ?', [createdCongeId]);
    }
  });

  // ── Référentiel types ──────────────────────────────────────────────────
  describe('GET /api/conges/types', () => {
    it('200 — liste des types de congés', async () => {
      const res = await request(app)
        .get('/api/conges/types')
        .set('Authorization', `Bearer ${employeToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // ── Lecture ────────────────────────────────────────────────────────────
  describe('GET /api/conges', () => {
    it('401 — sans token', async () => {
      const res = await request(app).get('/api/conges');
      expect(res.status).toBe(401);
    });

    it('200 — liste des congés (EMPLOYE)', async () => {
      const res = await request(app)
        .get('/api/conges')
        .set('Authorization', `Bearer ${employeToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('200 — liste complète (ADMIN)', async () => {
      const res = await request(app)
        .get('/api/conges')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ── Demande ────────────────────────────────────────────────────────────
  describe('POST /api/conges', () => {
    it('400 — solde insuffisant (période trop longue)', async () => {
      // ~153 jours ouvrés >> 25 jours de solde → rejeté
      const res = await request(app)
        .post('/api/conges')
        .set('Authorization', `Bearer ${employeToken}`)
        .send({ type_conge_id: 1, date_debut: '2026-06-01', date_fin: '2026-12-31', motif: 'Test' });
      expect(res.status).toBe(400);
    });

    it('201 — demande créée avec succès', async () => {
      // 3 jours ouvrés (lun–mer), bien en dessous du solde de 25 j
      const res = await request(app)
        .post('/api/conges')
        .set('Authorization', `Bearer ${employeToken}`)
        .send({ type_conge_id: 1, date_debut: '2026-08-03', date_fin: '2026-08-05', motif: 'Test intégration' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('nb_jours');
      createdCongeId = res.body.id;
    });
  });

  // ── Annulation ─────────────────────────────────────────────────────────
  describe('DELETE /api/conges/:id', () => {
    it('200 — annulation réussie', async () => {
      const res = await request(app)
        .delete(`/api/conges/${createdCongeId}`)
        .set('Authorization', `Bearer ${employeToken}`);
      expect(res.status).toBe(200);
    });

    it('404 — congé inexistant', async () => {
      const res = await request(app)
        .delete('/api/conges/99999')
        .set('Authorization', `Bearer ${employeToken}`);
      expect(res.status).toBe(404);
    });
  });
});
