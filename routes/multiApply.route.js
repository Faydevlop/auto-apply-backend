const express = require('express');
const router = express.Router();
const multiCtrl = require('../controllers/multiApply.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/send', auth, multiCtrl.sendMultiple);

module.exports = router;
