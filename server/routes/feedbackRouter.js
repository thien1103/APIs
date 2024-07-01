const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const feedbacks = require("../controllers/feedbackController");

router.get("/feedbacks/all", verifyToken, feedbacks.GetAllFeedBack);
router.get("/feedbacks/:feedbackId", verifyToken, feedbacks.GetDetailedFeedBack);
router.post("/feedbacks/create", verifyToken, feedbacks.CreateFeedBack);
router.put("/feedbacks/update/:feedbackId", verifyToken, feedbacks.UpdateFeedBack);
router.delete("/feedbacks/delete/:feedbackId", verifyToken, feedbacks.DeleteFeedBack);

module.exports = router;
