/**
 * auth.js — Gestion de l'authentification JWT côté client
 * HorizonR — NovaTech Solutions
 */

const TOKEN_KEY = 'horizonr_token';
const USER_KEY  = 'horizonr_user';

const Auth = {
  /**
   * Stocke le token et les infos utilisateur après login
   */
  setSession(token, utilisateur) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(utilisateur));
  },

  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const raw = sessionStorage.getItem(USER_KEY);
    try { return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  },

  /**
   * Retourne le rôle de l'utilisateur connecté
   */
  getRole() {
    const u = Auth.getUser();
    return u ? u.role : null;
  },

  /**
   * Vérifie si l'utilisateur est connecté (token présent)
   */
  isLoggedIn() {
    return !!Auth.getToken();
  },

  /**
   * Supprime la session
   */
  logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.location.href = 'login.html';
  },

  /**
   * Redirige vers login si non connecté.
   * Appeler en haut de chaque page protégée.
   */
  requireAuth() {
    if (!Auth.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  },

  /**
   * Vérifie que l'utilisateur a l'un des rôles attendus.
   * Sinon redirige vers dashboard.
   */
  requireRole(...roles) {
    Auth.requireAuth();
    if (!roles.includes(Auth.getRole())) {
      window.location.href = 'conges.html';
    }
  }
};

// Applique le thème sauvegardé dès le chargement de la page
(function () {
  if (localStorage.getItem('horizonr_theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
