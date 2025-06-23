const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/support.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/', auth, upload.single('attachment'), ctrl.createTicket);
router.get('/my', auth, ctrl.getUserTickets);

// Admin Only Routes (protect with role check middleware if needed)
router.get('/', auth, ctrl.getAllTickets);
router.post('/:id/reply', auth, ctrl.replyTicket);
router.patch('/:id/status', auth, ctrl.updateTicketStatus);

module.exports = router;
