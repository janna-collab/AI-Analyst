
import React from 'react';
import { LayoutDashboard, Settings, UploadCloud, History, Bookmark, Menu, LogOut, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  currentView: 'upload' | 'dashboard';
  setView: (view: 'upload' | 'dashboard') => void;
  onLogout: () => void;
  user: User;
  onShowHistory?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, currentView, setView, onLogout, user, onShowHistory }) => {
  const isGuest = user.name === 'Guest Analyst';

  return (
    <div className="flex flex-col h-full bg-slate-950">
      
      {/* Sidebar Heading / Toggle */}
      <div className={cn(
        "flex items-center border-b border-white/5 transition-all duration-300 h-16",
        isOpen ? "justify-start px-4" : "justify-center"
      )}>
         <button 
            onClick={toggle} 
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Toggle Sidebar"
           >
            <Menu size={24} />
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden">
        
        <div className={cn("mb-6", isOpen ? "px-4" : "px-2")}>
          {isOpen && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Platform</h3>}
          <nav className="space-y-1">
              <button
                onClick={() => setView('upload')}
                className={cn(
                  "flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors text-sm",
                  currentView === 'upload' 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-white",
                  !isOpen && "justify-center"
                )}
                title="New Analysis"
              >
                <UploadCloud size={18} className="shrink-0" />
                {isOpen && <span className="font-medium whitespace-nowrap">Start New Analysis</span>}
              </button>
              
              <button
                onClick={() => setView('dashboard')}
                className={cn(
                  "flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors text-sm",
                  currentView === 'dashboard' 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-white",
                  !isOpen && "justify-center"
                )}
                title="Download Report"
              >
                <LayoutDashboard size={18} className="shrink-0" />
                {isOpen && <span className="font-medium whitespace-nowrap">Current Analysis Report</span>}
              </button>
          </nav>
        </div>

        <div className={cn("mb-6", isOpen ? "px-4" : "px-2")}>
          {isOpen && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Library</h3>}
          <nav className="space-y-1">
              <button 
                onClick={onShowHistory}
                className={cn(
                  "flex items-center gap-3 w-full p-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-colors text-sm",
                  !isOpen && "justify-center"
                )}
                title="Recent Reports"
              >
                <History size={18} className="shrink-0" />
                {isOpen && <span className="font-medium whitespace-nowrap">Recent Reports</span>}
              </button>
              <button 
                 onClick={onShowHistory}
                 className={cn(
                  "flex items-center gap-3 w-full p-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-colors text-sm",
                  !isOpen && "justify-center"
                )}
                 title="Saved Portfolio"
              >
                <Bookmark size={18} className="shrink-0" />
                {isOpen && <span className="font-medium whitespace-nowrap">Saved Portfolio</span>}
              </button>
          </nav>
        </div>
      </div>

      <div className={cn("p-4 border-t border-white/10 space-y-1", !isOpen && "flex flex-col items-center")}>
        <button 
          className={cn(
            "flex items-center gap-3 w-full p-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-colors text-sm",
            !isOpen && "justify-center"
          )}
          title="Settings"
        >
          <Settings size={18} className="shrink-0" />
          {isOpen && <span className="font-medium whitespace-nowrap">Settings</span>}
        </button>
         <button 
           onClick={onLogout}
           className={cn(
            "flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors text-sm",
            isGuest 
              ? "text-blue-400 hover:bg-blue-600/10" 
              : "text-slate-400 hover:bg-red-900/10 hover:text-red-400",
            !isOpen && "justify-center"
          )}
           title={isGuest ? "Sign In" : "Sign Out"}
         >
          {isGuest ? <LogIn size={18} className="shrink-0" /> : <LogOut size={18} className="shrink-0" />}
          {isOpen && <span className="font-medium whitespace-nowrap">{isGuest ? 'Sign In to Save' : 'Sign Out'}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
