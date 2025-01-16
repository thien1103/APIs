const express = require('express');
const router = express.Router();
const userContactController = require('../controllers/user/contactController');
const employeeContactController = require('../controllers/employee/contactController');

const verify = require('../middleware/verifyToken');

//user
router.get('/user/contacts',verify.verifyToken, userContactController.GetAllContacts)

//employee
router.get('/employee/contacts',verify.verifyToken, employeeContactController.GetAllContacts)


module.exports = router;