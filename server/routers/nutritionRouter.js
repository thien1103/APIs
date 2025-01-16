const express = require("express");
const router = express.Router();
const verify = require("../middleware/verifyToken");
const nutrition = require("../controllers/user/nutritionController");

//user
router.get("/nutrition/:userId", verify.verifyToken, nutrition.GetNutritionByUserAge);


module.exports = router;
