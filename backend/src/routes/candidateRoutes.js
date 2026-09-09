const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Job candidate routes
router.post('/jobs/:id/candidates', authMiddleware, roleMiddleware('employer'), upload.single('resume'), candidateController.addCandidateToJob);
router.get('/jobs/:id/candidates', authMiddleware, roleMiddleware('employer'), candidateController.getJobCandidates);
router.post('/jobs/:id/compare', authMiddleware, roleMiddleware('employer'), candidateController.compareCandidates);

// Individual candidate routes
router.get('/candidates/:id', authMiddleware, candidateController.getCandidateById);
router.post('/candidates/:id/analyze', authMiddleware, roleMiddleware('employer'), candidateController.analyzeCandidate);
router.put('/applications/:id/status', authMiddleware, roleMiddleware('employer'), candidateController.updateApplicationStatus);

module.exports = router;
