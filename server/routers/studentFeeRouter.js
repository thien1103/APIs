const express = require("express");
const router = express.Router();
const studentFeeController = require("../controllers/user/studentFeeController");
const verify = require("../middleware/verifyToken");

//user
router.get("/fee/:userId", verify.verifyToken, studentFeeController.GetStudentFeeByUserID);


module.exports = router;
