const express = require('express');
const { listerPlanning, creerEvenement, supprimerEvenement } = require('../controllers/planningController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.use(auth);

router.get('/',      listerPlanning);
router.post('/',     role('ADMIN', 'MANAGER'), creerEvenement);
router.delete('/:id',role('ADMIN', 'MANAGER'), supprimerEvenement);

module.exports = router;
