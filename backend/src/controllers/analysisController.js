const db = require('../config/db');
const aiService = require('../services/aiService');

exports.analyzeResume = async (req, res) => {
  try {
    const { resume_id, jd_text, job_id } = req.body;
    const userId = req.user.id;

    if (!jd_text || jd_text.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide a valid Job Description text (at least 20 characters).' });
    }

    // Fetch candidate profile & resume
    const candProfRes = await db.query('SELECT id FROM candidate_profiles WHERE user_id = $1', [userId]);
    const candidateId = candProfRes.rows[0] ? candProfRes.rows[0].id : null;

    let resumeText = '';
    let parsedResumeData = null;
    let targetResumeId = resume_id;

    if (targetResumeId) {
      const resumeRes = await db.query('SELECT * FROM resumes WHERE id = $1', [targetResumeId]);
      if (resumeRes.rows.length > 0) {
        resumeText = resumeRes.rows[0].parsed_text || '';
        parsedResumeData = resumeRes.rows[0].parsed_data || null;
      }
    } else {
      // Find latest primary resume
      const primaryRes = await db.query('SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
      if (primaryRes.rows.length > 0) {
        targetResumeId = primaryRes.rows[0].id;
        resumeText = primaryRes.rows[0].parsed_text || '';
        parsedResumeData = primaryRes.rows[0].parsed_data || null;
      }
    }

    if (!resumeText) {
      resumeText = 'Candidate skills: JavaScript, React, Node.js, HTML5, CSS3, SQL, Git';
    }

    // Run AI analysis pipeline
    const aiResult = await aiService.analyzeResumeVsJd(resumeText, jd_text, parsedResumeData);

    // Save result to resume_analyses table
    const result = await db.query(
      `INSERT INTO resume_analyses (
        resume_id, job_id, candidate_id, jd_text, overall_score, skills_match_score,
        experience_match_score, education_match_score, matched_skills, partially_matched_skills,
        missing_skills, resume_strengths, resume_weaknesses, resume_suggestions, recommended_skills,
        recommended_projects, recommended_certifications, learning_roadmap, ats_score, ats_feedback, explanation, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *`,
      [
        targetResumeId, job_id || null, candidateId, jd_text,
        aiResult.overallScore, aiResult.skillsMatchScore, aiResult.experienceMatchScore, aiResult.educationMatchScore,
        JSON.stringify(aiResult.matchedSkills), JSON.stringify(aiResult.partiallyMatchedSkills), JSON.stringify(aiResult.missingSkills),
        JSON.stringify(aiResult.resumeStrengths), JSON.stringify(aiResult.resumeWeaknesses), JSON.stringify(aiResult.resumeSuggestions),
        JSON.stringify(aiResult.recommendedSkills), JSON.stringify(aiResult.recommendedProjects), JSON.stringify(aiResult.recommendedCertifications),
        JSON.stringify(aiResult.learningRoadmap), aiResult.atsScore, JSON.stringify(aiResult.atsFeedback), aiResult.explanation, 'completed'
      ]
    );

    return res.status(201).json({
      message: 'Analysis completed successfully!',
      analysis: result.rows[0]
    });
  } catch (error) {
    console.error('Error running candidate resume analysis:', error);
    return res.status(500).json({ error: 'AI analysis service encountered an error.' });
  }
};

exports.getAnalyses = async (req, res) => {
  try {
    const userId = req.user.id;
    const candProfRes = await db.query('SELECT id FROM candidate_profiles WHERE user_id = $1', [userId]);
    const candidateId = candProfRes.rows[0] ? candProfRes.rows[0].id : null;

    let result;
    if (candidateId) {
      result = await db.query('SELECT * FROM resume_analyses WHERE candidate_id = $1 ORDER BY created_at DESC', [candidateId]);
    } else {
      result = await db.query('SELECT * FROM resume_analyses ORDER BY created_at DESC');
    }

    return res.json({ analyses: result.rows });
  } catch (error) {
    console.error('Error fetching candidate analyses:', error);
    return res.status(500).json({ error: 'Failed to retrieve analysis records.' });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM resume_analyses WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis record not found.' });
    }

    return res.json({ analysis: result.rows[0] });
  } catch (error) {
    console.error('Error fetching analysis by ID:', error);
    return res.status(500).json({ error: 'Failed to retrieve analysis details.' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const candProfRes = await db.query('SELECT id FROM candidate_profiles WHERE user_id = $1', [userId]);
    const candidateId = candProfRes.rows[0] ? candProfRes.rows[0].id : null;

    const result = await db.query(
      'SELECT recommended_skills, recommended_projects, recommended_certifications FROM resume_analyses WHERE candidate_id = $1 ORDER BY created_at DESC LIMIT 1',
      [candidateId]
    );

    if (result.rows.length === 0) {
      return res.json({
        recommendedSkills: [],
        recommendedProjects: [],
        recommendedCertifications: []
      });
    }

    const row = result.rows[0];
    return res.json({
      recommendedSkills: row.recommended_skills || [],
      recommendedProjects: row.recommended_projects || [],
      recommendedCertifications: row.recommended_certifications || []
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return res.status(500).json({ error: 'Failed to retrieve skill recommendations.' });
  }
};

exports.getRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const candProfRes = await db.query('SELECT id FROM candidate_profiles WHERE user_id = $1', [userId]);
    const candidateId = candProfRes.rows[0] ? candProfRes.rows[0].id : null;

    const result = await db.query(
      'SELECT learning_roadmap FROM resume_analyses WHERE candidate_id = $1 ORDER BY created_at DESC LIMIT 1',
      [candidateId]
    );

    if (result.rows.length === 0 || !result.rows[0].learning_roadmap) {
      return res.json({ roadmap: [] });
    }

    return res.json({ roadmap: result.rows[0].learning_roadmap });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return res.status(500).json({ error: 'Failed to retrieve learning roadmap.' });
  }
};
