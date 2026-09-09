-- Seed Data for AI Career Assistant System
-- Passwords below are hashed for password: "password123"

-- Clean tables before seeding
TRUNCATE TABLE resume_analyses, applications, job_openings, resumes, employer_profiles, candidate_profiles, users RESTART IDENTITY CASCADE;

-- 1. SEED USERS
-- Candidate 1: Alex Morgan
-- Candidate 2: Sarah Chen
-- Employer 1: TechNova Solutions (Recruiter: Mark Taylor)
INSERT INTO users (id, email, password_hash, full_name, role) VALUES
(1, 'alex.candidate@example.com', '$2b$10$K7ZgO8t4J1oV2b3c4d5e6eF7g8h9i0j1k2l3m4n5o6p7q8r9s0t', 'Alex Morgan', 'candidate'),
(2, 'sarah.candidate@example.com', '$2b$10$K7ZgO8t4J1oV2b3c4d5e6eF7g8h9i0j1k2l3m4n5o6p7q8r9s0t', 'Sarah Chen', 'candidate'),
(3, 'recruiter@technova.com', '$2b$10$K7ZgO8t4J1oV2b3c4d5e6eF7g8h9i0j1k2l3m4n5o6p7q8r9s0t', 'Mark Taylor', 'employer');

-- 2. CANDIDATE PROFILES
INSERT INTO candidate_profiles (id, user_id, headline, phone, location, bio, target_role, years_of_experience) VALUES
(1, 1, 'Full Stack Software Engineer | React, Node.js, SQL', '+1 (555) 234-5678', 'San Francisco, CA', 'Passionate full-stack developer with experience in modern web technologies, building scalable REST APIs, and responsive React applications.', 'Full Stack Developer', 3.5),
(2, 2, 'AI & Frontend Engineer | React, Python, Data Visualization', '+1 (555) 876-5432', 'Austin, TX', 'Enthusiastic software developer specializing in React frontends, Python backend microservices, and interactive UI dashboards.', 'Frontend Engineer', 2.0);

-- 3. EMPLOYER PROFILES
INSERT INTO employer_profiles (id, user_id, company_name, company_website, company_size, industry) VALUES
(1, 3, 'TechNova Solutions Inc.', 'https://technova.example.com', '50-200 employees', 'Software & Cloud Services');

-- 4. RESUMES
INSERT INTO resumes (id, user_id, file_name, file_path, file_size, parsed_text, parsed_data, is_primary) VALUES
(1, 1, 'Alex_Morgan_Resume.pdf', '/uploads/Alex_Morgan_Resume.pdf', 145000, 
'Alex Morgan | San Francisco, CA | alex.candidate@example.com | +1 555 234 5678
SUMMARY: Full Stack Engineer with 3.5 years of experience in JavaScript, React, Node.js, Express, PostgreSQL, and Git. Built 10+ web apps.
EDUCATION: B.S. in Computer Science, University of California, 2021.
EXPERIENCE: Full Stack Developer at WebLabs (2021-Present) - Engineered responsive React interfaces, developed Node.js REST services, and optimized SQL queries.
SKILLS: JavaScript, React.js, Node.js, Express, PostgreSQL, HTML5, CSS3, REST API, Git, Docker, Jest.
PROJECTS: E-Commerce Platform (React, Node, Postgres), Real-time Chat App (WebSockets, Express).', 
'{
  "name": "Alex Morgan",
  "email": "alex.candidate@example.com",
  "phone": "+1 555 234 5678",
  "education": ["B.S. in Computer Science, UC 2021"],
  "skills": ["JavaScript", "React.js", "Node.js", "Express", "PostgreSQL", "HTML5", "CSS3", "REST API", "Git", "Docker", "Jest"],
  "experience": ["Full Stack Developer at WebLabs (2021-Present) - Built React UIs and Node.js backend services"],
  "projects": ["E-Commerce Platform", "Real-time Chat App"]
}', true),

(2, 2, 'Sarah_Chen_Resume.pdf', '/uploads/Sarah_Chen_Resume.pdf', 128000, 
'Sarah Chen | Austin, TX | sarah.candidate@example.com | +1 555 876 5432
SUMMARY: Frontend Engineer with 2 years of experience creating dynamic UI dashboards with React, TypeScript, Tailwind CSS, and Python FastAPI.
EDUCATION: B.S. in Software Engineering, UT Austin, 2022.
EXPERIENCE: Junior Frontend Engineer at DataViz Inc. (2022-Present) - Developed React components with Recharts & Tailwind CSS. Integrated Python FastAPI backends.
SKILLS: React, TypeScript, Tailwind CSS, JavaScript, HTML5, CSS3, Python, FastAPI, Git, Redux Toolkit.
PROJECTS: Analytics Dashboard (React, Recharts, FastAPI), Task Tracker (React, Redux).', 
'{
  "name": "Sarah Chen",
  "email": "sarah.candidate@example.com",
  "phone": "+1 555 876 5432",
  "education": ["B.S. in Software Engineering, UT Austin 2022"],
  "skills": ["React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML5", "CSS3", "Python", "FastAPI", "Git", "Redux Toolkit"],
  "experience": ["Junior Frontend Engineer at DataViz Inc. (2022-Present)"],
  "projects": ["Analytics Dashboard", "Task Tracker"]
}', true);

-- 5. JOB OPENINGS
INSERT INTO job_openings (id, employer_id, title, department, location, employment_type, salary_range, job_description, required_skills, preferred_skills, min_experience_years, status) VALUES
(1, 1, 'Senior Full Stack Engineer (React & Node.js)', 'Engineering', 'San Francisco, CA (Hybrid)', 'Full-time', '$120,000 - $150,000', 
'We are looking for a Senior Full Stack Engineer to lead web application development. You will build user-facing features using React and Tailwind CSS, design scalable REST APIs using Node.js and Express, write PostgreSQL queries, and containerize services with Docker and AWS.', 
'["React", "Node.js", "JavaScript", "PostgreSQL", "Express", "REST API", "Docker"]', 
'["AWS", "TypeScript", "Redis", "CI/CD", "Jest"]', 3.0, 'active'),

(2, 1, 'Frontend Engineer (React & Data Vis)', 'Product Development', 'Remote', 'Full-time', '$95,000 - $125,000', 
'Join our team as a Frontend Engineer! You will craft sleek, responsive web applications using React, TypeScript, and Tailwind CSS. Experience with state management (Redux/Zustand), API integration, and performance optimization is key.', 
'["React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML5", "CSS3", "REST API"]', 
'["Redux", "Recharts", "Figma", "WebSockets"]', 2.0, 'active');

-- 6. APPLICATIONS
INSERT INTO applications (id, job_id, candidate_id, resume_id, candidate_name, candidate_email, status) VALUES
(1, 1, 1, 1, 'Alex Morgan', 'alex.candidate@example.com', 'shortlisted'),
(2, 1, 2, 2, 'Sarah Chen', 'sarah.candidate@example.com', 'screening'),
(3, 2, 2, 2, 'Sarah Chen', 'sarah.candidate@example.com', 'interview');

-- 7. RESUME ANALYSES
INSERT INTO resume_analyses (id, resume_id, job_id, candidate_id, jd_text, overall_score, skills_match_score, experience_match_score, education_match_score, matched_skills, partially_matched_skills, missing_skills, resume_strengths, resume_weaknesses, resume_suggestions, recommended_skills, recommended_projects, recommended_certifications, learning_roadmap, ats_score, ats_feedback, explanation, status) VALUES
(1, 1, 1, 1, 
'Senior Full Stack Engineer (React & Node.js) - Requirements: React, Node.js, Express, PostgreSQL, REST API, Docker, AWS, TypeScript.', 
84.50, 85.00, 90.00, 85.00, 
'["React", "Node.js", "Express", "PostgreSQL", "REST API", "Docker", "JavaScript"]', 
'["TypeScript"]', 
'["AWS", "Redis", "CI/CD"]', 
'["Strong alignment in core stack (React, Node.js, PostgreSQL)", "Solid experience duration matching senior requirements", "Includes containerization (Docker) experience"]', 
'["Missing cloud infrastructure experience (AWS)", "No explicit deployment or CI/CD pipelines mentioned"]', 
'[
  {"type": "improvement", "original": "Worked on a website using React.", "suggested": "Architected and delivered a high-throughput React single-page application with optimized component render cycles and state management."},
  {"type": "keyword", "original": "Created database tables.", "suggested": "Designed normalized PostgreSQL schemas with indexing, foreign key constraints, and performance tuning."}
]', 
'[
  {"skill": "AWS (Amazon Web Services)", "reason": "High priority requirement for deployment and cloud infrastructure in target JD.", "difficulty": "Medium", "order": 1, "projectIdea": "Deploy Node.js/Postgres application to AWS ECS with RDS."},
  {"skill": "TypeScript", "reason": "Strongly preferred language requirement for full-stack architecture stability.", "difficulty": "Easy", "order": 2, "projectIdea": "Migrate existing JavaScript Express routes to strict TypeScript types."}
]', 
'[
  {"title": "AWS Cloud Deployed Microservice", "description": "Build and deploy a containerized Express API to AWS ECS with PostgreSQL RDS.", "techStack": ["AWS ECS", "AWS RDS", "Docker", "Node.js"]},
  {"title": "TypeScript Full Stack Dashboard", "description": "Build an end-to-end full stack application utilizing strict TypeScript interfaces on frontend and backend.", "techStack": ["React", "TypeScript", "Node.js", "Express"]}
]', 
'[
  {"name": "AWS Certified Developer – Associate", "provider": "Amazon Web Services"},
  {"name": "Meta Front-End / Back-End Professional Certificate", "provider": "Coursera / Meta"}
]', 
'[
  {"week": 1, "topic": "AWS Fundamentals & EC2/RDS Setup", "tasks": ["Study core AWS services (EC2, S3, RDS)", "Set up a free tier AWS account and launch a PostgreSQL RDS instance"]},
  {"week": 2, "topic": "Dockerization & Container Registry", "tasks": ["Dockerize Express backend & React frontend", "Push images to Amazon ECR (Elastic Container Registry)"]},
  {"week": 3, "topic": "AWS ECS Deployment & CI/CD", "tasks": ["Configure AWS ECS cluster with Fargate", "Set up GitHub Actions workflow for automatic deployment"]},
  {"week": 4, "topic": "TypeScript Refactoring & Final Testing", "tasks": ["Convert key Express routes to TypeScript", "Add end-to-end integration tests and document final architecture"]}
]', 
88.00, 
'{"formatting": "Clear headings, standard font styling", "missingKeywords": ["AWS", "Cloud Services", "CI/CD"], "readability": "Excellent section structure and bullet points"}', 
'Candidate displays a strong 84.5% match for Senior Full Stack Engineer. Primary skill gap centers on AWS Cloud Services and CI/CD pipelines.', 
'completed');

-- Reset sequences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('candidate_profiles_id_seq', (SELECT MAX(id) FROM candidate_profiles));
SELECT setval('employer_profiles_id_seq', (SELECT MAX(id) FROM employer_profiles));
SELECT setval('resumes_id_seq', (SELECT MAX(id) FROM resumes));
SELECT setval('job_openings_id_seq', (SELECT MAX(id) FROM job_openings));
SELECT setval('applications_id_seq', (SELECT MAX(id) FROM applications));
SELECT setval('resume_analyses_id_seq', (SELECT MAX(id) FROM resume_analyses));
