const authService = require('../services/authService');

async function login(req, res) {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const result = await authService.login(email, mot_de_passe);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    res.json(result.data);
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

function logout(_req, res) {
  res.json({ message: 'Déconnexion réussie' });
}

module.exports = { login, logout };