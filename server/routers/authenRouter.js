const express = require('express');
const router = express.Router();
const verify = require('../middleware/verifyToken');
const UserAuthentication = require('../controllers/user/authenticateController');
const EmployeeAuthentication = require('../controllers/employee/authenticateController')

//user
router.post('/user/signup', UserAuthentication.SignUp);
router.post('/user/signin', UserAuthentication.SignIn);
router.post('/user/signout',verify.verifyToken, UserAuthentication.logoutExecute);
// router.get('/', verifyToken, Authentication.showVerifyUser);
router.post('/user/changePassword',verify.verifyToken, UserAuthentication.ChangePassword);
router.get("/user/verify-email", UserAuthentication.VerifyEmail);

//employee
router.post('/employee/signin', EmployeeAuthentication.SignIn);
router.post('/employee/signout',verify.verifyToken, EmployeeAuthentication.logoutExecute);
// router.get('/', verifyToken, Authentication.showVerifyUser);
router.post('/employee/changePassword',verify.verifyToken, EmployeeAuthentication.ChangePassword);

module.exports = router;