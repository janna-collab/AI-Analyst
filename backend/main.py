
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from typing import List, Optional
import uuid
from datetime import datetime
import logging

from .agents.agent_orchestrator import orchestrator
from .services.document_processor import document_processor
from .services.pdf_service import pdf_service
from .services.email_service import email_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("venturescout.api")

app = FastAPI(
    title="VentureScout AI - Core Intelligence API",
    version="1.0.0",
    description="Multi-agent backend for institutional startup evaluation."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/analysis/analyze")
async def analyze(
    notes: Optional[str] = Form("Standard analysis."),
    sector: Optional[str] = Form("General Tech"),
    files: List[UploadFile] = File(...)
):
    try:
        logger.info(f"Received analysis request for sector: {sector} with {len(files)} files.")
        file_parts = await document_processor.process_files(files)
        result = await orchestrator.run_analysis(file_parts, notes)
        result["timestamp"] = datetime.utcnow().isoformat()
        result["status"] = "COMPLETED"
        return result
    except ValueError as ve:
        logger.error(f"Configuration Error: {ve}")
        raise HTTPException(status_code=500, detail="Server misconfiguration (API Key issues).")
    except Exception as e:
        logger.error(f"Analysis Pipeline Failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"The AI swarm encountered an error: {str(e)}")

@app.post("/api/v1/analysis/export-pdf")
async def export_pdf(analysis: dict):
    try:
        pdf_bytes = pdf_service.generate_memo_pdf(analysis)
        filename = f"Investment_Memo_{analysis.get('companyName', 'Startup')}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        logger.error(f"PDF Export Failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@app.post("/api/v1/analysis/send-email")
async def send_email(payload: dict = Body(...)):
    """
    Sends the analysis report to an investor via Gmail.
    Payload: { "analysis": StartupAnalysis, "email": string, "message": string }
    """
    analysis = payload.get("analysis")
    recipient = payload.get("email")
    message = payload.get("message", "")
    
    if not analysis or not recipient:
        raise HTTPException(status_code=400, detail="Missing analysis data or recipient email.")
        
    try:
        result = await email_service.send_analysis_report(recipient, analysis, message)
        return result
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Gmail credentials.json not found on server.")
    except Exception as e:
        logger.error(f"Email Dispatch Failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {
        "status": "operational",
        "engine": "Gemini 3 Pro",
        "timestamp": datetime.utcnow().isoformat()
    }
