/**
 * Générateur de middleware RBAC.
 * Usage : role('ADMIN') ou role('ADMIN', 'MANAGER')
 */
function role(...rolesAutorises) {
  return (req, res, next) => {
    if (!req.utilisateur) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    if (!rolesAutorises.includes(req.utilisateur.role)) {
      return res.status(403).json({ error: 'Accès interdit — droits insuffisants' });
    }
    next();
  };
}

module.exports = role;
