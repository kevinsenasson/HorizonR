/**
 * planning.js — Affichage du planning hebdomadaire
 */

Auth.requireAuth();

const role = Auth.getRole();
let evenements  = [];
let employes    = [];
let semaineCour = new Date();

// Revenons au lundi de la semaine courante
function lundiDe(date) {
  const d = new Date(date);
  const diff = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0,0,0,0);
  return d;
}

function formatDateCourt(d) {
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

function classeType(type) {
  const map = {
    TELETRAVAIL: 'event-teletravail',
    DEPLACEMENT: 'event-deplacement',
    FORMATION:   'event-formation',
    REUNION:     'event-reunion',
    AUTRE:       'event-autre'
  };
  return map[type] || 'event-autre';
}

// ---------- Rendu planning ----------
function renderPlanning() {
  const lundi = lundiDe(semaineCour);
  const jours = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(lundi);
    d.setDate(lundi.getDate() + i);
    return d;
  });

  document.getElementById('label-semaine').textContent =
    `Semaine du ${jours[0].toLocaleDateString('fr-FR')} au ${jours[4].toLocaleDateString('fr-FR')}`;

  const container = document.getElementById('planning-container');

  // Colonnes par jour
  let html = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:1rem">';

  // En-têtes
  jours.forEach(j => {
    html += `<div class="planning-day-header">${formatDateCourt(j)}</div>`;
  });

  // Événements par jour
  jours.forEach(j => {
    const debutJour = new Date(j); debutJour.setHours(0,0,0,0);
    const finJour   = new Date(j); finJour.setHours(23,59,59,999);

    const evtsJour = evenements.filter(ev => {
      const d = new Date(ev.date_debut);
      return d >= debutJour && d <= finJour;
    });

    if (evtsJour.length === 0) {
      html += '<div style="min-height:60px;padding:4px;"></div>';
    } else {
      html += '<div style="min-height:60px;padding:4px;">';
      evtsJour.forEach(ev => {
        const libType = ev.type ? ev.type.charAt(0) + ev.type.slice(1).toLowerCase() : '';
        html += `
          <div class="planning-event ${classeType(ev.type)}" title="${ev.description || ev.titre}">
            ${role !== 'EMPLOYE' && ev.employe ? `<span class="fw-600">${ev.employe}</span> — ` : ''}
            ${ev.titre}
            ${ev.date_debut ? ` (${new Date(ev.date_debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})` : ''}
            ${role !== 'EMPLOYE' ? `<button class="btn btn-icon" style="font-size:.65rem;padding:0 .2rem;margin-left:.3rem;" onclick="supprimerEv(${ev.id})">✕</button>` : ''}
          </div>
        `;
      });
      html += '</div>';
    }
  });

  html += '</div>';
  container.innerHTML = html;
}

// ---------- Navigation ----------
document.getElementById('btn-semaine-prec').addEventListener('click', () => {
  semaineCour.setDate(semaineCour.getDate() - 7);
  renderPlanning();
});
document.getElementById('btn-semaine-suiv').addEventListener('click', () => {
  semaineCour.setDate(semaineCour.getDate() + 7);
  renderPlanning();
});

// ---------- Init ----------
async function init() {
  try {
    evenements = await Api.getPlanning();

    if (role === 'ADMIN' || role === 'MANAGER') {
      document.getElementById('btn-nouvel-event').classList.remove('hidden');
      employes = await Api.getEmployes();
      remplirSelectEmploye();
    }

    renderPlanning();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function remplirSelectEmploye() {
  const sel = document.getElementById('event-employe');
  sel.innerHTML = '';
  employes.forEach(e => {
    const o = document.createElement('option');
    o.value = e.id;
    o.textContent = `${e.prenom} ${e.nom}`;
    sel.appendChild(o);
  });
}

// ---------- Modal événement ----------
const modal = document.getElementById('modal-event');

document.getElementById('btn-nouvel-event').      addEventListener('click', () => modal.classList.add('open'));
document.getElementById('btn-fermer-modal-event').addEventListener('click', () => modal.classList.remove('open'));
document.getElementById('btn-annuler-event').     addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

document.getElementById('btn-sauvegarder-event').addEventListener('click', async () => {
  const payload = {
    employe_id:  parseInt(document.getElementById('event-employe').value),
    titre:       document.getElementById('event-titre').value,
    description: document.getElementById('event-description').value || null,
    date_debut:  document.getElementById('event-debut').value,
    date_fin:    document.getElementById('event-fin').value,
    type:        document.getElementById('event-type').value
  };
  if (!payload.titre || !payload.date_debut || !payload.date_fin) {
    showToast('Champs obligatoires manquants', 'warning'); return;
  }
  try {
    await Api.creerEvenement(payload);
    showToast('Événement créé', 'success');
    modal.classList.remove('open');
    evenements = await Api.getPlanning();
    renderPlanning();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// ---------- Suppression ----------
async function supprimerEv(id) {
  if (!confirm('Supprimer cet événement ?')) return;
  try {
    await Api.supprimerEvenement(id);
    showToast('Événement supprimé', 'success');
    evenements = await Api.getPlanning();
    renderPlanning();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

init();
