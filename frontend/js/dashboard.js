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

function renderCharts(s) {
  const palette = [
    '#2563eb','#16a34a','#d97706','#dc2626','#8b5cf6',
    '#0891b2','#db2777','#65a30d','#ea580c','#7c3aed'
  ];

  // 1. Effectifs par service (barres horizontales)
  new Chart(document.getElementById('chart-services'), {
    type: 'bar',
    data: {
      labels:   s.employes.parService.map(x => x.service),
      datasets: [{
        label:           'Employés',
        data:            s.employes.parService.map(x => x.nb),
        backgroundColor: palette,
        borderRadius:    4
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });

  // 2. Statut des congés (donut)
  new Chart(document.getElementById('chart-conges'), {
    type: 'doughnut',
    data: {
      labels:   ['En attente', 'Validés', 'Refusés'],
      datasets: [{
        data:            [s.conges.enAttente, s.conges.valides, s.conges.refuses],
        backgroundColor: ['#fbbf24', '#4ade80', '#f87171'],
        borderWidth:     2
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      },
      cutout: '60%'
    }
  });

  // 3. Types de congés (camembert)
  new Chart(document.getElementById('chart-types'), {
    type: 'pie',
    data: {
      labels:   s.conges.parType.map(x => x.type),
      datasets: [{
        data:            s.conges.parType.map(x => x.nb),
        backgroundColor: palette,
        borderWidth:     2
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // 4. Congés validés par mois (courbe)
  const moisLabels = s.conges.parMois.map(x => {
    const [year, month] = x.mois.split('-');
    return new Date(year, month - 1).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  });

  new Chart(document.getElementById('chart-mois'), {
    type: 'line',
    data: {
      labels:   moisLabels,
      datasets: [{
        label:           'Congés validés',
        data:            s.conges.parMois.map(x => x.nb),
        borderColor:     '#2563eb',
        backgroundColor: 'rgba(37,99,235,.1)',
        fill:            true,
        tension:         0.4,
        pointBackgroundColor: '#2563eb'
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

init();
