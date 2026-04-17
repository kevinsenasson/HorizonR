const express = require('express');
const {
  listerConges, demanderConge,
  validerConge, annulerConge, listerTypes
} = require('../controllers/congesController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.use(auth);

router.get('/types', listerTypes);
router.get('/',     listerConges);
router.post('/',    demanderConge);
router.put('/:id/valider', role('ADMIN', 'MANAGER'), validerConge);
router.delete('/:id',      annulerConge);

module.exports = router;
