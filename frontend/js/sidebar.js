/**
 * sidebar.js — Génère la sidebar dynamiquement selon le rôle
 */

Auth.requireAuth();

(function buildSidebar() {
  const user = Auth.getUser();
  const role = user ? user.role : '';

  const navAdmin = `
    <p class="nav-section-label">Administration</p>
    <a class="nav-item" href="employes.html" data-page="employes">
      <span class="nav-icon">👥</span> Employés
    </a>
  `;

  const navManagerConges = `
    <p class="nav-section-label">Équipe</p>
    <a class="nav-item" href="conges.html" data-page="conges">
      <span class="nav-icon">📋</span> Congés
    </a>
    <a class="nav-item" href="planning.html" data-page="planning">
      <span class="nav-icon">📅</span> Planning
    </a>
  `;

  const navEmploye = `
    <p class="nav-section-label">Mon espace</p>
    <a class="nav-item" href="conges.html" data-page="conges">
      <span class="nav-icon">📋</span> Mes congés
    </a>
    <a class="nav-item" href="planning.html" data-page="planning">
      <span class="nav-icon">📅</span> Mon planning
    </a>
    <a class="nav-item" href="profil.html" data-page="profil">
      <span class="nav-icon">👤</span> Mon profil
    </a>
  `;

  let nav = '';
  if (role === 'ADMIN') {
    nav = `
      <p class="nav-section-label">Tableau de bord</p>
      <a class="nav-item" href="dashboard.html" data-page="dashboard">
        <span class="nav-icon">📊</span> Dashboard
      </a>
      ${navAdmin}
      ${navManagerConges}
      <p class="nav-section-label">Mon espace</p>
      <a class="nav-item" href="profil.html" data-page="profil">
        <span class="nav-icon">👤</span> Mon profil
      </a>
    `;
  } else if (role === 'MANAGER') {
    nav = `${navManagerConges}
      <a class="nav-item" href="profil.html" data-page="profil">
        <span class="nav-icon">👤</span> Mon profil
      </a>
    `;
  } else {
    nav = navEmploye;
  }

  // Initiales pour l'avatar
  const initiales = user
    ? (user.prenom[0] + user.nom[0]).toUpperCase()
    : '?';

  const html = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">H</div>
        <div>
          <div class="logo-text">HorizonR</div>
          <span class="logo-sub">NovaTech Solutions</span>
        </div>
      </div>
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-footer">
        <button class="btn btn-outline btn-sm w-full mb-1" id="btn-theme" style="justify-content:center;gap:0.5rem;">
          <span id="theme-icon">🌙</span>
          <span id="theme-label">Mode sombre</span>
        </button>
        <div class="user-card" id="btn-logout" title="Se déconnecter">
          <div class="user-avatar">${initiales}</div>
          <div class="user-info">
            <div class="user-name">${user ? user.prenom + ' ' + user.nom : ''}</div>
            <div class="user-role">${role}</div>
          </div>
          <span title="Déconnexion">⏻</span>
        </div>
      </div>
    </aside>
  `;

  const container = document.getElementById('sidebar-container');
  if (container) container.innerHTML = html;

  // Marquer le lien actif
  const page = window.location.pathname.split('/').pop().replace('.html', '');
  document.querySelectorAll('.nav-item').forEach(a => {
    if (a.dataset.page === page) a.classList.add('active');
  });

  // Déconnexion
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    if (confirm('Voulez-vous vous déconnecter ?')) Auth.logout();
  });

  // Toggle mode sombre
  const btnTheme   = document.getElementById('btn-theme');
  const themeIcon  = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  function applyTheme(dark) {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('horizonr_theme', 'dark');
      themeIcon.textContent  = '☀️';
      themeLabel.textContent = 'Mode clair';
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('horizonr_theme', 'light');
      themeIcon.textContent  = '🌙';
      themeLabel.textContent = 'Mode sombre';
    }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }));
  }

  // Sync bouton avec l'état actuel
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark');

  btnTheme?.addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
  });
})();
