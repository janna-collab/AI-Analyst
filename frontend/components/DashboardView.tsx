
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { StartupAnalysis } from '../types';
import { 
  CheckCircle2, AlertTriangle, XCircle, TrendingUp, 
  Building2, Users, Download, 
  Mail, Send, X, Check, 
  Shield, FileJson, Table, Bookmark, BookmarkCheck, Sparkles, Trophy, Wallet, Brain, HeartPulse, GraduationCap, BarChart3, Clock, Target, Lightbulb, Map, Globe, ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';
import { apiService } from '../api';
import { storageService } from '../storage';
import { authService } from '../auth';

interface DashboardViewProps {
  analysis: StartupAnalysis;
  mode: 'results' | 'insights';
}

const DashboardView: React.FC<DashboardViewProps> = ({ analysis, mode }) => {
  const [shareStep, setShareStep] = useState<'idle' | 'input' | 'sending' | 'success'>('idle');
  const [founderEmail, setFounderEmail] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const currentUser = authService.getCurrentUser();

  const chartData = [
    { subject: 'Team', A: analysis.scores?.team || 50, fullMark: 100 },
    { subject: 'Product', A: analysis.scores?.product || 50, fullMark: 100 },
    { subject: 'Market', A: analysis.scores?.market || 50, fullMark: 100 },
    { subject: 'Traction', A: analysis.scores?.traction || 50, fullMark: 100 },
    { subject: 'Financials', A: analysis.scores?.financials || 50, fullMark: 100 },
  ];

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'Invest': return 'bg-green-500/10 text-green-400 border-green-500/50';
      case 'Watch': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50';
      case 'Pass': return 'bg-red-500/10 text-red-400 border-red-500/50';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const handleSaveReport = () => {
    if (currentUser) {
      storageService.saveReport(analysis, currentUser);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const renderHeader = () => (
    <div className="flex flex-col gap-6 mb-8 print:hidden">
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 size={24} className="text-green-400" />
        </div>
        <div>
          <h3 className="text-green-400 font-bold text-sm">Swarm Review Complete</h3>
          <p className="text-green-400/70 text-xs">6 institutional agents reached consensus on financial viability.</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
           <Sparkles size={12} className="text-green-400" />
           <span className="text-[10px] font-bold text-green-300 uppercase tracking-widest">Institutional Ready</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
           <div className="flex items-center gap-3 mb-2">
             <h1 className="text-3xl font-bold text-white">{analysis.companyName}</h1>
             <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold uppercase border border-slate-700">{analysis.sector}</span>
             <button 
               onClick={handleSaveReport}
               className={cn(
                 "ml-2 p-2 rounded-full transition-all border",
                 isSaved ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"
               )}
             >
               {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
             </button>
           </div>
           <p className="text-lg text-slate-400 font-light max-w-2xl">{analysis.oneLiner}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShareStep(shareStep === 'idle' ? 'input' : 'idle')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-500 rounded-xl transition-all text-xs font-bold shadow-lg"
            >
              <Mail size={14} /> Mail Committee
            </button>
            {shareStep !== 'idle' && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl p-6 z-[60] animate-in fade-in zoom-in-95 duration-200">
                 {shareStep === 'input' && (
                   <div className="space-y-4">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-bold text-white">Memo Dispatch</h3>
                        <button onClick={() => setShareStep('idle')} className="text-slate-500 hover:text-white"><X size={14} /></button>
                      </div>
                      <div className="space-y-3">
                        <input 
                          type="email" 
                          placeholder="Committee Email" 
                          value={founderEmail}
                          onChange={(e) => setFounderEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <textarea 
                          placeholder="Your conviction statement..." 
                          value={shareMessage}
                          onChange={(e) => setShareMessage(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-[10px] text-white h-20 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button 
                          onClick={async () => {
                            setShareStep('sending');
                            await apiService.sendToFounders(analysis, founderEmail, shareMessage);
                            setShareStep('success');
                            setTimeout(() => setShareStep('idle'), 2000);
                          }}
                          className="w-full bg-indigo-600 py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2"
                        >
                          <Send size={12} /> Open Local Mail
                        </button>
                      </div>
                   </div>
                 )}
              </div>
            )}
          </div>

          <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 text-white hover:bg-slate-800 transition-all text-xs font-bold rounded-xl shadow-lg">
            <Download size={14} /> PDF Repo
          </button>

          <div className={cn(
            "flex flex-col items-center justify-center px-4 py-2 rounded-xl border-2 min-w-[120px]",
            getVerdictStyle(analysis.verdict)
          )}>
             <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Verdict</span>
             <span className="text-lg font-black">{analysis.verdict}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === 'results') {
    return (
      <div className="animate-fade-in pb-12 text-white">
        {renderHeader()}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-blue-500" /> Executive Investment Memo
            </h2>
            <div className="prose prose-invert max-w-none">
               <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">{analysis.executiveSummary}</p>
            </div>
            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
               <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Wallet size={12} /> Money-Wise Conviction
               </h4>
               <p className="text-sm text-slate-300 font-medium">{analysis.reasoning}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
               <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" /> Traction vs Industry Benchmarks
              </h2>
              <div className="space-y-4">
                {Array.isArray(analysis.keyMetrics) && analysis.keyMetrics.map((metric, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-800">
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-medium text-sm">{metric.label}</span>
                      <span className="text-[10px] text-slate-600">Std: {metric.industryStandard || "N/A"}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-base">{metric.value}</div>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        metric.benchmarkComparison === 'Above' ? 'bg-green-500/20 text-green-400' :
                        metric.benchmarkComparison === 'Below' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'
                      )}> {metric.benchmarkComparison} Avg </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
               <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users size={20} className="text-blue-500" /> Analyst Reasoning
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm italic border-l-4 border-blue-500 pl-4 py-1">{analysis.reasoning}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Shield size={20} className="text-indigo-400" /> Competitive Landscape & Entry Barriers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.isArray(analysis.market_details?.competition?.competitors) && analysis.market_details?.competition?.competitors.map((comp, idx) => (
                <div key={idx} className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-indigo-400" />
                      <h3 className="font-bold text-white text-base">{comp.name}</h3>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-800 text-slate-400 rounded uppercase border border-white/5">{comp.marketPosition}</span>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest block mb-2">Technical/Business Pros</span>
                        <ul className="text-xs text-slate-400 space-y-1.5">
                           {Array.isArray(comp.pros) ? comp.pros.map((p, i) => <li key={i} className="flex items-start gap-2"><Check size={10} className="text-green-500 mt-0.5 shrink-0" /> {p}</li>) : <li className="flex items-start gap-2"><Check size={10} className="text-green-500 mt-0.5 shrink-0" /> {comp.pros}</li>}
                        </ul>
                     </div>
                     <div>
                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest block mb-2">Weaknesses/Cons</span>
                        <ul className="text-xs text-slate-400 space-y-1.5">
                           {Array.isArray(comp.cons) ? comp.cons.map((c, i) => <li key={i} className="flex items-start gap-2"><X size={10} className="text-red-500 mt-0.5 shrink-0" /> {c}</li>) : <li className="flex items-start gap-2"><X size={10} className="text-red-500 mt-0.5 shrink-0" /> {comp.cons}</li>}
                        </ul>
                     </div>
                     <div className="pt-3 border-t border-white/5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Market Gap We Fill</span>
                        <p className="text-xs text-slate-300 leading-relaxed italic">"{comp.market_gap}"</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {analysis.sources && analysis.sources.length > 0 && (
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm mt-2">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Globe size={20} className="text-blue-400" /> Research Grounding Sources
              </h2>
              <div className="flex flex-wrap gap-3">
                {analysis.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-white/5 rounded-lg hover:border-blue-500/50 transition-all text-xs text-blue-400 group"
                  >
                    <Globe size={12} className="group-hover:animate-pulse" />
                    <span className="truncate max-w-[240px]">{source.title}</span>
                    <ExternalLink size={10} className="opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-12 text-white">
      {renderHeader()}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm flex flex-col items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Institutional scorecard</h3>
            <div className="text-5xl font-black text-white mb-6">
              {analysis.scores?.overall || 0}<span className="text-xl text-slate-500 font-normal">/100</span>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="Startup" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Brain size={16} className="text-purple-400" /> Founder resilience Tracking
             </h3>
             <div className="space-y-4">
                {Array.isArray(analysis.founder_insights) && analysis.founder_insights.map((founder, i) => (
                  <div key={i} className="p-4 bg-slate-950/30 rounded-xl border border-white/5">
                     <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-white text-sm">{founder.founder_name}</span>
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded",
                          founder.background_strength === 'Elite' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'
                        )}>{founder.background_strength} Background</span>
                     </div>
                     <div className="flex items-center gap-2 mb-3">
                        <HeartPulse size={12} className="text-pink-500" />
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-pink-500" style={{ width: `${founder.emotional_resilience_score}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400">{founder.emotional_resilience_score}% Resilience</span>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Commitment Signals</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                           {Array.isArray(founder.commitment_signals) ? founder.commitment_signals.map((s, si) => (
                             <span key={si} className="text-[9px] px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded border border-white/5">{s}</span>
                           )) : typeof founder.commitment_signals === 'string' ? (
                             <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded border border-white/5">{founder.commitment_signals}</span>
                           ) : null}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
             <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Wallet size={20} className="text-green-500" /> High-Resolution Financials
             </h2>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Burn Rate', value: analysis.financials?.burn_rate || 'N/A', icon: <TrendingUp size={14} className="text-red-400"/> },
                  { label: 'Profit Margin', value: analysis.financials?.profit_margin || 'N/A', icon: <BarChart3 size={14} className="text-green-400"/> },
                  { label: 'LTV/CAC', value: analysis.financials?.ltv_cac_ratio || 'N/A', icon: <Target size={14} className="text-blue-400"/> },
                  { label: 'Runway', value: `${analysis.financials?.runway_months || 0} mo`, icon: <Clock size={14} className="text-yellow-400"/> },
                  { label: 'Payback', value: analysis.financials?.payback_period || 'N/A', icon: <CheckCircle2 size={14} className="text-purple-400"/> },
                  { label: 'Rev Quality', value: `${analysis.financials?.revenue_quality_score || 0}/100`, icon: <Shield size={14} className="text-cyan-400"/> },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-950/30 rounded-xl border border-white/5 flex flex-col justify-between">
                     <div className="flex items-center gap-2 opacity-60 mb-2">
                        {item.icon}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                     </div>
                     <span className="text-lg font-black text-white">{item.value}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
             <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Map size={20} className="text-blue-400" /> Path to Profitability & Growth
             </h2>
             <div className="space-y-6">
                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                   <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Lightbulb size={12} /> Institutional Roadmap
                   </h4>
                   <p className="text-sm text-slate-300 leading-relaxed">{analysis.path_to_profitability}</p>
                </div>
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                   <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <TrendingUp size={12} /> Scalability Strategy
                   </h4>
                   <p className="text-sm text-slate-300 leading-relaxed">{analysis.growth_strategy}</p>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle size={20} className="text-yellow-500" /> Forensic Risk Portfolio
            </h2>
            <div className="grid gap-4">
              {Array.isArray(analysis.risks) && analysis.risks.map((risk, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-slate-950/30 rounded-xl border border-white/5">
                  {risk.severity === 'High' ? <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" /> : 
                   risk.severity === 'Medium' ? <AlertTriangle size={18} className="text-yellow-500 mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-slate-200 text-sm">{risk.category}</span>
                       <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded uppercase",
                        risk.severity === 'High' ? 'bg-red-900/30 text-red-400' : 
                        risk.severity === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-blue-900/30 text-blue-400'
                      )}>{risk.severity} Risk</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{risk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
