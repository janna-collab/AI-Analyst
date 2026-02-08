
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import UploadView from './components/UploadView';
import DashboardView from './components/DashboardView';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import { apiService } from './api';
import { authService } from './auth';
import { storageService } from './storage';
import { StartupAnalysis, UploadedFile, User, SavedReport } from './types';
import { Home, UploadCloud, FileText, AlertCircle, Telescope, Cpu, Sparkles, History, Trash2, Calendar } from 'lucide-react';
import { cn } from './lib/utils';

type Tab = 'upload' | 'results' | 'insights' | 'history';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  
  const [analysisResult, setAnalysisResult] = useState<StartupAnalysis | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>("Initializing Agent Swarm...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadHistory(user);
    }
  }, []);

  const loadHistory = (user: User) => {
    const reports = storageService.getReports(user);
    setSavedReports(reports);
  };

  const handleAnalyze = async (files: UploadedFile[], notes: string, sector: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisStatus("Intake complete. Calling Backend Swarm...");
    try {
      const result = await apiService.analyzeStartup(files, notes, sector, (status) => {
        setAnalysisStatus(status);
      });
      setAnalysisResult(result);
      
      // Auto-save the most recent analysis to history
      if (currentUser) {
        storageService.saveReport(result, currentUser);
        loadHistory(currentUser);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.message || "Analysis failure.";
      if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota")) {
        setError("API Quota Exceeded. The Gemini API limits for this key have been reached. Please wait a minute or upgrade your plan.");
      } else {
        setError(errorMsg || "Analysis failure. The backend swarm was interrupted.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetStarted = () => {
    try {
      const guestId = `guest_${Math.random().toString(36).substr(2, 5)}`;
      const guestUser = authService.signUp(`${guestId}@venturescout.ai`, 'password123', 'Guest Analyst');
      setCurrentUser(guestUser);
      loadHistory(guestUser);
    } catch (e) {
      const sessionUser = authService.getCurrentUser();
      if (sessionUser) {
        setCurrentUser(sessionUser);
        loadHistory(sessionUser);
      } else {
        const fallbackUser = { id: 'guest', email: 'guest@venturescout.ai', name: 'Guest Analyst' };
        setCurrentUser(fallbackUser);
        loadHistory(fallbackUser);
      }
    }
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAnalysisResult(null);
    setSavedReports([]);
    setActiveTab('upload');
  };

  const deleteSavedReport = (id: string) => {
    if (currentUser) {
      storageService.deleteReport(id, currentUser);
      loadHistory(currentUser);
    }
  };

  const viewSavedReport = (report: SavedReport) => {
    setAnalysisResult(report.analysis);
    setActiveTab('results');
  };

  if (!currentUser) {
    return (
      <>
        <LandingPage 
          onGetStarted={handleGetStarted} 
          onLogin={() => openAuth('login')}
          onSignUp={() => openAuth('signup')}
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          initialMode={authMode}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            loadHistory(user);
          }}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-white overflow-hidden">
      
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-slate-950 border-r border-white/10 transition-all duration-300 ease-in-out",
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <Sidebar 
          isOpen={isSidebarOpen}
          toggle={() => setSidebarOpen(!isSidebarOpen)}
          currentView={activeTab === 'upload' ? 'upload' : 'dashboard'} 
          setView={(view) => {
            if (view === 'upload') setActiveTab('upload');
            else if (view === 'dashboard' && analysisResult) setActiveTab('results');
          }} 
          onLogout={handleLogout}
          user={currentUser}
          onShowHistory={() => setActiveTab('history')}
        />
      </div>

      <div className={cn(
        "flex-1 flex flex-col h-full transition-all duration-300",
        isSidebarOpen ? 'ml-64' : 'ml-20'
      )}>
        
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-violet-900/20">
               <Telescope size={20} className="text-white" />
             </div>
             <span className="font-bold text-lg tracking-tight text-white">VentureScout</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-bold text-white">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 font-medium lowercase tracking-tighter">{currentUser.email.toLowerCase()}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium"
            >
               <Home size={16} />
               <span className="hidden sm:inline">Portal Home</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative flex flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950 -z-10 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col">
            <div className="flex items-center border-b border-white/10 mb-8 shrink-0 overflow-x-auto">
              <button onClick={() => setActiveTab('upload')} className={cn("relative px-6 py-4 font-semibold text-sm flex items-center gap-2.5", activeTab === 'upload' ? 'text-blue-400' : 'text-slate-400')}>
                <UploadCloud size={18} /> Intake {activeTab === 'upload' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
              </button>
              <button onClick={() => analysisResult && setActiveTab('results')} disabled={!analysisResult} className={cn("relative px-6 py-4 font-medium text-sm flex items-center gap-2.5", activeTab === 'results' ? 'text-blue-400 font-semibold' : !analysisResult ? 'text-slate-600' : 'text-slate-400')}>
                <FileText size={18} /> Memo {activeTab === 'results' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
              </button>
              <button onClick={() => analysisResult && setActiveTab('insights')} disabled={!analysisResult} className={cn("relative px-6 py-4 font-medium text-sm flex items-center gap-2.5", activeTab === 'insights' ? 'text-blue-400 font-semibold' : !analysisResult ? 'text-slate-600' : 'text-slate-400')}>
                <AlertCircle size={18} /> Insights {activeTab === 'insights' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
              </button>
              <button onClick={() => setActiveTab('history')} className={cn("relative px-6 py-4 font-medium text-sm flex items-center gap-2.5", activeTab === 'history' ? 'text-blue-400 font-semibold' : 'text-slate-400')}>
                <History size={18} /> History {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-900/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} className="shrink-0" />
                <span className="font-bold">Execution Error:</span> {error}
              </div>
            )}

            <div className="flex-1">
              {activeTab === 'upload' && <UploadView onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} status={analysisStatus} hasResult={!!analysisResult} onViewResult={() => setActiveTab('results')} />}
              {activeTab === 'results' && analysisResult && <DashboardView analysis={analysisResult} mode="results" />}
              {activeTab === 'insights' && analysisResult && <DashboardView analysis={analysisResult} mode="insights" />}
              {activeTab === 'history' && (
                <div className="animate-fade-in grid gap-4">
                  {savedReports.map((report) => (
                    <div key={report.id} className="group bg-slate-900/60 border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all flex justify-between items-center">
                      <div className="flex-1 cursor-pointer" onClick={() => viewSavedReport(report)}>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400">{report.analysis.companyName}</h3>
                        <p className="text-sm text-slate-400">{report.analysis.oneLiner}</p>
                        <div className="flex gap-4 mt-2 text-[10px] text-slate-500 uppercase font-bold">
                           <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(report.savedAt).toLocaleDateString()}</span>
                           <span className={cn(report.analysis.verdict === 'Invest' ? 'text-green-400' : 'text-red-400')}>{report.analysis.verdict}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteSavedReport(report.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
