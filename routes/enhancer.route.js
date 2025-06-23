const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/enhancer.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth, ctrl.enhanceEmail);

module.exports = router;
