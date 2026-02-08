
import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

class Config:
    # API Key from environment variable
    API_KEY = os.getenv("API_KEY")
    
    # Explicit Gemini 3 Series Model Names
    DEFAULT_MODEL = "gemini-3-pro-preview"
    FAST_MODEL = "gemini-3-flash-preview"
    
    # State-of-the-art Google Embedding Model
    EMBEDDING_MODEL = "models/text-embedding-004"
    
    # Persistence and Storage
    CHROMA_PATH = os.path.join(os.path.dirname(__file__), "../vectordb/data")
    UPLOAD_FOLDER = "uploads"
    MAX_FILE_SIZE_MB = 20

    # Gmail Auth Config
    # Place credentials.json from Google Cloud Console in the backend root
    GMAIL_CREDENTIALS_PATH = os.path.join(os.path.dirname(__file__), "credentials.json")
    GMAIL_TOKEN_PATH = os.path.join(os.path.dirname(__file__), "token.json")

settings = Config()
