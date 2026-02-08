
from pydantic import BaseModel, Field
from typing import List, Optional

class Metric(BaseModel):
    label: str
    value: str
    benchmarkComparison: str  # "Below", "Average", "Above"

class Risk(BaseModel):
    severity: str  # "High", "Medium", "Low"
    category: str
    description: str

class Scores(BaseModel):
    team: int
    product: int
    market: int
    traction: int
    overall: int

class Source(BaseModel):
    title: str
    uri: str

class AnalysisResult(BaseModel):
    id: Optional[str] = None
    timestamp: Optional[str] = None
    companyName: str
    oneLiner: str
    executiveSummary: str
    sector: str
    scores: Scores
    keyMetrics: List[Metric]
    risks: List[Risk]
    opportunities: List[str]
    verdict: str  # "Invest", "Pass", "Watch"
    reasoning: str
    sources: Optional[List[Source]] = []
