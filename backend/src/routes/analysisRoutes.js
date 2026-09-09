const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('candidate'), analysisController.analyzeResume);
router.get('/', authMiddleware, analysisController.getAnalyses);
router.get('/recommendations', authMiddleware, roleMiddleware('candidate'), analysisController.getRecommendations);
router.get('/roadmap', authMiddleware, roleMiddleware('candidate'), analysisController.getRoadmap);
router.get('/:id', authMiddleware, analysisController.getAnalysisById);

module.exports = router;
