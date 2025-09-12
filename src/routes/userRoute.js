const express = require('express');
const router = express.Router();
const {loginUser,confirmRegistration, registerUser, forgotPassword, resetPassword} = require('../controllers/authController');

router.route('/login').post(loginUser);
router.route('/register/confirm').post( confirmRegistration)
router.route('/register').post(registerUser)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;