const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/user/:userId', userController.GetUserInfo);
router.put('/user/:userId', userController.UpdateUserInfo)

module.exports = router;