const request = require('supertest');
const app     = require('../../src/app');

/** Authentifie un compte et retourne son JWT. */
async function loginAs(email, password) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, mot_de_passe: password });
  return res.body.token;
}

// Comptes de démonstration créés par seed.sql
const ADMIN_EMAIL    = 'admin@demo.fr';
const ADMIN_PASSWORD = 'admin123';
const MGR_EMAIL      = 'manager@demo.fr';
const MGR_PASSWORD   = 'manager123';
const EMP_EMAIL      = 'employe@demo.fr';
const EMP_PASSWORD   = 'employe123';

module.exports = {
  loginAs,
  ADMIN_EMAIL, ADMIN_PASSWORD,
  MGR_EMAIL,   MGR_PASSWORD,
  EMP_EMAIL,   EMP_PASSWORD,
};
