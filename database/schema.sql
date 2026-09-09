-- AI Career Assistant System - PostgreSQL Schema DDL

-- Drop existing tables if they exist (in proper reverse-dependency order)
DROP TABLE IF EXISTS resume_analyses CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS job_openings CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS employer_profiles CASCADE;
DROP TABLE IF EXISTS candidate_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('candidate', 'employer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. CANDIDATE PROFILES TABLE
CREATE TABLE candidate_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    bio TEXT,
    target_role VARCHAR(255),
    years_of_experience NUMERIC(4,1) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_profiles_user_id ON candidate_profiles(user_id);

-- 3. EMPLOYER PROFILES TABLE
CREATE TABLE employer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_website VARCHAR(255),
    company_size VARCHAR(100),
    industry VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employer_profiles_user_id ON employer_profiles(user_id);

-- 4. RESUMES TABLE
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    parsed_text TEXT,
    parsed_data JSONB DEFAULT '{}'::jsonb,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);

-- 5. JOB OPENINGS TABLE
CREATE TABLE job_openings (
    id SERIAL PRIMARY KEY,
    employer_id INTEGER NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50) DEFAULT 'Full-time',
    salary_range VARCHAR(100),
    job_description TEXT NOT NULL,
    required_skills JSONB DEFAULT '[]'::jsonb,
    preferred_skills JSONB DEFAULT '[]'::jsonb,
    min_experience_years NUMERIC(4,1) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_openings_employer_id ON job_openings(employer_id);
CREATE INDEX idx_job_openings_status ON job_openings(status);

-- 6. APPLICATIONS TABLE
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES candidate_profiles(id) ON DELETE SET NULL,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE SET NULL,
    candidate_name VARCHAR(255) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'shortlisted', 'interview', 'selected', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);

-- 7. RESUME ANALYSES TABLE
CREATE TABLE resume_analyses (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES job_openings(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    jd_text TEXT,
    overall_score NUMERIC(5,2) DEFAULT 0,
    skills_match_score NUMERIC(5,2) DEFAULT 0,
    experience_match_score NUMERIC(5,2) DEFAULT 0,
    education_match_score NUMERIC(5,2) DEFAULT 0,
    matched_skills JSONB DEFAULT '[]'::jsonb,
    partially_matched_skills JSONB DEFAULT '[]'::jsonb,
    missing_skills JSONB DEFAULT '[]'::jsonb,
    resume_strengths JSONB DEFAULT '[]'::jsonb,
    resume_weaknesses JSONB DEFAULT '[]'::jsonb,
    resume_suggestions JSONB DEFAULT '[]'::jsonb,
    recommended_skills JSONB DEFAULT '[]'::jsonb,
    recommended_projects JSONB DEFAULT '[]'::jsonb,
    recommended_certifications JSONB DEFAULT '[]'::jsonb,
    learning_roadmap JSONB DEFAULT '[]'::jsonb,
    ats_score NUMERIC(5,2) DEFAULT 0,
    ats_feedback JSONB DEFAULT '{}'::jsonb,
    explanation TEXT,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resume_analyses_resume_id ON resume_analyses(resume_id);
CREATE INDEX idx_resume_analyses_job_id ON resume_analyses(job_id);
CREATE INDEX idx_resume_analyses_candidate_id ON resume_analyses(candidate_id);
