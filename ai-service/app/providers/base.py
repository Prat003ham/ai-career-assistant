from abc import ABC, abstractmethod
from typing import Dict, Any
from app.models.schemas import AnalysisResponse

class AIProvider(ABC):
    """Abstract Base Class for modular LLM and Heuristic AI Providers."""

    @abstractmethod
    async def analyze_resume_vs_jd(
        self, 
        resume_text: str, 
        jd_text: str, 
        parsed_resume: Dict[str, Any]
    ) -> AnalysisResponse:
        """Analyze candidate resume against target Job Description and return structured JSON response."""
        pass
