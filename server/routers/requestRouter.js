const express = require('express');
const router = express.Router();
const userRequestRouter = require('../controllers/user/requestController');
const employeeRequestRouter = require('../controllers/employee/requestController');

const verify = require('../middleware/verifyToken');

//user
router.get('/user/leave-requests/detail/:requestId',verify.verifyToken, userRequestRouter.GetDetailedLeaveRequest);
router.get('/user/leave-requests/:userId',verify.verifyToken, userRequestRouter.GetAllLeaveRequestsForUser);
router.post('/user/leave-requests/add',verify.verifyToken, userRequestRouter.AddLeaveRequest);
router.put('/user/leave-requests/update/:requestId',verify.verifyToken, userRequestRouter.UpdateLeaveRequest);
router.delete('/user/leave-requests/delete/:requestId',verify.verifyToken, userRequestRouter.DeleteLeaveRequest);

//employee 
router.post('/employee/leave-requests/all',verify.verifyToken, employeeRequestRouter.GetAllLeaveRequestsOnClassForTeacher);
router.get('/employee/leave-requests/:requestId',verify.verifyToken, employeeRequestRouter.GetDetailedLeaveRequest);


module.exports = router;