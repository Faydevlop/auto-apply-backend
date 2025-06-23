const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/template.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/user', ctrl.getTemplatesForUser);
router.get('/admin', auth, ctrl.getAllTemplates);

router.post('/', auth, ctrl.createTemplate);
router.patch('/:id/status', auth, ctrl.updateStatus);
router.put('/:id', auth, ctrl.editTemplate);
router.delete('/:id', auth, ctrl.deleteTemplate);

module.exports = router;
