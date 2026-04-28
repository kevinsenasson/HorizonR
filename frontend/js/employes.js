/**
 * employes.js — Gestion CRUD des employés (ADMIN)
 */

Auth.requireRole('ADMIN');

let employes = [];
let services = [];
let roles    = [];
let editId   = null;

const tbody    = document.getElementById('tbody-employes');
const modal    = document.getElementById('modal-employe');
const formEmp  = document.getElementById('form-employe');

// ---------- Chargement initial ----------
async function init() {
  try {
    [employes, services, roles] = await Promise.all([
      Api.getEmployes(),
      Api.getServices(),
      Api.getRoles()
    ]);
    remplirFiltres();
    renderTable(employes);
    remplirSelectsModal();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function remplirFiltres() {
  const sel = document.getElementById('filtre-service');
  services.forEach(s => {
    const o = document.createElement('option');
    o.value = s.nom; o.textContent = s.nom;
    sel.appendChild(o);
  });
}

// ---------- Rendu tableau ----------
function renderTable(liste) {
  document.getElementById('nb-employes').textContent = `${liste.length} employé(s)`;
  if (liste.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Aucun résultat</td></tr>';
    return;
  }
  tbody.innerHTML = liste.map(e => `
    <tr>
      <td>
        <div class="fw-600">${e.prenom} ${e.nom}</div>
        <div class="text-small text-muted">${e.email}</div>
      </td>
      <td>${e.poste || '—'}</td>
      <td>${e.service || '—'}</td>
      <td><span class="badge badge-info">${e.role}</span></td>
      <td>${e.date_embauche ? new Date(e.date_embauche).toLocaleDateString('fr-FR') : '—'}</td>
      <td>${e.solde_conges} j</td>
      <td>
        <span class="badge ${e.actif ? 'badge-success' : 'badge-danger'}">
          ${e.actif ? 'Actif' : 'Inactif'}
        </span>
      </td>
      <td>
        <div class="gap-1">
          <button class="btn btn-outline btn-sm" onclick="ouvrirEdition(${e.id})">✏️</button>
          ${e.actif
            ? `<button class="btn btn-danger btn-sm" onclick="desactiver(${e.id})" title="Désactiver">🗑</button>`
            : `<button class="btn btn-danger btn-sm" onclick="supprimerDefinitivement(${e.id})" title="Supprimer définitivement">❌</button>`}
        </div>
      </td>
    </tr>
  `).join('');
}

// ---------- Filtres ----------
function appliquerFiltres() {
  const nom     = document.getElementById('filtre-nom').value.toLowerCase();
  const service = document.getElementById('filtre-service').value;
  const role    = document.getElementById('filtre-role').value;

  const filtre = employes.filter(e =>
    (!nom     || `${e.nom} ${e.prenom}`.toLowerCase().includes(nom)) &&
    (!service || e.service === service) &&
    (!role    || e.role === role)
  );
  renderTable(filtre);
}

document.getElementById('filtre-nom').     addEventListener('input', appliquerFiltres);
document.getElementById('filtre-service'). addEventListener('change', appliquerFiltres);
document.getElementById('filtre-role').    addEventListener('change', appliquerFiltres);

// ---------- Modal ----------
function remplirSelectsModal() {
  const selService = document.getElementById('emp-service');
  const selRole    = document.getElementById('emp-role');

  selService.innerHTML = '<option value="">— Aucun —</option>';
  services.forEach(s => {
    const o = document.createElement('option');
    o.value = s.id; o.textContent = s.nom;
    selService.appendChild(o);
  });

  selRole.innerHTML = '';
  roles.forEach(r => {
    const o = document.createElement('option');
    o.value = r.id; o.textContent = r.nom;
    selRole.appendChild(o);
  });
}

function ouvrirCreation() {
  editId = null;
  formEmp.reset();
  document.getElementById('employe-id').value = '';
  document.getElementById('modal-employe-titre').textContent = 'Nouvel employé';
  document.getElementById('group-mdp').style.display = '';
  document.getElementById('emp-mdp').required = true;
  modal.classList.add('open');
}

async function ouvrirEdition(id) {
  try {
    const e = await Api.getEmploye(id);
    editId = id;
    document.getElementById('modal-employe-titre').textContent = 'Modifier l\'employé';
    document.getElementById('employe-id').value     = e.id;
    document.getElementById('emp-nom').value        = e.nom;
    document.getElementById('emp-prenom').value     = e.prenom;
    document.getElementById('emp-email').value      = e.email;
    document.getElementById('emp-telephone').value  = e.telephone || '';
    document.getElementById('emp-poste').value      = e.poste || '';
    document.getElementById('emp-date-embauche').value = e.date_embauche
      ? e.date_embauche.substr(0, 10) : '';
    document.getElementById('emp-solde').value      = e.solde_conges;
    document.getElementById('emp-service').value    = e.service_id || '';
    document.getElementById('emp-role').value       = e.role_id;
    // Cacher le champ MDP en édition
    document.getElementById('group-mdp').style.display = 'none';
    document.getElementById('emp-mdp').required = false;
    modal.classList.add('open');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function fermerModal() {
  modal.classList.remove('open');
  formEmp.reset();
}

document.getElementById('btn-nouvel-employe').  addEventListener('click', ouvrirCreation);
document.getElementById('btn-fermer-modal').    addEventListener('click', fermerModal);
document.getElementById('btn-annuler-modal').   addEventListener('click', fermerModal);
modal.addEventListener('click', e => { if (e.target === modal) fermerModal(); });

// ---------- Sauvegarde ----------
document.getElementById('btn-sauvegarder-employe').addEventListener('click', async () => {
  const payload = {
    nom:           document.getElementById('emp-nom').value,
    prenom:        document.getElementById('emp-prenom').value,
    email:         document.getElementById('emp-email').value,
    telephone:     document.getElementById('emp-telephone').value || null,
    poste:         document.getElementById('emp-poste').value || null,
    date_embauche: document.getElementById('emp-date-embauche').value || null,
    solde_conges:  parseFloat(document.getElementById('emp-solde').value),
    role_id:       parseInt(document.getElementById('emp-role').value),
    service_id:    parseInt(document.getElementById('emp-service').value) || null,
    actif:         1
  };
  if (!editId) {
    const mdp = document.getElementById('emp-mdp').value;
    const regexMdp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;
    if (!regexMdp.test(mdp)) {
      showToast('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&_-#)', 'warning');
      return;
    }
    payload.mot_de_passe = mdp;
  }

  try {
    if (editId) {
      await Api.modifierEmploye(editId, payload);
      showToast('Employé mis à jour', 'success');
    } else {
      await Api.creerEmploye(payload);
      showToast('Employé créé', 'success');
    }
    fermerModal();
    await init();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// ---------- Désactivation ----------
async function desactiver(id) {
  if (!confirm('Désactiver cet employé ?')) return;
  try {
    await Api.supprimerEmploye(id);
    showToast('Employé désactivé', 'success');
    await init();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ---------- Suppression définitive ----------
async function supprimerDefinitivement(id) {
  if (!confirm('Supprimer définitivement cet employé ? Cette action est irréversible.')) return;
  try {
    await Api.supprimerEmployeDefinitivement(id);
    showToast('Employé supprimé définitivement', 'success');
    await init();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

init();
