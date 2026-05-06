const service = require('../services/dashboardService');

async function getStats(req, res) {
  try {
    const data = await service.getStats();
    res.json(data);
  } catch (err) {
    console.error('Erreur getStats:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getStats };
