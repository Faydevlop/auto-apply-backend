// routes/email.route.js
const express = require('express');
const router = express.Router();
const emailCtrl = require('../controllers/email.controller');
const auth = require('../middlewares/auth.middleware');
const limit = require('../middlewares/limit.middleware');

router.post('/send', auth, limit, emailCtrl.sendJobApplication);

module.exports = router;
