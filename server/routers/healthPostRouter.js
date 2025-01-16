const express = require('express');
const router = express.Router();
const HealthPost = require('../controllers/healthPostController');
const verify = require('../middleware/verifyToken')

router.get('/health-posts',verify.verifyToken, HealthPost.GetAllHealthPost)
router.get("/health-posts/image/:filename", verify.verifyToken, HealthPost.GetHealthPostImage);
router.get('/health-posts/:postId',verify.verifyToken, HealthPost.GetDetailedPost)

module.exports = router;