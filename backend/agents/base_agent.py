
import google.generativeai as genai
from ..config import settings
import logging
import json
import asyncio
import time

logger = logging.getLogger("venturescout.agents")

class BaseAgent:
    """
    Standardized Base for Gemini 3 Multi-Agent Swarm (Python).
    Centralizes model initialization and JSON response handling.
    Includes built-in retry logic for rate limiting.
    """
    def __init__(self, system_instruction: str, model_type: str = "default", tools: list = None):
        if not settings.API_KEY:
            raise ValueError("CRITICAL: API_KEY environment variable is not set. Cannot initialize Gemini 3 Swarm.")
        
        genai.configure(api_key=settings.API_KEY)
        
        # Select appropriate Gemini 3 model based on task complexity
        model_name = settings.DEFAULT_MODEL if model_type == "pro" else settings.FAST_MODEL
        
        self.model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=system_instruction,
            tools=tools
        )
        logger.info(f"Initialized Agent with model: {model_name} and tools: {tools}")

    async def call_gemini(self, prompt: str, max_retries: int = 3) -> dict:
        """
        Executes a reasoning cycle using Gemini 3.
        Enforces JSON output for structural reliability.
        Includes exponential backoff for 429/Resource Exhausted errors.
        """
        delay = 2.0 # Initial delay in seconds
        
        for i in range(max_retries):
            try:
                # Use deterministic settings for institutional-grade analysis
                response = self.model.generate_content(
                    prompt,
                    generation_config={
                        "response_mime_type": "application/json",
                        "temperature": 0.1 
                    }
                )
                
                if not response.text:
                    raise ValueError("AI Swarm returned an empty response.")

                # Parse the structured JSON response
                data = json.loads(response.text.strip())
                
                # Extract grounding metadata if search tool was used
                grounding_metadata = None
                if hasattr(response, 'candidates') and response.candidates:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'grounding_metadata'):
                        grounding_metadata = candidate.grounding_metadata

                return {
                    "json": data,
                    "groundingMetadata": grounding_metadata
                }
                
            except Exception as e:
                error_msg = str(e).lower()
                is_rate_limit = "429" in error_msg or "resource_exhausted" in error_msg or "quota" in error_msg
                
                if is_rate_limit and i < max_retries - 1:
                    logger.warning(f"Rate limit exceeded (429). Retrying in {delay}s... (Attempt {i+1}/{max_retries})")
                    await asyncio.sleep(delay)
                    delay *= 2
                    continue
                
                logger.error(f"Gemini 3 Reasoning Failure: {str(e)}")
                return {"error": True, "detail": str(e), "json": {}}
        
        return {"error": True, "detail": "Max retries exceeded", "json": {}}
