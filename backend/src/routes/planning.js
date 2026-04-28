const express = require('express');
const { listerPlanning, creerEvenement, supprimerEvenement } = require('../controllers/planningController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.use(auth);

router.get('/',       listerPlanning);
router.post('/',      creerEvenement);
router.delete('/:id', supprimerEvenement);

module.exports = router;
