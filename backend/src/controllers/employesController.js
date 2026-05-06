const service = require('../services/employesService');

async function listerEmployes(req, res) {
  try {
    const rows = await service.listerEmployes(req.utilisateur.role, req.utilisateur.id);
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerEmployes:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function getEmploye(req, res) {
  try {
    const result = await service.getEmploye(req.params.id);
    if (result && result.error === 'not found') return res.status(404).json({ error: 'Employé non trouvé' });
    res.json(result);
  } catch (err) {
    console.error('Erreur getEmploye:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function creerEmploye(req, res) {
  try {
    const result = await service.creerEmploye(req.body);
    if (result.error === 'missing fields') return res.status(400).json({ error: 'Champs obligatoires manquants (nom, prenom, email, mot_de_passe, role_id)' });
    if (result.error === 'weak password')  return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&_-#)' });
    if (result.error === 'duplicate email') return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    res.status(201).json({ id: result.id, message: 'Employé créé avec succès' });
  } catch (err) {
    console.error('Erreur creerEmploye:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function modifierEmploye(req, res) {
  try {
    const result = await service.modifierEmploye(req.params.id, req.body);
    if (result.error === 'not found')       return res.status(404).json({ error: 'Employé non trouvé' });
    if (result.error === 'duplicate email') return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    res.json({ message: 'Employé mis à jour' });
  } catch (err) {
    console.error('Erreur modifierEmploye:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function supprimerEmploye(req, res) {
  try {
    const result = await service.supprimerEmploye(req.params.id, req.utilisateur.id);
    if (result.error === 'self delete') return res.status(400).json({ error: 'Impossible de désactiver votre propre compte' });
    if (result.error === 'not found')   return res.status(404).json({ error: 'Employé non trouvé' });
    res.json({ message: 'Employé désactivé' });
  } catch (err) {
    console.error('Erreur supprimerEmploye:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function listerEmployesService(req, res) {
  try {
    const rows = await service.listerEmployesService(req.utilisateur.id);
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerEmployesService:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function listerServices(req, res) {
  try {
    const rows = await service.listerServices();
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerServices:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function listerRoles(req, res) {
  try {
    const rows = await service.listerRoles();
    res.json(rows);
  } catch (err) {
    console.error('Erreur listerRoles:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function supprimerEmployeDefinitivement(req, res) {
  try {
    const result = await service.supprimerEmployeDefinitivement(req.params.id, req.utilisateur.id);
    if (result.error === 'self delete')   return res.status(400).json({ error: 'Impossible de supprimer votre propre compte' });
    if (result.error === 'not found')     return res.status(404).json({ error: 'Employé non trouvé' });
    if (result.error === 'still active')  return res.status(400).json({ error: 'Désactiver l\'employé avant de le supprimer définitivement' });
    res.json({ message: 'Employé supprimé définitivement' });
  } catch (err) {
    console.error('Erreur supprimerEmployeDefinitivement:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  listerEmployes,
  getEmploye,
  creerEmploye,
  modifierEmploye,
  supprimerEmploye,
  supprimerEmployeDefinitivement,
  listerEmployesService,
  listerServices,
  listerRoles
};
