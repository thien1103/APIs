const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

router.get('/user/:userId',verifyToken, userController.GetUserInfo);
router.put('/user/:userId',verifyToken, userController.UpdateUserInfo)

module.exports = router;