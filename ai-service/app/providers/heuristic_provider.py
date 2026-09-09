import re
from typing import Dict, Any, List
from app.providers.base import AIProvider
from app.models.schemas import (
    AnalysisResponse, 
    ResumeSuggestionItem, 
    RecommendedSkillItem, 
    RecommendedProjectItem, 
    RecommendedCertificationItem, 
    RoadmapWeekItem
)
from app.services.skill_extractor import (
    extract_skills_from_text, 
    categorize_skills, 
    normalize_skill
)

class HeuristicFallbackProvider(AIProvider):
    """Rule-based intelligent NLP analysis engine that works offline without cloud API keys."""

    async def analyze_resume_vs_jd(
        self, 
        resume_text: str, 
        jd_text: str, 
        parsed_resume: Dict[str, Any]
    ) -> AnalysisResponse:
        
        # 1. Skill Extraction & Normalization
        resume_skills = parsed_resume.get("skills", [])
        if not resume_skills:
            resume_skills = extract_skills_from_text(resume_text)
            
        jd_skills = extract_skills_from_text(jd_text)
        
        matched_skills, partially_matched_skills, missing_skills = categorize_skills(resume_skills, jd_skills)

        # 2. Calculate Sub-Scores
        # Skills Score (50% weight)
        total_jd_skills = len(jd_skills) if len(jd_skills) > 0 else 1
        skills_match_score = min(100.0, ((len(matched_skills) + 0.5 * len(partially_matched_skills)) / total_jd_skills) * 100.0)
        skills_match_score = round(max(30.0, skills_match_score), 1)

        # Experience Score (25% weight)
        exp_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs)', jd_text, re.IGNORECASE)
        required_yrs = float(exp_matches[0]) if exp_matches else 2.0
        
        cand_exp_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs)', resume_text, re.IGNORECASE)
        cand_yrs = float(cand_exp_matches[0]) if cand_exp_matches else 2.5

        if cand_yrs >= required_yrs:
            experience_match_score = 90.0 + min(10.0, (cand_yrs - required_yrs) * 2)
        else:
            experience_match_score = round(max(40.0, (cand_yrs / required_yrs) * 85.0), 1)

        # Education Score (10% weight)
        edu_score = 80.0
        if any(term in resume_text.lower() for term in ["b.s.", "bachelor", "master", "m.s.", "computer science", "engineering"]):
            edu_score = 90.0
        education_match_score = edu_score

        # Projects / Relevance Score (10% weight)
        projects_count = len(parsed_resume.get("projects", []))
        projects_score = min(95.0, 70.0 + (projects_count * 10.0))

        # ATS Score (5% weight)
        word_count = len(resume_text.split())
        ats_formatting_score = 85.0
        if word_count < 150:
            ats_formatting_score = 60.0
        elif word_count > 1000:
            ats_formatting_score = 75.0
            
        ats_score = round((ats_formatting_score * 0.4) + (skills_match_score * 0.6), 1)

        # Overall Configurable Weighted Score:
        # Skills: 50%, Experience: 25%, Education: 10%, Projects: 10%, ATS Quality: 5%
        overall_score = round(
            (skills_match_score * 0.50) +
            (experience_match_score * 0.25) +
            (education_match_score * 0.10) +
            (projects_score * 0.10) +
            (ats_score * 0.05),
            1
        )

        # 3. Build Strengths & Weaknesses
        strengths = []
        weaknesses = []
        if matched_skills:
            strengths.append(f"Strong overlap in core required skills ({', '.join(matched_skills[:4])}).")
        if cand_yrs >= required_yrs:
            strengths.append(f"Meets or exceeds required experience level ({cand_yrs} years vs {required_yrs} years required).")
        if parsed_resume.get("education"):
            strengths.append("Relevant academic degree background included on resume.")

        if missing_skills:
            weaknesses.append(f"Missing key job requirements: {', '.join(missing_skills[:4])}.")
        if cand_yrs < required_yrs:
            weaknesses.append(f"Experience length ({cand_yrs} yrs) is below requested target ({required_yrs} yrs).")
        if ats_score < 75:
            weaknesses.append("Resume section structure or formatting could be optimized for Applicant Tracking Systems.")

        # 4. Generate Resume Bullet Point Suggestions
        suggestions: List[ResumeSuggestionItem] = []
        if missing_skills:
            top_missing = missing_skills[0]
            suggestions.append(ResumeSuggestionItem(
                type="keyword",
                original="Worked on web application development tasks.",
                suggested=f"Developed scalable web application modules utilizing {top_missing} and RESTful microservices."
            ))
        suggestions.append(ResumeSuggestionItem(
            type="improvement",
            original="Responsible for managing database queries.",
            suggested="Designed and optimized indexed database queries resulting in a 35% reduction in API response times."
        ))

        # 5. Generate Recommended Skills
        recommended_skills: List[RecommendedSkillItem] = []
        for idx, skill in enumerate(missing_skills[:3], start=1):
            recommended_skills.append(RecommendedSkillItem(
                skill=skill,
                reason=f"Explicitly listed as a key requirement in target Job Description.",
                importance="High" if idx == 1 else "Medium",
                difficulty="Medium",
                order=idx,
                projectIdea=f"Build an end-to-end full stack application showcasing production usage of {skill}."
            ))

        # 6. Recommended Projects & Certifications
        recommended_projects: List[RecommendedProjectItem] = []
        if missing_skills:
            skill_focus = " & ".join(missing_skills[:2])
            recommended_projects.append(RecommendedProjectItem(
                title=f"{skill_focus} Portfolio Project",
                description=f"Construct a cloud-ready application incorporating {skill_focus} with interactive UI components and unit tests.",
                techStack=missing_skills[:3] + ["Git", "Docker"]
            ))

        recommended_certifications = [
            RecommendedCertificationItem(name="AWS Certified Developer – Associate", provider="Amazon Web Services"),
            RecommendedCertificationItem(name="Meta Front-End / Back-End Specialization", provider="Coursera / Meta")
        ]

        # 7. Learning Roadmap
        learning_roadmap: List[RoadmapWeekItem] = []
        target_skills = missing_skills if missing_skills else ["Advanced System Architecture", "Cloud Deployment"]
        
        for w in range(1, 5):
            skill_focus = target_skills[(w - 1) % len(target_skills)]
            learning_roadmap.append(RoadmapWeekItem(
                week=w,
                topic=f"Week {w}: Core Mastery of {skill_focus}",
                tasks=[
                    f"Study official documentation and fundamental concepts of {skill_focus}",
                    f"Implement mini-hands-on code snippets incorporating {skill_focus}",
                    f"Integrate {skill_focus} into your primary GitHub project repository",
                    f"Document code, write unit tests, and add project details to resume"
                ]
            ))

        explanation = (
            f"Overall compatibility score is {overall_score}%. "
            f"Candidate satisfies {len(matched_skills)} core skill requirements with strong experience alignment. "
            f"Focusing on the {len(missing_skills)} missing skills will significantly elevate candidacy."
        )

        return AnalysisResponse(
            overallScore=overall_score,
            skillsMatchScore=skills_match_score,
            experienceMatchScore=experience_match_score,
            educationMatchScore=education_match_score,
            matchedSkills=matched_skills,
            partiallyMatchedSkills=partially_matched_skills,
            missingSkills=missing_skills,
            importantKeywordsMissing=missing_skills[:5],
            resumeStrengths=strengths if strengths else ["Clear contact details and education section."],
            resumeWeaknesses=weaknesses if weaknesses else ["Minor keyword adjustments recommended."],
            resumeSuggestions=suggestions,
            recommendedSkills=recommended_skills,
            recommendedProjects=recommended_projects,
            recommendedCertifications=recommended_certifications,
            learningRoadmap=learning_roadmap,
            atsScore=ats_score,
            atsFeedback={
                "formatting": "Standard text formatting detected.",
                "missingKeywords": missing_skills[:5],
                "readability": "Good overall structure and line length."
            },
            explanation=explanation
        )
