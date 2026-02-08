import logging
from ..config import settings

class BaseService:
    """
    Standard Base Service for institutional-grade reliability.
    Provides centralized logging and configuration access.
    """
    def __init__(self, service_name: str):
        self.settings = settings
        self.logger = logging.getLogger(f"venturescout.services.{service_name}")
        self.logger.setLevel(logging.INFO)
        
        # Ensure handlers are set up if not already
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def log_error(self, message: str, error: Exception):
        self.logger.error(f"{message}: {str(error)}")
