const express = require("express");
const router = express.Router();
const verify = require("../middleware/verifyToken");
const userMessage = require("../controllers/user/messageController");
const employeeMessage = require("../controllers/employee/messageController");


//user
router.get("user/messages/all/:name", verify.verifyToken, userMessage.GetAllMessage);
router.get("user/messages/:messageId", verify.verifyToken, userMessage.GetDetailedMessage);
router.post("user/messages/add", verify.verifyToken, userMessage.SendMessage);
router.put("user/messages/update/:messageId", verify.verifyToken, userMessage.UpdateMessage);
router.delete("user/messages/delete/:messageId", verify.verifyToken, userMessage.DeleteMessage);

//employee
router.get("employee/messages/all/:name", verify.verifyToken, employeeMessage.GetAllMessage);
router.get("employee/messages/:messageId", verify.verifyToken, employeeMessage.GetDetailedMessage);
router.post("employee/messages/add", verify.verifyToken, employeeMessage.SendMessage);
router.put("employee/messages/update/:messageId", verify.verifyToken, employeeMessage.UpdateMessage);
router.delete("employee/messages/delete/:messageId", verify.verifyToken, employeeMessage.DeleteMessage);


module.exports = router;