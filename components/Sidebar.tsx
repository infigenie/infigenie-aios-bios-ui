
import React from 'react';
import { OSMode, View } from '../types';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BrainCircuit, 
  Wallet, 
  Building2, 
  Swords, 
  Settings, 
  User, 
  Briefcase,
  Zap,
  Heart,
  GraduationCap,
  PlaySquare,
  Megaphone,
  ShoppingBag,
  GitBranch,
  Users,
  HardDrive,
  Code,
  Trophy
} from 'lucide-react';

interface SidebarProps {
  mode: OSMode;
  currentView: View;
  onViewChange: (view: View) => void;
  onModeToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mode, currentView, onViewChange, onModeToggle }) => {
  
  const navItemClass = (view: View) => `
    flex items-center gap-3 px-3 py-2 transition-all duration-200 cursor-pointer mb-1 font-mono text-xs tracking-wide relative border-l-2
    ${currentView === view
      ? 'bg-amber-950/30 text-amber-500 border-amber-500 shadow-lg shadow-amber-500/10'
      : 'text-amber-700 hover:bg-amber-950/10 hover:text-amber-400 border-transparent hover:border-amber-800'}
  `;

  return (
    <div className="w-64 h-screen bg-black border-r-2 border-amber-900/50 flex flex-col flex-shrink-0 relative">
      {/* Vertical accent line */}
      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-500/0 via-amber-500/50 to-amber-500/0"></div>

      {/* Header */}
      <div className="p-6 border-b-2 border-amber-900/50 relative">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 border-2 border-amber-500 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-amber-500/10 animate-pulse"></div>
            <Zap className="w-5 h-5 text-amber-500 relative z-10" />
          </div>
          <div className="font-mono">
            <div className="text-[10px] text-amber-600 tracking-widest">SYSTEM</div>
            <div className="font-bold text-lg tracking-wide text-amber-500">INFIGENIE</div>
          </div>
        </div>
        <div className="text-[8px] text-amber-800 tracking-[0.2em] mt-2">TACTICAL OS v1.0</div>
      </div>

      {/* Context Badge */}
      <div className="px-6 py-4 border-b border-amber-900/30">
        <div className={`text-[10px] font-bold px-3 py-2 border-2 w-fit tracking-[0.2em] ${
          mode === OSMode.AIOS
            ? 'bg-amber-950/20 border-amber-700 text-amber-500'
            : 'bg-amber-950/30 border-amber-600 text-amber-400'
        }`}>
          {mode === OSMode.AIOS ? '[ PERSONAL OS ]' : '[ BUSINESS OS ]'}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 overflow-y-auto py-4">
        <div className="text-[10px] font-bold text-amber-800 mb-3 px-3 tracking-[0.3em]">
          [ MODULES ]
        </div>

        <div onClick={() => onViewChange(View.DASHBOARD)} className={navItemClass(View.DASHBOARD)}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </div>

        {mode === OSMode.AIOS && (
          <>
            <div onClick={() => onViewChange(View.LIFE_OS)} className={navItemClass(View.LIFE_OS)}>
              <CheckSquare size={18} />
              <span>LifeOS</span>
            </div>
            <div onClick={() => onViewChange(View.MEMORY_OS)} className={navItemClass(View.MEMORY_OS)}>
              <BrainCircuit size={18} />
              <span>MemoryOS</span>
            </div>
            <div onClick={() => onViewChange(View.WORKFLOW_OS)} className={navItemClass(View.WORKFLOW_OS)}>
              <GitBranch size={18} />
              <span>WorkflowOS</span>
            </div>
            <div onClick={() => onViewChange(View.FINANCE_OS)} className={navItemClass(View.FINANCE_OS)}>
              <Wallet size={18} />
              <span>FinanceOS</span>
            </div>
            <div onClick={() => onViewChange(View.HEALTH_OS)} className={navItemClass(View.HEALTH_OS)}>
              <Heart size={18} />
              <span>HealthOS</span>
            </div>
            <div onClick={() => onViewChange(View.LEARN_OS)} className={navItemClass(View.LEARN_OS)}>
              <GraduationCap size={18} />
              <span>LearnOS</span>
            </div>
            <div onClick={() => onViewChange(View.MEDIA_OS)} className={navItemClass(View.MEDIA_OS)}>
              <PlaySquare size={18} />
              <span>MediaOS</span>
            </div>
            <div onClick={() => onViewChange(View.GIOS)} className={navItemClass(View.GIOS)}>
              <Trophy size={18} />
              <span>GIOS (Game)</span>
            </div>
          </>
        )}

        {mode === OSMode.BIOS && (
          <>
            <div onClick={() => onViewChange(View.BRAND_INTEL)} className={navItemClass(View.BRAND_INTEL)}>
              <Building2 size={18} />
              <span>Brand Intel</span>
            </div>
            <div onClick={() => onViewChange(View.COMPETITOR_INTEL)} className={navItemClass(View.COMPETITOR_INTEL)}>
              <Swords size={18} />
              <span>Competitor</span>
            </div>
            <div onClick={() => onViewChange(View.CREATOR_STUDIO)} className={navItemClass(View.CREATOR_STUDIO)}>
              <Megaphone size={18} />
              <span>Creator Studio</span>
            </div>
            <div onClick={() => onViewChange(View.CIOS)} className={navItemClass(View.CIOS)}>
              <Users size={18} />
              <span>CIOS (CRM)</span>
            </div>
            <div onClick={() => onViewChange(View.DIOS)} className={navItemClass(View.DIOS)}>
              <HardDrive size={18} />
              <span>DIOS (Data)</span>
            </div>
            <div onClick={() => onViewChange(View.EIOS)} className={navItemClass(View.EIOS)}>
              <Code size={18} />
              <span>EIOS (Dev)</span>
            </div>
          </>
        )}

        <div className="my-4 border-t border-amber-900/30"></div>

        <div onClick={() => onViewChange(View.MARKETPLACE)} className={navItemClass(View.MARKETPLACE)}>
          <ShoppingBag size={18} />
          <span>Marketplace</span>
        </div>
      </div>

      {/* Footer / Mode Switcher */}
      <div className="p-4 border-t-2 border-amber-900/50 relative">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>

        <button
          onClick={onModeToggle}
          className="w-full flex items-center justify-center gap-2 p-3 bg-black border-2 border-amber-700/50 hover:border-amber-500 hover:bg-amber-950/20 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-amber-500/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          {mode === OSMode.AIOS ? <Briefcase size={16} className="text-amber-600 group-hover:text-amber-500 relative z-10" /> : <User size={16} className="text-amber-600 group-hover:text-amber-500 relative z-10" />}
          <span className="text-[10px] font-bold text-amber-600 group-hover:text-amber-500 tracking-[0.15em] relative z-10">
            → {mode === OSMode.AIOS ? 'BIOS' : 'AIOS'}
          </span>
        </button>
        
        <button
          className="mt-4 flex items-center justify-between px-2 text-amber-800 hover:text-amber-500 cursor-pointer transition-colors w-full font-mono"
          onClick={() => onViewChange(View.SETTINGS)}
          aria-label="Open Settings"
        >
          <div className="flex items-center gap-2">
            <Settings size={14} className={currentView === View.SETTINGS ? 'text-amber-500' : ''} />
            <span className={`text-[10px] tracking-wider ${currentView === View.SETTINGS ? 'text-amber-500' : ''}`}>SETTINGS</span>
          </div>
          <span className="text-[8px] bg-amber-950/30 px-2 py-1 border border-amber-900 text-amber-700 tracking-wider">v1.0</span>
        </button>
      </div>
    </div>
  );
};
