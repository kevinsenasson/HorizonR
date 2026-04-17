const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'horizonr_dev_secret';

/**
 * Vérifie le token JWT dans le header Authorization.
 * Si valide, injecte req.utilisateur = { id, email, role }.
 */
function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.utilisateur = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

module.exports = authMiddleware;
