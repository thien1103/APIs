const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser');
const Authentication = require('../controllers/authenticateController');

router.post('/signup', Authentication.SignUp);
router.post('/signin', Authentication.SignIn);
router.get('/signout', Authentication.logoutExecute);
router.get('/', verifyUser, Authentication.showVerifyUser);
router.post('/change-password', Authentication.ChangePassword);

module.exports = router;