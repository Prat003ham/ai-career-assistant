import re
from typing import List, Dict, Tuple, Set

# Comprehensive Skill Taxonomy & Canonical Mapping
SKILL_SYNONYMS: Dict[str, str] = {
    "react": "React",
    "reactjs": "React",
    "react.js": "React",
    "react native": "React Native",
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "express": "Express.js",
    "expressjs": "Express.js",
    "express.js": "Express.js",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "postgres db": "PostgreSQL",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "ts": "TypeScript",
    "typescript": "TypeScript",
    "js": "JavaScript",
    "javascript": "JavaScript",
    "es6": "JavaScript",
    "py": "Python",
    "python3": "Python",
    "fastapi": "FastAPI",
    "django": "Django",
    "flask": "Flask",
    "docker": "Docker",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "aws": "AWS",
    "amazon web services": "AWS",
    "gcp": "Google Cloud",
    "google cloud": "Google Cloud",
    "azure": "Azure",
    "git": "Git",
    "github": "Git",
    "gitlab": "Git",
    "html": "HTML5",
    "html5": "HTML5",
    "css": "CSS3",
    "css3": "CSS3",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "bootstrap": "Bootstrap",
    "rest": "REST API",
    "rest api": "REST API",
    "restful api": "REST API",
    "graphql": "GraphQL",
    "sql": "SQL",
    "nosql": "NoSQL",
    "redux": "Redux",
    "redux toolkit": "Redux",
    "jest": "Jest",
    "cypress": "Cypress",
    "mocha": "Mocha",
    "java": "Java",
    "spring": "Spring Boot",
    "spring boot": "Spring Boot",
    "c#": "C#",
    ".net": ".NET",
    "asp.net": ".NET",
    "cpp": "C++",
    "c++": "C++",
    "golang": "Go",
    "go": "Go",
    "rust": "Rust",
    "redis": "Redis",
    "elasticsearch": "Elasticsearch",
    "ci/cd": "CI/CD",
    "continuous integration": "CI/CD",
    "jenkins": "Jenkins",
    "github actions": "GitHub Actions",
    "terraform": "Terraform",
    "microservices": "Microservices",
    "agile": "Agile",
    "scrum": "Scrum",
    "jira": "Jira",
    "system design": "System Design",
    "unit testing": "Unit Testing"
}

def normalize_skill(skill: str) -> str:
    """Normalize skill strings into standard canonical representations."""
    cleaned = skill.strip().lower()
    return SKILL_SYNONYMS.get(cleaned, skill.strip().title())

def extract_skills_from_text(text: str) -> List[str]:
    """Extract and normalize all technical skills mentioned in a block of text."""
    found_skills: Set[str] = set()
    lowered_text = text.lower()
    
    # Check taxonomy keys
    for term, canonical in SKILL_SYNONYMS.items():
        # Match word boundary
        pattern = r'(?:\b|_)' + re.escape(term) + r'(?:\b|_)'
        if re.search(pattern, lowered_text):
            found_skills.add(canonical)
            
    return list(found_skills)

def categorize_skills(resume_skills: List[str], jd_skills: List[str]) -> Tuple[List[str], List[str], List[str]]:
    """
    Categorize skills into:
    1. Matched Skills (exact match or normalized canonical match)
    2. Partially Matched Skills (related concepts or family matches)
    3. Missing Skills (in JD but absent from resume)
    """
    norm_resume = {normalize_skill(s): s for s in resume_skills}
    norm_jd = {normalize_skill(s): s for s in jd_skills}

    matched: Set[str] = set()
    partially_matched: Set[str] = set()
    missing: Set[str] = set()

    # Domain relationships for partial matching
    skill_families = [
        {"React", "Vue.js", "Angular", "Svelte"},  # Modern Frontend
        {"Node.js", "Express.js", "FastAPI", "Django", "Flask", "Spring Boot"},  # Backend Frameworks
        {"PostgreSQL", "MySQL", "MongoDB", "SQL", "Redis"},  # Databases
        {"AWS", "Google Cloud", "Azure", "Docker", "Kubernetes"},  # Cloud & DevOps
        {"TypeScript", "JavaScript"},  # JS Ecosystem
        {"HTML5", "CSS3", "Tailwind CSS", "Bootstrap"}  # Web Fundamentals
    ]

    for norm_j, original_j in norm_jd.items():
        if norm_j in norm_resume:
            matched.add(norm_j)
        else:
            # Check for partial match in skill family
            has_partial = False
            for family in skill_families:
                if norm_j in family:
                    # Check if candidate has another skill in the same family
                    candidate_family_skills = family.intersection(set(norm_resume.keys()))
                    if candidate_family_skills:
                        partially_matched.add(norm_j)
                        has_partial = True
                        break
            if not has_partial:
                missing.add(norm_j)

    return list(matched), list(partially_matched), list(missing)
