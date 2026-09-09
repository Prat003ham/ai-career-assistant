import re
import io
from typing import Dict, Any, List

def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    """Extract raw text from PDF bytes using pdfplumber with pypdf fallback."""
    text = ""
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"pdfplumber extraction error: {e}, falling back to pypdf...")
        try:
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        except Exception as e2:
            print(f"pypdf extraction error: {e2}")

    return text.strip()

def parse_resume_text(text: str) -> Dict[str, Any]:
    """Parse raw text into structured resume sections using rule-based regex and pattern extraction."""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Extract Email
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    email = email_match.group(0) if email_match else None

    # Extract Phone
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else None

    # Extract Name (typically first non-empty line without email/phone)
    name = "Candidate"
    for line in lines[:5]:
        if not re.search(r'@|http|\+?\d{10}', line) and len(line.split()) <= 4:
            name = line
            break

    # Extract Links
    links = re.findall(r'(https?://[^\s]+|github\.com/[^\s]+|linkedin\.com/in/[^\s]+)', text)

    # Section Headers detection
    section_keywords = {
        'skills': ['skills', 'technical skills', 'core competencies', 'technologies', 'expertise'],
        'experience': ['experience', 'work experience', 'employment history', 'work history', 'professional experience'],
        'education': ['education', 'academic background', 'qualification', 'academic history'],
        'projects': ['projects', 'key projects', 'personal projects', 'featured projects'],
        'certifications': ['certifications', 'certificates', 'licenses', 'credentials'],
        'achievements': ['achievements', 'awards', 'honors', 'accomplishments']
    }

    sections: Dict[str, List[str]] = {
        'skills': [],
        'experience': [],
        'education': [],
        'projects': [],
        'certifications': [],
        'achievements': []
    }

    current_section = None
    for line in lines:
        lower_line = line.lower().strip(':')
        matched_section = None
        for sec_name, keywords in section_keywords.items():
            if lower_line in keywords or any(lower_line.startswith(k + ':') for k in keywords):
                matched_section = sec_name
                break
        
        if matched_section:
            current_section = matched_section
        elif current_section:
            sections[current_section].append(line)

    # Clean up skills section into a list
    skills_list = []
    if sections['skills']:
        skill_text = " ".join(sections['skills'])
        # Split by commas, bullets, pipes, or newlines
        items = re.split(r'[,|•·\n]', skill_text)
        skills_list = [item.strip() for item in items if item.strip() and len(item.strip()) < 40]
    else:
        # Generic skill extraction fallback from full text
        common_tech_skills = [
            "JavaScript", "TypeScript", "React", "React.js", "Node.js", "Express", "Python", 
            "FastAPI", "Django", "PostgreSQL", "MySQL", "MongoDB", "Docker", "AWS", "Git", 
            "HTML5", "CSS3", "Tailwind CSS", "REST API", "GraphQL", "Redux", "Jest", "Java", 
            "Spring Boot", "C++", "Kubernetes", "Linux", "CI/CD"
        ]
        for skill in common_tech_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
                skills_list.append(skill)

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "education": sections['education'][:5],
        "experience": sections['experience'][:10],
        "skills": list(set(skills_list)),
        "projects": sections['projects'][:5],
        "certifications": sections['certifications'][:5],
        "achievements": sections['achievements'][:5],
        "links": list(set(links))
    }
