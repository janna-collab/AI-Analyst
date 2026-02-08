
import React, { useState, useRef, DragEvent } from 'react';
import { UploadCloud, FileText, X, Loader2, ChevronRight, Trash2, Phone, Mail, Paperclip, FolderOpen, Sparkles, Cpu, UserPlus, CheckCircle2 } from 'lucide-react';
import { UploadedFile } from '../types';

interface UploadViewProps {
  onAnalyze: (files: UploadedFile[], notes: string, sector: string) => void;
  isAnalyzing: boolean;
  status?: string;
  hasResult?: boolean;
  onViewResult?: () => void;
}

const UploadView: React.FC<UploadViewProps> = ({ onAnalyze, isAnalyzing, status, hasResult, onViewResult }) => {
  const [pitchDeck, setPitchDeck] = useState<UploadedFile | null>(null);
  const [supportingDocs, setSupportingDocs] = useState<UploadedFile[]>([]);
  const [customNotes, setCustomNotes] = useState("");
  
  // Drag states
  const [isDraggingDeck, setIsDraggingDeck] = useState(false);
  const [dragActiveZone, setDragActiveZone] = useState<string | null>(null);
  
  // Refs for file inputs
  const pitchDeckRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const founderEmailRef = useRef<HTMLInputElement>(null);
  const updateRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File, prefix?: string): Promise<UploadedFile> => {
    const base64 = await toBase64(file);
    const name = prefix ? `[${prefix}] ${file.name}` : file.name;
    return { name: name, type: file.type, data: base64 };
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result.split(',')[1]);
        else reject(new Error("Failed to read file"));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDeckDrag = (e: DragEvent<HTMLDivElement>, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingDeck(active);
  };

  const handleDeckDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingDeck(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') return alert("Pitch deck must be a PDF.");
      setPitchDeck(await processFile(file));
    }
  };

  const handleSupportDrag = (e: DragEvent<HTMLButtonElement>, zone: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveZone(zone);
  };

  const handleSupportDrop = async (e: DragEvent<HTMLButtonElement>, categoryName: string, prefix: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveZone(null);
    
    if (e.dataTransfer.files?.length) {
      const newFiles = await Promise.all(
        Array.from(e.dataTransfer.files).map((f: any) => processFile(f, prefix))
      );
      setSupportingDocs(prev => [...prev, ...newFiles]);
    }
  };

  const handleSupportFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, prefix: string) => {
    if (e.target.files) {
      const newFiles = await Promise.all(Array.from(e.target.files).map((f: any) => processFile(f, prefix)));
      setSupportingDocs(prev => [...prev, ...newFiles]);
    }
    if (transcriptRef.current) transcriptRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (founderEmailRef.current) founderEmailRef.current.value = '';
    if (updateRef.current) updateRef.current.value = '';
  };

  const handleStart = () => {
    const allFiles = pitchDeck ? [pitchDeck, ...supportingDocs] : [...supportingDocs];
    onAnalyze(allFiles, customNotes || "Conduct a full institutional audit.", "Technology");
  };

  return (
    <div className="animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-white/5 pb-6">
        <div>
           <h1 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
              <div className="bg-blue-600/20 border border-blue-500/30 p-2 rounded-lg">
                <Sparkles className="text-blue-400" size={20} />
              </div>
              New Evaluation
           </h1>
           <p className="text-slate-400 text-sm ml-1">
             Upload documents to trigger the specialized Agent Swarm.
           </p>
        </div>
        
        {!hasResult ? (
          <div className="flex bg-slate-900/80 border border-white/10 px-4 py-2 rounded-full items-center gap-2 backdrop-blur-md whitespace-nowrap">
            <Loader2 size={14} className="text-blue-400 animate-spin-slow" />
            <span className="text-xs font-medium text-slate-300">Estimated Time: <span className="text-white font-bold ml-1">2-3 min</span></span>
          </div>
        ) : (
          <div className="flex bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full items-center gap-2 backdrop-blur-md whitespace-nowrap animate-in zoom-in duration-300">
            <CheckCircle2 size={14} className="text-green-400" />
            <span className="text-xs font-bold text-green-300 uppercase tracking-tighter">Analysis Ready</span>
          </div>
        )}
      </div>

      {hasResult && (
        <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-left-4 duration-500">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                 <CheckCircle2 size={28} className="text-green-400" />
              </div>
              <div>
                 <h2 className="text-white font-bold text-lg">Analysis Complete!</h2>
                 <p className="text-slate-400 text-sm">Your Investment Memo has been synthesized and is ready for review.</p>
              </div>
           </div>
           <button 
             onClick={onViewResult}
             className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center gap-2 whitespace-nowrap"
           >
              View Investment Memo <ChevronRight size={18} />
           </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Pitch Deck Card */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
             <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="text-blue-400" size={16} />
                  Primary Deck (PDF)
                </h2>
                <p className="text-[11px] text-slate-400 mt-1 ml-6">Foundation for the Data Associate</p>
             </div>
             <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">REQUIRED</span>
          </div>

          <div 
            onDragEnter={(e) => handleDeckDrag(e, true)}
            onDragLeave={(e) => handleDeckDrag(e, false)}
            onDragOver={(e) => handleDeckDrag(e, true)}
            onDrop={handleDeckDrop}
            onClick={() => pitchDeckRef.current?.click()}
            className={`
              relative group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden h-56
              ${isDraggingDeck 
                ? 'bg-blue-900/20 border-blue-500 scale-[1.01]' 
                : pitchDeck 
                  ? 'bg-slate-900/60 border-blue-500/50' 
                  : 'bg-slate-900/40 border-slate-700/60 hover:border-blue-500/50 hover:bg-slate-800/60'}
            `}
          >
            <input ref={pitchDeckRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0]).then(setPitchDeck)} />
            
            {pitchDeck ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-3 shadow-xl shadow-blue-900/20">
                  <FileText size={24} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-sm text-center break-all px-4 truncate max-w-full">{pitchDeck.name}</h3>
                <p className="text-blue-300/70 text-[10px] mt-1 font-medium">Ready for Extraction</p>
                
                {!isAnalyzing && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPitchDeck(null); }}
                    className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors border border-red-500/20"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center p-6 z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${isDraggingDeck ? 'bg-blue-500 text-white scale-110' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-blue-400'}`}>
                  <UploadCloud size={20} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Drag & Drop Pitch Deck</h3>
                <p className="text-slate-400 text-xs mb-3">PDF Format Preferred</p>
              </div>
            )}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Supporting Docs */}
        <div className="flex flex-col h-full">
           <div className="mb-4">
             <div className="flex items-center gap-2">
               <Paperclip className="text-white" size={16} />
               <h2 className="text-sm font-bold text-white">Multimodal Context</h2>
             </div>
             <p className="text-[11px] text-slate-400 mt-1 ml-6">Feeds the specialized auditing agents</p>
           </div>
           
           <div className="flex-1 space-y-3">
              
              <input ref={transcriptRef} type="file" multiple className="hidden" onChange={(e) => handleSupportFileSelect(e, 'Transcript')} />
              <button 
                onDragEnter={(e) => handleSupportDrag(e, 'transcript')}
                onDragLeave={(e) => handleSupportDrag(e, null)}
                onDragOver={(e) => handleSupportDrag(e, 'transcript')}
                onDrop={(e) => handleSupportDrop(e, 'Call Transcripts', 'Transcript')}
                onClick={() => transcriptRef.current?.click()}
                disabled={isAnalyzing}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl border transition-all group relative overflow-hidden
                  ${dragActiveZone === 'transcript' 
                    ? 'bg-pink-900/40 border-pink-500 scale-[1.02]' 
                    : 'bg-gradient-to-r from-pink-950/30 to-slate-900/40 border-pink-500/20 hover:border-pink-500/50 hover:from-pink-900/20'}
                `}
              >
                <div className="flex items-center gap-3 z-10">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                    <Phone size={18} className="text-pink-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white text-sm font-semibold">Call Transcripts</h3>
                    <p className="text-pink-200/50 text-[10px]">Verify founder claims</p>
                  </div>
                </div>
                <div className="z-10 bg-pink-500/10 p-1.5 rounded-lg">
                  {dragActiveZone === 'transcript' ? <UploadCloud size={16} className="text-pink-400 animate-bounce" /> : <FolderOpen size={16} className="text-pink-400/70" />}
                </div>
              </button>

              <input ref={founderEmailRef} type="file" multiple className="hidden" onChange={(e) => handleSupportFileSelect(e, 'FounderEmail')} />
              <button 
                onDragEnter={(e) => handleSupportDrag(e, 'founderEmail')}
                onDragLeave={(e) => handleSupportDrag(e, null)}
                onDragOver={(e) => handleSupportDrag(e, 'founderEmail')}
                onDrop={(e) => handleSupportDrop(e, 'Founder Emails', 'FounderEmail')}
                onClick={() => founderEmailRef.current?.click()}
                disabled={isAnalyzing}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl border transition-all group relative overflow-hidden
                  ${dragActiveZone === 'founderEmail' 
                    ? 'bg-violet-900/40 border-violet-500 scale-[1.02]' 
                    : 'bg-gradient-to-r from-violet-950/30 to-slate-900/40 border-violet-500/20 hover:border-violet-500/50 hover:from-violet-900/20'}
                `}
              >
                <div className="flex items-center gap-3 z-10">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                    <UserPlus size={18} className="text-violet-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white text-sm font-semibold">Founder Correspondence</h3>
                    <p className="text-violet-200/50 text-[10px]">Direct 1-on-1 communications</p>
                  </div>
                </div>
                <div className="z-10 bg-violet-500/10 p-1.5 rounded-lg">
                   {dragActiveZone === 'founderEmail' ? <UploadCloud size={16} className="text-violet-400 animate-bounce" /> : <FolderOpen size={16} className="text-violet-400/70" />}
                </div>
              </button>

              <input ref={emailRef} type="file" multiple className="hidden" onChange={(e) => handleSupportFileSelect(e, 'Email')} />
              <button 
                onDragEnter={(e) => handleSupportDrag(e, 'email')}
                onDragLeave={(e) => handleSupportDrag(e, null)}
                onDragOver={(e) => handleSupportDrag(e, 'email')}
                onDrop={(e) => handleSupportDrop(e, 'Email Threads', 'Email')}
                onClick={() => emailRef.current?.click()}
                disabled={isAnalyzing}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl border transition-all group relative overflow-hidden
                  ${dragActiveZone === 'email' 
                    ? 'bg-cyan-900/40 border-cyan-500 scale-[1.02]' 
                    : 'bg-gradient-to-r from-cyan-950/30 to-slate-900/40 border-cyan-500/20 hover:border-cyan-500/50 hover:from-cyan-900/20'}
                `}
              >
                <div className="flex items-center gap-3 z-10">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <Mail size={18} className="text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white text-sm font-semibold">Institutional Threads</h3>
                    <p className="text-cyan-200/50 text-[10px]">Audit comms & deal terms</p>
                  </div>
                </div>
                <div className="z-10 bg-cyan-500/10 p-1.5 rounded-lg">
                   {dragActiveZone === 'email' ? <UploadCloud size={16} className="text-cyan-400 animate-bounce" /> : <FolderOpen size={16} className="text-cyan-400/70" />}
                </div>
              </button>

              {supportingDocs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Swarm Context ({supportingDocs.length} items)</h4>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                        {supportingDocs.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors group">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="p-1 rounded bg-slate-700 text-slate-300">
                                        <FileText size={10} />
                                    </div>
                                    <span className="text-xs text-slate-300 truncate font-medium max-w-[200px]">{file.name}</span>
                                </div>
                                {!isAnalyzing && (
                                  <button 
                                      onClick={() => setSupportingDocs(prev => prev.filter((_, i) => i !== idx))}
                                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-all"
                                  >
                                      <X size={12} />
                                  </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Specialist Analyst Notes */}
      <div className="mt-8 mb-10 w-full">
         <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Specialist Analyst Notes</h3>
         <textarea 
           value={customNotes}
           onChange={(e) => setCustomNotes(e.target.value)}
           disabled={isAnalyzing}
           placeholder="e.g. Focus on IP defensibility or verify the MRR growth claims in the last 3 months. Provide a deep dive into the underlying unit economics and scalability bottlenecks..."
           className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 h-56 resize-none transition-all placeholder:text-slate-600 shadow-inner"
         />
      </div>

      {/* Action Footer */}
      <div className="flex flex-col items-center pt-8 border-t border-white/5 gap-6">
        
        {isAnalyzing && (
          <div className="w-full max-w-xl bg-slate-900 border border-blue-500/20 rounded-2xl p-6 shadow-2xl animate-pulse">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                   <Cpu className="text-blue-400 animate-spin-slow" size={24} />
                </div>
                <div className="flex-1">
                   <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Active Reasoning Swarm</div>
                   <div className="text-sm text-white font-medium">{status}</div>
                </div>
             </div>
             <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-[loading_10s_ease-in-out_infinite]" style={{width: '60%'}}></div>
             </div>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={!pitchDeck || isAnalyzing}
          className={`
            group relative overflow-hidden w-full px-16 py-4 rounded-2xl font-bold text-lg tracking-wide transition-all shadow-2xl flex items-center justify-center gap-4
            ${pitchDeck && !isAnalyzing 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50 hover:shadow-blue-500/40 hover:-translate-y-1 border border-white/10' 
              : 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-800'}
          `}
        >
          {pitchDeck && !isAnalyzing && (
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
          )}
          
          {isAnalyzing ? (
            <>
               <Loader2 className="animate-spin" size={20} />
               <span>Orchestrating Expert Agents...</span>
            </>
          ) : (
            <>
              <span className="relative z-10">Trigger Swarm Analysis</span>
              {pitchDeck && <ChevronRight size={20} className="animate-pulse relative z-10" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadView;
