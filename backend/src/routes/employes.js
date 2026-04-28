const express = require('express');
const {
  listerEmployes, getEmploye, creerEmploye,
  modifierEmploye, supprimerEmploye, supprimerEmployeDefinitivement,
  listerServices, listerRoles
} = require('../controllers/employesController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.use(auth);

router.get('/services', listerServices);
router.get('/roles',    listerRoles);

router.get('/',      role('ADMIN', 'MANAGER'), listerEmployes);
router.get('/:id',   role('ADMIN', 'MANAGER'), getEmploye);
router.post('/',     role('ADMIN'),             creerEmploye);
router.put('/:id',   role('ADMIN'),             modifierEmploye);
router.delete('/:id',       role('ADMIN'), supprimerEmploye);
router.delete('/:id/force', role('ADMIN'), supprimerEmployeDefinitivement);

module.exports = router;
