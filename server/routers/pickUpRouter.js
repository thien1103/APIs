const express = require('express');
const router = express.Router();
const userPickUpController = require('../controllers/user/pickUpController');
const employeePickUpController = require('../controllers/employee/pickUpController');
const verify = require('../middleware/verifyToken');

//user
router.post('/user/pickups/all',verify.verifyToken, userPickUpController.GetAllPickUpsEachUser)
router.get('/user/pickups/:pickupId',verify.verifyToken, userPickUpController.GetDetailPickup)
router.post('/user/pickups/add',verify.verifyToken, userPickUpController.CreatePickUp)
router.put('/user/pickups/update/:pickupId',verify.verifyToken, userPickUpController.UpdatePickUp)
router.delete('/user/pickups/delete/:pickupId',verify.verifyToken, userPickUpController.DeletePickUp)

//employee
router.post('/employee/pickups/all',verify.verifyToken, employeePickUpController.GetAllPickUpsOnTeacherClass)


module.exports = router;
