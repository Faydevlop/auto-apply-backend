const express = require('express');
const router = express.Router();
const planCtrl = require('../controllers/plan.controller');
const admin = require('../middlewares/adminAuth.middleware'); // Only admin can create/edit/delete

router.post('/', admin, planCtrl.createPlan);
router.get('/', planCtrl.getAllPlans);
router.put('/:id', admin, planCtrl.updatePlan);
router.delete('/:id', admin, planCtrl.deletePlan);

module.exports = router;
