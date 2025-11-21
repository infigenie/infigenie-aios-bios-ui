import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { LifeOS } from './components/LifeOS';
import { MemoryOS } from './components/MemoryOS';
import { FinanceOS } from './components/FinanceOS';
import { HealthOS } from './components/HealthOS';
import { LearnOS } from './components/LearnOS';
import { MediaOS } from './components/MediaOS';
import { WorkflowOS } from './components/WorkflowOS';
import { BIOS } from './components/BIOS';
import { CreatorStudio } from './components/CreatorStudio';
import { Marketplace } from './components/Marketplace';
import { Settings } from './components/Settings';
import { CommandPalette } from './components/CommandPalette';
import { Copilot } from './components/Copilot';
import { CIOS, DIOS, EIOS, GIOS } from './components/ExtraModules';
import { OSMode, View, Project } from './types';
import { generateDailyBrief } from './services/geminiService';
import { storage } from './utils/storage';
import { Sun, Clock, Battery, Cpu, Briefcase, ArrowRight, Activity, Zap, CheckCircle2, Target, Flame, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<OSMode>(OSMode.AIOS);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [dailyBrief, setDailyBrief] = useState<string | null>(null);
  const [showBrief, setShowBrief] = useState(false);
  
  // API Key Gate State
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  // Real data from storage
  const [dashboardData, setDashboardData] = useState({
    tasks: [] as any[],
    habits: [] as any[],
    goals: [] as any[],
    notes: [] as any[]
  });

  // Load dashboard data from storage
  useEffect(() => {
    const loadDashboardData = () => {
      const tasks = storage.tasks.get();
      const habits = storage.habits.get();
      const goals = storage.goals.get();
      const notes = storage.notes.get();

      setDashboardData({ tasks, habits, goals, notes });
    };

    loadDashboardData();

    // Reload data when view changes back to dashboard
    if (currentView === View.DASHBOARD) {
      loadDashboardData();
    }
  }, [currentView]);

  // API Key Check
  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio) {
        try {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } catch (e) {
          console.error("Error checking API key", e);
        }
      } else {
        // Fallback for dev/local without the wrapper
        setHasApiKey(true);
      }
      setIsCheckingKey(false);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio) {
      try {
        await (window as any).aistudio.openSelectKey();
        // Assume success per instructions to handle race condition
        setHasApiKey(true);
      } catch (e) {
        console.error("Selection failed", e);
      }
    }
  };

  // Handle global keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        if (hasApiKey) setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasApiKey]);

  const toggleMode = () => {
    const newMode = mode === OSMode.AIOS ? OSMode.BIOS : OSMode.AIOS;
    setMode(newMode);
    setCurrentView(newMode === OSMode.AIOS ? View.DASHBOARD : View.BRAND_INTEL);
  };

  const handleGenerateBrief = async () => {
    setShowBrief(true);
    try {
      // Use real tasks from storage
      const brief = await generateDailyBrief(dashboardData.tasks);
      setDailyBrief(brief);
    } catch (error) {
      setDailyBrief('Failed to generate AI brief. Please check your API connection.');
    }
  };

  const handleCommandExecute = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();
    
    // Navigation logic
    if (lowerCmd.includes('dashboard') || lowerCmd.includes('home')) setCurrentView(View.DASHBOARD);
    else if (lowerCmd.includes('life') || lowerCmd.includes('task') || lowerCmd.includes('todo')) { setMode(OSMode.AIOS); setCurrentView(View.LIFE_OS); }
    else if (lowerCmd.includes('memory') || lowerCmd.includes('note')) { setMode(OSMode.AIOS); setCurrentView(View.MEMORY_OS); }
    else if (lowerCmd.includes('finance') || lowerCmd.includes('money') || lowerCmd.includes('budget')) { setMode(OSMode.AIOS); setCurrentView(View.FINANCE_OS); }
    else if (lowerCmd.includes('health') || lowerCmd.includes('fitness')) { setMode(OSMode.AIOS); setCurrentView(View.HEALTH_OS); }
    else if (lowerCmd.includes('learn') || lowerCmd.includes('course')) { setMode(OSMode.AIOS); setCurrentView(View.LEARN_OS); }
    else if (lowerCmd.includes('media') || lowerCmd.includes('read')) { setMode(OSMode.AIOS); setCurrentView(View.MEDIA_OS); }
    else if (lowerCmd.includes('workflow') || lowerCmd.includes('automat')) { setMode(OSMode.AIOS); setCurrentView(View.WORKFLOW_OS); }
    else if (lowerCmd.includes('brand') || lowerCmd.includes('dna')) { setMode(OSMode.BIOS); setCurrentView(View.BRAND_INTEL); }
    else if (lowerCmd.includes('competitor') || lowerCmd.includes('swot')) { setMode(OSMode.BIOS); setCurrentView(View.COMPETITOR_INTEL); }
    else if (lowerCmd.includes('creator') || lowerCmd.includes('social') || lowerCmd.includes('post')) { setMode(OSMode.BIOS); setCurrentView(View.CREATOR_STUDIO); }
    else if (lowerCmd.includes('market') || lowerCmd.includes('store') || lowerCmd.includes('plugin')) setCurrentView(View.MARKETPLACE);
    else if (lowerCmd.includes('setting') || lowerCmd.includes('config')) setCurrentView(View.SETTINGS);
  };

  const renderContent = () => {
    if (currentView === View.DASHBOARD) {
      return (
        <div className="flex flex-col h-full">
          <div className="mb-8 border-l-4 border-amber-500 pl-4">
            <div className="text-xs tracking-widest text-amber-600 mb-1">[ TACTICAL COMMAND CENTER ]</div>
            <h1 className="text-4xl font-bold text-amber-500 mb-2 tracking-wide">OPERATIONAL DASHBOARD</h1>
            <p className="text-amber-700 text-sm tracking-wide">SYSTEM STATUS: NOMINAL</p>
          </div>

          {/* System Stats Widget */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-black border-2 border-amber-900/50 p-4 flex items-center gap-3 relative group hover:border-amber-700 transition-colors">
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500"></div>
              <div className="flex-1">
                <div className="text-[10px] text-amber-600 tracking-widest mb-1">TASKS</div>
                <div className="font-bold text-amber-500 text-xl">{dashboardData.tasks.filter(t => !t.completed).length}</div>
                <div className="text-[10px] text-amber-800 tracking-wide">ACTIVE OPS</div>
              </div>
              <CheckCircle2 size={32} className="text-amber-900/50" />
            </div>

            <div className="bg-black border-2 border-amber-900/50 p-4 flex items-center gap-3 relative group hover:border-amber-700 transition-colors">
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500"></div>
              <div className="flex-1">
                <div className="text-[10px] text-amber-600 tracking-widest mb-1">HABITS</div>
                <div className="font-bold text-amber-500 text-xl">{dashboardData.habits.length}</div>
                <div className="text-[10px] text-amber-800 tracking-wide">TRACKED</div>
              </div>
              <Flame size={32} className="text-amber-900/50" />
            </div>

            <div className="bg-black border-2 border-amber-900/50 p-4 flex items-center gap-3 relative group hover:border-amber-700 transition-colors">
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500"></div>
              <div className="flex-1">
                <div className="text-[10px] text-amber-600 tracking-widest mb-1">GOALS</div>
                <div className="font-bold text-amber-500 text-xl">{dashboardData.goals.length}</div>
                <div className="text-[10px] text-amber-800 tracking-wide">OBJECTIVES</div>
              </div>
              <Target size={32} className="text-amber-900/50" />
            </div>

            <div className="bg-black border-2 border-amber-500/70 p-4 flex items-center gap-3 relative cursor-pointer hover:border-amber-500 transition-all hover:shadow-lg hover:shadow-amber-500/20" onClick={() => setIsPaletteOpen(true)}>
              <div className="absolute inset-0 bg-amber-500/5 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-400"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-400"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-400"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-400"></div>
              <div className="flex-1 relative z-10">
                <div className="text-[10px] text-amber-400 tracking-widest mb-1">QUICK CMD</div>
                <div className="font-bold text-amber-500 text-sm tracking-wider">⌘ + K</div>
              </div>
              <Sun size={32} className="text-amber-500/50 relative z-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
            {/* AI Brief Widget */}
            <div className="lg:col-span-2 bg-black border-2 border-amber-900/50 p-8 relative overflow-hidden flex flex-col">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

              <div className="relative z-10 flex-1">
                <div className="flex items-center justify-between mb-4 border-b border-amber-900/50 pb-3">
                  <div>
                    <div className="text-[10px] text-amber-600 tracking-widest mb-1">[ INTELLIGENCE REPORT ]</div>
                    <h2 className="text-xl font-bold text-amber-500 tracking-wide">DAILY AI BRIEF</h2>
                  </div>
                  <div className="text-[10px] px-2 py-1 bg-amber-950/50 text-amber-600 border border-amber-900/50 tracking-wider">GEMINI 2.5 FLASH</div>
                </div>
                
                {!showBrief ? (
                  <div className="text-amber-700 h-full flex flex-col justify-center items-start">
                    <div className="text-sm mb-6 tracking-wide">
                      <div className="text-amber-600 mb-2">[ STATUS: AWAITING DIRECTIVE ]</div>
                      <div className="text-amber-800 text-xs">Intelligence summary pending. Analyze LifeOS and MemoryOS data to generate tactical brief.</div>
                    </div>
                    <button
                      onClick={handleGenerateBrief}
                      className="px-6 py-3 bg-amber-500 text-black font-bold tracking-widest hover:bg-amber-400 transition-all border-2 border-amber-400 text-sm relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-amber-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                      <span className="relative z-10">[ GENERATE BRIEF ]</span>
                    </button>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none overflow-y-auto max-h-[300px] pr-2">
                     {dailyBrief ? (
                       <div className="whitespace-pre-line text-sm leading-relaxed text-amber-200/80 tracking-wide">
                         {dailyBrief}
                       </div>
                     ) : (
                       <div className="flex items-center gap-2 text-amber-600 animate-pulse">
                         <Cpu className="animate-spin" size={16} /> [ PROCESSING INTELLIGENCE DATA ]
                       </div>
                     )}
                  </div>
                )}
              </div>
            </div>

            {/* Active Goals Widget */}
            <div className="bg-black border-2 border-amber-900/50 p-6 flex flex-col relative">
               <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
               <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
               <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
               <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

               <div className="border-b border-amber-900/50 pb-3 mb-4">
                 <div className="text-[10px] text-amber-600 tracking-widest mb-1">[ OBJECTIVES ]</div>
                 <h3 className="text-lg font-bold text-amber-500 tracking-wide">ACTIVE GOALS</h3>
               </div>
               <div className="flex-1 space-y-4 overflow-y-auto">
                 {dashboardData.goals.length > 0 ? (
                   dashboardData.goals.slice(0, 3).map((goal: any) => {
                     const completedMilestones = goal.milestones?.filter((m: any) => m.completed).length || 0;
                     const totalMilestones = goal.milestones?.length || 1;
                     const progress = Math.round((completedMilestones / totalMilestones) * 100);
                     const isCompleted = progress === 100;

                     return (
                       <div key={goal.id} className="p-3 bg-black border border-amber-900/30 hover:border-amber-700/50 transition-colors cursor-pointer relative group" onClick={() => setCurrentView(View.LIFE_OS)}>
                         <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-600/50"></div>
                         <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-600/50"></div>
                         <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-600/50"></div>
                         <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-600/50"></div>

                         <div className="flex justify-between mb-2">
                           <span className="font-medium text-amber-400 text-xs tracking-wide">{goal.title}</span>
                           <span className={`text-[10px] px-2 py-0.5 border tracking-wider ${isCompleted ? 'bg-amber-950/50 text-amber-700 border-amber-900' : 'bg-amber-500/10 text-amber-500 border-amber-700'}`}>
                             {isCompleted ? 'COMPLETE' : 'ACTIVE'}
                           </span>
                         </div>
                         <div className="flex items-center gap-2 mb-1">
                           <div className="flex-1 h-1 bg-amber-950/50 overflow-hidden">
                             <div
                               className="h-full bg-amber-500 transition-all"
                               style={{width: `${progress}%`}}
                             ></div>
                           </div>
                           <span className="text-[10px] text-amber-600 tracking-wider font-bold">{progress}%</span>
                         </div>
                         <div className="text-[10px] text-amber-800 mt-1 tracking-wide">
                           {completedMilestones} / {totalMilestones} MILESTONES
                         </div>
                       </div>
                     );
                   })
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-amber-800 text-sm">
                     <Target size={32} className="mb-2 opacity-30" />
                     <div className="text-[10px] tracking-wider mb-2">NO OBJECTIVES</div>
                     <button
                       onClick={() => setCurrentView(View.LIFE_OS)}
                       className="mt-2 text-amber-600 hover:text-amber-500 text-[10px] tracking-wider border-b border-amber-900 hover:border-amber-600 transition-colors"
                     >
                       → CREATE FIRST GOAL
                     </button>
                   </div>
                 )}
               </div>
               {dashboardData.goals.length > 0 && (
                 <button
                   onClick={() => setCurrentView(View.LIFE_OS)}
                   className="mt-4 w-full py-2 text-[10px] text-amber-700 hover:text-amber-500 flex items-center justify-center gap-1 border-t border-amber-900/50 transition-colors tracking-wider"
                 >
                   [ VIEW ALL OBJECTIVES ] <ArrowRight size={12} />
                 </button>
               )}
            </div>
          </div>
          
          {/* Recent Activity / Items */}
          <div className="mt-8 bg-black border-2 border-amber-900/50 p-6 relative">
             <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
             <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
             <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
             <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

             <h3 className="text-sm font-bold text-amber-500 mb-4 flex items-center gap-2 tracking-wider">
               <Activity size={18} /> [ RECENT ACTIVITY ]
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* Recent Notes */}
               {dashboardData.notes.length > 0 ? (
                 dashboardData.notes
                   .sort((a: any, b: any) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                   .slice(0, 1)
                   .map((note: any) => (
                     <div
                       key={note.id}
                       onClick={() => setCurrentView(View.MEMORY_OS)}
                       className="p-4 bg-black border-2 border-amber-900/50 flex items-center gap-3 hover:border-amber-600 cursor-pointer transition-colors relative"
                     >
                       <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                       <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                       <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                       <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                       <div className="w-10 h-10 bg-amber-950/20 border border-amber-900/50 flex items-center justify-center text-amber-600">
                         <FileText size={20} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="font-medium text-amber-500 truncate text-sm tracking-wide">{note.title}</div>
                         <div className="text-[10px] text-amber-700 tracking-wider">
                           {note.lastModified ? new Date(note.lastModified).toLocaleDateString().toUpperCase() : 'RECENTLY'}
                         </div>
                       </div>
                     </div>
                   ))
               ) : (
                 <div className="p-4 bg-black border-2 border-amber-900/50 flex items-center gap-3 opacity-50 relative">
                   <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                   <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                   <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                   <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                   <div className="w-10 h-10 bg-amber-950/20 border border-amber-900/50 flex items-center justify-center text-amber-700">
                     <FileText size={20} />
                   </div>
                   <div>
                     <div className="font-medium text-amber-700 text-sm tracking-wide">NO NOTES YET</div>
                     <div className="text-[10px] text-amber-800 tracking-wider">CREATE ONE IN MEMORYOS</div>
                   </div>
                 </div>
               )}

               {/* Recent Tasks */}
               {dashboardData.tasks.filter((t: any) => !t.completed).length > 0 ? (
                 dashboardData.tasks
                   .filter((t: any) => !t.completed)
                   .slice(0, 1)
                   .map((task: any) => (
                     <div
                       key={task.id}
                       onClick={() => setCurrentView(View.LIFE_OS)}
                       className="p-4 bg-black border-2 border-amber-900/50 flex items-center gap-3 hover:border-amber-600 cursor-pointer transition-colors relative"
                     >
                       <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                       <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                       <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                       <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                       <div className="w-10 h-10 bg-cyan-950/20 border border-cyan-900/50 flex items-center justify-center text-cyan-600">
                         <CheckCircle2 size={20} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="font-medium text-amber-500 truncate text-sm tracking-wide">{task.title}</div>
                         <div className="text-[10px] text-amber-700 tracking-wider">
                           {task.priority ? task.priority.toUpperCase() : 'NORMAL'} PRIORITY
                         </div>
                       </div>
                     </div>
                   ))
               ) : (
                 <div className="p-4 bg-black border-2 border-amber-900/50 flex items-center gap-3 opacity-50 relative">
                   <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                   <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                   <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                   <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                   <div className="w-10 h-10 bg-cyan-950/20 border border-cyan-900/50 flex items-center justify-center text-cyan-700">
                     <CheckCircle2 size={20} />
                   </div>
                   <div>
                     <div className="font-medium text-amber-700 text-sm tracking-wide">NO ACTIVE TASKS</div>
                     <div className="text-[10px] text-amber-800 tracking-wider">ALL CAUGHT UP!</div>
                   </div>
                 </div>
               )}

               {/* Active Habits */}
               {dashboardData.habits.length > 0 ? (
                 dashboardData.habits.slice(0, 1).map((habit: any) => (
                   <div
                     key={habit.id}
                     onClick={() => setCurrentView(View.LIFE_OS)}
                     className="p-4 bg-black border-2 border-amber-900/50 flex items-center gap-3 hover:border-amber-600 cursor-pointer transition-colors relative"
                   >
                     <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                     <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                     <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                     <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                     <div className="w-10 h-10 bg-emerald-950/20 border border-emerald-900/50 flex items-center justify-center text-emerald-600">
                       <Flame size={20} />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="font-medium text-amber-500 truncate text-sm tracking-wide">{habit.name}</div>
                       <div className="text-[10px] text-amber-700 tracking-wider">
                         {habit.streak || 0} DAY STREAK
                       </div>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="p-4 bg-black border-2 border-amber-900/50 flex items-center gap-3 opacity-50 relative">
                   <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                   <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                   <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                   <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                   <div className="w-10 h-10 bg-emerald-950/20 border border-emerald-900/50 flex items-center justify-center text-emerald-700">
                     <Flame size={20} />
                   </div>
                   <div>
                     <div className="font-medium text-amber-700 text-sm tracking-wide">NO HABITS TRACKED</div>
                     <div className="text-[10px] text-amber-800 tracking-wider">START TRACKING IN LIFEOS</div>
                   </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case View.LIFE_OS: return <LifeOS />;
      case View.MEMORY_OS: return <MemoryOS />;
      case View.WORKFLOW_OS: return <WorkflowOS />;
      case View.FINANCE_OS: return <FinanceOS />;
      case View.HEALTH_OS: return <HealthOS />;
      case View.LEARN_OS: return <LearnOS />;
      case View.MEDIA_OS: return <MediaOS />;
      case View.BRAND_INTEL: return <BIOS activeTab="brand" />;
      case View.COMPETITOR_INTEL: return <BIOS activeTab="competitor" />;
      case View.CREATOR_STUDIO: return <CreatorStudio />;
      case View.MARKETPLACE: return <Marketplace />;
      case View.SETTINGS: return <Settings />;
      case View.CIOS: return <CIOS />;
      case View.DIOS: return <DIOS />;
      case View.EIOS: return <EIOS />;
      case View.GIOS: return <GIOS />;
      default: return null;
    }
  };

  if (isCheckingKey) return (
    <div className="h-screen bg-black flex items-center justify-center text-amber-500 font-mono">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">[ INITIALIZING ]</div>
        <div className="text-sm tracking-widest">INFIGENIE TACTICAL OS</div>
      </div>
    </div>
  );

  if (!hasApiKey) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden font-mono">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255, 184, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 184, 0, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative z-10">
          <div className="w-32 h-32 border-4 border-amber-500 flex items-center justify-center mb-8 relative group">
            <div className="absolute inset-0 bg-amber-500/10 animate-pulse"></div>
            <Zap size={64} className="text-amber-500 relative z-10" />
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
          </div>

          <div className="mb-2 text-xs tracking-[0.3em] text-amber-600">[ TACTICAL INTELLIGENCE SYSTEM ]</div>
          <h1 className="text-5xl font-bold text-amber-500 mb-6 tracking-wide">INFIGENIE<span className="text-amber-600">|</span>BIOS</h1>

          <div className="max-w-xl mb-8 border border-amber-900/50 bg-amber-950/20 p-6">
            <div className="text-amber-400/80 text-sm leading-relaxed mb-4 tracking-wide">
              <div className="mb-2">[ STATUS: AWAITING API CREDENTIALS ]</div>
              <div className="text-xs text-amber-600/60 leading-relaxed">
                TACTICAL OS REQUIRES GEMINI AI CORE CONNECTION<br/>
                INITIALIZE GOOGLE CLOUD API KEY TO PROCEED
              </div>
            </div>
          </div>

          <button
            onClick={handleSelectKey}
            className="px-8 py-4 bg-amber-500 text-black font-bold tracking-widest hover:bg-amber-400 transition-all flex items-center gap-3 text-sm shadow-lg shadow-amber-500/20 border-2 border-amber-400 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-amber-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <span className="relative z-10">[ CONNECT INTELLIGENCE CORE ]</span>
            <ArrowRight size={18} className="relative z-10" />
          </button>

          <div className="mt-8 text-[10px] text-amber-900 leading-relaxed tracking-wider border-t border-amber-950 pt-4 max-w-md">
            <div className="mb-1">SECURITY CLEARANCE: PAID API KEY REQUIRED</div>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-amber-700 hover:text-amber-500 transition-colors border-b border-amber-900">
              → VIEW BILLING DOCUMENTATION
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-amber-50 overflow-hidden selection:bg-amber-500/30 font-mono relative">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255, 184, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 184, 0, 0.3) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none animate-pulse" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255, 184, 0, 0.1) 0px, transparent 2px, transparent 4px)',
      }}></div>

      <Sidebar
        mode={mode}
        currentView={currentView}
        onViewChange={setCurrentView}
        onModeToggle={toggleMode}
      />

      <main className="flex-1 relative h-full overflow-hidden">
        {/* Content Container */}
        <div className="h-full p-8 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-right-4 duration-300">
          {renderContent()}
        </div>
      </main>

      <Copilot currentView={currentView} />

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onExecute={handleCommandExecute}
      />
    </div>
  );
};

export default App;