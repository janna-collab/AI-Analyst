# 🔭 VentureScout AI: Local Setup Guide

Follow these instructions to run the **Institutional-Grade Startup Analysis Platform** on your local machine. This app uses a multi-agent swarm powered by Gemini 3 to analyze pitch decks and founder materials.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:
1. **Python 3.10+**: For the Backend Orchestrator.
2. **Node.js 18+**: For the Frontend Portal.
3. **Gemini API Key**: Obtain one for free at [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 🔑 Step 1: Configuration

1.  **Backend Environment**:
    *   Navigate to the `backend/` directory.
    *   Open the `.env` file.
    *   Replace `your_gemini_api_key_here` with your actual Gemini API Key.
    ```env
    API_KEY=AIzaSy...your_actual_key...
    ```

2.  **Gmail Integration (Optional)**:
    *   To use the "Email Founders" feature, go to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a project and enable the **Gmail API**.
    *   Download the `credentials.json` file and place it in the `backend/` root folder.
    *   *Note: If this is missing, the app will automatically use a mock service to simulate sending.*

---

## 🧠 Step 2: Start the Backend (The Intelligence)

The backend handles RAG (Retrieval Augmented Generation), document chunking, and agent coordination.

```bash
# From the project root
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*The backend is now live at `http://localhost:8000`.*

---

## 💻 Step 3: Start the Frontend (The Portal)

The frontend provides the professional analyst dashboard.

```bash
# Open a new terminal tab at the project root
npm install

# Start the development server
npm run dev
```
*The portal will open at `http://localhost:5173`.*

---

## 🚀 Step 4: Run an Analysis

1.  **Access the Portal**: Open your browser to the local Vite URL.
2.  **Auth**: Click "Get Started" to enter as a Guest Analyst or sign up.
3.  **Upload**: 
    *   Drag a **Pitch Deck (PDF)** into the primary slot.
    *   (Optional) Add call transcripts or email threads to provide the agents with more context.
4.  **Trigger Swarm**: Click "Trigger Swarm Analysis".
5.  **Review**: 
    *   Watch the status updates as the **Data Associate**, **Forensic Auditor**, and **Managing Partner** agents work.
    *   Once complete, a green success banner appears. Click "View Investment Memo".
    *   Check the "Scorecard & Risks" tab for the radar chart and red-flag assessment.

---

## 🛠 Troubleshooting

*   **RPC Failed / Proxy Errors**: Ensure your `API_KEY` is valid and has not reached its rate limit.
*   **VectorDB Issues**: If you encounter errors with ChromaDB, delete the `vectordb/data` folder to reset the semantic index.
*   **Missing Backend**: If you run the frontend without the backend, the app will use `mockService.ts` to perform analysis directly via the browser (Gemini-side). Ensure your browser context has access to the `process.env.API_KEY`.

---

**Institutional Security Note**: 
All uploaded documents are processed locally via ChromaDB. Data is only sent to Google Gemini models for reasoning purposes and is not used for public model training by default on paid/tier API keys.
