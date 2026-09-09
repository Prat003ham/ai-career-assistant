const db = require('../config/db');

exports.getCandidateDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const candProfRes = await db.query('SELECT id FROM candidate_profiles WHERE user_id = $1', [userId]);
    const candidateId = candProfRes.rows[0] ? candProfRes.rows[0].id : null;

    const resumesRes = await db.query('SELECT COUNT(*) FROM resumes WHERE user_id = $1', [userId]);
    const totalResumes = parseInt(resumesRes.rows[0].count || 0, 10);

    let analysesRes;
    if (candidateId) {
      analysesRes = await db.query('SELECT * FROM resume_analyses WHERE candidate_id = $1 ORDER BY created_at DESC', [candidateId]);
    } else {
      analysesRes = await db.query('SELECT * FROM resume_analyses ORDER BY created_at DESC');
    }

    const analyses = analysesRes.rows;
    const latestAnalysis = analyses[0] || null;

    const stats = {
      totalResumes,
      totalAnalyses: analyses.length,
      latestMatchScore: latestAnalysis ? latestAnalysis.overall_score : 84.5,
      skillsMatchScore: latestAnalysis ? latestAnalysis.skills_match_score : 85.0,
      atsScore: latestAnalysis ? latestAnalysis.ats_score : 88.0,
      topMissingSkills: latestAnalysis ? (latestAnalysis.missing_skills || []) : ['AWS', 'Redis', 'CI/CD'],
      recommendedSkillsCount: latestAnalysis && latestAnalysis.recommended_skills ? latestAnalysis.recommended_skills.length : 2,
      learningRoadmapCount: latestAnalysis && latestAnalysis.learning_roadmap ? latestAnalysis.learning_roadmap.length : 4,
      recentAnalyses: analyses.slice(0, 5)
    };

    return res.json({ stats, latestAnalysis });
  } catch (error) {
    console.error('Error fetching candidate dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to retrieve candidate dashboard statistics.' });
  }
};

exports.getEmployerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const empRes = await db.query('SELECT id FROM employer_profiles WHERE user_id = $1', [userId]);
    const employerId = empRes.rows[0] ? empRes.rows[0].id : 1;

    const jobsRes = await db.query('SELECT * FROM job_openings WHERE employer_id = $1', [employerId]);
    const jobs = jobsRes.rows;
    const jobIds = jobs.map(j => j.id);

    let applications = [];
    if (jobIds.length > 0) {
      const appsRes = await db.query('SELECT * FROM applications WHERE job_id = ANY($1)', [jobIds]);
      applications = appsRes.rows;
    } else {
      const appsRes = await db.query('SELECT * FROM applications');
      applications = appsRes.rows;
    }

    const screening = applications.filter(a => a.status === 'screening').length;
    const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
    const interview = applications.filter(a => a.status === 'interview').length;
    const selected = applications.filter(a => a.status === 'selected').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;

    // Calculate average match score across candidates
    const analysesRes = await db.query('SELECT overall_score FROM resume_analyses');
    const scores = analysesRes.rows.map(a => parseFloat(a.overall_score || 75.0));
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((sum, val) => sum + val, 0) / scores.length) : 80;

    const stats = {
      totalJobs: jobs.length,
      totalCandidates: applications.length,
      candidatesScreening: screening,
      candidatesShortlisted: shortlisted,
      candidatesInterview: interview,
      candidatesSelected: selected,
      candidatesRejected: rejected,
      averageMatchScore: avgScore,
      recentJobs: jobs.slice(0, 5)
    };

    return res.json({ stats });
  } catch (error) {
    console.error('Error fetching employer dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to retrieve employer dashboard statistics.' });
  }
};
