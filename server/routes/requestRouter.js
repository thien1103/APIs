const express = require('express');
const router = express.Router();
const requestRouter = require('../controllers/requestController');

router.get('/leave-requests', requestRouter.GetAllLeaveRequests);
router.post('/leave-requests', requestRouter.AddLeaveRequest);
router.put('/leave-requests/:requestId', requestRouter.UpdateLeaveRequest);
router.delete('/leave-requests/:requestId', requestRouter.DeleteLeaveRequest);

module.exports = router;