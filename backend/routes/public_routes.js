const express           = require('express');
const authController    = require('../controllers/auth');
const userController    = require('../controllers/user');

// Public routes
const router = express.Router();
router.post('/register',            userController.createUser); 
router.post('/login',               authController.login);
router.post('/recover-password',    authController.recoverPassword);

module.exports = router;
