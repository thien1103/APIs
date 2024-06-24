const express = require('express');
const router = express.Router();
const requestRouter = require('../controllers/requestController');
const verifyToken = require('../middleware/verifyToken');

router.get('/leave-requests',verifyToken, requestRouter.GetAllLeaveRequests);
router.post('/leave-requests',verifyToken, requestRouter.AddLeaveRequest);
router.put('/leave-requests/:requestId',verifyToken, requestRouter.UpdateLeaveRequest);
router.delete('/leave-requests/:requestId',verifyToken, requestRouter.DeleteLeaveRequest);

module.exports = router;