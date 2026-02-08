
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { StartupAnalysis } from '../types';
import { 
  CheckCircle2, AlertTriangle, XCircle, TrendingUp, 
  Building2, Users, Search, Download, 
  Loader2, Mail, Send, X, Check, 
  Shield, Target, BarChart3, FileJson, Table, Bookmark, BookmarkCheck, Sparkles, Trophy
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
    { subject: 'Overall', A: analysis.scores?.overall || 50, fullMark: 100 },
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

  const renderHeader = () => (
    <div className="flex flex-col gap-6 mb-8 print:hidden">
      {/* Analysis Complete Success Banner */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 size={24} className="text-green-400" />
        </div>
        <div>
          <h3 className="text-green-400 font-bold text-sm">Analysis Complete</h3>
          <p className="text-green-400/70 text-xs">AI Swarm has successfully synthesized all materials for {analysis.companyName}.</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
           <Sparkles size={12} className="text-green-400" />
           <span className="text-[10px] font-bold text-green-300 uppercase tracking-widest">High Confidence</span>
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
               title="Save to Library"
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
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-500 rounded-xl transition-all text-xs font-bold shadow-lg shadow-indigo-900/20"
            >
              <Mail size={14} />
              Email Founders
            </button>
            {shareStep !== 'idle' && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl p-6 z-[60] animate-in fade-in zoom-in-95 duration-200">
                 {shareStep === 'input' && (
                   <div className="space-y-4">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-bold text-white">Founder Dispatch</h3>
                        <button onClick={() => setShareStep('idle')} className="text-slate-500 hover:text-white"><X size={14} /></button>
                      </div>
                      <div className="space-y-3">
                        <input 
                          type="email" 
                          placeholder="Founder Email" 
                          value={founderEmail}
                          onChange={(e) => setFounderEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <textarea 
                          placeholder="Feedback or context..." 
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
                          className="w-full bg-indigo-600 py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 hover:bg-indigo-500 transition-colors"
                        >
                          <Send size={12} /> Send Report
                        </button>
                      </div>
                   </div>
                 )}
                 {shareStep === 'sending' && (
                   <div className="flex flex-col items-center justify-center py-6 space-y-4">
                      <Loader2 size={32} className="text-indigo-500 animate-spin" />
                      <p className="text-sm font-bold text-white">Sending...</p>
                   </div>
                 )}
                 {shareStep === 'success' && (
                   <div className="flex flex-col items-center justify-center py-6 space-y-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Check size={20} className="text-green-400" />
                      </div>
                      <p className="text-sm font-bold text-white">Sent successfully</p>
                   </div>
                 )}
              </div>
            )}
          </div>

          <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 text-white hover:bg-slate-800 transition-all text-xs font-bold border-r border-white/5">
              <Download size={14} /> PDF
            </button>
            <button onClick={async () => {
              const blob = await apiService.exportToCsv(analysis);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${analysis.companyName}_Report.csv`;
              a.click();
            }} className="flex items-center gap-2 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xs font-bold border-r border-white/5">
              <Table size={14} /> CSV
            </button>
            <button onClick={async () => {
              const blob = await apiService.exportToJson(analysis);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${analysis.companyName}_Report.json`;
              a.click();
            }} className="flex items-center gap-2 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xs font-bold">
              <FileJson size={14} /> JSON
            </button>
          </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm col-span-1 lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-blue-500" /> Executive Summary
            </h2>
            <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">{analysis.executiveSummary}</p>
          </div>

          {/* Competitor Analysis Result - Enhanced Section */}
          {analysis.market_details?.competition?.competitors && analysis.market_details.competition.competitors.length > 0 && (
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield size={20} className="text-indigo-400" /> Competitive Analysis Result
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                   <Target size={12} className="text-indigo-400" />
                   <span className="text-[10px] font-bold text-indigo-300 uppercase">Market Intelligence</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {analysis.market_details.competition.competitors.map((comp, idx) => (
                  <div key={idx} className="bg-slate-950/40 border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                           <Trophy size={18} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{comp.name}</h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 uppercase tracking-widest mb-1">
                          {comp.estimated_growth}
                        </span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Est. Growth</span>
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                       <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Target size={12} /> Market Position
                       </h4>
                       <p className="text-sm text-slate-200 font-medium leading-relaxed">{comp.marketPosition || 'N/A'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 size={12} /> Pros
                        </h4>
                        <ul className="space-y-2">
                          {(comp.pros || (comp as any).strengths)?.map((s: string, i: number) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-2 leading-tight">
                              <span className="text-green-500 shrink-0">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle size={12} /> Cons
                        </h4>
                        <ul className="space-y-2">
                          {(comp.cons || (comp as any).weaknesses)?.map((w: string, i: number) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-2 leading-tight">
                              <span className="text-red-500 shrink-0">•</span> {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Market Gap Strategy</h4>
                      <p className="text-xs text-slate-400 leading-relaxed italic">"{comp.market_gap}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" /> Key Metrics & Traction
            </h2>
            <div className="space-y-4">
              {analysis.keyMetrics?.length > 0 ? analysis.keyMetrics.map((metric, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-medium text-sm">{metric.label}</span>
                  <div className="text-right">
                    <div className="font-bold text-white text-base">{metric.value}</div>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      metric.benchmarkComparison === 'Above' ? 'bg-green-500/20 text-green-400' :
                      metric.benchmarkComparison === 'Below' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'
                    )}> {metric.benchmarkComparison} Avg </span>
                  </div>
                </div>
              )) : <div className="text-slate-500 italic py-10 text-center">No metrics identified.</div>}
            </div>
          </div>
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-500" /> Analyst Verdict Logic
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm italic border-l-4 border-blue-500 pl-4 py-1">{analysis.reasoning}</p>
          </div>
        </div>
      </div>
    );
  }

  // Insights Mode - Realignment of Scorecard and Risks
  return (
    <div className="animate-fade-in pb-12 text-white">
      {renderHeader()}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Scorecard: Left Column (4/12) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm flex flex-col items-center h-full">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Venture Score</h3>
            <div className="text-5xl font-black text-white mb-6">
              {analysis.scores?.overall || 0}<span className="text-xl text-slate-500 font-normal">/100</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="Startup" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
               {['team', 'product', 'market', 'traction'].map((key) => (
                 <div key={key} className="p-3 bg-slate-950/40 rounded-xl border border-white/5 text-center">
                    <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">{key}</div>
                    <div className="text-sm font-bold text-white">{(analysis.scores as any)?.[key] || 0}%</div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Risks and Market: Right Column (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {analysis.market_details && (
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-400" /> Market Validation
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Market Size</div>
                  <div className="text-sm font-bold text-indigo-300">{analysis.market_details.market_insights?.market_size_estimate || 'N/A'}</div>
                </div>
                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Growth Rate</div>
                  <div className="text-sm font-bold text-green-400">{analysis.market_details.market_insights?.growth_rate || 'N/A'}</div>
                </div>
                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Maturity</div>
                  <div className="text-sm font-bold text-slate-200">{analysis.market_details.market_insights?.market_maturity || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm flex-1">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle size={20} className="text-yellow-500" /> Detailed Risk Assessment
            </h2>
            <div className="grid gap-4">
              {analysis.risks?.length > 0 ? analysis.risks.map((risk, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-slate-950/30 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                  {risk.severity === 'High' ? <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" /> : 
                   risk.severity === 'Medium' ? <AlertTriangle size={18} className="text-yellow-500 mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-slate-200 text-sm">{risk.category}</span>
                       <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                        risk.severity === 'High' ? 'bg-red-900/30 text-red-400' : 
                        risk.severity === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-blue-900/30 text-blue-400'
                      )}>{risk.severity} Risk</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{risk.description}</p>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <CheckCircle2 size={32} className="mb-2 opacity-20" />
                  <p className="text-sm font-medium">No critical risks identified.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
