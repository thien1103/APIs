const express = require('express');
const router = express.Router();
const notification = require('../controllers/notificationController')

router.get('/notifications', notification.GetAllNotifications)

module.exports = router;
