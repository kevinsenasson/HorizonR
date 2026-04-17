/**
 * dashboard.js — Dashboard ADMIN avec graphiques Chart.js
 */

Auth.requireRole('ADMIN');

async function init() {
  try {
    const stats = await Api.getDashboardStats();

    // Mettre à jour les notifications congés en attente
    const nb = stats.conges.enAttente;
    const badge = document.getElementById('notif-badge');
    if (nb > 0) { badge.textContent = nb; badge.classList.remove('hidden'); }

    renderKPI(stats);
    renderCharts(stats);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderKPI(s) {
  document.getElementById('kpi-employes').textContent = s.employes.total;
  document.getElementById('kpi-attente').textContent  = s.conges.enAttente;
  document.getElementById('kpi-valides').textContent  = s.conges.valides;
  document.getElementById('kpi-refuses').textContent  = s.conges.refuses;
}


document.addEventListener('DOMContentLoaded', init);
