const express = require('express');
const router = express.Router();
const requestRouter = require('../controllers/requestController');
const verifyToken = require('../middleware/verifyToken');

router.get('/leave-requests',verifyToken, requestRouter.GetAllLeaveRequests);
router.post('/leave-requests/add',verifyToken, requestRouter.AddLeaveRequest);
router.put('/leave-requests/update/:requestId',verifyToken, requestRouter.UpdateLeaveRequest);
router.delete('/leave-requests/delete/:requestId',verifyToken, requestRouter.DeleteLeaveRequest);

module.exports = router;