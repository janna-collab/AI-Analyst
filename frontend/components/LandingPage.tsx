import React from 'react';
import { 
  BarChart2, ShieldCheck, Zap, ArrowRight, TrendingUp, Search, 
  BrainCircuit, Globe, Bot, Sparkles, CheckCircle2, Play, 
  PieChart, Activity, FileText, MessageSquare, Telescope, 
  Layers, Clock, Users, ChevronRight, Star, Quote, Check
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onSignUp }) => {
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none">
         <div className="absolute inset-0 bg-[#020617]"></div>
         {/* Dynamic Glows */}
         <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-40 animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
         
         {/* Tech Grid Overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 mask-image-gradient"></div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 backdrop-blur-xl fixed w-full z-50 bg-[#020617]/70 supports-[backdrop-filter]:bg-[#020617]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-violet-500/20">
              <Telescope size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">VentureScout AI</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={onLogin}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={onSignUp}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign Up
            </button>
            <button 
              onClick={scrollToPricing}
              className="bg-white text-slate-950 px-6 py-2 rounded-full text-xs font-bold hover:bg-indigo-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105 uppercase tracking-widest"
            >
              PRICING
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 backdrop-blur-md animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span className="text-[10px] font-bold text-indigo-300 tracking-widest uppercase">AI POWERED INVESTMENT ANALYST</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                The Analyst That <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                  Never Sleeps.
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-xl mb-8 leading-relaxed">
                Automate your due diligence. Ingest pitch decks, verify markets, and generate investment memos in seconds with our multi-agent AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full font-bold text-base transition-all hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
                <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white border border-white/10 rounded-full font-semibold text-base transition-all backdrop-blur-sm flex items-center justify-center gap-3 hover:border-white/20">
                   <Play size={16} className="fill-white" />
                   View Sample Memo
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">
                       {['S','J','M'][i-1]}
                    </div>
                  ))}
                </div>
                <p>Trusted by 500+ VCs & Angels</p>
              </div>
            </div>

            {/* Right Visual - Interactive Dashboard Simulation */}
            <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
               {/* Main Card Container with 3D effect */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-[4/3] bg-[#0f172a] rounded-xl border border-indigo-500/20 shadow-[0_0_50px_rgba(79,70,229,0.15)] rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700 ease-out group overflow-hidden z-20">
                  
                  {/* Window Header */}
                  <div className="h-10 bg-slate-900/50 border-b border-white/5 flex items-center px-4 gap-2">
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                     </div>
                     <div className="ml-4 h-1.5 w-32 bg-slate-800 rounded-full opacity-50"></div>
                  </div>

                  {/* Dashboard Layout */}
                  <div className="p-5 grid grid-cols-12 gap-5 h-[calc(100%-40px)]">
                     
                     {/* Left Sidebar */}
                     <div className="col-span-3 space-y-3 border-r border-white/5 pr-4 flex flex-col">
                        <div className="h-20 bg-indigo-500/10 rounded-lg animate-pulse mb-2 border border-indigo-500/10"></div>
                        <div className="h-6 bg-slate-800/30 rounded-md w-3/4"></div>
                        <div className="h-6 bg-slate-800/30 rounded-md w-full"></div>
                        <div className="h-6 bg-slate-800/30 rounded-md w-2/3"></div>
                        <div className="mt-auto">
                           <div className="h-20 bg-slate-800/20 rounded-lg w-full"></div>
                        </div>
                     </div>

                     {/* Main Content Area */}
                     <div className="col-span-9 flex flex-col gap-4">
                        
                        {/* Top Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                           <div className="h-24 bg-slate-800/40 rounded-lg border border-white/5 p-4 relative overflow-hidden group/card">
                              <div className="absolute top-0 right-0 p-2 opacity-20"><Activity className="text-blue-400" /></div>
                              <div className="h-2 w-16 bg-slate-700 rounded mb-3"></div>
                              <div className="h-8 w-10 bg-slate-600/50 rounded animate-pulse"></div>
                              {/* Animated Graph Line */}
                              <svg className="absolute bottom-0 left-0 right-0 h-12 w-full text-blue-500/20 fill-current" viewBox="0 0 100 20" preserveAspectRatio="none">
                                 <path d="M0,20 L0,10 Q20,5 40,15 T100,0 L100,20 Z" />
                              </svg>
                           </div>
                           <div className="h-24 bg-slate-800/40 rounded-lg border border-white/5 p-4 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-2 opacity-20"><PieChart className="text-purple-400" /></div>
                              <div className="h-2 w-16 bg-slate-700 rounded mb-3"></div>
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin"></div>
                                 <div className="h-2 w-12 bg-slate-700 rounded"></div>
                              </div>
                           </div>
                        </div>

                        {/* Central Chart Area */}
                        <div className="flex-1 bg-slate-900/50 rounded-lg border border-white/5 p-4 relative flex flex-col justify-end overflow-hidden">
                           <div className="absolute top-4 left-4 h-2 w-24 bg-slate-700 rounded"></div>
                           <div className="flex items-end justify-between gap-2 h-24 px-1 pb-1">
                              {[35, 55, 40, 70, 45, 80, 60, 75].map((h, i) => (
                                 <div key={i} className="w-full bg-indigo-500/10 rounded-t-sm relative group overflow-hidden">
                                    <div 
                                       style={{ height: `${h}%`, '--target-height': `${h}%` } as React.CSSProperties} 
                                       className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm opacity-80 animate-[grow_2s_ease-out_forwards]"
                                    ></div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Bottom Metric Cards */}
                        <div className="grid grid-cols-2 gap-4 h-20">
                           <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3 flex flex-col justify-between">
                              <div className="flex items-center gap-2">
                                 <div className="p-1 rounded bg-green-500/20 text-green-400"><TrendingUp size={12}/></div>
                                 <span className="text-[10px] text-green-300 font-bold uppercase">Growth Signal</span>
                              </div>
                              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full w-[85%] bg-green-500"></div>
                              </div>
                           </div>
                           <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 flex flex-col justify-between">
                              <div className="flex items-center gap-2">
                                 <div className="p-1 rounded bg-red-500/20 text-red-400"><ShieldCheck size={12}/></div>
                                 <span className="text-[10px] text-red-300 font-bold uppercase">Risk Check</span>
                              </div>
                              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full w-[30%] bg-red-500"></div>
                              </div>
                           </div>
                        </div>

                     </div>
                  </div>

                  {/* Overlay Scanner Line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-scan opacity-50 pointer-events-none z-30"></div>

                  {/* Toast Notification */}
                  <div className="absolute bottom-6 right-6 bg-slate-800 border border-white/10 rounded-lg shadow-2xl p-3 flex items-center gap-3 animate-slideIn z-40">
                     <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-green-400" />
                     </div>
                     <div>
                        <div className="text-xs font-bold text-white">Deal Memo Generated</div>
                        <div className="text-[10px] text-slate-400">Processing time: 1.4s</div>
                     </div>
                  </div>

               </div>
               
               {/* Background Decorative Blobs */}
               <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-indigo-600/30 rounded-full blur-[100px] -z-10 animate-pulse"></div>
               <div className="absolute bottom-[10%] left-[10%] w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] -z-10 animate-float"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUSTED BY */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02]">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Empowering Investment Teams At</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {['Sequoia', 'a16z', 'Benchmark', 'Lightspeed', 'Founders Fund'].map((name, i) => (
                  <div key={i} className="text-xl font-bold text-slate-300 flex items-center gap-2">
                     <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
                     {name}
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION 3: THE PROBLEM */}
      <section className="py-24 bg-[#020617] relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-4">Stop Drowning in Data Rooms</h2>
               <p className="text-slate-400 max-w-2xl mx-auto">The traditional investment process is broken. VentureScout fixes it.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               {/* The Old Way */}
               <div className="p-8 rounded-3xl bg-red-900/5 border border-red-500/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Clock size={100} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-red-200 mb-4 flex items-center gap-2">
                     <div className="p-1.5 bg-red-500/20 rounded-lg"><Clock size={16} /></div>
                     The Old Way
                  </h3>
                  <ul className="space-y-4 text-slate-400">
                     <li className="flex items-start gap-3">
                        <span className="text-red-500 font-bold mt-1">✕</span>
                        Hours spent reading generic pitch decks
                     </li>
                     <li className="flex items-start gap-3">
                        <span className="text-red-500 font-bold mt-1">✕</span>
                        Manual competitive landscape mapping
                     </li>
                     <li className="flex items-start gap-3">
                        <span className="text-red-500 font-bold mt-1">✕</span>
                        Missed red flags in financial appendices
                     </li>
                     <li className="flex items-start gap-3">
                        <span className="text-red-500 font-bold mt-1">✕</span>
                        Inconsistent evaluation criteria
                     </li>
                  </ul>
               </div>

               {/* The VentureScout Way */}
               <div className="p-8 rounded-3xl bg-indigo-900/5 border border-indigo-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Zap size={100} className="text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold text-indigo-200 mb-4 flex items-center gap-2">
                     <div className="p-1.5 bg-indigo-500/20 rounded-lg"><Zap size={16} /></div>
                     The VentureScout Way
                  </h3>
                  <ul className="space-y-4 text-slate-300">
                     <li className="flex items-start gap-3">
                        <span className="text-indigo-400 font-bold mt-1">✓</span>
                        <span className="font-medium text-white">2-minute</span> full analysis turnarounds
                     </li>
                     <li className="flex items-start gap-3">
                        <span className="text-indigo-400 font-bold mt-1">✓</span>
                        Auto-generated market sizing & growth benchmarks
                     </li>
                     <li className="flex items-start gap-3">
                        <span className="text-indigo-400 font-bold mt-1">✓</span>
                        Deep forensic risk detection (IP, Cap Table, Churn)
                     </li>
                     <li className="flex items-start gap-3">
                        <span className="text-indigo-400 font-bold mt-1">✓</span>
                        Standardized scoring across your entire pipeline
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-24 bg-gradient-to-b from-[#020617] to-slate-950 relative overflow-hidden">
         {/* Line connector */}
         <div className="hidden md:block absolute top-[50%] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -translate-y-1/2 border-t border-dashed border-slate-700/50"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
               <h2 className="text-3xl font-bold mb-4">From Deck to Decision in 3 Steps</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
               {[
                  {
                     step: "01",
                     title: "Upload Materials",
                     desc: "Drag & drop pitch decks, call transcripts, and data room files. We handle PDFs, Audio, and Text.",
                     icon: <Layers size={24} className="text-blue-400" />
                  },
                  {
                     step: "02",
                     title: "Agent Swarm Analysis",
                     desc: "Specialized AI agents dissect the Product, verify the Market size, and audit the Team background simultaneously.",
                     icon: <BrainCircuit size={24} className="text-purple-400" />
                  },
                  {
                     step: "03",
                     title: "Investment Verdict",
                     desc: "Receive a structured Investment Memo with a clear 0-100 Score, Risk Assessment, and Recommendation.",
                     icon: <FileText size={24} className="text-pink-400" />
                  }
               ].map((item, i) => (
                  <div key={i} className="relative group text-center">
                     <div className="w-20 h-20 mx-auto bg-slate-900 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-900/10 group-hover:-translate-y-2 transition-transform duration-300 relative z-20">
                        {item.icon}
                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                           {item.step}
                        </div>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                     <p className="text-slate-400 text-sm leading-relaxed px-4">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION 5: FEATURES GRID */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">Capabilities</div>
             <h2 className="text-4xl font-bold mb-4">The Complete Analyst Toolkit</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="text-yellow-400" size={24} />,
                title: "Instant Synthesis",
                desc: "Extract key metrics, value props, and team backgrounds automatically from unstructured docs."
              },
              {
                icon: <ShieldCheck className="text-red-400" size={24} />,
                title: "Forensic Risk Detection",
                desc: "We flag inconsistent financials, competitive crowding, and unusual cap table structures."
              },
              {
                icon: <BarChart2 className="text-blue-400" size={24} />,
                title: "Market Benchmarking",
                desc: "Contextualize traction against a live database of 50k+ startups to validate growth quality."
              },
              {
                 icon: <Globe className="text-cyan-400" size={24} />,
                 title: "Competitor Mapping",
                 desc: "Identify direct and adjacent competitors instantly to assess moat durability."
              },
              {
                 icon: <MessageSquare className="text-purple-400" size={24} />,
                 title: "Q&A Prep",
                 desc: "Generate high-IQ follow-up questions for founder calls based on deck gaps."
              },
              {
                 icon: <TrendingUp className="text-green-400" size={24} />,
                 title: "Exit Scenarios",
                 desc: "Project potential exit multiples based on sector M&A activity and public comps."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.06] transition-all hover:-translate-y-1 duration-300 relative overflow-hidden">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-white/20">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-white group-hover:text-indigo-200 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="py-24 bg-[#020617] relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-3xl font-bold text-center mb-16">Loved by Modern Investors</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
               {[
                  {
                     quote: "VentureScout acts like a senior associate working at 100x speed. We screen 5x more deals since adopting it.",
                     author: "Sarah J.",
                     role: "Partner @ Sequoia (Mock)"
                  },
                  {
                     quote: "The risk detection is scary good. It caught a cap table issue in a Series A deck that we missed manually.",
                     author: "David L.",
                     role: "Angel Investor"
                  },
                  {
                     quote: "Finally, a tool that structures the mess of pitch decks into clean, comparable data. A game changer for our investment committee.",
                     author: "Elena R.",
                     role: "Head of Platform @ Growth Fund"
                  }
               ].map((t, i) => (
                  <div key={i} className="bg-slate-900/50 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative">
                     <Quote className="absolute top-6 right-6 text-indigo-500/20" size={40} />
                     <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-yellow-500 text-yellow-500" />)}
                     </div>
                     <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                           {t.author.charAt(0)}
                        </div>
                        <div>
                           <div className="text-white font-bold text-sm">{t.author}</div>
                           <div className="text-indigo-400 text-xs">{t.role}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION 7: FINAL CTA */}
      <section className="py-20">
         <div className="max-w-5xl mx-auto px-6">
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-3xl p-12 text-center border border-indigo-500/30 relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
               <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to 10x your deal flow?</h2>
                  <p className="text-indigo-200 mb-8 max-w-xl mx-auto text-lg">Join elite investors using AI to make faster, smarter high-conviction decisions.</p>
                  <button 
                    onClick={onGetStarted}
                    className="bg-white text-indigo-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105"
                  >
                     Get Started for Free
                  </button>
                  <p className="mt-4 text-xs text-indigo-300/60">No credit card required • SOC2 Compliant</p>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION: PRICING (Moved to end of page) */}
      <section id="pricing" className="py-24 bg-[#020617] relative overflow-hidden border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold mb-4">Investment Scale Pricing</h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose the right plan for your fund's deal flow volume.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {[
                  {
                     name: "Angel",
                     price: "$99",
                     period: "/mo",
                     desc: "Perfect for solo angels and scouts.",
                     features: ["5 Analysis Memos /mo", "Basic Risk Detection", "PDF Ingestion", "Community Support"],
                     cta: "Start for Free",
                     popular: false
                  },
                  {
                     name: "Venture",
                     price: "$499",
                     period: "/mo",
                     desc: "Designed for small GP/LP teams.",
                     features: ["50 Analysis Memos /mo", "Advanced Risk Forensics", "Agent Swarm Reasoning", "Priority Support", "Competitor Mapping"],
                     cta: "Get Started",
                     popular: true
                  },
                  {
                     name: "Enterprise",
                     price: "Custom",
                     period: "",
                     desc: "For institutional funds and banks.",
                     features: ["Unlimited Analysis", "Custom AI Models", "SOC2 Compliance", "Dedicated Analyst Support", "API Access"],
                     cta: "Talk to Sales",
                     popular: false
                  }
               ].map((plan, i) => (
                  <div key={i} className={`p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] flex flex-col ${plan.popular ? 'bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_40px_rgba(79,70,229,0.15)] relative' : 'bg-white/[0.02] border-white/10 hover:border-white/20'}`}>
                     {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                           Most Popular
                        </div>
                     )}
                     <div className="mb-8">
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                           <span className="text-4xl font-bold">{plan.price}</span>
                           <span className="text-slate-400 text-sm font-medium">{plan.period}</span>
                        </div>
                        <p className="text-slate-400 text-sm mt-3">{plan.desc}</p>
                     </div>
                     <div className="flex-1 space-y-4 mb-8">
                        {plan.features.map((f, fi) => (
                           <div key={fi} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                 <Check size={12} className="text-indigo-400" />
                              </div>
                              <span className="text-sm text-slate-300">{f}</span>
                           </div>
                        ))}
                     </div>
                     <button 
                       onClick={plan.cta === "Talk to Sales" ? undefined : onGetStarted}
                       className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
                     >
                        {plan.cta}
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#020617] text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
           <div className="col-span-1">
              <div className="flex items-center gap-2 text-white mb-4">
                 <div className="bg-slate-800 p-1.5 rounded-lg">
                    <Telescope size={16} />
                 </div>
                 <span className="font-bold">VentureScout AI</span>
              </div>
              <p className="text-slate-500 leading-relaxed">The operating system for modern venture capital due diligence.</p>
           </div>
           <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                 <li><a href="#" className="hover:text-indigo-400">Features</a></li>
                 <li><a href="#" className="hover:text-indigo-400">Security</a></li>
                 <li><a href="#" className="hover:text-indigo-400">Pricing</a></li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                 <li><a href="#" className="hover:text-indigo-400">Blog</a></li>
                 <li><a href="#" className="hover:text-indigo-400">Case Studies</a></li>
                 <li><a href="#" className="hover:text-indigo-400">Docs</a></li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                 <li><a href="#" className="hover:text-indigo-400">About</a></li>
                 <li><a href="#" className="hover:text-indigo-400">Careers</a></li>
                 <li><a href="#" className="hover:text-indigo-400">Contact</a></li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
           <p>© 2024 VentureScout AI. All rights reserved.</p>
           <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;