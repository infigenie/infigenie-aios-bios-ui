
import React, { useState } from 'react';
import { Search, Download, Star, Zap, Box, Layout, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Agents' | 'Templates' | 'Plugins'>('Agents');

  const agents = [
    { id: 1, title: 'Research Assistant Pro', desc: 'Autonomous web research and report generation.', icon: <Search size={24} />, rating: 4.9, downloads: '12k', installed: true },
    { id: 2, title: 'Email Drafter Agent', desc: 'Learns your style and drafts replies automatically.', icon: <User size={24} />, rating: 4.7, downloads: '8.5k', installed: false },
    { id: 3, title: 'Data Analyst', desc: 'Visualize CSV/JSON data with natural language.', icon: <Zap size={24} />, rating: 4.8, downloads: '5k', installed: false },
  ];

  const templates = [
    { id: 4, title: 'Startup OS', desc: 'Complete dashboard for early stage founders.', icon: <Layout size={24} />, rating: 4.9, downloads: '22k', installed: false },
    { id: 5, title: 'Student Brain', desc: 'Optimized for lectures, assignments, and exams.', icon: <Layout size={24} />, rating: 4.6, downloads: '15k', installed: false },
    { id: 6, title: 'Content Machine', desc: 'Workflow for YouTubers and Bloggers.', icon: <Layout size={24} />, rating: 4.8, downloads: '9k', installed: false },
  ];

  const items = activeTab === 'Agents' ? agents : templates;

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="flex justify-between items-center mb-8 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ EXTENSION MARKETPLACE ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">MARKETPLACE</h2>
          <p className="text-amber-700 text-sm tracking-wide">COMMUNITY-BUILT AGENTS & TEMPLATES</p>
        </div>
        <div className="bg-black p-1 border-2 border-amber-900/50 flex">
          {['Agents', 'Templates', 'Plugins'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 text-[10px] font-bold tracking-wider transition-colors border-l-2 ${
                activeTab === tab ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 hover:text-amber-400 border-transparent'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="mb-8 relative bg-amber-950/20 border-2 border-amber-500 p-8 flex items-center justify-between overflow-hidden">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400"></div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-bold mb-4 border border-amber-500/50 tracking-wider">
            FEATURED AGENT
          </div>
          <h3 className="text-3xl font-bold text-amber-500 mb-2 tracking-wide">MARKET ANALYST X</h3>
          <p className="text-amber-700 mb-6 text-sm tracking-wide">
            REAL-TIME STOCK ANALYSIS AND CRYPTO TREND FORECASTING DIRECTLY IN YOUR DASHBOARD.
          </p>
          <button className="bg-amber-500 text-black px-6 py-3 font-bold hover:bg-amber-400 transition-colors flex items-center gap-2 text-sm tracking-wider border-2 border-amber-400">
            INSTALL AGENT <ArrowRight size={18} />
          </button>
        </div>
        <div className="hidden lg:block relative z-10">
           <Box size={180} className="text-amber-900/20" />
        </div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
        {items.map((item) => (
          <div key={item.id} className="bg-black border-2 border-amber-900/50 p-6 flex flex-col hover:border-amber-600 transition-all group relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>

            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-amber-950/20 border border-amber-900/50 flex items-center justify-center text-amber-700 group-hover:bg-amber-500/20 group-hover:text-amber-500 transition-colors">
                {item.icon}
              </div>
              {item.installed ? (
                 <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/20 px-2 py-1 border border-emerald-500/50 tracking-wider">
                   <CheckCircle2 size={12} /> INSTALLED
                 </span>
              ) : (
                <div className="flex items-center gap-1 text-amber-500 bg-amber-950/20 px-2 py-1 border border-amber-900/50">
                  <Star size={12} fill="currentColor" />
                  <span className="text-[10px] font-bold tracking-wider">{item.rating}</span>
                </div>
              )}
            </div>

            <h4 className="text-xl font-bold text-amber-500 mb-2 tracking-wide">{item.title.toUpperCase()}</h4>
            <p className="text-amber-700 text-xs mb-6 flex-1 leading-relaxed tracking-wide">{item.desc.toUpperCase()}</p>

            <div className="flex items-center justify-between pt-4 border-t-2 border-amber-900/50">
              <div className="text-[10px] text-amber-800 tracking-wider">
                <span className="text-amber-600 font-bold">{item.downloads}</span> USERS
              </div>
              <button
                className={`px-4 py-2 text-[10px] font-bold tracking-wider transition-colors flex items-center gap-2 border ${
                  item.installed
                    ? 'bg-amber-950/20 text-amber-800 border-amber-900/50 cursor-default'
                    : 'bg-amber-950/30 hover:bg-amber-500 hover:text-black text-amber-400 border-amber-900/50 hover:border-amber-400'
                }`}
              >
                {item.installed ? 'MANAGE' : <><Download size={14} /> GET</>}
              </button>
            </div>
          </div>
        ))}

        {/* Mock Coming Soon */}
        <div className="border-2 border-dashed border-amber-900/50 p-6 flex flex-col items-center justify-center text-amber-800 hover:border-amber-700 hover:bg-amber-950/10 transition-colors cursor-pointer min-h-[240px] relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-700/50"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-700/50"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-700/50"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-700/50"></div>
          <PlusCircleIcon />
          <span className="mt-4 font-bold text-[10px] tracking-widest">SUBMIT YOUR OWN AGENT</span>
        </div>
      </div>
    </div>
  );
};

const PlusCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
