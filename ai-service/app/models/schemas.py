from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ResumeParseRequest(BaseModel):
    text: Optional[str] = None

class ParsedResumeData(BaseModel):
    name: Optional[str] = "Candidate"
    email: Optional[str] = None
    phone: Optional[str] = None
    education: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    links: List[str] = Field(default_factory=list)

class AnalysisRequest(BaseModel):
    resume_text: str
    jd_text: str
    parsed_resume: Optional[Dict[str, Any]] = None

class ResumeSuggestionItem(BaseModel):
    type: str = "improvement"  # improvement | keyword | formatting
    original: str
    suggested: str

class RecommendedSkillItem(BaseModel):
    skill: str
    reason: str
    importance: str = "High"  # High | Medium | Low
    difficulty: str = "Medium"  # Easy | Medium | Hard
    order: int = 1
    projectIdea: str

class RecommendedProjectItem(BaseModel):
    title: str
    description: str
    techStack: List[str] = Field(default_factory=list)

class RecommendedCertificationItem(BaseModel):
    name: str
    provider: str

class RoadmapWeekItem(BaseModel):
    week: int
    topic: str
    tasks: List[str] = Field(default_factory=list)

class AnalysisResponse(BaseModel):
    overallScore: float
    skillsMatchScore: float
    experienceMatchScore: float
    educationMatchScore: float
    matchedSkills: List[str] = Field(default_factory=list)
    partiallyMatchedSkills: List[str] = Field(default_factory=list)
    missingSkills: List[str] = Field(default_factory=list)
    importantKeywordsMissing: List[str] = Field(default_factory=list)
    resumeStrengths: List[str] = Field(default_factory=list)
    resumeWeaknesses: List[str] = Field(default_factory=list)
    resumeSuggestions: List[ResumeSuggestionItem] = Field(default_factory=list)
    recommendedSkills: List[RecommendedSkillItem] = Field(default_factory=list)
    recommendedProjects: List[RecommendedProjectItem] = Field(default_factory=list)
    recommendedCertifications: List[RecommendedCertificationItem] = Field(default_factory=list)
    learningRoadmap: List[RoadmapWeekItem] = Field(default_factory=list)
    atsScore: float = 80.0
    atsFeedback: Dict[str, Any] = Field(default_factory=dict)
    explanation: str = ""
