const express = require('express');
const { getProfil, changerMotDePasse } = require('../controllers/profilController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);
router.get('/',                getProfil);
router.put('/mot-de-passe',    changerMotDePasse);

module.exports = router;
