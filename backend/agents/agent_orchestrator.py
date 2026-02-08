
from .data_extraction_agent import DataExtractionAgent
from .market_research_agent import MarketResearchAgent
from .risk_detection_agent import RiskDetectionAgent
from .benchmarking_agent import BenchmarkingAgent
from .growth_agent import GrowthAgent
from .recommendation_agent import RecommendationAgent
from ..services.rag_system import rag_system
from ..services.email_service import email_service
import asyncio
import logging
import uuid
import json

logger = logging.getLogger("venturescout.orchestrator")

class AgentOrchestrator:
    def __init__(self):
        # The Expert Swarm
        self.extractor = DataExtractionAgent()
        self.market_expert = MarketResearchAgent()
        self.risk_expert = RiskDetectionAgent()
        self.benchmarker = BenchmarkingAgent()
        self.growth_expert = GrowthAgent()
        self.recommender = RecommendationAgent()

    async def run_analysis(self, file_parts: dict, notes: str):
        """
        Sequential Intelligence Pipeline:
        1. Index (RAG) -> 2. Extract -> 3. Specialized Audits -> 4. Synthesis -> 5. Export
        """
        startup_id = str(uuid.uuid4())
        shared_context = {"startup_id": startup_id, "user_notes": notes}
        
        logger.info(f"Phase 0: Building Semantic Knowledge Base for {startup_id}")
        rag_system.add_documents(file_parts, startup_id)
        
        # Step 1: Extraction (Foundation)
        logger.info("Phase 1: Data Associate facts extraction")
        facts = await self.extractor.extract(startup_id)
        shared_context["facts"] = facts
        
        # Step 2: Specialized Reasonings
        logger.info("Phase 2: Market Strategist analysis")
        market_analysis = await self.market_expert.analyze_market(startup_id, facts)
        shared_context["market"] = market_analysis
        
        logger.info("Phase 3: Forensic Risk Auditor verification")
        risk_audit = await self.risk_expert.detect_risks(startup_id, facts)
        shared_context["risks"] = risk_audit
        
        logger.info("Phase 4: Real-time Benchmarking")
        benchmarks = await self.benchmarker.benchmark(
            startup_id, 
            facts
        )
        shared_context["benchmarks"] = benchmarks

        logger.info("Phase 5: Growth Architect assessment")
        growth_analysis = await self.growth_expert.assess_growth(
            startup_id,
            facts,
            benchmarks
        )
        shared_context["growth"] = growth_analysis

        # Step 6: Final Synthesis (Managing Partner)
        logger.info("Phase 6: Synthesis & Memo Generation")
        final_memo_result = await self.recommender.generate_verdict(
            raw=facts,
            market=market_analysis,
            risks=risk_audit,
            benchmarks=benchmarks,
            growth=growth_analysis,
            notes=notes
        )
        final_memo = final_memo_result.get("json", {})
        
        # Ensure we attach benchmarking sources to the final memo
        final_memo["sources"] = benchmarks.get("sources", [])
        
        # Merge rich market data into memo for frontend display
        final_memo["market_details"] = market_analysis

        # Step 7: Export & Dispatch
        try:
            await email_service.send_analysis_report("analyst@venturescout.ai", final_memo)
        except Exception as e:
            logger.error(f"Failed to dispatch report: {e}")

        final_memo["id"] = startup_id
        return final_memo

orchestrator = AgentOrchestrator()
