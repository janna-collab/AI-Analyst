
from .base_agent import BaseAgent
from ..services.rag_system import rag_system
from typing import Dict, Any
import logging
import json

logger = logging.getLogger("venturescout.agents.growth")

class GrowthAgent(BaseAgent):
    """
    Growth Architect: Evaluates scalability and long-term business potential.
    Strictly follows the requested RAG queries and output schema.
    """
    def __init__(self):
        system_instr = (
            "You are a growth strategy analyst for venture capital. "
            "Your role is to assess the scalability, innovation, and exit potential of early-stage startups."
        )
        super().__init__(system_instr, model_type="fast")

    async def assess_growth(self, startup_id: str, extracted_data: Dict[str, Any], benchmark_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Assess growth potential and scalability using targeted RAG queries.
        """
        logger.info(f"🚀 Agent 5: Assessing growth potential for {startup_id}...")
        
        # 1. Targeted RAG Queries (Strictly following the user's logic)
        pmf_context = rag_system.query(
            "Evidence of product-market fit: customer feedback, retention, satisfaction, demand",
            startup_id,
            n_results=5
        )
        
        moat_context = rag_system.query(
            "What makes the product unique? Competitive advantages? Technology? Patents? Network effects?",
            startup_id,
            n_results=5
        )
        
        scale_context = rag_system.query(
            "Business model scalability? Unit economics? Expansion plans? International potential?",
            startup_id,
            n_results=5
        )
        
        execution_context = rag_system.query(
            "Milestones achieved? Progress timeline? Execution speed? Team capabilities?",
            startup_id,
            n_results=5
        )
        
        prompt = f"""
        You are a growth strategy analyst for venture capital.

        STARTUP DATA:
        {json.dumps(extracted_data, indent=2)}

        BENCHMARK COMPARISON:
        {json.dumps(benchmark_data, indent=2)}

        PRODUCT-MARKET FIT EVIDENCE:
        {pmf_context}

        COMPETITIVE MOAT:
        {moat_context}

        SCALABILITY:
        {scale_context}

        EXECUTION CAPABILITY:
        {execution_context}

        Assess growth potential across 5 dimensions and return ONLY valid JSON:

        {{
          "growth_scores": {{
            "market_opportunity": {{
              "score": number_from_1_to_10,
              "reasoning": "Why this score",
              "evidence": ["Evidence point 1", "Evidence point 2"]
            }},
            "competitive_moat": {{
              "score": number_from_1_to_10,
              "reasoning": "Why this score",
              "evidence": ["Evidence point 1", "Evidence point 2"],
              "moat_type": "Network Effects|Technology|Brand|Data|Switching Costs|None"
            }},
            "product_innovation": {{
              "score": number_from_1_to_10,
              "reasoning": "Why this score",
              "evidence": ["Evidence point 1", "Evidence point 2"],
              "innovation_level": "Breakthrough|Significant|Incremental|Me-too"
            }},
            "scalability": {{
              "score": number_from_1_to_10,
              "reasoning": "Why this score",
              "evidence": ["Evidence point 1", "Evidence point 2"],
              "bottlenecks": ["Bottleneck 1", "Bottleneck 2"]
            }},
            "team_execution": {{
              "score": number_from_1_to_10,
              "reasoning": "Why this score",
              "evidence": ["Evidence point 1", "Evidence point 2"],
              "key_strengths": ["Strength 1", "Strength 2"],
              "key_gaps": ["Gap 1", "Gap 2"]
            }}
          }},
          "overall_growth_score": number_from_1_to_10,
          "growth_trajectory": "Exponential|Linear|Stagnant|Declining",
          "time_to_scale": "< 2 years|2-4 years|4+ years|Unclear",
          "exit_potential": {{
            "likely_outcome": "IPO|Acquisition|Strategic Sale|Other",
            "estimated_timeline": "years or Unknown",
            "potential_acquirers": ["Company 1", "Company 2"] or [],
            "exit_multiple_estimate": "range or Unknown"
          }},
          "growth_plan_quality": {{
            "score": number_from_1_to_10,
            "has_clear_strategy": true_or_false,
            "key_milestones": ["Milestone 1", "Milestone 2"],
            "risks_to_plan": ["Risk 1", "Risk 2"]
          }},
          "recommendation_summary": "2-3 sentences on growth potential"
        }}

        Scoring Guidelines:
        - 9-10: Exceptional, top 5% potential
        - 7-8: Strong, above average
        - 5-6: Average, meets expectations
        - 3-4: Below average, concerns
        - 1-2: Weak, significant issues

        Return ONLY JSON.
        """
        
        result = await self.call_gemini(prompt)
        
        if result.get("error"):
            logger.error(f"Growth assessment failed: {result.get('detail')}")
            return self._get_default_structure()
            
        logger.info(f"✅ Growth assessment complete! Overall score: {result.get('json', {}).get('overall_growth_score', 'N/A')}/10")
        return result.get("json", self._get_default_structure())

    def _get_default_structure(self) -> Dict[str, Any]:
        """Requested default fallback structure"""
        return {
            "growth_scores": {
                "market_opportunity": { "score": 5, "reasoning": "Unable to assess", "evidence": [] },
                "competitive_moat": { "score": 5, "reasoning": "Unable to assess", "evidence": [], "moat_type": "None" },
                "product_innovation": { "score": 5, "reasoning": "Unable to assess", "evidence": [], "innovation_level": "Incremental" },
                "scalability": { "score": 5, "reasoning": "Unable to assess", "evidence": [], "bottlenecks": [] },
                "team_execution": { "score": 5, "reasoning": "Unable to assess", "evidence": [], "key_strengths": [], "key_gaps": [] }
            },
            "overall_growth_score": 5,
            "growth_trajectory": "Unclear",
            "time_to_scale": "Unclear",
            "exit_potential": { "likely_outcome": "Other", "estimated_timeline": "Unknown", "potential_acquirers": [], "exit_multiple_estimate": "Unknown" },
            "growth_plan_quality": { "score": 5, "has_clear_strategy": False, "key_milestones": [], "risks_to_plan": [] },
            "recommendation_summary": "Insufficient data for growth assessment"
        }
