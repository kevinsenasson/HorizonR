const pool = require('../config/db');

/**
 * GET /api/planning
 * ADMIN : tout | MANAGER : son équipe | EMPLOYE : son planning
 */
async function listerPlanning(req, res) {
  try {
    const { role, id } = req.utilisateur;
    let query, params;

    if (role === 'ADMIN') {
      query = `
        SELECT p.id, p.titre, p.description, p.date_debut, p.date_fin, p.type,
               CONCAT(e.prenom,' ',e.nom) AS employe, e.id AS employe_id,
               s.nom AS service
        FROM planning p
        JOIN employes e ON p.employe_id = e.id
        LEFT JOIN services s ON e.service_id = s.id
        ORDER BY p.date_debut`;
      params = [];
    } else if (role === 'MANAGER') {
      query = `
        SELECT p.id, p.titre, p.description, p.date_debut, p.date_fin, p.type,
               CONCAT(e.prenom,' ',e.nom) AS employe, e.id AS employe_id
        FROM planning p
        JOIN employes e ON p.employe_id = e.id
        WHERE e.service_id = (SELECT service_id FROM employes WHERE id = ?)
        ORDER BY p.date_debut`;
      params = [id];
    } else {
      query = `
        SELECT p.id, p.titre, p.description, p.date_debut, p.date_fin, p.type
        FROM planning p
        WHERE p.employe_id = ?
        ORDER BY p.date_debut`;
      params = [id];
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerPlanning:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * POST /api/planning
 * ADMIN et MANAGER uniquement
 */
async function creerEvenement(req, res) {
  const { employe_id, titre, description, date_debut, date_fin, type } = req.body;

  if (!employe_id || !titre || !date_debut || !date_fin) {
    return res.status(400).json({ error: 'employe_id, titre, date_debut et date_fin sont obligatoires' });
  }

  // Un EMPLOYE ne peut créer que pour lui-même
  if (req.utilisateur.role === 'EMPLOYE' && parseInt(employe_id) !== req.utilisateur.id) {
    return res.status(403).json({ error: 'Vous ne pouvez créer des événements que pour vous-même' });
  }

  if (new Date(date_fin) < new Date(date_debut)) {
    return res.status(400).json({ error: 'La date de fin doit être postérieure à la date de début' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO planning (employe_id, titre, description, date_debut, date_fin, type, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [employe_id, titre, description || null, date_debut, date_fin,
       type || 'AUTRE', req.utilisateur.id]
    );
    res.status(201).json({ id: result.insertId, message: 'Événement créé' });
  } catch (err) {
    console.error('Erreur creerEvenement:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * DELETE /api/planning/:id
 * ADMIN et MANAGER uniquement
 */
async function supprimerEvenement(req, res) {
  const { id } = req.params;
  try {
    const [existing] = await pool.query('SELECT id, employe_id FROM planning WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Événement non trouvé' });

    // Un EMPLOYE ne peut supprimer que ses propres événements
    if (req.utilisateur.role === 'EMPLOYE' && existing[0].employe_id !== req.utilisateur.id) {
      return res.status(403).json({ error: 'Vous ne pouvez supprimer que vos propres événements' });
    }

    await pool.query('DELETE FROM planning WHERE id = ?', [id]);
    res.json({ message: 'Événement supprimé' });
  } catch (err) {
    console.error('Erreur supprimerEvenement:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { listerPlanning, creerEvenement, supprimerEvenement };
