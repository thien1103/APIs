const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const message = require("../controllers/messageController");

router.get("/messages/all", verifyToken, message.GetAllMessage);
router.get("/messages/:messageId", verifyToken, message.GetDetailedMessage);
router.post("/messages/add", verifyToken, message.SendMessage);
router.put("/messages/update/:messageId", verifyToken, message.UpdateMessage);
router.delete("/messages/delete/:messageId", verifyToken, message.DeleteMessage);

module.exports = router;