const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, upload.single('resume'), resumeController.uploadResume);
router.get('/', authMiddleware, resumeController.getResumes);
router.get('/:id', authMiddleware, resumeController.getResumeById);

module.exports = router;
