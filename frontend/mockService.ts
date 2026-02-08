
import { StartupAnalysis, UploadedFile } from './types';
import { GoogleGenAI } from "@google/genai";

/**
 * Utility to delay execution.
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Implements exponential backoff for API calls to handle rate limits (429 errors).
 */
async function callWithRetry(fn: () => Promise<any>, maxRetries = 3, initialDelay = 2000) {
  let delay = initialDelay;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const errorMsg = error?.message || "";
      const isRateLimit = errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota");
      
      if (isRateLimit && i < maxRetries - 1) {
        console.warn(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await sleep(delay);
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
}

/**
 * Helper to extract JSON from model response text.
 */
const extractJsonFromText = (text: string | undefined, fallback: any = {}) => {
  if (!text) return fallback;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return fallback;
  
  let cleanText = jsonMatch[0].trim();
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    console.warn("JSON Parse failed in mockService", e);
    return fallback;
  }
};

export const mockService = {
  async analyzeStartup(
    files: UploadedFile[], 
    notes: string, 
    sector: string,
    onProgress?: (status: string) => void
  ): Promise<StartupAnalysis> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    onProgress?.("Ingesting materials into local reasoning engine...");
    const fileParts = files.map(file => ({
      inlineData: {
        data: file.data,
        mimeType: file.type || 'application/pdf'
      }
    }));

    // Step 1: Extraction
    onProgress?.("Local Agent 1: Extracting factual profile...");
    const extractionResponse = await callWithRetry(() => 
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { 
          parts: [...fileParts, { text: `Extract profile for this startup. Focus: ${notes}. Return ONLY JSON with: companyName, oneLiner, sector, keyMetrics (array of {label, value, benchmarkComparison}).` }] 
        },
        config: { responseMimeType: "application/json" }
      })
    );
    const extractedData = extractJsonFromText(extractionResponse.text);

    // Artificial delay to prevent burst rate limit
    await sleep(1500);

    // Step 2: Market Research
    onProgress?.("Local Agent 2: Mapping competitive landscape...");
    const marketResponse = await callWithRetry(() => 
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { 
          parts: [...fileParts, { text: `Identify top 3 competitors for ${extractedData.companyName}. For each, provide name, pros (list), cons (list), marketPosition (short string), and estimated_growth. Also provide market_insights. Return ONLY JSON.` }] 
        },
        config: { tools: [{ googleSearch: {} }] }
      })
    );
    const marketDetails = extractJsonFromText(marketResponse.text);

    // Artificial delay to prevent burst rate limit
    await sleep(2000);

    // Step 3: Synthesis
    onProgress?.("Local Agent 3: Finalizing Synthesis...");
    const synthesisResponse = await callWithRetry(() => 
      ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { 
          parts: [...fileParts, { text: `Finalize investment memo for ${extractedData.companyName}. Verdict: Invest/Pass/Watch. Return ONLY JSON with: executiveSummary, verdict, reasoning, scores (team, product, market, traction, overall), risks (severity, category, description).` }] 
        },
        config: { responseMimeType: "application/json" }
      })
    );
    const synthesisData = extractJsonFromText(synthesisResponse.text);

    return {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
      companyName: extractedData.companyName || 'Unknown Startup',
      oneLiner: extractedData.oneLiner || 'No description provided.',
      sector: extractedData.sector || sector,
      scores: synthesisData.scores || { team: 50, product: 50, market: 50, traction: 50, overall: 50 },
      keyMetrics: extractedData.keyMetrics || [],
      risks: synthesisData.risks || [],
      opportunities: [],
      verdict: synthesisData.verdict || 'Watch',
      reasoning: synthesisData.reasoning || 'Synthesis pending.',
      executiveSummary: synthesisData.executiveSummary || 'Summary pending.',
      market_details: marketDetails
    };
  },

  async sendToFounders(analysis: StartupAnalysis, email: string, message: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`[Mock Dispatch] Sending memo for ${analysis.companyName} to ${email}`);
    return { 
      success: true, 
      messageId: `mock-msg-${Math.random().toString(36).substring(7)}`,
      status: 'Sent via mock service' 
    };
  }
};
