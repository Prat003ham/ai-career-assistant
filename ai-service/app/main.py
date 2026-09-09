import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load central environment variables
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.models.schemas import AnalysisRequest, AnalysisResponse, ParsedResumeData
from app.services.resume_parser import extract_text_from_pdf_bytes, parse_resume_text
from app.providers.base import AIProvider
from app.providers.heuristic_provider import HeuristicFallbackProvider
from app.providers.openai_provider import OpenAIProvider
from app.providers.gemini_provider import GeminiProvider

app = FastAPI(
    title="AI Career Assistant - AI Microservice",
    version="1.0.0",
    description="FastAPI service for PDF resume parsing, NLP skill extraction, resume-JD match scoring, and personalized AI recommendations."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_ai_provider() -> AIProvider:
    provider_type = os.getenv("LLM_PROVIDER", "heuristic").lower()
    if provider_type == "openai":
        api_key = os.getenv("OPENAI_API_KEY", "")
        return OpenAIProvider(api_key=api_key)
    elif provider_type == "gemini":
        api_key = os.getenv("GEMINI_API_KEY", "")
        return GeminiProvider(api_key=api_key)
    else:
        return HeuristicFallbackProvider()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ai-service",
        "provider": os.getenv("LLM_PROVIDER", "heuristic")
    }

@app.post("/parse", response_model=ParsedResumeData)
async def parse_resume_file(file: UploadFile = File(None), text: str = Form(None)):
    """Parse resume PDF or raw text into structured JSON response."""
    extracted_text = ""
    if file:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        bytes_data = await file.read()
        extracted_text = extract_text_from_pdf_bytes(bytes_data)
    elif text:
        extracted_text = text
    else:
        raise HTTPException(status_code=400, detail="Either file upload or text content must be provided.")

    if not extracted_text:
        raise HTTPException(status_code=422, detail="Failed to extract text from provided resume.")

    parsed_result = parse_resume_text(extracted_text)
    return ParsedResumeData(**parsed_result)

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume_vs_jd(request: AnalysisRequest):
    """Analyze resume against Job Description and return structured recommendations."""
    if not request.resume_text or not request.jd_text:
        raise HTTPException(status_code=400, detail="Both resume_text and jd_text are required.")

    parsed_data = request.parsed_resume
    if not parsed_data:
        parsed_data = parse_resume_text(request.resume_text)

    provider = get_ai_provider()
    try:
        analysis_result = await provider.analyze_resume_vs_jd(
            resume_text=request.resume_text,
            jd_text=request.jd_text,
            parsed_resume=parsed_data
        )
        return analysis_result
    except Exception as e:
        print(f"Error during AI analysis execution: {e}")
        # Fallback guarantee
        fallback_provider = HeuristicFallbackProvider()
        return await fallback_provider.analyze_resume_vs_jd(
            resume_text=request.resume_text,
            jd_text=request.jd_text,
            parsed_resume=parsed_data
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
