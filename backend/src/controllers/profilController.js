const service = require('../services/profilService');

async function getProfil(req, res) {
  try {
    const result = await service.getProfil(req.utilisateur.id);
    if (result && result.error === 'not found') return res.status(404).json({ error: 'Profil non trouvé' });
    res.json(result);
  } catch (err) {
    console.error('Erreur getProfil:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function changerMotDePasse(req, res) {
  try {
    const result = await service.changerMotDePasse(req.utilisateur.id, req.body);
    if (result.error === 'missing fields') return res.status(400).json({ error: 'Ancien et nouveau mot de passe requis' });
    if (result.error === 'weak password')  return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&_-#)' });
    if (result.error === 'wrong password') return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
    res.json({ message: 'Mot de passe mis à jour' });
  } catch (err) {
    console.error('Erreur changerMotDePasse:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getProfil, changerMotDePasse };
