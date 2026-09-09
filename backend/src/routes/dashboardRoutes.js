const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/candidate', authMiddleware, roleMiddleware('candidate'), dashboardController.getCandidateDashboard);
router.get('/employer', authMiddleware, roleMiddleware('employer'), dashboardController.getEmployerDashboard);

module.exports = router;
