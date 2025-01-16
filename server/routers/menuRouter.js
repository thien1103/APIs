const express = require("express");
const router = express.Router();
const verify = require("../middleware/verifyToken");
const menu = require("../controllers/user/menuController");

//user
router.get("/menu", verify.verifyToken, menu.GetMenu);
router.post("/menu", verify.verifyToken, menu.GetMenuByGrade);


module.exports = router;