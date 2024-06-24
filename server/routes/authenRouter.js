const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Authentication = require('../controllers/authenticateController');

router.post('/signup', Authentication.SignUp);
router.post('/signin', Authentication.SignIn);
router.post('/signout',verifyToken, Authentication.logoutExecute);
// router.get('/', verifyToken, Authentication.showVerifyUser);
router.post('/change-password',verifyToken, Authentication.ChangePassword);

module.exports = router;