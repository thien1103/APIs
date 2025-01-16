const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee/employeeController');
const verify = require('../middleware/verifyToken');

//user
router.get('/employee/info/:employeeId',verify.verifyToken, employeeController.GetEmployeeInfo);
router.get("/employee/info/avatar/:filename", employeeController.GetEmployeeAvatar);
router.put('/employee/info/update/:employeeId',verify.verifyToken, employeeController.UpdateEmployeeInfo);
router.put('/employee/info/changeAvatar/:employeeId', verify.verifyToken, employeeController.ChangeAvatar);


module.exports = router;