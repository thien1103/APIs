const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/contacts', contactController.GetAllContacts)

module.exports = router;