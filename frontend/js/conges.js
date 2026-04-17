/**
 * conges.js — Gestion des congés (demande, liste, validation)
 */

Auth.requireAuth();

const role = Auth.getRole();
let conges      = [];
let typesConges = [];

const tbody          = document.getElementById('tbody-conges');
const modalConge     = document.getElementById('modal-conge');
const modalDecision  = document.getElementById('modal-decision');

// ---------- Utilitaires ----------
function badgeStatut(statut) {
  const map = {
    EN_ATTENTE: 'badge-pending',
    VALIDE:     'badge-success',
    REFUSE:     'badge-danger'
  };
  const label = { EN_ATTENTE: 'En attente', VALIDE: 'Validé', REFUSE: 'Refusé' };
  return `<span class="badge ${map[statut] || 'badge-secondary'}">${label[statut] || statut}</span>`;
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR');
}

// ---------- Chargement ----------
async function init() {
  try {
    [conges, typesConges] = await Promise.all([Api.getConges(), Api.getTypesConges()]);

    // Remplir select type dans modal
    const selType = document.getElementById('conge-type');
    selType.innerHTML = '';
    typesConges.forEach(t => {
      const o = document.createElement('option');
      o.value = t.id; o.textContent = t.libelle;
      selType.appendChild(o);
    });

    // Remplir filtre type
    const filtreType = document.getElementById('filtre-type');
    typesConges.forEach(t => {
      const o = document.createElement('option');
      o.value = t.libelle; o.textContent = t.libelle;
      filtreType.appendChild(o);
    });

    // Afficher/masquer colonne employé selon rôle
    if (role !== 'EMPLOYE') {
      document.getElementById('col-employe-header').classList.remove('hidden');
    }

    if (role === 'EMPLOYE') {
      document.getElementById('conges-subtitle').textContent = 'Mes demandes de congé';
    }

    renderTable(conges);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ---------- Rendu ----------
function renderTable(liste) {
  document.getElementById('nb-conges').textContent = `${liste.length} demande(s)`;
  if (liste.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Aucune demande</td></tr>';
    return;
  }

  tbody.innerHTML = liste.map(c => {
    const peutValider = (role === 'ADMIN' || role === 'MANAGER') && c.statut === 'EN_ATTENTE';
    const peutAnnuler = role === 'EMPLOYE' && c.statut === 'EN_ATTENTE';

    return `
      <tr>
        ${role !== 'EMPLOYE' ? `<td><div class="fw-600">${c.employe || '—'}</div></td>` : ''}
        <td>${c.type_conge || '—'}</td>
        <td>${formatDate(c.date_debut)}</td>
        <td>${formatDate(c.date_fin)}</td>
        <td>${c.nb_jours} j</td>
        <td class="text-small text-muted">${c.motif || '—'}</td>
        <td>${badgeStatut(c.statut)}</td>
        <td>
          <div class="gap-1">
            ${peutValider ? `<button class="btn btn-outline btn-sm" onclick="ouvrirDecision(${c.id})">Traiter</button>` : ''}
            ${peutAnnuler ? `<button class="btn btn-danger btn-sm" onclick="annuler(${c.id})">Annuler</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ---------- Filtres ----------
function appliquerFiltres() {
  const statut = document.getElementById('filtre-statut').value;
  const type   = document.getElementById('filtre-type').value;
  const filtre = conges.filter(c =>
    (!statut || c.statut === statut) &&
    (!type   || c.type_conge === type)
  );
  renderTable(filtre);
}

document.getElementById('filtre-statut').addEventListener('change', appliquerFiltres);
document.getElementById('filtre-type').  addEventListener('change', appliquerFiltres);

// ---------- Modal demande ----------
function fermerModalConge() { modalConge.classList.remove('open'); }

document.getElementById('btn-nouveau-conge').    addEventListener('click', () => modalConge.classList.add('open'));
document.getElementById('btn-fermer-modal-conge').addEventListener('click', fermerModalConge);
document.getElementById('btn-annuler-conge').     addEventListener('click', fermerModalConge);
modalConge.addEventListener('click', e => { if (e.target === modalConge) fermerModalConge(); });

// Calcul automatique jours ouvrés
function calcJoursOuvres(d1, d2) {
  let n = 0;
  const d = new Date(d1);
  const fin = new Date(d2);
  while (d <= fin) {
    const j = d.getDay();
    if (j !== 0 && j !== 6) n++;
    d.setDate(d.getDate() + 1);
  }
  return n;
}

['conge-debut', 'conge-fin'].forEach(id =>
  document.getElementById(id).addEventListener('change', () => {
    const d1 = document.getElementById('conge-debut').value;
    const d2 = document.getElementById('conge-fin').value;
    if (d1 && d2) {
      document.getElementById('nb-jours-calc').textContent =
        d2 >= d1 ? `${calcJoursOuvres(d1, d2)} jour(s)` : '—';
    }
  })
);

document.getElementById('btn-soumettre-conge').addEventListener('click', async () => {
  const payload = {
    type_conge_id: parseInt(document.getElementById('conge-type').value),
    date_debut:    document.getElementById('conge-debut').value,
    date_fin:      document.getElementById('conge-fin').value,
    motif:         document.getElementById('conge-motif').value || null
  };
  if (!payload.date_debut || !payload.date_fin) {
    showToast('Dates obligatoires', 'warning'); return;
  }
  try {
    await Api.demanderConge(payload);
    showToast('Demande soumise avec succès', 'success');
    fermerModalConge();
    await init();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// ---------- Modal décision (ADMIN/MANAGER) ----------
let decisionCongeId = null;

function ouvrirDecision(id) {
  const c = conges.find(x => x.id === id);
  if (!c) return;
  decisionCongeId = id;
  document.getElementById('decision-conge-id').value = id;
  document.getElementById('decision-recap').textContent =
    `${c.employe || 'Employé'} — ${c.type_conge} du ${formatDate(c.date_debut)} au ${formatDate(c.date_fin)} (${c.nb_jours} j)`;
  document.getElementById('decision-commentaire').value = '';
  modalDecision.classList.add('open');
}

function fermerModalDecision() { modalDecision.classList.remove('open'); }

document.getElementById('btn-fermer-modal-decision').addEventListener('click', fermerModalDecision);
document.getElementById('btn-fermer-decision').addEventListener('click', fermerModalDecision);
modalDecision.addEventListener('click', e => { if (e.target === modalDecision) fermerModalDecision(); });

async function traiterConge(decision) {
  const commentaire = document.getElementById('decision-commentaire').value;
  try {
    await Api.validerConge(decisionCongeId, { decision, commentaire_rh: commentaire || null });
    showToast(decision === 'VALIDE' ? 'Congé validé' : 'Congé refusé',
              decision === 'VALIDE' ? 'success' : 'warning');
    fermerModalDecision();
    await init();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.getElementById('btn-valider-conge'). addEventListener('click', () => traiterConge('VALIDE'));
document.getElementById('btn-refuser-conge'). addEventListener('click', () => traiterConge('REFUSE'));

// ---------- Annulation (EMPLOYE) ----------
async function annuler(id) {
  if (!confirm('Annuler cette demande ?')) return;
  try {
    await Api.annulerConge(id);
    showToast('Demande annulée', 'success');
    await init();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

init();
