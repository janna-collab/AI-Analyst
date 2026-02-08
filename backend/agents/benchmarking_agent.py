
from .base_agent import BaseAgent
from ..services.rag_system import rag_system
from typing import Dict, Any
import logging
import json

logger = logging.getLogger("venturescout.agents.benchmark")

class BenchmarkingAgent(BaseAgent):
    """
    Agent to benchmark startup against industry peers using real-time Google Search.
    Strictly follows the requested output structure and reasoning logic.
    """
    def __init__(self):
        # Tools: googleSearch is enabled to allow the model to fetch real-time data.
        super().__init__(
            system_instruction=(
                "You are an expert Venture Capital Benchmarking Analyst. Your task is to compare a startup's "
                "performance metrics against current industry standards and peer benchmarks found via Google Search."
            ),
            model_type="pro", # Gemini 3 Pro is used for high-quality search and reasoning.
            tools=[{"googleSearch": {}}]
        )

    async def benchmark(self, startup_id: str, extracted_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Benchmark startup against sector peers.
        Mirroring the logic of the requested benchmarking tool while leveraging Gemini 3's advanced features.
        """
        logger.info(f"📊 Agent 2: Benchmarking startup {startup_id} against industry peers...")

        # Context retrieval from RAG for the startup's specific metrics
        metrics_context = rag_system.query(
            "What are all the metrics: revenue, MRR, growth rate, team size, customers?",
            startup_id,
            n_results=5
        )

        # Handling the new fact structure from DataExtractionAgent
        company_info = extracted_data.get('company_info', {})
        sector = company_info.get('sector', 'Unknown')
        stage = company_info.get('stage', 'Seed')
        name = company_info.get('name', 'Unknown')
        
        prompt = f"""
        You are a venture capital benchmarking analyst.
        
        USE GOOGLE SEARCH to find current, live benchmarks for the following:
        - {sector} {stage} stage average metrics
        - {sector} startup valuation multiples
        - {sector} startup growth rates benchmarks
        - {sector} {stage} stage revenue benchmarks
        
        STARTUP INFORMATION:
        Company: {name}
        Sector: {sector}
        Stage: {stage}

        STARTUP METRICS:
        {json.dumps(extracted_data.get('metrics', {}), indent=2)}
        
        Team Size: {extracted_data.get('team', {}).get('total_employees', 'Unknown')}
        Customers: {extracted_data.get('metrics', {}).get('customers', 'Unknown')}

        METRICS CONTEXT FROM DOCUMENTS:
        {metrics_context}

        Compare this startup against sector benchmarks found via Google Search and return ONLY valid JSON:

        {{
          "sector_benchmarks": {{
            "sector": "{sector}",
            "stage": "{stage}",
            "avg_revenue_seed": "typical stage revenue or Unknown",
            "avg_growth_rate": "typical monthly growth % or Unknown",
            "avg_team_size": "typical team size or Unknown",
            "avg_valuation_multiple": "typical revenue multiple or Unknown"
          }},
          "comparisons": {{
            "revenue": {{
              "startup_value": "their revenue or Unknown",
              "sector_average": "sector avg or Unknown",
              "percentile": number_0_to_100_or_null,
              "status": "Above Average|Average|Below Average|Unknown",
              "notes": "Brief explanation"
            }},
            "growth_rate": {{
              "startup_value": "their growth rate or Unknown",
              "sector_average": "sector avg or Unknown",
              "percentile": number_0_to_100_or_null,
              "status": "Above Average|Average|Below Average|Unknown",
              "notes": "Brief explanation"
            }},
            "team_size": {{
              "startup_value": "their team size or Unknown",
              "sector_average": "sector avg or Unknown",
              "status": "Appropriate|Too Large|Too Small|Unknown",
              "notes": "Brief explanation"
            }},
            "customer_count": {{
              "startup_value": "their customers or Unknown",
              "sector_average": "sector avg or Unknown",
              "percentile": number_0_to_100_or_null,
              "status": "Above Average|Average|Below Average|Unknown",
              "notes": "Brief explanation"
            }},
            "revenue_per_employee": {{
              "startup_value": "calculated value or Unknown",
              "sector_average": "sector avg or Unknown",
              "status": "Efficient|Average|Inefficient|Unknown",
              "notes": "Brief explanation"
            }}
          }},
          "competitive_position": {{
            "overall_ranking": "Top 25%|Top 50%|Bottom 50%|Bottom 25%|Unknown",
            "key_advantages": ["Advantage 1", "Advantage 2"],
            "key_gaps": ["Gap 1", "Gap 2"],
            "catch_up_difficulty": "Easy|Moderate|Difficult|Very Difficult"
          }},
          "benchmark_score": number_from_0_to_100,
          "summary": "2-3 sentence summary of how they compare"
        }}

        Guidelines:
        - If data is missing, use "Unknown" and null
        - Be realistic with percentiles based on actual search results
        - Focus on metrics relevant to their sector
        - You MUST list the URLs of the sources you find in your internal reasoning.
        """
        
        result = await self.call_gemini(prompt)
        data = result.get("json", {})
        grounding = result.get("groundingMetadata")

        # Extraction logic for UI consistency
        flattened_metrics = []
        for key, comp in data.get("comparisons", {}).items():
            flattened_metrics.append({
                "label": key.replace("_", " ").title(),
                "value": comp.get("startup_value", "N/A"),
                "benchmarkComparison": comp.get("status", "Average")
            })

        sources = []
        # In a real GCP environment, groundingMetadata would be parsed into sources.
        
        return {
            **data,
            "metrics": flattened_metrics,
            "raw_benchmarks": data,
            "sources": sources
        }
