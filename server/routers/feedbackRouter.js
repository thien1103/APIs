const express = require("express");
const router = express.Router();
const verify = require("../middleware/verifyToken");
const userFeedBacks = require("../controllers/user/feedbackController");
const employeeFeedBacks = require("../controllers/employee/feedbackController");


//user
router.post("/user/feedbacks/all", verify.verifyToken, userFeedBacks.GetAllFeedBackCreated);
router.get("/user/feedbacks/:feedbackId", verify.verifyToken, userFeedBacks.GetDetailedFeedBackCreated);
router.post("/user/feedbacks/add", verify.verifyToken, userFeedBacks.CreateFeedBack);


//employee
router.post("/employee/feedbacks/all", verify.verifyToken, employeeFeedBacks.GetAllFeedBackFromParent);
router.get("/employee/feedbacks/:feedbackId", verify.verifyToken, employeeFeedBacks.GetDetailedFeedBackFromParent);
// router.post("/feedbacks/add", verify.verifyToken, verify.verifyRole(['Giáo viên']), employeeFeedBacks.CreateFeedBack);
// router.put("/feedbacks/update/:feedbackId", verifyToken, feedbacks.UpdateFeedBack);
// router.delete("/feedbacks/delete/:feedbackId", verifyToken, feedbacks.DeleteFeedBack);

module.exports = router;
