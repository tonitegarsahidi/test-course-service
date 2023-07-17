const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Define the routes for the course endpoints
router.get('/course', authenticateToken, courseController.getCourses);
router.get('/course/:courseId', authenticateToken, courseController.getCourseById);

module.exports = router;
