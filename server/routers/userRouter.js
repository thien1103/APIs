const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const verify = require('../middleware/verifyToken');

//user
router.get('/user/info/:userId',verify.verifyToken, userController.GetUserInfo);
router.get("/user/info/avatar/:filename", userController.GetUserAvatar);
router.put('/user/info/update/:userId',verify.verifyToken, userController.UpdateUserInfo);
router.put('/user/info/changeAvatar/:userId', verify.verifyToken, userController.ChangeAvatar);


module.exports = router;