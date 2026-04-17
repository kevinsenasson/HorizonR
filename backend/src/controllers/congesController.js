const pool = require('../config/db');

/**
 * Calcule le nombre de jours ouvrés entre deux dates (lundi-vendredi)
 */
function calculerJoursOuvres(dateDebut, dateFin) {
  let jours = 0;
  const d = new Date(dateDebut);
  const fin = new Date(dateFin);
  while (d <= fin) {
    const jour = d.getDay();
    if (jour !== 0 && jour !== 6) jours++;
    d.setDate(d.getDate() + 1);
  }
  return jours;
}

/**
 * GET /api/conges
 * ADMIN : tous | MANAGER : son équipe + ses propres | EMPLOYE : ses propres
 */
async function listerConges(req, res) {
  try {
    let query, params;
    const { role, id } = req.utilisateur;

    if (role === 'ADMIN') {
      query = `
        SELECT c.id, c.date_debut, c.date_fin, c.nb_jours, c.motif, c.statut, c.commentaire_rh,
               CONCAT(e.prenom,' ',e.nom) AS employe, e.id AS employe_id,
               t.libelle AS type_conge, c.type_conge_id,
               CONCAT(v.prenom,' ',v.nom) AS valideur
        FROM conges c
        JOIN employes e ON c.employe_id = e.id
        JOIN types_conges t ON c.type_conge_id = t.id
        LEFT JOIN employes v ON c.valideur_id = v.id
        ORDER BY c.created_at DESC`;
      params = [];
    } else if (role === 'MANAGER') {
      query = `
        SELECT c.id, c.date_debut, c.date_fin, c.nb_jours, c.motif, c.statut, c.commentaire_rh,
               CONCAT(e.prenom,' ',e.nom) AS employe, e.id AS employe_id,
               t.libelle AS type_conge, c.type_conge_id,
               CONCAT(v.prenom,' ',v.nom) AS valideur
        FROM conges c
        JOIN employes e ON c.employe_id = e.id
        JOIN types_conges t ON c.type_conge_id = t.id
        LEFT JOIN employes v ON c.valideur_id = v.id
        WHERE e.manager_id = ? OR e.id = ?
        ORDER BY c.created_at DESC`;
      params = [id, id];
    } else {
      query = `
        SELECT c.id, c.date_debut, c.date_fin, c.nb_jours, c.motif, c.statut, c.commentaire_rh,
               t.libelle AS type_conge, c.type_conge_id
        FROM conges c
        JOIN types_conges t ON c.type_conge_id = t.id
        WHERE c.employe_id = ?
        ORDER BY c.created_at DESC`;
      params = [id];
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerConges:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * POST /api/conges
 * Tous les rôles peuvent créer une demande pour eux-mêmes
 */
async function demanderConge(req, res) {
  const { type_conge_id, date_debut, date_fin, motif } = req.body;
  const employe_id = req.utilisateur.id;

  if (!type_conge_id || !date_debut || !date_fin) {
    return res.status(400).json({ error: 'type_conge_id, date_debut et date_fin sont obligatoires' });
  }

  if (new Date(date_fin) < new Date(date_debut)) {
    return res.status(400).json({ error: 'La date de fin doit être postérieure à la date de début' });
  }

  const nb_jours = calculerJoursOuvres(date_debut, date_fin);
  if (nb_jours === 0) {
    return res.status(400).json({ error: 'Aucun jour ouvré dans la période sélectionnée' });
  }

  try {
    // Vérifier le solde disponible (types 1 et 2 = CP et RTT)
    const [soldeRows] = await pool.query('SELECT solde_conges FROM employes WHERE id = ?', [employe_id]);
    if (soldeRows[0].solde_conges < nb_jours && [1, 2].includes(parseInt(type_conge_id))) {
      return res.status(400).json({ error: `Solde insuffisant (${soldeRows[0].solde_conges} jours disponibles)` });
    }

    const [result] = await pool.query(
      `INSERT INTO conges (employe_id, type_conge_id, date_debut, date_fin, nb_jours, motif, statut)
       VALUES (?, ?, ?, ?, ?, ?, 'EN_ATTENTE')`,
      [employe_id, type_conge_id, date_debut, date_fin, nb_jours, motif || null]
    );
    res.status(201).json({ id: result.insertId, nb_jours, message: 'Demande de congé soumise' });
  } catch (err) {
    console.error('Erreur demanderConge:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * PUT /api/conges/:id/valider
 * ADMIN ou MANAGER — valide ou refuse un congé
 * Body : { decision: 'VALIDE'|'REFUSE', commentaire_rh? }
 */
async function validerConge(req, res) {
  const { id } = req.params;
  const { decision, commentaire_rh } = req.body;
  const valideurId = req.utilisateur.id;

  if (!['VALIDE', 'REFUSE'].includes(decision)) {
    return res.status(400).json({ error: 'La décision doit être VALIDE ou REFUSE' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT c.*, e.manager_id, e.solde_conges, e.id AS emp_id
       FROM conges c JOIN employes e ON c.employe_id = e.id
       WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Congé non trouvé' });

    const conge = rows[0];

    if (conge.statut !== 'EN_ATTENTE') {
      return res.status(400).json({ error: 'Ce congé a déjà été traité' });
    }

    // Un MANAGER ne peut valider que les congés de son équipe
    if (req.utilisateur.role === 'MANAGER' && conge.manager_id !== valideurId && conge.emp_id !== valideurId) {
      return res.status(403).json({ error: 'Vous ne pouvez valider que les congés de votre équipe' });
    }

    await pool.query(
      `UPDATE conges SET statut = ?, valideur_id = ?, commentaire_rh = ? WHERE id = ?`,
      [decision, valideurId, commentaire_rh || null, id]
    );

    // Déduire le solde si congé validé (CP ou RTT)
    if (decision === 'VALIDE' && [1, 2].includes(parseInt(conge.type_conge_id))) {
      await pool.query(
        'UPDATE employes SET solde_conges = GREATEST(0, solde_conges - ?) WHERE id = ?',
        [conge.nb_jours, conge.employe_id]
      );
    }

    res.json({ message: `Congé ${decision.toLowerCase()}` });
  } catch (err) {
    console.error('Erreur validerConge:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * DELETE /api/conges/:id
 * EMPLOYE peut annuler sa propre demande EN_ATTENTE
 */
async function annulerConge(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT employe_id, statut FROM conges WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Congé non trouvé' });

    const conge = rows[0];

    if (conge.employe_id !== req.utilisateur.id && req.utilisateur.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    if (conge.statut !== 'EN_ATTENTE') {
      return res.status(400).json({ error: 'Impossible d\'annuler un congé déjà traité' });
    }

    await pool.query('DELETE FROM conges WHERE id = ?', [id]);
    res.json({ message: 'Demande de congé annulée' });
  } catch (err) {
    console.error('Erreur annulerConge:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * GET /api/conges/types
 */
async function listerTypes(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, libelle FROM types_conges ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerTypes:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  listerConges,
  demanderConge,
  validerConge,
  annulerConge,
  listerTypes,
  calculerJoursOuvres
};
