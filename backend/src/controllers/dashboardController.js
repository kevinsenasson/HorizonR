const pool = require('../config/db');

/**
 * GET /api/dashboard/stats
 * ADMIN uniquement
 */
async function getStats(req, res) {
  try {
    const [[totalEmployes]]   = await pool.query('SELECT COUNT(*) AS total FROM employes WHERE actif = 1');
    const [[congesEnAttente]] = await pool.query("SELECT COUNT(*) AS total FROM conges WHERE statut = 'EN_ATTENTE'");
    const [[congesValides]]   = await pool.query("SELECT COUNT(*) AS total FROM conges WHERE statut = 'VALIDE'");
    const [[congesRefuses]]   = await pool.query("SELECT COUNT(*) AS total FROM conges WHERE statut = 'REFUSE'");

    const [parService] = await pool.query(`
      SELECT s.nom AS service, COUNT(e.id) AS nb
      FROM employes e
      JOIN services s ON e.service_id = s.id
      WHERE e.actif = 1
      GROUP BY s.id, s.nom
      ORDER BY nb DESC`);

    const [parRole] = await pool.query(`
      SELECT r.nom AS role, COUNT(e.id) AS nb
      FROM employes e
      JOIN roles r ON e.role_id = r.id
      WHERE e.actif = 1
      GROUP BY r.id, r.nom`);

    const [congesParType] = await pool.query(`
      SELECT t.libelle AS type, COUNT(c.id) AS nb
      FROM conges c
      JOIN types_conges t ON c.type_conge_id = t.id
      GROUP BY t.id, t.libelle
      ORDER BY nb DESC`);

    const [congesParMois] = await pool.query(`
      SELECT DATE_FORMAT(date_debut, '%Y-%m') AS mois, COUNT(*) AS nb
      FROM conges
      WHERE statut = 'VALIDE' AND YEAR(date_debut) = YEAR(CURDATE())
      GROUP BY mois
      ORDER BY mois`);

    res.json({
      employes: {
        total:      totalEmployes.total,
        parService,
        parRole
      },
      conges: {
        enAttente: congesEnAttente.total,
        valides:   congesValides.total,
        refuses:   congesRefuses.total,
        parType:   congesParType,
        parMois:   congesParMois
      }
    });
  } catch (err) {
    console.error('Erreur getStats:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getStats };
