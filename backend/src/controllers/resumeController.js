const db = require('../config/db');
const aiService = require('../services/aiService');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF resume file.' });
    }

    const { originalname, path: filePath, size } = req.file;
    const userId = req.user.id;

    // Trigger AI service parsing
    const parsedData = await aiService.parseResumeFile(filePath, originalname);
    const parsedText = `${parsedData.name || ''} | ${parsedData.email || ''} | Skills: ${parsedData.skills ? parsedData.skills.join(', ') : ''}`;

    // Store in resumes table
    const result = await db.query(
      `INSERT INTO resumes (user_id, file_name, file_path, file_size, parsed_text, parsed_data, is_primary) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, originalname, filePath, size, parsedText, JSON.stringify(parsedData), true]
    );

    const newResume = result.rows[0];

    return res.status(201).json({
      message: 'Resume uploaded and parsed successfully!',
      resume: newResume
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return res.status(500).json({ error: 'Failed to process and save uploaded resume.' });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query('SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC', [userId]);

    return res.json({ resumes: result.rows });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return res.status(500).json({ error: 'Failed to retrieve uploaded resumes.' });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM resumes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    const resume = result.rows[0];

    // Authorization check: Candidate owns resume or User is Employer
    if (req.user.role === 'candidate' && resume.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden access. You do not own this resume.' });
    }

    return res.json({ resume });
  } catch (error) {
    console.error('Error fetching resume by ID:', error);
    return res.status(500).json({ error: 'Failed to retrieve resume details.' });
  }
};
