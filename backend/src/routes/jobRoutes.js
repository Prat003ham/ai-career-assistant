const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('employer'), jobController.createJob);
router.get('/', authMiddleware, jobController.getJobs);
router.get('/:id', authMiddleware, jobController.getJobById);
router.put('/:id', authMiddleware, roleMiddleware('employer'), jobController.updateJob);
router.delete('/:id', authMiddleware, roleMiddleware('employer'), jobController.deleteJob);

module.exports = router;
