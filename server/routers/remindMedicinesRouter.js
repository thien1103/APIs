const express = require("express");
const router = express.Router();
const verify = require("../middleware/verifyToken");
const userRemindMedicines = require("../controllers/user/remindMedicines");
const employeeRemindMedicines = require("../controllers/employee/remindMedicines");


//user
router.post("/user/remindMedicines/all", verify.verifyToken, userRemindMedicines.GetAllRemindMedicinesForUser);
router.get("/user/remindMedicines/:enrollmentId", verify.verifyToken, userRemindMedicines.GetDetailedRemindMedicines);
router.post("/user/remindMedicines/add", verify.verifyToken, userRemindMedicines.CreateRemindMedicines);
router.put("/user/remindMedicines/update/:remindId", verify.verifyToken, userRemindMedicines.UpdateRemindMedicines);
router.delete("/user/remindMedicines/delete/:remindId", verify.verifyToken, userRemindMedicines.DeleteRemindMedicines);

//employee 
router.post("/employee/remindMedicines/all", verify.verifyToken, employeeRemindMedicines.GetAllRemindMedicinesForEmployee);
router.get("/employee/remindMedicines/:remindId", verify.verifyToken, employeeRemindMedicines.GetDetailedRemindMedicines);

module.exports = router;
