const express = require('express');
const router = express.Router();
const healthPost = require('../controllers/healthPostController');

router.get('/health-posts', healthPost.GetAllHealthPost)
router.get('/health-posts/:postId', healthPost.GetDetailedPost)

module.exports = router;