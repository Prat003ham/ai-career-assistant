import json
import httpx
from typing import Dict, Any
from app.providers.base import AIProvider
from app.providers.heuristic_provider import HeuristicFallbackProvider
from app.models.schemas import AnalysisResponse

class GeminiProvider(AIProvider):
    """Google Gemini API Provider with Heuristic fallback."""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = HeuristicFallbackProvider()

    async def analyze_resume_vs_jd(
        self, 
        resume_text: str, 
        jd_text: str, 
        parsed_resume: Dict[str, Any]
    ) -> AnalysisResponse:
        if not self.api_key:
            return await self.fallback.analyze_resume_vs_jd(resume_text, jd_text, parsed_resume)

        prompt = f"""
You are an expert AI Resume Analyst. Analyze this Resume against the Job Description.

RESUME TEXT:
{resume_text}

JOB DESCRIPTION:
{jd_text}

Respond strictly in valid JSON matching this exact structure:
{{
  "overallScore": 82.5,
  "skillsMatchScore": 85.0,
  "experienceMatchScore": 80.0,
  "educationMatchScore": 90.0,
  "matchedSkills": ["React", "Node.js"],
  "partiallyMatchedSkills": ["TypeScript"],
  "missingSkills": ["AWS", "Docker"],
  "importantKeywordsMissing": ["AWS"],
  "resumeStrengths": ["Good core tech stack match"],
  "resumeWeaknesses": ["Lacks cloud experience"],
  "resumeSuggestions": [
    {{"type": "improvement", "original": "Built website", "suggested": "Architected high-performance React application"}}
  ],
  "recommendedSkills": [
    {{"skill": "AWS", "reason": "Required for cloud deployment", "importance": "High", "difficulty": "Medium", "order": 1, "projectIdea": "Deploy Node app to AWS"}}
  ],
  "recommendedProjects": [
    {{"title": "AWS Cloud Microservice", "description": "Build and deploy Node app on AWS", "techStack": ["AWS", "Docker"]}}
  ],
  "recommendedCertifications": [
    {{"name": "AWS Certified Developer", "provider": "Amazon Web Services"}}
  ],
  "learningRoadmap": [
    {{"week": 1, "topic": "AWS Basics", "tasks": ["Setup AWS free tier", "Deploy container"]}}
  ],
  "atsScore": 85.0,
  "atsFeedback": {{"readability": "Good", "missingKeywords": ["AWS"]}},
  "explanation": "Summary of match."
}}
        """

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    url,
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"response_mime_type": "application/json"}
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    parsed_json = json.loads(raw_text)
                    return AnalysisResponse(**parsed_json)
                else:
                    print(f"Gemini API Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Gemini API Exception: {e}. Using fallback...")

        return await self.fallback.analyze_resume_vs_jd(resume_text, jd_text, parsed_resume)
