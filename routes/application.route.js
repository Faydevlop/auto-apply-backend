const express = require('express');
const router = express.Router();
const appCtrl = require('../controllers/application.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth, appCtrl.addApplication); // single or bulk
router.get('/history', auth, appCtrl.getHistory);
router.get('/stats', auth, appCtrl.getStats);
// Add application
router.post('/send', auth, appCtrl.sendApplication);
// Get user's application history
router.get('/history', auth, appCtrl.getMyApplications);
// Update application response
router.put('/response/:id', auth, appCtrl.updateResponse);

router.post('/create', auth, appCtrl.createApplication);
router.get('/', auth, appCtrl.getMyApplications);
router.post('/send-bulk', auth, appCtrl.sendBulkApplications);

module.exports = router;
