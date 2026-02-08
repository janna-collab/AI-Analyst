
from .base_agent import BaseAgent
from typing import Dict, Any
import json
import logging

logger = logging.getLogger("venturescout.agents.recommender")

class RecommendationAgent(BaseAgent):
    """
    The Managing Partner Agent.
    Final synthesis layer using Gemini 3 Pro. Strictly follows the Partner decision logic
    including deal scoring and verdict guidelines.
    """
    def __init__(self):
        system_instr = (
            "You are a senior venture capital partner making final investment decisions. "
            "Your role is to review all analyst inputs and determine the final deal score and verdict. "
            "You focus on identifying high-conviction opportunities and protecting the fund from tail risks."
        )
        super().__init__(system_instr, model_type="pro")

    async def generate_verdict(
        self, raw: Dict[str, Any], market: Dict[str, Any], 
        risks: Dict[str, Any], benchmarks: Dict[str, Any], 
        growth: Dict[str, Any], notes: str
    ) -> Dict[str, Any]:
        
        logger.info(f"💰 Agent 6: Generating final investment recommendation for {raw.get('company_info', {}).get('name')}...")
        
        # We pass all pre-processed intelligence to the Partner model.
        # The prompt enforces the specific logic requested by the user.
        prompt = f"""
        You are a senior venture capital partner. Review the following intelligence from your analyst team:

        1. STARTUP PROFILE (Data Associate):
        {json.dumps(raw, indent=2)}

        2. RISK AUDIT (Forensic Auditor):
        {json.dumps(risks, indent=2)}

        3. MARKET RESEARCH & COMPETITIVE INTEL (Market Strategist):
        {json.dumps(market, indent=2)}

        4. BENCHMARK DATA (Benchmark Specialist):
        {json.dumps(benchmarks, indent=2)}

        5. GROWTH ASSESSMENT (Growth Architect):
        {json.dumps(growth, indent=2)}

        6. ANALYST AD-HOC NOTES:
        {notes}

        TASK:
        Synthesize a final investment memo and return ONLY valid JSON. 
        You MUST follow these specific scoring and decision guidelines:

        DECISION GUIDELINES:
        - PASS: Any critical red flags detected OR risk_score > 70 OR deal_score < 40 OR growth_score < 4
        - WATCH: Some concerns but potential OR deal_score 40-65 OR growth_score 5-6
        - INVEST: Strong opportunity, manageable risks, deal_score > 65 AND growth_score > 6

        DEAL SCORE CALCULATION LOGIC (Internal Reasoning):
        - Start with 50 base points
        - Add up to +20 for strong growth score (>7)
        - Add up to +15 for good benchmark score (>60)
        - Add up to +15 for low risk score (<40)
        - Subtract -10 for each HIGH severity red flag
        - Subtract -25 for each CRITICAL red flag
        - Add up to +10 for strong market validation
        - Add up to +10 for exceptional team

        RETURN THIS EXACT JSON STRUCTURE (Compatible with UI):
        {{
          "companyName": "string",
          "oneLiner": "string",
          "executiveSummary": "multiparagraph summary. Highlight the 'Why Invest' or 'Why Pass'. Mention key competitors from market research.",
          "sector": "string",
          "verdict": "Invest|Pass|Watch",
          "reasoning": "Detailed thesis combining Key Strengths, Key Concerns, and specific Follow-up Questions for the founders.",
          "scores": {{
            "team": number (0-100),
            "product": number (0-100),
            "market": number (0-100),
            "traction": number (0-100),
            "overall": number (The calculated Deal Score)
          }},
          "keyMetrics": [
            {{ "label": "string", "value": "string", "benchmarkComparison": "Above|Average|Below" }}
          ],
          "risks": [
            {{ "severity": "High|Medium|Low", "category": "string", "description": "string" }}
          ],
          "opportunities": ["Growth opportunity 1", "Growth opportunity 2"]
        }}

        Rules:
        - The 'reasoning' field should be comprehensive. Use bullet points (using •) for strengths and concerns.
        - Be critical. If the risk is too high, the verdict must be 'Pass'.
        - Ensure all scores are numbers.
        - Return ONLY JSON.
        """
        
        result = await self.call_gemini(prompt)
        
        # Log the calculated score for backend visibility
        if not result.get("error"):
            data = result.get("json", {})
            logger.info(f"✅ Recommendation Generated: {data.get('verdict')} (Deal Score: {data.get('scores', {}).get('overall')}/100)")
        
        return result
