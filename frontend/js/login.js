/**
 * login.js — Gestion du formulaire de connexion
 */

// ── Comptes de démo : clic → remplissage automatique ──────────────────────
document.querySelectorAll('.demo-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.getElementById('email').value    = card.dataset.email;
    document.getElementById('password').value = card.dataset.password;
    document.getElementById('email').focus();
  });
});
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btnLogin = document.getElementById('btn-login');
  const errEl    = document.getElementById('login-error');

  errEl.style.display = 'none';
  btnLogin.textContent = 'Connexion…';
  btnLogin.disabled = true;

  try {
    const data = await Api.login(email, password);
    Auth.setSession(data.token, data.utilisateur);

    // Redirection selon rôle
    const role = data.utilisateur.role;
    if (role === 'ADMIN') {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'conges.html';
    }
  } catch (err) {
    errEl.textContent = err.message || 'Identifiants incorrects';
    errEl.style.display = 'block';
    btnLogin.textContent = 'Se connecter';
    btnLogin.disabled = false;
  }
});
