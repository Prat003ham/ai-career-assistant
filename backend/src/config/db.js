const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'ai_career_assistant'}`;

let pool;
let isConnectedToPostgres = false;

try {
  pool = new Pool({
    connectionString,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
  });

  pool.on('error', (err) => {
    console.warn('[Database Warning] PostgreSQL Pool Background Error:', err.message);
  });
} catch (e) {
  console.warn('[Database Warning] Failed to initialize PostgreSQL pool:', e.message);
}

// In-Memory Storage Fallback for Seamless Instant Demo Testing
const inMemoryDb = {
  users: [
    {
      id: 1,
      email: 'alex.candidate@example.com',
      password_hash: '$2b$10$K7ZgO8t4J1oV2b3c4d5e6eF7g8h9i0j1k2l3m4n5o6p7q8r9s0t', // "password123"
      full_name: 'Alex Morgan',
      role: 'candidate',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      email: 'sarah.candidate@example.com',
      password_hash: '$2b$10$K7ZgO8t4J1oV2b3c4d5e6eF7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      full_name: 'Sarah Chen',
      role: 'candidate',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      email: 'recruiter@technova.com',
      password_hash: '$2b$10$K7ZgO8t4J1oV2b3c4d5e6eF7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      full_name: 'Mark Taylor',
      role: 'employer',
      created_at: new Date().toISOString()
    }
  ],
  candidate_profiles: [
    {
      id: 1,
      user_id: 1,
      headline: 'Full Stack Software Engineer | React, Node.js, SQL',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      bio: 'Passionate full-stack developer with experience building scalable REST APIs and responsive React applications.',
      target_role: 'Full Stack Developer',
      years_of_experience: 3.5
    },
    {
      id: 2,
      user_id: 2,
      headline: 'Frontend Engineer | React, TypeScript, Tailwind CSS',
      phone: '+1 (555) 876-5432',
      location: 'Austin, TX',
      bio: 'Enthusiastic frontend software engineer specializing in UI design systems and state management.',
      target_role: 'Frontend Engineer',
      years_of_experience: 2.0
    }
  ],
  employer_profiles: [
    {
      id: 1,
      user_id: 3,
      company_name: 'TechNova Solutions Inc.',
      company_website: 'https://technova.example.com',
      company_size: '50-200 employees',
      industry: 'Software & Cloud Services'
    }
  ],
  resumes: [
    {
      id: 1,
      user_id: 1,
      file_name: 'Alex_Morgan_Resume.pdf',
      file_path: '/uploads/Alex_Morgan_Resume.pdf',
      file_size: 145000,
      parsed_text: 'Alex Morgan | San Francisco, CA | Full Stack Developer | Skills: JavaScript, React, Node.js, Express, PostgreSQL, Docker, Git',
      parsed_data: {
        name: 'Alex Morgan',
        email: 'alex.candidate@example.com',
        phone: '+1 555 234 5678',
        education: ['B.S. Computer Science, UC 2021'],
        skills: ['JavaScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'REST API', 'Git'],
        experience: ['Full Stack Engineer at WebLabs (2021-Present)'],
        projects: ['E-Commerce Platform', 'Real-time Chat Application']
      },
      is_primary: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 2,
      file_name: 'Sarah_Chen_Resume.pdf',
      file_path: '/uploads/Sarah_Chen_Resume.pdf',
      file_size: 128000,
      parsed_text: 'Sarah Chen | Austin, TX | Frontend Engineer | Skills: React, TypeScript, Tailwind CSS, JavaScript, HTML5, CSS3, Python, FastAPI',
      parsed_data: {
        name: 'Sarah Chen',
        email: 'sarah.candidate@example.com',
        phone: '+1 555 876 5432',
        education: ['B.S. Software Engineering, UT Austin 2022'],
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3', 'Python', 'FastAPI'],
        experience: ['Junior Frontend Engineer at DataViz Inc. (2022-Present)'],
        projects: ['Analytics Dashboard', 'Task Tracker']
      },
      is_primary: true,
      created_at: new Date().toISOString()
    }
  ],
  job_openings: [
    {
      id: 1,
      employer_id: 1,
      title: 'Senior Full Stack Engineer (React & Node.js)',
      department: 'Engineering',
      location: 'San Francisco, CA (Hybrid)',
      employment_type: 'Full-time',
      salary_range: '$120,000 - $150,000',
      job_description: 'We are looking for a Senior Full Stack Engineer to lead web application development. You will build user-facing features using React and Tailwind CSS, design scalable REST APIs using Node.js and Express, write PostgreSQL queries, and containerize services with Docker.',
      required_skills: ['React', 'Node.js', 'JavaScript', 'PostgreSQL', 'Express', 'REST API', 'Docker'],
      preferred_skills: ['AWS', 'TypeScript', 'Redis', 'CI/CD', 'Jest'],
      min_experience_years: 3.0,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      employer_id: 1,
      title: 'Frontend Engineer (React & Data Vis)',
      department: 'Product Development',
      location: 'Remote',
      employment_type: 'Full-time',
      salary_range: '$95,000 - $125,000',
      job_description: 'Join our team as a Frontend Engineer! You will craft sleek, responsive web applications using React, TypeScript, and Tailwind CSS. Experience with state management (Redux), API integration, and performance optimization is key.',
      required_skills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3', 'REST API'],
      preferred_skills: ['Redux', 'Recharts', 'Figma', 'WebSockets'],
      min_experience_years: 2.0,
      status: 'active',
      created_at: new Date().toISOString()
    }
  ],
  applications: [
    {
      id: 1,
      job_id: 1,
      candidate_id: 1,
      resume_id: 1,
      candidate_name: 'Alex Morgan',
      candidate_email: 'alex.candidate@example.com',
      status: 'shortlisted',
      applied_at: new Date().toISOString()
    },
    {
      id: 2,
      job_id: 1,
      candidate_id: 2,
      resume_id: 2,
      candidate_name: 'Sarah Chen',
      candidate_email: 'sarah.candidate@example.com',
      status: 'screening',
      applied_at: new Date().toISOString()
    },
    {
      id: 3,
      job_id: 2,
      candidate_id: 2,
      resume_id: 2,
      candidate_name: 'Sarah Chen',
      candidate_email: 'sarah.candidate@example.com',
      status: 'interview',
      applied_at: new Date().toISOString()
    }
  ],
  resume_analyses: [
    {
      id: 1,
      resume_id: 1,
      job_id: 1,
      candidate_id: 1,
      jd_text: 'Senior Full Stack Engineer (React & Node.js) - Requirements: React, Node.js, Express, PostgreSQL, REST API, Docker, AWS.',
      overall_score: 84.5,
      skills_match_score: 85.0,
      experience_match_score: 90.0,
      education_match_score: 85.0,
      matched_skills: ['React', 'Node.js', 'Express', 'PostgreSQL', 'REST API', 'Docker', 'JavaScript'],
      partially_matched_skills: ['TypeScript'],
      missing_skills: ['AWS', 'Redis', 'CI/CD'],
      resume_strengths: [
        'Strong alignment in core stack (React, Node.js, PostgreSQL)',
        'Solid experience duration matching senior requirements',
        'Includes containerization (Docker) experience'
      ],
      resume_weaknesses: [
        'Missing cloud infrastructure experience (AWS)',
        'No explicit deployment or CI/CD pipelines mentioned'
      ],
      resume_suggestions: [
        {
          type: 'improvement',
          original: 'Worked on a website using React.',
          suggested: 'Architected and delivered a high-throughput React single-page application with optimized component render cycles and state management.'
        },
        {
          type: 'keyword',
          original: 'Created database tables.',
          suggested: 'Designed normalized PostgreSQL schemas with indexing, foreign key constraints, and performance tuning.'
        }
      ],
      recommended_skills: [
        {
          skill: 'AWS (Amazon Web Services)',
          reason: 'High priority requirement for deployment and cloud infrastructure in target JD.',
          importance: 'High',
          difficulty: 'Medium',
          order: 1,
          projectIdea: 'Deploy Node.js/Postgres application to AWS ECS with RDS.'
        },
        {
          skill: 'TypeScript',
          reason: 'Strongly preferred language requirement for full-stack architecture stability.',
          importance: 'Medium',
          difficulty: 'Easy',
          order: 2,
          projectIdea: 'Migrate existing JavaScript Express routes to strict TypeScript types.'
        }
      ],
      recommended_projects: [
        {
          title: 'AWS Cloud Deployed Microservice',
          description: 'Build and deploy a containerized Express API to AWS ECS with PostgreSQL RDS.',
          techStack: ['AWS ECS', 'AWS RDS', 'Docker', 'Node.js']
        }
      ],
      recommended_certifications: [
        { name: 'AWS Certified Developer – Associate', provider: 'Amazon Web Services' },
        { name: 'Meta Front-End / Back-End Professional Certificate', provider: 'Coursera / Meta' }
      ],
      learning_roadmap: [
        { week: 1, topic: 'AWS Fundamentals & EC2/RDS Setup', tasks: ['Study core AWS services', 'Launch PostgreSQL RDS instance'] },
        { week: 2, topic: 'Dockerization & Container Registry', tasks: ['Dockerize Express backend & React frontend', 'Push images to ECR'] },
        { week: 3, topic: 'AWS ECS Deployment & CI/CD', tasks: ['Configure AWS ECS cluster with Fargate', 'Set up GitHub Actions workflow'] },
        { week: 4, topic: 'TypeScript Refactoring & Final Testing', tasks: ['Convert key Express routes to TypeScript', 'Add end-to-end integration tests'] }
      ],
      ats_score: 88.0,
      ats_feedback: {
        formatting: 'Clear headings, standard font styling',
        missingKeywords: ['AWS', 'Cloud Services', 'CI/CD'],
        readability: 'Excellent section structure and bullet points'
      },
      explanation: 'Candidate displays a strong 84.5% match for Senior Full Stack Engineer. Primary skill gap centers on AWS Cloud Services.',
      status: 'completed',
      created_at: new Date().toISOString()
    }
  ]
};

async function query(text, params = []) {
  if (pool) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      // If Postgres error occurs (e.g. table missing or connection rejected), log and fall back
      console.warn('[Database Query Fallback] Postgres query failed, falling back to memory layer:', err.message);
    }
  }
  
  // Custom query processor for inMemoryDb
  return handleInMemoryQuery(text, params);
}

function handleInMemoryQuery(text, params) {
  const sql = text.trim();
  const lower = sql.toLowerCase();

  // 1. SELECT Users by Email
  if (lower.includes('from users') && lower.includes('email =')) {
    const emailParam = params[0];
    const user = inMemoryDb.users.find(u => u.email === emailParam);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 2. SELECT Users by ID
  if (lower.includes('from users') && lower.includes('id =')) {
    const idParam = Number(params[0]);
    const user = inMemoryDb.users.find(u => u.id === idParam);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 3. INSERT User
  if (lower.startsWith('insert into users')) {
    const id = inMemoryDb.users.length + 1;
    const [email, password_hash, full_name, role] = params;
    const newUser = { id, email, password_hash, full_name, role, created_at: new Date().toISOString() };
    inMemoryDb.users.push(newUser);
    return { rows: [newUser], rowCount: 1 };
  }

  // 4. CANDIDATE PROFILE by user_id
  if (lower.includes('from candidate_profiles') && lower.includes('user_id =')) {
    const userId = Number(params[0]);
    const profile = inMemoryDb.candidate_profiles.find(cp => cp.user_id === userId);
    return { rows: profile ? [profile] : [], rowCount: profile ? 1 : 0 };
  }

  // 5. INSERT Candidate Profile
  if (lower.startsWith('insert into candidate_profiles')) {
    const id = inMemoryDb.candidate_profiles.length + 1;
    const [user_id, headline, phone, location, bio, target_role, years_of_experience] = params;
    const profile = { id, user_id, headline, phone, location, bio, target_role, years_of_experience: Number(years_of_experience) };
    inMemoryDb.candidate_profiles.push(profile);
    return { rows: [profile], rowCount: 1 };
  }

  // 6. EMPLOYER PROFILE by user_id
  if (lower.includes('from employer_profiles') && lower.includes('user_id =')) {
    const userId = Number(params[0]);
    const profile = inMemoryDb.employer_profiles.find(ep => ep.user_id === userId);
    return { rows: profile ? [profile] : [], rowCount: profile ? 1 : 0 };
  }

  // 7. INSERT Employer Profile
  if (lower.startsWith('insert into employer_profiles')) {
    const id = inMemoryDb.employer_profiles.length + 1;
    const [user_id, company_name, company_website, company_size, industry] = params;
    const profile = { id, user_id, company_name, company_website, company_size, industry };
    inMemoryDb.employer_profiles.push(profile);
    return { rows: [profile], rowCount: 1 };
  }

  // 8. RESUMES by user_id
  if (lower.includes('from resumes') && lower.includes('user_id =')) {
    const userId = Number(params[0]);
    const userResumes = inMemoryDb.resumes.filter(r => r.user_id === userId);
    return { rows: userResumes, rowCount: userResumes.length };
  }

  // 9. RESUMES by ID
  if (lower.includes('from resumes') && lower.includes('id =')) {
    const resumeId = Number(params[0]);
    const resume = inMemoryDb.resumes.find(r => r.id === resumeId);
    return { rows: resume ? [resume] : [], rowCount: resume ? 1 : 0 };
  }

  // 10. INSERT Resume
  if (lower.startsWith('insert into resumes')) {
    const id = inMemoryDb.resumes.length + 1;
    const [user_id, file_name, file_path, file_size, parsed_text, parsed_data, is_primary] = params;
    const newResume = {
      id, user_id, file_name, file_path, file_size: Number(file_size),
      parsed_text, parsed_data: typeof parsed_data === 'string' ? JSON.parse(parsed_data) : parsed_data,
      is_primary: Boolean(is_primary), created_at: new Date().toISOString()
    };
    inMemoryDb.resumes.push(newResume);
    return { rows: [newResume], rowCount: 1 };
  }

  // 11. JOB OPENINGS by employer_id or ALL
  if (lower.includes('from job_openings')) {
    if (lower.includes('id =')) {
      const id = Number(params[0]);
      const job = inMemoryDb.job_openings.find(j => j.id === id);
      return { rows: job ? [job] : [], rowCount: job ? 1 : 0 };
    }
    if (lower.includes('employer_id =')) {
      const empId = Number(params[0]);
      const jobs = inMemoryDb.job_openings.filter(j => j.employer_id === empId);
      return { rows: jobs, rowCount: jobs.length };
    }
    return { rows: inMemoryDb.job_openings, rowCount: inMemoryDb.job_openings.length };
  }

  // 12. INSERT Job Opening
  if (lower.startsWith('insert into job_openings')) {
    const id = inMemoryDb.job_openings.length + 1;
    const [employer_id, title, department, location, employment_type, salary_range, job_description, required_skills, preferred_skills, min_experience_years] = params;
    const newJob = {
      id, employer_id, title, department, location, employment_type, salary_range, job_description,
      required_skills: typeof required_skills === 'string' ? JSON.parse(required_skills) : required_skills,
      preferred_skills: typeof preferred_skills === 'string' ? JSON.parse(preferred_skills) : preferred_skills,
      min_experience_years: Number(min_experience_years), status: 'active', created_at: new Date().toISOString()
    };
    inMemoryDb.job_openings.push(newJob);
    return { rows: [newJob], rowCount: 1 };
  }

  // 13. APPLICATIONS by job_id
  if (lower.includes('from applications')) {
    if (lower.includes('job_id =')) {
      const jobId = Number(params[0]);
      const apps = inMemoryDb.applications.filter(a => a.job_id === jobId);
      return { rows: apps, rowCount: apps.length };
    }
    if (lower.includes('candidate_id =')) {
      const candId = Number(params[0]);
      const apps = inMemoryDb.applications.filter(a => a.candidate_id === candId);
      return { rows: apps, rowCount: apps.length };
    }
    return { rows: inMemoryDb.applications, rowCount: inMemoryDb.applications.length };
  }

  // 14. INSERT Application
  if (lower.startsWith('insert into applications')) {
    const id = inMemoryDb.applications.length + 1;
    const [job_id, candidate_id, resume_id, candidate_name, candidate_email, status] = params;
    const newApp = {
      id, job_id, candidate_id, resume_id, candidate_name, candidate_email,
      status: status || 'applied', applied_at: new Date().toISOString()
    };
    inMemoryDb.applications.push(newApp);
    return { rows: [newApp], rowCount: 1 };
  }

  // 15. UPDATE Application Status
  if (lower.startsWith('update applications')) {
    const [status, appId] = params;
    const app = inMemoryDb.applications.find(a => a.id === Number(appId));
    if (app) {
      app.status = status;
      app.updated_at = new Date().toISOString();
      return { rows: [app], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 16. RESUME ANALYSES
  if (lower.includes('from resume_analyses')) {
    if (lower.includes('id =')) {
      const id = Number(params[0]);
      const analysis = inMemoryDb.resume_analyses.find(ra => ra.id === id);
      return { rows: analysis ? [analysis] : [], rowCount: analysis ? 1 : 0 };
    }
    if (lower.includes('resume_id =')) {
      const rId = Number(params[0]);
      const analyses = inMemoryDb.resume_analyses.filter(ra => ra.resume_id === rId);
      return { rows: analyses, rowCount: analyses.length };
    }
    if (lower.includes('candidate_id =')) {
      const cId = Number(params[0]);
      const analyses = inMemoryDb.resume_analyses.filter(ra => ra.candidate_id === cId);
      return { rows: analyses, rowCount: analyses.length };
    }
    return { rows: inMemoryDb.resume_analyses, rowCount: inMemoryDb.resume_analyses.length };
  }

  // 17. INSERT Resume Analysis
  if (lower.startsWith('insert into resume_analyses')) {
    const id = inMemoryDb.resume_analyses.length + 1;
    const [
      resume_id, job_id, candidate_id, jd_text, overall_score, skills_match_score,
      experience_match_score, education_match_score, matched_skills, partially_matched_skills,
      missing_skills, resume_strengths, resume_weaknesses, resume_suggestions, recommended_skills,
      recommended_projects, recommended_certifications, learning_roadmap, ats_score, ats_feedback, explanation
    ] = params;

    const parseField = (f) => typeof f === 'string' ? JSON.parse(f) : f;

    const newAnalysis = {
      id, resume_id, job_id, candidate_id, jd_text,
      overall_score: Number(overall_score),
      skills_match_score: Number(skills_match_score),
      experience_match_score: Number(experience_match_score),
      education_match_score: Number(education_match_score),
      matched_skills: parseField(matched_skills),
      partially_matched_skills: parseField(partially_matched_skills),
      missing_skills: parseField(missing_skills),
      resume_strengths: parseField(resume_strengths),
      resume_weaknesses: parseField(resume_weaknesses),
      resume_suggestions: parseField(resume_suggestions),
      recommended_skills: parseField(recommended_skills),
      recommended_projects: parseField(recommended_projects),
      recommended_certifications: parseField(recommended_certifications),
      learning_roadmap: parseField(learning_roadmap),
      ats_score: Number(ats_score),
      ats_feedback: parseField(ats_feedback),
      explanation,
      status: 'completed',
      created_at: new Date().toISOString()
    };
    inMemoryDb.resume_analyses.push(newAnalysis);
    return { rows: [newAnalysis], rowCount: 1 };
  }

  return { rows: [], rowCount: 0 };
}

module.exports = {
  query,
  inMemoryDb
};
