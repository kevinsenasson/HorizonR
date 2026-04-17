const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.use(auth);
router.get('/stats', role('ADMIN'), getStats);

module.exports = router;
