const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const message = require("../controllers/messageController");
const { DeleteMessage } = require("../controllers/messageController");

router.get("/message/all", verifyToken, message.GetAllMessage);
router.get("/message/:token", verifyToken, message.GetDetailedMessage);
router.post("/message/send", verifyToken, message.SendMessage);
router.put("/message/update/:token", verifyToken, message.UpdateMessage);
router.delete("/message/delete/:token", verifyToken, message.DeleteMessage);

module.exports = router;