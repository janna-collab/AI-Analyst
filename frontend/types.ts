
export interface User {
  id: string;
  email: string;
  name: string;
}

export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Competitor {
  name: string;
  pros: string[];
  cons: string[];
  marketPosition: string;
  market_gap: string;
  estimated_growth: string;
  entry_barriers: string;
}

export interface Financials {
  profit_margin: string;
  burn_rate: string;
  ltv_cac_ratio: string;
  payback_period: string;
  runway_months: number;
  revenue_quality_score: number;
}

export interface FounderInsight {
  founder_name: string;
  background_strength: 'Elite' | 'Strong' | 'Average';
  emotional_resilience_score: number;
  commitment_signals: string[];
  founder_market_fit: string;
}

export interface MarketDetails {
  market_insights: {
    market_size_estimate: string;
    growth_rate: string;
    key_trends: string[];
    market_maturity: string;
  };
  competition: {
    competitive_intensity: string;
    competitors: Competitor[];
    differentiation_potential: string;
  };
  validation: {
    problem_validation: string;
    solution_fit: string;
    timing: string;
  };
  credibility_score: number;
  summary: string;
}

export interface StartupAnalysis {
  id: string;
  timestamp: string;
  status: AnalysisStatus;
  companyName: string;
  oneLiner: string;
  executiveSummary: string;
  sector: string;
  scores: {
    team: number;
    product: number;
    market: number;
    traction: number;
    financials: number;
    overall: number;
  };
  keyMetrics: {
    label: string;
    value: string;
    benchmarkComparison: 'Below' | 'Average' | 'Above';
    industryStandard?: string;
  }[];
  financials?: Financials;
  founder_insights?: FounderInsight[];
  risks: {
    severity: 'High' | 'Medium' | 'Low';
    category: string;
    description: string;
  }[];
  opportunities: string[];
  verdict: 'Invest' | 'Pass' | 'Watch';
  reasoning: string;
  path_to_profitability?: string;
  growth_strategy?: string;
  sources?: GroundingSource[];
  market_details?: MarketDetails;
}

export interface SavedReport {
  id: string;
  userId: string;
  analysis: StartupAnalysis;
  savedAt: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  data: string;
}

export interface AnalysisRequest {
  files: UploadedFile[];
  notes?: string;
  sector_preference?: string;
}
