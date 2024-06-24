const express = require('express');
const router = express.Router();
const notification = require('../controllers/notificationController');
const verifyToken = require('../middleware/verifyToken');

router.get('/notifications',verifyToken, notification.GetAllNotifications)

module.exports = router;
