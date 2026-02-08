
from .base_agent import BaseAgent
from ..services.rag_system import rag_system
from typing import Dict, Any
import logging
import json
import re

logger = logging.getLogger("venturescout.agents.risk")

class RiskDetectionAgent(BaseAgent):
    """
    Forensic Risk Auditor: Detects red flags, inconsistencies, and deal-breakers.
    Strictly follows the requested RAG-based detection logic and JSON schema.
    """
    def __init__(self):
        system_instr = (
            "You are a forensic risk assessment specialist for venture capital. "
            "Your task is to identify red flags, inconsistencies, and critical risks in startup documents. "
            "You are skeptical, detail-oriented, and focus on evidence-based auditing."
        )
        super().__init__(system_instr, model_type="fast")

    async def detect_risks(self, startup_id: str, extracted_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Detects all risk flags using multiple targeted RAG queries.
        """
        logger.info(f"🚨 Agent 3: Detecting risks and red flags for {startup_id}...")
        
        # 1. Targeted RAG Queries (Mirroring the requested logic)
        metrics_context = rag_system.query(
            "Find all mentions of revenue, MRR, ARR, growth rate, customer count across all documents",
            startup_id,
            n_results=10
        )
        
        market_context = rag_system.query(
            "What market size, TAM, SAM claims are made? What is the addressable market?",
            startup_id,
            n_results=5
        )
        
        financial_context = rag_system.query(
            "What is the burn rate, runway, cash position, funding needs?",
            startup_id,
            n_results=5
        )
        
        team_context = rag_system.query(
            "Information about founders' experience, team composition, key roles filled",
            startup_id,
            n_results=5
        )
        
        customer_context = rag_system.query(
            "Customer retention, churn rate, customer satisfaction, feedback",
            startup_id,
            n_results=5
        )
        
        prompt = f"""
        You are a risk assessment specialist for venture capital.
        Analyze these documents for RED FLAGS and return ONLY valid JSON.

        EXTRACTED STRUCTURED DATA:
        {json.dumps(extracted_data, indent=2)}

        METRICS ACROSS DOCUMENTS:
        {metrics_context}

        MARKET SIZE CLAIMS:
        {market_context}

        FINANCIAL HEALTH:
        {financial_context}

        TEAM INFORMATION:
        {team_context}

        CUSTOMER INFORMATION:
        {customer_context}

        Detect these specific risks:
        1. INCONSISTENT METRICS - Do numbers contradict across documents?
        2. INFLATED MARKET SIZE - Is TAM unrealistic or too broad?
        3. FINANCIAL DISTRESS - Burn rate too high? Running out of money soon?
        4. TEAM RISKS - Missing critical roles? Lack of experience?
        5. CUSTOMER/MARKET RISKS - High churn rate? Unclear product-market fit?
        6. UNREALISTIC PROJECTIONS - Growth projections too aggressive?
        7. EXECUTION RISKS - Product not launched yet but claiming traction?

        Return this EXACT JSON structure:
        {{
          "red_flags": [
            {{
              "type": "inconsistent_metrics|inflated_market_size|financial_distress|team_risks|customer_risks|unrealistic_projections|execution_risks",
              "severity": "LOW|MEDIUM|HIGH|CRITICAL",
              "title": "string (Short risk title)",
              "description": "string (Brief description)",
              "evidence": ["Evidence point 1", "Evidence point 2"],
              "impact": "Why this matters"
            }}
          ],
          "risk_score": number_from_0_to_100,
          "overall_assessment": "Low Risk|Medium Risk|High Risk|Critical Risk"
        }}

        Rules:
        - Only flag risks with concrete evidence.
        - Be specific.
        - Return ONLY the JSON object.
        """
        
        result = await self.call_gemini(prompt)
        
        if result.get("error"):
            logger.error(f"Risk detection failed: {result.get('detail')}")
            return self._get_default_structure()
            
        data = result.get("json", self._get_default_structure())
        
        # Mapping to internal 'risks' structure for synthesis compatibility
        mapped_risks = []
        for flag in data.get("red_flags", []):
            mapped_risks.append({
                "severity": flag.get("severity", "Medium").title(), # Normalize to "High", "Medium", "Low"
                "category": flag.get("type", "General").replace("_", " ").title(),
                "description": f"{flag.get('title')}: {flag.get('description')}"
            })
            
        data["risks"] = mapped_risks
        logger.info(f"✅ Risk detection complete! Found {len(mapped_risks)} red flags")
        return data

    def _get_default_structure(self) -> Dict[str, Any]:
        """Requested default fallback structure"""
        return {
            "red_flags": [],
            "risk_score": 50,
            "overall_assessment": "Unable to assess - analysis error",
            "risks": []
        }
