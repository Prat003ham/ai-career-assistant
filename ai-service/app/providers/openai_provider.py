import json
import httpx
from typing import Dict, Any
from app.providers.base import AIProvider
from app.providers.heuristic_provider import HeuristicFallbackProvider
from app.models.schemas import AnalysisResponse

class OpenAIProvider(AIProvider):
    """OpenAI API Provider with Heuristic fallback."""

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
You are an expert AI Resume Analyst and Career Coach. 
Analyze the given Resume against the Job Description.

RESUME TEXT:
{resume_text}

JOB DESCRIPTION:
{jd_text}

Respond strictly in valid JSON matching this schema:
{{
  "overallScore": 82.5,
  "skillsMatchScore": 85.0,
  "experienceMatchScore": 80.0,
  "educationMatchScore": 90.0,
  "matchedSkills": ["React", "Node.js"],
  "partiallyMatchedSkills": ["TypeScript"],
  "missingSkills": ["AWS", "Docker"],
  "importantKeywordsMissing": ["AWS", "Docker"],
  "resumeStrengths": ["Strong frontend experience with React"],
  "resumeWeaknesses": ["Lacks cloud deployment skills"],
  "resumeSuggestions": [
    {{"type": "improvement", "original": "Built website", "suggested": "Architected high-performance React application"}}
  ],
  "recommendedSkills": [
    {{"skill": "AWS", "reason": "Required for cloud deployment", "importance": "High", "difficulty": "Medium", "order": 1, "projectIdea": "Deploy Node app to AWS ECS"}}
  ],
  "recommendedProjects": [
    {{"title": "AWS Cloud Microservice", "description": "Build and deploy Node app on AWS", "techStack": ["AWS", "Docker", "Node.js"]}}
  ],
  "recommendedCertifications": [
    {{"name": "AWS Certified Developer", "provider": "Amazon Web Services"}}
  ],
  "learningRoadmap": [
    {{"week": 1, "topic": "AWS Basics", "tasks": ["Setup AWS free tier", "Deploy simple container"]}}
  ],
  "atsScore": 85.0,
  "atsFeedback": {{"readability": "Good", "missingKeywords": ["AWS"]}},
  "explanation": "Detailed summary of candidate match."
}}
        """

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "response_format": {"type": "json_object"},
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.2
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed_json = json.loads(content)
                    return AnalysisResponse(**parsed_json)
                else:
                    print(f"OpenAI API Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"OpenAI API Exception: {e}. Using fallback...")

        return await self.fallback.analyze_resume_vs_jd(resume_text, jd_text, parsed_resume)
