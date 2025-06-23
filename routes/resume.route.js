const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const auth = require('../middlewares/auth.middleware');
const resumeCtrl = require('../controllers/resume.controller');

router.post('/upload', auth, upload.single('file'), resumeCtrl.uploadResume);
router.get('/', auth, resumeCtrl.getResume);

module.exports = router;
