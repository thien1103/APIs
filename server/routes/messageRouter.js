const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const message = require("../controllers/messageController");

router.get("/messages/all", verifyToken, message.GetAllMessage);
router.get("/messages/:token", verifyToken, message.GetDetailedMessage);
router.post("/messages/send", verifyToken, message.SendMessage);
router.put("/messages/update/:token", verifyToken, message.UpdateMessage);
router.delete("/messages/delete/:token", verifyToken, message.DeleteMessage);

module.exports = router;