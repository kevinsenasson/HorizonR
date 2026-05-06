const service = require('../services/planningService');

async function listerPlanning(req, res) {
  try {
    const rows = await service.listerPlanning(req.utilisateur.role, req.utilisateur.id);
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerPlanning:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function creerEvenement(req, res) {
  try {
    const result = await service.creerEvenement(req.body, req.utilisateur);
    if (result.error === 'missing fields') return res.status(400).json({ error: 'employe_id, titre, date_debut et date_fin sont obligatoires' });
    if (result.error === 'forbidden')      return res.status(403).json({ error: 'Vous ne pouvez créer des événements que pour vous-même' });
    if (result.error === 'invalid dates')  return res.status(400).json({ error: 'La date de fin doit être postérieure à la date de début' });
    res.status(201).json({ id: result.id, message: 'Événement créé' });
  } catch (err) {
    console.error('Erreur creerEvenement:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function supprimerEvenement(req, res) {
  try {
    const result = await service.supprimerEvenement(req.params.id, req.utilisateur);
    if (result.error === 'not found') return res.status(404).json({ error: 'Événement non trouvé' });
    if (result.error === 'forbidden') return res.status(403).json({ error: 'Vous ne pouvez supprimer que vos propres événements' });
    res.json({ message: 'Événement supprimé' });
  } catch (err) {
    console.error('Erreur supprimerEvenement:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { listerPlanning, creerEvenement, supprimerEvenement };
