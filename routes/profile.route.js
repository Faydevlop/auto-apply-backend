const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profile.controller');
const auth = require('../middlewares/auth.middleware');
const multer = require('multer');
const upload = require('../utils/upload');

router.get('/', auth, profileCtrl.getProfile);
router.put('/update', auth, profileCtrl.updateProfile);
router.put('/change-password', auth, profileCtrl.changePassword);
router.post('/resume', auth, upload.single('resume'), profileCtrl.uploadResume);
router.delete('/resume', auth, profileCtrl.deleteResume);


module.exports = router;
