
import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Mail,
  Phone,
  MoreHorizontal,
  HardDrive,
  Folder,
  FileText,
  Image as ImageIcon,
  Code,
  Terminal,
  GitBranch,
  PlayCircle,
  Trophy,
  Medal,
  Star,
  Zap,
  Crown,
  Search
} from 'lucide-react';

// --- CIOS: Communication Intelligence OS (CRM) ---
export const CIOS: React.FC = () => {
  const [contacts] = useState([
    { id: 1, name: 'Alice Freeman', role: 'Product Director', company: 'TechVision', lastContact: '2 days ago', status: 'Hot Lead' },
    { id: 2, name: 'Bob Smith', role: 'CEO', company: 'StartUp Inc', lastContact: '1 week ago', status: 'Customer' },
    { id: 3, name: 'Charlie Davis', role: 'Freelancer', company: 'Self', lastContact: '3 weeks ago', status: 'Cold' },
  ]);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="flex justify-between items-center mb-6 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ RELATIONSHIP MANAGEMENT ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">CIOS</h2>
          <p className="text-amber-700 text-sm tracking-wide">COMMUNICATION & RELATIONSHIP INTELLIGENCE</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-[10px] font-bold tracking-wider transition-colors border-2 border-amber-400">
          ADD CONTACT
        </button>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="w-1/3 bg-black border-2 border-amber-900/50 overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>

           <div className="p-4 border-b-2 border-amber-900/50">
             <div className="relative">
               <input
                 type="text"
                 placeholder="SEARCH CONTACTS..."
                 className="w-full bg-black border-2 border-amber-900/50 pl-9 pr-4 py-2 text-sm text-amber-400 outline-none focus:border-amber-500 tracking-wide placeholder-amber-900"
               />
               <Search size={16} className="absolute left-3 top-2.5 text-amber-700" />
             </div>
           </div>
           <div className="flex-1 overflow-y-auto">
             {contacts.map(contact => (
               <div key={contact.id} className="p-4 border-b border-amber-900/30 hover:bg-amber-950/20 cursor-pointer transition-colors">
                 <div className="flex justify-between items-start mb-1">
                   <h4 className="font-bold text-amber-400 text-sm tracking-wide">{contact.name.toUpperCase()}</h4>
                   <span className={`text-[10px] px-2 py-0.5 font-bold tracking-wider border ${
                     contact.status === 'Hot Lead' ? 'bg-rose-950/30 text-rose-400 border-rose-900/50' :
                     contact.status === 'Customer' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' :
                     'bg-amber-950/20 text-amber-700 border-amber-900/50'
                   }`}>{contact.status.toUpperCase()}</span>
                 </div>
                 <p className="text-xs text-amber-700 tracking-wide">{contact.role.toUpperCase()} @ {contact.company.toUpperCase()}</p>
                 <div className="mt-2 text-[10px] text-amber-800 flex items-center gap-1 tracking-wider">
                   <ClockIcon /> LAST: {contact.lastContact.toUpperCase()}
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="flex-1 bg-black border-2 border-amber-900/50 p-6 flex flex-col items-center justify-center text-amber-800 relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
          <Users size={64} className="mb-4 opacity-20" />
          <p className="text-[10px] tracking-widest">SELECT CONTACT TO VIEW INTELLIGENCE HISTORY</p>
        </div>
      </div>
    </div>
  );
};

// --- DIOS: Data Intelligence OS (Files/Drive) ---
export const DIOS: React.FC = () => {
  const files = [
    { id: 1, name: 'Q3_Report.pdf', type: 'doc', size: '2.4 MB', date: 'Nov 20' },
    { id: 2, name: 'Logo_V2.png', type: 'img', size: '1.1 MB', date: 'Nov 19' },
    { id: 3, name: 'Project_Specs.docx', type: 'doc', size: '500 KB', date: 'Nov 18' },
    { id: 4, name: 'Demo_Video.mp4', type: 'video', size: '45 MB', date: 'Nov 15' },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="flex justify-between items-center mb-6 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ DATA STORAGE ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">DIOS</h2>
          <p className="text-amber-700 text-sm tracking-wide">DATA ASSET MANAGEMENT & STORAGE</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-[10px] font-bold tracking-wider transition-colors flex items-center gap-2 border-2 border-amber-400">
          <HardDrive size={14} /> UPLOAD
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map(file => (
          <div key={file.id} className="bg-black border-2 border-amber-900/50 p-4 hover:border-amber-600 transition-all group cursor-pointer relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
             <div className="h-32 bg-amber-950/10 mb-3 flex items-center justify-center text-amber-800 group-hover:text-amber-500 transition-colors">
               {file.type === 'doc' && <FileText size={48} />}
               {file.type === 'img' && <ImageIcon size={48} />}
               {file.type === 'video' && <PlayCircle size={48} />}
             </div>
             <div className="flex justify-between items-start">
               <div>
                 <div className="font-bold text-amber-400 truncate w-32 text-sm tracking-wide">{file.name}</div>
                 <div className="text-[10px] text-amber-800 tracking-wider">{file.size} • {file.date}</div>
               </div>
               <button className="text-amber-800 hover:text-amber-500 transition-colors"><MoreHorizontal size={16} /></button>
             </div>
          </div>
        ))}

        <div className="bg-black/50 border-2 border-dashed border-amber-900/50 p-4 flex flex-col items-center justify-center text-amber-800 hover:bg-amber-950/10 hover:border-amber-700 transition-all cursor-pointer relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-700/50"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-700/50"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-700/50"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-700/50"></div>
           <Folder size={32} className="mb-2 opacity-50" />
           <span className="text-[10px] tracking-widest font-bold">NEW FOLDER</span>
        </div>
      </div>
    </div>
  );
};

// --- EIOS: Engineering Intelligence OS (Dev Tools) ---
export const EIOS: React.FC = () => {
  const snippets = [
    { id: 1, title: 'Auth Middleware', lang: 'TypeScript', tags: ['Security', 'Express'] },
    { id: 2, title: 'React Hook Form', lang: 'React', tags: ['Frontend', 'Forms'] },
    { id: 3, title: 'AWS S3 Upload', lang: 'Python', tags: ['Cloud', 'Boto3'] },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="flex justify-between items-center mb-6 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ DEVELOPMENT ENVIRONMENT ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">EIOS</h2>
          <p className="text-amber-700 text-sm tracking-wide">ENGINEERING CODEBASE & SNIPPETS</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-amber-950/30 hover:bg-amber-950/50 text-amber-400 px-4 py-2 text-[10px] font-bold tracking-wider transition-colors flex items-center gap-2 border border-amber-900/50">
            <Terminal size={14} /> TERMINAL
          </button>
          <button className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-[10px] font-bold tracking-wider transition-colors flex items-center gap-2 border-2 border-amber-400">
            <Code size={14} /> NEW SNIPPET
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="w-1/3 bg-black border-2 border-amber-900/50 overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
           <div className="p-4 border-b-2 border-amber-900/50 font-bold text-amber-500 flex items-center gap-2 text-sm tracking-wider">
             <GitBranch size={16} /> REPOSITORY SNIPPETS
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-2">
             {snippets.map(snip => (
               <div key={snip.id} className="p-3 bg-black border border-amber-900/50 hover:border-amber-600 cursor-pointer transition-all">
                 <div className="flex justify-between mb-1">
                   <span className="font-bold text-amber-400 text-sm tracking-wide">{snip.title.toUpperCase()}</span>
                   <span className="text-[10px] font-mono text-fuchsia-400 bg-fuchsia-950/20 px-1.5 py-0.5 border border-fuchsia-900/50 tracking-wider">{snip.lang}</span>
                 </div>
                 <div className="flex gap-2">
                   {snip.tags.map(t => (
                     <span key={t} className="text-[10px] text-amber-800 tracking-wider">#{t.toUpperCase()}</span>
                   ))}
                 </div>
               </div>
             ))}
           </div>
        </div>
        <div className="flex-1 bg-black border-2 border-amber-900/50 p-4 font-mono text-sm text-amber-400 overflow-auto relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
          <span className="text-amber-800">// SELECT A SNIPPET TO VIEW CODE</span>
          <br/>
          <span className="text-fuchsia-400">const</span> <span className="text-cyan-400">infigenie</span> = <span className="text-fuchsia-400">new</span> <span className="text-amber-500">AIOS</span>();
          <br/>
          <span className="text-cyan-400">infigenie</span>.<span className="text-amber-500">optimizeLife</span>();
        </div>
      </div>
    </div>
  );
};

// --- GIOS: Gamification Intelligence OS (Growth/Game) ---
export const GIOS: React.FC = () => {
  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="mb-8 text-center border-l-4 border-amber-500 pl-4">
         <div className="text-[10px] text-amber-600 tracking-widest mb-2">[ GAMIFICATION SYSTEM ]</div>
         <h2 className="text-4xl font-bold text-amber-500 mb-2 tracking-wide">LEVEL 42</h2>
         <p className="text-amber-600 font-bold tracking-wider">GRANDMASTER ARCHITECT</p>

         <div className="max-w-md mx-auto mt-6 relative">
           <div className="flex justify-between text-[10px] text-amber-700 mb-2 font-bold uppercase tracking-widest">
             <span>XP: 42,500</span>
             <span>NEXT: 50,000</span>
           </div>
           <div className="w-full h-4 bg-amber-950/50 overflow-hidden border-2 border-amber-900/50 shadow-inner">
             <div className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 w-[85%] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10" style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem'}}></div>
             </div>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-black border-2 border-amber-900/50 p-6 relative overflow-hidden group hover:border-amber-600 transition-all">
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
           <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Trophy size={80} className="text-amber-500" />
           </div>
           <h3 className="text-sm font-bold text-amber-500 mb-4 flex items-center gap-2 tracking-wider"><Medal className="text-amber-600" size={18} /> [ ACHIEVEMENTS ]</h3>
           <div className="space-y-3">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-amber-500/20 border border-amber-900/50 flex items-center justify-center text-amber-500"><Zap size={16} /></div>
               <div>
                 <div className="text-sm font-bold text-amber-400 tracking-wide">EARLY RISER</div>
                 <div className="text-[10px] text-amber-800 tracking-wider">COMPLETE 5 TASKS BEFORE 9AM</div>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-900/50 flex items-center justify-center text-emerald-400"><CheckCircleIcon /></div>
               <div>
                 <div className="text-sm font-bold text-amber-400 tracking-wide">TASK MASTER</div>
                 <div className="text-[10px] text-amber-800 tracking-wider">100 TASKS COMPLETED</div>
               </div>
             </div>
           </div>
         </div>

         <div className="bg-black border-2 border-amber-900/50 p-6 relative overflow-hidden group hover:border-amber-600 transition-all">
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
           <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Crown size={80} className="text-amber-500" />
           </div>
           <h3 className="text-sm font-bold text-amber-500 mb-4 flex items-center gap-2 tracking-wider"><Crown className="text-fuchsia-500" size={18} /> [ LEADERBOARD ]</h3>
           <div className="space-y-2">
             <div className="flex justify-between items-center p-2 bg-amber-950/20 border border-amber-500/50">
               <div className="flex items-center gap-2">
                 <span className="font-bold text-amber-400 text-sm tracking-wider">1</span>
                 <span className="text-amber-500 font-bold tracking-wide">YOU</span>
               </div>
               <span className="font-mono text-amber-400 text-sm tracking-wider">42,500</span>
             </div>
             <div className="flex justify-between items-center p-2 opacity-50">
               <div className="flex items-center gap-2">
                 <span className="font-bold text-amber-800 text-sm tracking-wider">2</span>
                 <span className="text-amber-700 tracking-wide">ALICE</span>
               </div>
               <span className="font-mono text-amber-800 text-sm tracking-wider">38,200</span>
             </div>
             <div className="flex justify-between items-center p-2 opacity-50">
               <div className="flex items-center gap-2">
                 <span className="font-bold text-amber-800 text-sm tracking-wider">3</span>
                 <span className="text-amber-700 tracking-wide">BOB</span>
               </div>
               <span className="font-mono text-amber-800 text-sm tracking-wider">31,000</span>
             </div>
           </div>
         </div>

         <div className="bg-black border-2 border-amber-900/50 p-6 relative overflow-hidden group hover:border-amber-600 transition-all">
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
           <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Star size={80} className="text-amber-500" />
           </div>
           <h3 className="text-sm font-bold text-amber-500 mb-4 flex items-center gap-2 tracking-wider"><Star className="text-rose-500" size={18} /> [ DAILY QUESTS ]</h3>
           <div className="space-y-3">
             <div className="flex items-center gap-2 text-sm text-amber-400">
               <div className="w-4 h-4 border border-amber-700"></div>
               <span className="tracking-wide">DRINK 2L WATER</span>
               <span className="ml-auto text-[10px] text-rose-400 font-bold tracking-wider">+50 XP</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-amber-400">
               <div className="w-4 h-4 border border-emerald-500 bg-emerald-500 flex items-center justify-center text-black text-[10px]">✓</div>
               <span className="line-through text-amber-800 tracking-wide">INBOX ZERO</span>
               <span className="ml-auto text-[10px] text-emerald-500 font-bold tracking-wider">DONE</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-amber-400">
               <div className="w-4 h-4 border border-amber-700"></div>
               <span className="tracking-wide">READ 30 MINS</span>
               <span className="ml-auto text-[10px] text-rose-400 font-bold tracking-wider">+100 XP</span>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
