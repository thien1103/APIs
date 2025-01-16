const express = require('express');
const router = express.Router();
const notification = require('../controllers/notificationController');
const verify = require('../middleware/verifyToken');

router.get('/notifications',verify.verifyToken, notification.GetAllNotifications)

module.exports = router;
