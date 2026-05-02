const service = require('../services/congesService');

async function listerConges(req, res) {
  try {
    const { role, id } = req.utilisateur;
    const data = await service.listerConges(role, id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function demanderConge(req, res) {
  try {
    const result = await service.demanderConge(req.body, req.utilisateur);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function validerConge(req, res) {
  try {
    const result = await service.validerConge(
      req.params.id,
      req.body.decision,
      req.body.commentaire_rh,
      req.utilisateur
    );
    if (result.error === 'not found') return res.status(404).json({ error: result.error });
    if (result.error) return res.status(400).json({ error: result.error });
    res.json({ message: 'ok' });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function annulerConge(req, res) {
  try {
    const result = await service.annulerConge(req.params.id, req.utilisateur);
    if (result.error === 'not found') return res.status(404).json({ error: result.error });
    if (result.error) return res.status(400).json({ error: result.error });
    res.json({ message: 'deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function listerTypes(req, res) {
  const data = await service.listerTypes();
  res.json(data);
}

module.exports = {
  listerConges,
  demanderConge,
  validerConge,
  annulerConge,
  listerTypes
};