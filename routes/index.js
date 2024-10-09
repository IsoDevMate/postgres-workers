const express = require('express');
const authController = require('../controllers/authcoontroller');
const authMiddleware = require('../middlewares/authmiddleware');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.resetPassword);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
