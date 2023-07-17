const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Define the routes for the subscription endpoints
router.get('/enrolled', authenticateToken, subscriptionController.getEnrolledCourses);
router.post('/enrolled', authenticateToken, subscriptionController.addEnrolledCourse);

module.exports = router;
