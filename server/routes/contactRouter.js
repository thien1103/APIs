const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const verifyToken = require('../middleware/verifyToken');

router.get('/contacts',verifyToken, contactController.GetAllContacts)

module.exports = router;