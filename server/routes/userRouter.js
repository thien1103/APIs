const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

router.get("/user/all", verifyToken, userController.GetAllUserInfo);
router.get('/user/:userId',verifyToken, userController.GetUserInfo);
router.get("/user/avatar/:filename", verifyToken, userController.GetUserAvatar);
router.put('/user/update/:userId',verifyToken, userController.UpdateUserInfo);
router.put('/user/changeAvatar/:userId', verifyToken, userController.ChangeAvatar);
router.post('/user/changePassword/:userId',verifyToken, userController.ChangePassword);


module.exports = router;