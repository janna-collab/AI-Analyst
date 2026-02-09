
# VentureScout AI 🔭
> **Institutional-Grade Startup Analysis Platform**

VentureScout AI uses a multi-agent swarm powered by Gemini 3 Pro to automate venture capital due diligence.

## 🛠 Built With

### AI & Reasoning
- **Google Gemini API**: Core intelligence for multimodal extraction and reasoning.
- **Gemini 3 Pro**: Primary model for high-conviction investment synthesis and managing partner consensus.
- **Gemini 3 Flash**: High-speed extraction model for financial DNA and forensic auditing.
- **Google Search Tool**: Real-time market grounding for 2025 industry benchmarks.
- **Agentic Swarm Architecture**: 3-stage high-efficiency pipeline (Auditor, Strategist, Partner).

### Frontend Stack
- **React 19**: Modern declarative UI framework.
- **TypeScript**: Ensuring financial data integrity across the platform.
- **Tailwind CSS**: Institutional "Bloomberg-grade" aesthetic and responsive layouts.
- **Lucide React**: Clean, consistent iconography for professional dashboards.
- **Recharts**: High-performance data visualization for scorecards and traction analysis.

### Infrastructure & Operations
- **Exponential Backoff**: Robust rate-limit (429) management for high-volume API calls.
- **LocalStorage**: Persistent session and pipeline history management.
- **PDF Extraction**: Intelligent multimodal ingestion of pitch decks and appendices.

## 🚀 Local Execution Guide

### 1. Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Configuration
Ensure you have an API Key from Google AI Studio. The application expects `process.env.API_KEY` to be configured in your environment.

## 🏗 System Architecture
- **Stage 1 (Forensic Auditor)**: Extracts unit economics and audits founder signals.
- **Stage 2 (Market Strategist)**: Uses Google Search for competitive mapping and benchmarks.
- **Stage 3 (Managing Partner)**: Synthesizes all data into a definitive Invest/Pass verdict.

## 🔒 Security & Compliance
- **Multimodal Data**: Processes PDF, Audio, and Text via Gemini's large context window.
- **Client-Side Storage**: Reports are stored locally for maximum privacy during guest sessions.
