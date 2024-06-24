const express = require('express');
const router = express.Router();
const HealthPost = require('../controllers/healthPostController');
const verifyToken = require('../middleware/verifyToken')

router.get('/health-posts',verifyToken, HealthPost.GetAllHealthPost)
router.get('/health-posts/:postId',verifyToken, HealthPost.GetDetailedPost)

module.exports = router;