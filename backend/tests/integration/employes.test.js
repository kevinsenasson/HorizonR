const request = require('supertest');
const app  = require('../../src/app');
const pool = require('../../src/config/db');
const {
  loginAs,
  ADMIN_EMAIL, ADMIN_PASSWORD,
  MGR_EMAIL,   MGR_PASSWORD,
  EMP_EMAIL,   EMP_PASSWORD,
} = require('./helpers');

describe('Integration — Employés (CRUD)', () => {
  let adminToken, managerToken, employeToken;
  let createdId; // ID de l'employé créé pendant les tests

  beforeAll(async () => {
    adminToken   = await loginAs(ADMIN_EMAIL, ADMIN_PASSWORD);
    managerToken = await loginAs(MGR_EMAIL,   MGR_PASSWORD);
    employeToken = await loginAs(EMP_EMAIL,   EMP_PASSWORD);
  });

  afterAll(async () => {
    // Nettoyage : suppression physique de l'employé de test
    if (createdId) {
      await pool.query('DELETE FROM employes WHERE id = ?', [createdId]);
    }
  });

  // ── Accès non autorisé ─────────────────────────────────────────────────
  describe('GET /api/employes', () => {
    it('401 — sans token', async () => {
      const res = await request(app).get('/api/employes');
      expect(res.status).toBe(401);
    });

    it('403 — rôle EMPLOYE refusé', async () => {
      const res = await request(app)
        .get('/api/employes')
        .set('Authorization', `Bearer ${employeToken}`);
      expect(res.status).toBe(403);
    });

    it('200 — liste retournée pour ADMIN', async () => {
      const res = await request(app)
        .get('/api/employes')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('200 — liste retournée pour MANAGER (son service)', async () => {
      const res = await request(app)
        .get('/api/employes')
        .set('Authorization', `Bearer ${managerToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ── Création ───────────────────────────────────────────────────────────
  describe('POST /api/employes', () => {
    it('400 — champs obligatoires manquants', async () => {
      const res = await request(app)
        .post('/api/employes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nom: 'Incomplet' });
      expect(res.status).toBe(400);
    });

    it('400 — mot de passe trop faible', async () => {
      const res = await request(app)
        .post('/api/employes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nom: 'Test', prenom: 'Faible', email: 'faible@test.fr', mot_de_passe: '1234', role_id: 3 });
      expect(res.status).toBe(400);
    });

    it('403 — rôle MANAGER ne peut pas créer', async () => {
      const res = await request(app)
        .post('/api/employes')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ nom: 'Test', prenom: 'Mgr', email: 'mgr@test.fr', mot_de_passe: 'Test@2026', role_id: 3 });
      expect(res.status).toBe(403);
    });

    it('201 — création réussie (ADMIN)', async () => {
      const res = await request(app)
        .post('/api/employes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nom:          'Integ',
          prenom:       'Test',
          email:        'integ.test@novatech.fr',
          mot_de_passe: 'Integ@2026',
          role_id:      3,
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      createdId = res.body.id;
    });

    it('409 — email déjà utilisé', async () => {
      const res = await request(app)
        .post('/api/employes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nom:          'Doublon',
          prenom:       'Test',
          email:        'integ.test@novatech.fr',
          mot_de_passe: 'Integ@2026',
          role_id:      3,
        });
      expect(res.status).toBe(409);
    });
  });

  // ── Lecture unitaire ───────────────────────────────────────────────────
  describe('GET /api/employes/:id', () => {
    it('200 — employé trouvé', async () => {
      const res = await request(app)
        .get(`/api/employes/${createdId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ email: 'integ.test@novatech.fr' });
    });

    it('404 — id inexistant', async () => {
      const res = await request(app)
        .get('/api/employes/99999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  // ── Mise à jour ────────────────────────────────────────────────────────
  describe('PUT /api/employes/:id', () => {
    it('200 — modification réussie', async () => {
      const res = await request(app)
        .put(`/api/employes/${createdId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nom:    'Integ',
          prenom: 'Test',
          email:  'integ.test@novatech.fr',
          poste:  'Développeur Intégration',
          role_id: 3,
          actif:   1,
        });
      expect(res.status).toBe(200);
    });

    it('403 — MANAGER ne peut pas modifier', async () => {
      const res = await request(app)
        .put(`/api/employes/${createdId}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ poste: 'Tentative' });
      expect(res.status).toBe(403);
    });
  });

  // ── Désactivation ──────────────────────────────────────────────────────
  describe('DELETE /api/employes/:id', () => {
    it('200 — désactivation réussie (ADMIN)', async () => {
      const res = await request(app)
        .delete(`/api/employes/${createdId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });
  });
});
