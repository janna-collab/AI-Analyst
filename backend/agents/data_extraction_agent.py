
from .base_agent import BaseAgent
from ..services.rag_system import rag_system
from typing import Dict, Any
import logging
import json

logger = logging.getLogger("venturescout.agents.extractor")

class DataExtractionAgent(BaseAgent):
    """
    Data Associate: Extracts institutional-grade structured profiles from raw documents.
    Strictly follows the requested multi-context logic and output schema.
    """
    def __init__(self):
        system_instr = (
            "You are a professional data extraction specialist for venture capital analysis. "
            "Your goal is to extract factual data from documents with high precision. "
            "Be conservative and do not hallucinate data."
        )
        super().__init__(system_instr, model_type="fast")

    async def extract(self, startup_id: str) -> Dict[str, Any]:
        """
        Extracts structured data by performing multiple targeted RAG queries.
        """
        logger.info(f"🔍 Agent 1: Performing deep multi-context extraction for {startup_id}...")
        
        # 1. Targeted RAG Queries (Mirroring the requested logic)
        company_context = rag_system.query(
            "What is the company name, sector, industry, and location?",
            startup_id,
            n_results=3
        )
        
        business_context = rag_system.query(
            "What problem are they solving? What is their solution? Who are their target customers? What is their business model?",
            startup_id,
            n_results=5
        )
        
        metrics_context = rag_system.query(
            "What are the financial metrics: revenue, MRR, ARR, growth rate, customers, burn rate, runway?",
            startup_id,
            n_results=5
        )
        
        team_context = rag_system.query(
            "Who are the founders? What is the team size? What is their experience?",
            startup_id,
            n_results=3
        )
        
        market_context = rag_system.query(
            "What is the market size? TAM, SAM, SOM? Market opportunity?",
            startup_id,
            n_results=3
        )
        
        funding_context = rag_system.query(
            "How much funding have they raised? From which investors? What round?",
            startup_id,
            n_results=3
        )

        # 2. Synthesis Prompt
        prompt = f"""
        Extract structured information from these startup documents and return ONLY valid JSON.

        CONTEXT SECTIONS:
        
        COMPANY INFORMATION:
        {company_context}

        BUSINESS MODEL:
        {business_context}

        FINANCIAL METRICS:
        {metrics_context}

        TEAM:
        {team_context}

        MARKET:
        {market_context}

        FUNDING:
        {funding_context}

        Return this EXACT JSON structure:
        {{
          "company_info": {{
            "name": "company name or Unknown",
            "sector": "SaaS/FinTech/HealthTech/E-commerce/AI/EdTech/etc or Unknown",
            "stage": "Pre-seed/Seed/Series A/Series B/etc or Unknown",
            "founded_year": number_or_null,
            "location": "City, Country or Unknown"
          }},
          "business": {{
            "problem": "brief problem description or Not stated",
            "solution": "brief solution description or Not stated",
            "target_market": "target customer description or Not stated",
            "business_model": "revenue model description or Not stated",
            "unique_value_prop": "what makes them unique or Not stated",
            "market_size_tam": "TAM value with currency or Not stated"
          }},
          "metrics": {{
            "mrr": number_or_null,
            "arr": number_or_null,
            "revenue": number_or_null,
            "growth_rate_monthly": "percentage_string_or_null",
            "customers": number_or_null,
            "burn_rate_monthly": number_or_null,
            "runway_months": number_or_null,
            "churn_rate": "percentage_string_or_null"
          }},
          "team": {{
            "founders": ["list of names"],
            "total_employees": number_or_null,
            "key_hires": ["list of key positions filled"]
          }},
          "funding": {{
            "total_raised": number_or_null,
            "last_round": "round_name_or_null",
            "last_round_amount": number_or_null,
            "investors": ["list of investors"]
          }},
          "traction": {{
            "product_status": "Idea/MVP/Beta/Live/Scaling or Unknown",
            "customer_examples": ["list of notable customers"],
            "partnerships": ["list of partnerships"],
            "awards": ["list of awards"]
          }}
        }}

        Rules:
        - Use null for missing numbers.
        - Use "Unknown" or "Not stated" for missing text.
        - Extract exact values when available.
        - Return ONLY the JSON object.
        """
        
        result = await self.call_gemini(prompt)
        
        if result.get("error"):
            logger.error(f"Extraction failed: {result.get('detail')}")
            return self._get_default_structure()
            
        logger.info("✅ Data extraction complete!")
        return result.get("json", self._get_default_structure())

    def _get_default_structure(self) -> Dict[str, Any]:
        """Requested default fallback structure"""
        return {
            "company_info": {
                "name": "Unknown", "sector": "Unknown", "stage": "Unknown",
                "founded_year": None, "location": "Unknown"
            },
            "business": {
                "problem": "Not stated", "solution": "Not stated", "target_market": "Not stated",
                "business_model": "Not stated", "unique_value_prop": "Not stated", "market_size_tam": "Not stated"
            },
            "metrics": {
                "mrr": None, "arr": None, "revenue": None, "growth_rate_monthly": None,
                "customers": None, "burn_rate_monthly": None, "runway_months": None, "churn_rate": None
            },
            "team": { "founders": [], "total_employees": None, "key_hires": [] },
            "funding": { "total_raised": None, "last_round": None, "last_round_amount": None, "investors": [] },
            "traction": { "product_status": "Unknown", "customer_examples": [], "partnerships": [], "awards": [] }
        }
