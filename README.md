
# VentureScout AI 🔭
> **Institutional-Grade Startup Analysis Platform**

VentureScout AI uses a multi-agent swarm powered by Gemini 3 Pro to automate venture capital due diligence.

## 🚀 Local Execution Guide

### 1. Backend Setup (The Brain)
The backend handles document processing, semantic search (RAG), and AI agent orchestration.

```bash
# Navigate to backend
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure your API Key
# Open .env and replace 'your_gemini_api_key_here' with your actual key

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup (The Client)
The frontend provides the interface for uploading materials and viewing the generated Investment Memos.

```bash
# In a new terminal tab, from the project root:
npm install
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

## 🏗 System Architecture
- **API Transport**: The frontend sends `multipart/form-data` to `localhost:8000`.
- **Intelligence**: Powered by `gemini-3-pro-preview` for high-level reasoning.
- **Memory**: Uses `ChromaDB` for local vector storage of uploaded pitch decks and transcripts.
- **Security**: API Keys are kept server-side in the `backend/.env` file.
