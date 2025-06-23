const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


// Public routes
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/verify-otp', authCtrl.verifyOtp);
router.post('/reset-password', authCtrl.resetPassword);
router.post('/logout', authCtrl.logout);

// 🔐 Password-related routes
router.post('/change-password', authMiddleware, authCtrl.changePassword);  // Requires token
router.post('/send-password-reset-otp',authMiddleware, authCtrl.sendPasswordResetOtp);    // For forgot password
router.post('/verify-current-password', authMiddleware, authCtrl.verifyCurrentPassword);
router.post('/verify-reset-otp', authMiddleware, authCtrl.verifyResetOtp);  
module.exports = router;
