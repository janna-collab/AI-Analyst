
import { StartupAnalysis, UploadedFile, Competitor } from '../types';
import { GoogleGenAI } from "@google/genai";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry(fn: () => Promise<any>, maxRetries = 5, initialDelay = 5000) {
  let delay = initialDelay;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const msg = error?.message || "";
      const isRateLimit = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota");
      if (isRateLimit && i < maxRetries - 1) {
        console.warn(`Quota reached, retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await sleep(delay);
        delay *= 3; // More aggressive backoff
        continue;
      }
      throw error;
    }
  }
}

const parseAgentResponse = (text: string | undefined) => {
  if (!text) return {};
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  try {
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  } catch (e) {
    console.error("Agent JSON Parse Error", e);
    return {};
  }
};

export const swarmProvider = {
  async executeFullAnalysis(
    files: UploadedFile[], 
    notes: string, 
    sector: string,
    onProgress?: (status: string) => void
  ): Promise<StartupAnalysis> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const dataRoom = files.map(file => ({
      inlineData: {
        data: file.data,
        mimeType: file.type || 'application/pdf'
      }
    }));

    // --- STAGE 1: THE DATA & AUDIT SWARM (Consolidated Agent 1 & 4) ---
    onProgress?.("Stage 1: Extracting DNA & Performing Forensic Audit...");
    const stage1Res = await callWithRetry(() => 
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [...dataRoom, { text: `SYSTEM: Lead Financial Auditor. TASK: Extract company profile, unit economics, and audit for red flags. 
        Identify: Gross/Net Margins, Burn Rate, LTV/CAC, Payback, Runway. 
        Audit: Founder backgrounds, commitment signals, and forensic risks.
        Return JSON ONLY: {
          companyName, oneLiner, sector, stage, location, 
          keyMetrics: [{label, value}], 
          financials: {profit_margin, burn_rate, ltv_cac_ratio, payback_period, runway_months, revenue_quality_score},
          risks: [{severity, category, description}],
          founder_insights: [{founder_name, background_strength, emotional_resilience_score, commitment_signals, founder_market_fit}]
        }` }] },
        config: { responseMimeType: "application/json" }
      })
    );
    const auditData = parseAgentResponse(stage1Res.text);
    await sleep(3000); // Throttling for next major call

    // --- STAGE 2: THE MARKET & BENCHMARK INTEL (Consolidated Agent 2 & 3) ---
    onProgress?.("Stage 2: Real-time Competitive Mapping & Benchmarking...");
    const stage2Res = await callWithRetry(() => 
      ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: [...dataRoom, { text: `SYSTEM: Market Strategist. TASK: Use Google Search to find 2025 benchmarks for ${auditData.sector} (${auditData.stage}). 
        Also, identify top 3-4 direct competitors for ${auditData.companyName}.
        Compare these extracted metrics: ${JSON.stringify(auditData.keyMetrics)}. 
        Provide a comprehensive market analysis matching this specific JSON structure:
        {
          keyMetrics: [{label, value, benchmarkComparison, industryStandard}],
          market_insights: {market_size_estimate, growth_rate, key_trends: [], market_maturity},
          competition: {competitive_intensity, competitors: [{name, pros: [], cons: [], entry_barriers, market_gap, marketPosition}], differentiation_potential},
          validation: {problem_validation, solution_fit, timing},
          credibility_score (number),
          summary
        }
        Return JSON ONLY.` }] },
        config: { tools: [{ googleSearch: {} }] }
      })
    );
    const marketIntel = parseAgentResponse(stage2Res.text);
    
    // DO fix: Extract grounding sources from googleSearch tool output as required by guidelines
    const groundingChunks = stage2Res.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Research Source',
      uri: chunk.web?.uri || ''
    })).filter((s: any) => s.uri) || [];

    await sleep(3000);

    // --- STAGE 3: THE INVESTMENT COMMITTEE (Consolidated Agent 5 & 6) ---
    onProgress?.("Stage 3: Final Synthesis & Investment Verdict...");
    const stage3Res = await callWithRetry(() => 
      ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: [...dataRoom, { text: `SYSTEM: Managing Partner. TASK: Final investment decision.
        Evaluate scalability, moat, and the "money-wise" conviction.
        Data: Audit=${JSON.stringify(auditData)}, Market=${JSON.stringify(marketIntel)}.
        Return JSON ONLY: {
          executiveSummary, verdict (Invest/Watch/Pass), reasoning, path_to_profitability, growth_strategy, opportunities,
          scores: {team, product, market, traction, financials, overall}
        }` }] },
        config: { responseMimeType: "application/json" }
      })
    );
    const finalDecision = parseAgentResponse(stage3Res.text);

    return {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
      companyName: auditData.companyName || 'Startup',
      oneLiner: auditData.oneLiner || 'Institutional evaluation complete.',
      sector: auditData.sector || sector,
      scores: finalDecision.scores || { team: 50, product: 50, market: 50, traction: 50, financials: 50, overall: 50 },
      keyMetrics: marketIntel.keyMetrics || auditData.keyMetrics || [],
      financials: auditData.financials,
      founder_insights: auditData.founder_insights || [],
      risks: auditData.risks || [],
      opportunities: finalDecision.opportunities || [],
      verdict: finalDecision.verdict || 'Watch',
      reasoning: finalDecision.reasoning || 'Synthesis based on committee review.',
      executiveSummary: finalDecision.executiveSummary || 'Investment memo generated.',
      path_to_profitability: finalDecision.path_to_profitability || 'See financials section.',
      growth_strategy: finalDecision.growth_strategy || 'Standard growth roadmap.',
      market_details: marketIntel,
      sources: sources
    };
  }
};
