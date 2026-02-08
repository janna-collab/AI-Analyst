
from .base_agent import BaseAgent
from ..services.rag_system import rag_system
from typing import Dict, Any
import logging
import json

logger = logging.getLogger("venturescout.agents.market")

class MarketResearchAgent(BaseAgent):
    """
    Market Strategist: Conducts deep-dive research into market trends and competition.
    Uses real-time Google Search to identify peers and analyze their strategic positioning.
    """
    def __init__(self):
        super().__init__(
            system_instruction=(
                "You are a world-class Market Research Analyst for a top-tier VC firm. "
                "Your objective is to validate market size, identify emerging trends, and perform "
                "a deep-dive competitive analysis. Use Google Search to find current data."
            ),
            model_type="pro",
            tools=[{"googleSearch": {}}]
        )

    async def analyze_market(self, startup_id: str, extracted_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Conduct market research and competitive validation.
        """
        logger.info(f"🔍 Agent 4: Conducting real-time market research for {startup_id}...")
        
        company_info = extracted_data.get('company_info', {})
        sector = company_info.get('sector', 'Unknown')
        name = company_info.get('name', 'Unknown')
        business = extracted_data.get('business', {})
        problem = business.get('problem', 'Not stated')
        solution = business.get('solution', 'Not stated')
        
        # Query RAG for internal competitive context provided by the founder
        internal_comp_context = rag_system.query(
            "Direct and indirect competitors mentioned, market sizing claims, TAM/SAM/SOM", 
            startup_id
        )
        
        prompt = f"""
        You are a market research analyst for venture capital.
        
        USE GOOGLE SEARCH to find current (live) data for:
        - {sector} market trends and TAM/CAGR for the current year.
        - Direct and indirect competitors for a startup doing "{solution}" to solve "{problem}".
        - Specific details on top competitors: their strengths, weaknesses, and current growth trajectory.

        STARTUP:
        Name: {name}
        Sector: {sector}
        Problem: {problem}
        Solution: {solution}

        INTERNAL CONTEXT FROM FOUNDER:
        {internal_comp_context}

        Analyze market opportunity and return ONLY valid JSON:

        {{
          "market_insights": {{
            "market_size_estimate": "TAM estimate with source or Unknown",
            "growth_rate": "Market CAGR or monthly growth %",
            "key_trends": ["Trend 1", "Trend 2"],
            "market_maturity": "Emerging|Growing|Mature|Declining"
          }},
          "competition": {{
            "competitive_intensity": "Low|Medium|High|Very High",
            "competitors": [
              {{
                "name": "Competitor Name",
                "strengths": ["Strength 1", "Strength 2"],
                "weaknesses": ["Weakness 1", "Weakness 2"],
                "market_gap": "The specific gap this startup fills vs this competitor",
                "estimated_growth": "Known or estimated growth rate"
              }}
            ],
            "differentiation_potential": "Strong|Moderate|Weak"
          }},
          "validation": {{
            "problem_validation": "1-2 sentence assessment if this is a real burning problem",
            "solution_fit": "Does solution address problem well?",
            "timing": "Is now the right time (Why now?)"
          }},
          "credibility_score": number_from_0_to_100,
          "summary": "2-3 sentence market assessment"
        }}

        Rules:
        - Focus on the COMPETITORS section. Provide detailed strengths, weaknesses, and gaps.
        - Use real-time search results to find peers the founder might have missed.
        - Return ONLY JSON.
        """
       
        result = await self.call_gemini(prompt)
        
        if result.get("error"):
            logger.error(f"Market research failed: {result.get('detail')}")
            return self._get_default_structure()
            
        logger.info(f"✅ Market research complete! Credibility: {result.get('json', {}).get('credibility_score', 'N/A')}/100")
        return result.get("json", self._get_default_structure())

    def _get_default_structure(self) -> Dict[str, Any]:
        """Default structure when research fails"""
        return {
            "market_insights": {
                "market_size_estimate": "Unknown",
                "growth_rate": "Unknown",
                "key_trends": [],
                "market_maturity": "Unknown"
            },
            "competition": {
                "competitive_intensity": "Unknown",
                "competitors": [],
                "differentiation_potential": "Moderate"
            },
            "validation": {
                "problem_validation": "Unable to validate",
                "solution_fit": "Unable to assess",
                "timing": "Unable to assess"
            },
            "credibility_score": 50,
            "summary": "Insufficient data for market research"
        }
