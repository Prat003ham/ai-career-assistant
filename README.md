# AI Career Assistant & Recruiter Copilot System

A complete, production-quality full-stack web application designed for **Candidates/Job Seekers** to analyze resumes against target Job Descriptions (JDs), uncover skill gaps, and follow personalized learning roadmaps — and for **Employers/Recruiters** to manage job requisitions, parse applicant PDF resumes, run AI match scoring, compare candidates side-by-side, and streamline hiring pipelines.

---

## 🌟 Architecture & Tech Stack

```mermaid
graph TD
    Client[React 18 + Vite + Tailwind CSS\nLucide Icons + Recharts] -->|REST API + JWT Auth| Backend[Node.js + Express.js API Gateway]
    Backend -->|SQL / Pool| Database[(PostgreSQL Database)]
    Backend -->|JSON Analysis Payload| AIService[Python FastAPI AI Microservice]
    AIService -->|PDF Processing| PDFParser[pdfplumber & pypdf Text Extractor]
    AIService -->|NLP & Normalization| SkillEngine[Skill Taxonomy Engine\n50+ Canonical Mappings]
    AIService -->|LLM / Heuristic Engine| LLMProvider[Modular AI Provider\nOpenAI / Gemini / Offline Heuristic]
```

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide Icons.
- **Backend API**: Node.js, Express.js, JWT Authentication, bcryptjs, Multer file upload handling.
- **Database**: PostgreSQL (with automatic database fallback for instant local execution).
- **AI Microservice**: Python 3.10, FastAPI, Pydantic v2, pdfplumber, pypdf, httpx, modular `AIProvider` system (OpenAI, Gemini, and Standalone Heuristic engine).
- **DevOps**: Docker, Docker Compose, Nginx.

---

## 🚀 System Workflows

### Candidate / Job Seeker Flow
1. Register/Login as a Candidate.
2. Upload PDF resume (automatically parsed for skills, experience, education, and contact details).
3. Paste target Job Description (JD).
4. System executes NLP skill extraction, canonical normalization (e.g. `ReactJS` = `React`), experience evaluation, and ATS quality checks.
5. View detailed dashboard:
   - Match Score breakdown (Skills 50%, Experience 25%, Education 10%, Projects 10%, ATS 5%).
   - Categorized skills: Matched, Partially Matched, Missing.
   - AI Bullet Point Improvements (Before vs After).
   - Recommended Projects & Certifications.
   - Interactive 4-Week Actionable Learning Roadmap.

### Employer / Recruiter Flow
1. Register/Login as an Employer.
2. Create Job Openings (title, location, salary range, JD text, required skills, min experience).
3. Add candidate applications & upload candidate PDF resumes.
4. System runs AI match scoring against the job's JD.
5. View Candidate AI Ranking table sorted by overall match or skills match.
6. Select multiple applicants and launch the Side-by-Side Candidate Comparison Matrix.
7. Move candidates through hiring stages (`Applied` → `Screening` → `Shortlisted` → `Interview` → `Selected` → `Rejected`).

---

## 🛠️ Folder Structure

```
ai-career-assistant/
├── frontend/                 # Vite + React + Tailwind CSS client
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, MatchGauge, DisclaimerBanner
│   │   ├── context/          # AuthContext
│   │   ├── pages/            # Candidate & Employer Dashboards, Analysis, Ranking, etc.
│   │   ├── services/         # Axios API clients
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js + Express API server
│   ├── src/
│   │   ├── config/           # Database configuration (Postgres + fallback)
│   │   ├── controllers/      # Auth, Resume, Job, Candidate, Analysis controllers
│   │   ├── middleware/       # authMiddleware, roleMiddleware, uploadMiddleware, errorHandler
│   │   ├── routes/           # REST API routes
│   │   ├── services/         # AI microservice integration helper
│   │   └── app.js
│   └── package.json
├── ai-service/               # Python FastAPI AI processing engine
│   ├── app/
│   │   ├── api/              # FastAPI endpoints
│   │   ├── models/           # Pydantic schemas
│   │   ├── services/         # resume_parser, skill_extractor, heuristic_provider
│   │   ├── providers/        # AIProvider interface, OpenAI, Gemini, Heuristic
│   │   └── main.py
│   └── requirements.txt
├── database/
│   ├── schema.sql            # PostgreSQL schema DDL
│   └── seed.sql              # Realistic demo seed data
├── docker-compose.yml        # Docker setup
├── .env.example              # Central configuration template
└── README.md
```

---

## 🔑 Environment Setup (`.env`)

Copy `.env.example` to `.env` in the root directory:

```ini
NODE_ENV=development
PORT=5000
JWT_SECRET=super_secret_jwt_key_ai_career_assistant_2026
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_career_assistant

AI_SERVICE_URL=http://127.0.0.1:8000
AI_SERVICE_PORT=8000

# Options: heuristic | openai | gemini
LLM_PROVIDER=heuristic
OPENAI_API_KEY=
GEMINI_API_KEY=
```

---

## ⚡ Quick Start Options

### Option 1: Run with Docker Compose (Recommended)

```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Microservice: http://localhost:8000

---

### Option 2: Run Services Locally

#### 1. Python AI Service
```bash
cd ai-service
pip install -r requirements.txt
python app/main.py
```
*Runs on http://localhost:8000*

#### 2. Node.js Express Backend
```bash
cd backend
npm install
npm run dev
```
*Runs on http://localhost:5000*

#### 3. React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:3000*

---

## 🧪 1-Click Demo Accounts

For instant testing, use the pre-configured 1-Click Demo buttons on the Login page:

- **Candidate Account**: `alex.candidate@example.com` / `password123`
- **Recruiter Account**: `recruiter@technova.com` / `password123`

---

## 🛡️ Responsible AI Policy

The AI Career Assistant System enforces strict Responsible AI principles:
- **Decision-Support Only**: AI match scores are decision-support signals and must not be used as sole rejection criteria.
- **Privacy & Non-Discrimination**: The AI engine strictly ignores protected attributes (race, gender, age, nationality, religion, health). Evaluation is strictly limited to job-relevant skills, experience length, education, and project quality.
