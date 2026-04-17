/**
 * profil.js — Page profil utilisateur
 */

Auth.requireAuth();

async function init() {
  try {
    const [profil, conges] = await Promise.all([Api.getProfil(), Api.getConges()]);
    renderProfil(profil);
    renderConges(conges.slice(0, 5));
    document.getElementById('solde-val').textContent = profil.solde_conges;
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderProfil(p) {
  document.getElementById('profil-infos').innerHTML = `
    <table style="width:100%;font-size:.9rem">
      <tr><td class="text-muted" style="padding:.4rem 0;width:40%">Nom complet</td>
          <td class="fw-600">${p.prenom} ${p.nom}</td></tr>
      <tr><td class="text-muted" style="padding:.4rem 0">Email</td>
          <td>${p.email}</td></tr>
      <tr><td class="text-muted" style="padding:.4rem 0">Téléphone</td>
          <td>${p.telephone || '—'}</td></tr>
      <tr><td class="text-muted" style="padding:.4rem 0">Poste</td>
          <td>${p.poste || '—'}</td></tr>
      <tr><td class="text-muted" style="padding:.4rem 0">Service</td>
          <td>${p.service || '—'}</td></tr>
      <tr><td class="text-muted" style="padding:.4rem 0">Manager</td>
          <td>${p.manager || '—'}</td></tr>
      <tr><td class="text-muted" style="padding:.4rem 0">Rôle</td>
          <td><span class="badge badge-info">${p.role}</span></td></tr>
      <tr><td class="text-muted" style="padding:.4rem 0">Embauche</td>
          <td>${p.date_embauche ? new Date(p.date_embauche).toLocaleDateString('fr-FR') : '—'}</td></tr>
    </table>
  `;
}

function renderConges(liste) {
  const tbody = document.getElementById('tbody-mes-conges');
  if (liste.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Aucune demande</td></tr>';
    return;
  }
  tbody.innerHTML = liste.map(c => {
    const map = { EN_ATTENTE: 'badge-pending', VALIDE: 'badge-success', REFUSE: 'badge-danger' };
    const label = { EN_ATTENTE: 'En attente', VALIDE: 'Validé', REFUSE: 'Refusé' };
    return `
      <tr>
        <td>${c.type_conge || '—'}</td>
        <td>${new Date(c.date_debut).toLocaleDateString('fr-FR')}</td>
        <td>${new Date(c.date_fin).toLocaleDateString('fr-FR')}</td>
        <td>${c.nb_jours} j</td>
        <td><span class="badge ${map[c.statut]}">${label[c.statut]}</span></td>
      </tr>
    `;
  }).join('');
}

// ---------- Changement MDP ----------
document.getElementById('form-mdp').addEventListener('submit', async (e) => {
  e.preventDefault();
  const ancien  = document.getElementById('mdp-ancien').value;
  const nouveau = document.getElementById('mdp-nouveau').value;
  const confirm_ = document.getElementById('mdp-confirm').value;

  if (nouveau !== confirm_) {
    showToast('Les mots de passe ne correspondent pas', 'warning'); return;
  }
  if (nouveau.length < 8) {
    showToast('Le mot de passe doit faire au moins 8 caractères', 'warning'); return;
  }

  try {
    await Api.changerMotDePasse({ ancien_mot_de_passe: ancien, nouveau_mot_de_passe: nouveau });
    showToast('Mot de passe mis à jour', 'success');
    e.target.reset();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

init();
