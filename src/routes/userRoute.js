const express = require('express');
const router = express.Router();
const {loginUser,confirmRegistration, registerUser, forgotPassword, resetPassword, updateOwnerInfo, getOwnerInfo} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.route('/login').post(loginUser);
router.route('/register/confirm').post( confirmRegistration)
router.route('/register').post(registerUser)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.route("/update-owner-info").put(authMiddleware, updateOwnerInfo);
router.route("/get-owner-info").get(authMiddleware, getOwnerInfo);

module.exports = router;