const express = require('express');
const router = express.Router();
const pickUpController = require('../controllers/pickUpController');
const verifyToken = require('../middleware/verifyToken');


router.get('/pickups',verifyToken, pickUpController.GetAllPickUps)
router.post('/pickups',verifyToken, pickUpController.CreatePickUp)
router.put('/pickups/:pickupId',verifyToken, pickUpController.UpdatePickUp)
router.delete('/pickups/:pickupId',verifyToken, pickUpController.DeletePickUp)

module.exports = router;
