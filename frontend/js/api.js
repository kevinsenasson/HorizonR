/**
 * api.js — Wrapper fetch centralisé vers l'API HorizonR
 */

const API_BASE = '/api';

const Api = {
  /**
   * Requête générique
   */
  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = Auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${path}`, opts);

    if (res.status === 401) {
      Auth.logout();
      return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `Erreur ${res.status}`);
    }

    return data;
  },

  get:    (path)        => Api.request('GET',    path),
  post:   (path, body)  => Api.request('POST',   path, body),
  put:    (path, body)  => Api.request('PUT',    path, body),
  delete: (path)        => Api.request('DELETE', path),

  // --- Auth ---
  login: (email, mot_de_passe) => Api.post('/auth/login', { email, mot_de_passe }),

  // --- Employés ---
  getEmployes:     ()      => Api.get('/employes'),
  getEmploye:      (id)    => Api.get(`/employes/${id}`),
  creerEmploye:    (data)  => Api.post('/employes', data),
  modifierEmploye: (id, d) => Api.put(`/employes/${id}`, d),
  supprimerEmploye:(id)    => Api.delete(`/employes/${id}`),
  getServices:     ()      => Api.get('/employes/services'),
  getRoles:        ()      => Api.get('/employes/roles'),

  // --- Congés ---
  getConges:     ()           => Api.get('/conges'),
  getTypesConges:()           => Api.get('/conges/types'),
  demanderConge: (data)       => Api.post('/conges', data),
  validerConge:  (id, data)   => Api.put(`/conges/${id}/valider`, data),
  annulerConge:  (id)         => Api.delete(`/conges/${id}`),

  // --- Planning ---
  getPlanning:       ()       => Api.get('/planning'),
  creerEvenement:    (data)   => Api.post('/planning', data),
  supprimerEvenement:(id)     => Api.delete(`/planning/${id}`),

  // --- Dashboard ---
  getDashboardStats: ()       => Api.get('/dashboard/stats'),

  // --- Profil ---
  getProfil:          ()      => Api.get('/profil'),
  changerMotDePasse: (data)   => Api.put('/profil/mot-de-passe', data),
};
