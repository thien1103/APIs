const express = require('express');
const router = express.Router();
const pickUpController = require('../controllers/pickUpController')

router.get('/pickups', pickUpController.GetAllPickUps)
router.post('/pickups', pickUpController.CreatePickUp)
router.put('/pickups/:pickupId', pickUpController.UpdatePickUp)
router.delete('/pickups/:pickupId', pickUpController.DeletePickUp)

module.exports = router;
