const db = require('../config/db');

exports.createJob = async (req, res) => {
  try {
    const { title, department, location, employment_type, salary_range, job_description, required_skills, preferred_skills, min_experience_years } = req.body;
    const userId = req.user.id;

    if (!title || !location || !job_description) {
      return res.status(400).json({ error: 'Please provide job title, location, and job description.' });
    }

    const empRes = await db.query('SELECT id FROM employer_profiles WHERE user_id = $1', [userId]);
    if (empRes.rows.length === 0) {
      return res.status(400).json({ error: 'Employer profile not found.' });
    }
    const employerId = empRes.rows[0].id;

    const reqSkills = Array.isArray(required_skills) ? required_skills : (typeof required_skills === 'string' ? required_skills.split(',').map(s => s.trim()) : []);
    const prefSkills = Array.isArray(preferred_skills) ? preferred_skills : (typeof preferred_skills === 'string' ? preferred_skills.split(',').map(s => s.trim()) : []);

    const result = await db.query(
      `INSERT INTO job_openings (employer_id, title, department, location, employment_type, salary_range, job_description, required_skills, preferred_skills, min_experience_years, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        employerId, title.trim(), department || 'Engineering', location.trim(),
        employment_type || 'Full-time', salary_range || 'Competitive', job_description,
        JSON.stringify(reqSkills), JSON.stringify(prefSkills), Number(min_experience_years || 2), 'active'
      ]
    );

    return res.status(201).json({
      message: 'Job opening created successfully!',
      job: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating job opening:', error);
    return res.status(500).json({ error: 'Failed to create job opening.' });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const user = req.user;
    let jobs = [];

    if (user.role === 'employer') {
      const empRes = await db.query('SELECT id FROM employer_profiles WHERE user_id = $1', [user.id]);
      const employerId = empRes.rows[0] ? empRes.rows[0].id : null;
      if (employerId) {
        const result = await db.query('SELECT * FROM job_openings WHERE employer_id = $1 ORDER BY created_at DESC', [employerId]);
        jobs = result.rows;
      }
    } else {
      // Candidate sees all active jobs
      const result = await db.query('SELECT * FROM job_openings WHERE status = $1 ORDER BY created_at DESC', ['active']);
      jobs = result.rows;
    }

    return res.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({ error: 'Failed to retrieve job openings.' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM job_openings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job opening not found.' });
    }

    const job = result.rows[0];

    // Also fetch candidates / applications associated with this job
    const appRes = await db.query('SELECT * FROM applications WHERE job_id = $1 ORDER BY applied_at DESC', [id]);

    return res.json({ job, candidates: appRes.rows });
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    return res.status(500).json({ error: 'Failed to retrieve job details.' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, job_description, status } = req.body;

    const result = await db.query(
      `UPDATE job_openings SET title = COALESCE($1, title), location = COALESCE($2, location),
       job_description = COALESCE($3, job_description), status = COALESCE($4, status), updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [title, location, job_description, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job opening not found.' });
    }

    return res.json({ message: 'Job opening updated successfully!', job: result.rows[0] });
  } catch (error) {
    console.error('Error updating job:', error);
    return res.status(500).json({ error: 'Failed to update job opening.' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM job_openings WHERE id = $1', [id]);

    return res.json({ message: 'Job opening deleted successfully!' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return res.status(500).json({ error: 'Failed to delete job opening.' });
  }
};
