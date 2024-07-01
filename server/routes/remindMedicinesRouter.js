const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const remindMedicines = require("../controllers/remindMedicines");

router.get("/remindMedicines/all", verifyToken, remindMedicines.GetAllRemindMedicines);
router.get("/remindMedicines/:remindId", verifyToken, remindMedicines.GetDetailedRemindMedicines);
router.post("/remindMedicines/create", verifyToken, remindMedicines.CreateRemindMedicines);
router.put("/remindMedicines/update/:remindId", verifyToken, remindMedicines.UpdateRemindMedicines);
router.delete("/remindMedicines/delete/:remindId", verifyToken, remindMedicines.DeleteRemindMedicines);

module.exports = router;
