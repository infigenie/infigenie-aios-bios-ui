
import React, { useState, useEffect } from 'react';
import {
  User,
  Settings as SettingsIcon,
  Cpu,
  Plug,
  HardDrive,
  Shield,
  CreditCard,
  Bell,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  LogOut
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from './ui/Toast';

export const Settings: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'General' | 'Account' | 'Intelligence' | 'Integrations'>('General');

  const [toggles, setToggles] = useState({
    emailNotifs: true,
    pushNotifs: false,
    darkMode: true,
    soundEffects: true,
    autoUpdates: true
  });

  // Load settings from storage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('infigenie_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.toggles) {
          setToggles(parsed.toggles);
        }
        if (parsed.activeTab) {
          setActiveTab(parsed.activeTab);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Save settings to storage whenever they change
  useEffect(() => {
    try {
      const settingsData = {
        toggles,
        activeTab,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem('infigenie_settings', JSON.stringify(settingsData));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [toggles, activeTab]);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => {
      const newToggles = { ...prev, [key]: !prev[key] };
      toast.success(`${key === 'darkMode' ? 'Dark Mode' : key === 'soundEffects' ? 'Sound Effects' : key === 'emailNotifs' ? 'Email Notifications' : key} ${newToggles[key] ? 'enabled' : 'disabled'}`);
      return newToggles;
    });
  };

  const handleClearCache = () => {
    try {
      // Clear all storage except settings
      const settings = localStorage.getItem('infigenie_settings');
      localStorage.clear();
      if (settings) {
        localStorage.setItem('infigenie_settings', settings);
      }
      toast.success('Cache cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="mb-8 border-l-4 border-amber-500 pl-4">
        <div className="text-[10px] text-amber-600 tracking-widest">[ SYSTEM CONFIGURATION ]</div>
        <h2 className="text-3xl font-bold text-amber-500 tracking-wide">SETTINGS</h2>
        <p className="text-amber-700 text-sm tracking-wide">MANAGE PREFERENCES & SYSTEM CONFIG</p>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">

        {/* Settings Sidebar */}
        <div className="w-64 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('General')}
            className={`text-left px-4 py-3 text-xs font-bold flex items-center gap-3 transition-colors tracking-wider border-l-2 ${activeTab === 'General' ? 'bg-amber-950/30 text-amber-500 border-l-amber-500' : 'text-amber-700 hover:bg-amber-950/10 hover:text-amber-400 border-l-transparent'}`}
          >
            <SettingsIcon size={18} /> GENERAL
          </button>
          <button
            onClick={() => setActiveTab('Account')}
            className={`text-left px-4 py-3 text-xs font-bold flex items-center gap-3 transition-colors tracking-wider border-l-2 ${activeTab === 'Account' ? 'bg-amber-950/30 text-amber-500 border-l-amber-500' : 'text-amber-700 hover:bg-amber-950/10 hover:text-amber-400 border-l-transparent'}`}
          >
            <User size={18} /> ACCOUNT & BILLING
          </button>
          <button
            onClick={() => setActiveTab('Intelligence')}
            className={`text-left px-4 py-3 text-xs font-bold flex items-center gap-3 transition-colors tracking-wider border-l-2 ${activeTab === 'Intelligence' ? 'bg-amber-950/30 text-amber-500 border-l-amber-500' : 'text-amber-700 hover:bg-amber-950/10 hover:text-amber-400 border-l-transparent'}`}
          >
            <Cpu size={18} /> INTELLIGENCE
          </button>
          <button
            onClick={() => setActiveTab('Integrations')}
            className={`text-left px-4 py-3 text-xs font-bold flex items-center gap-3 transition-colors tracking-wider border-l-2 ${activeTab === 'Integrations' ? 'bg-amber-950/30 text-amber-500 border-l-amber-500' : 'text-amber-700 hover:bg-amber-950/10 hover:text-amber-400 border-l-transparent'}`}
          >
            <Plug size={18} /> INTEGRATIONS
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-black border-2 border-amber-900/50 p-8 overflow-y-auto custom-scrollbar relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
          
          {activeTab === 'General' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">[ APPEARANCE & BEHAVIOR ]</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-black border-2 border-amber-900/50 relative">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                      <div>
                        <div className="font-medium text-amber-400 text-sm tracking-wide">DARK MODE</div>
                        <div className="text-[10px] text-amber-800 tracking-wider">SYSTEM DEFAULT: ACTIVE</div>
                      </div>
                      <button onClick={() => handleToggle('darkMode')} className="text-amber-500">
                        {toggles.darkMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-amber-900" />}
                      </button>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-black border-2 border-amber-900/50 relative">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                      <div>
                        <div className="font-medium text-amber-400 text-sm tracking-wide">SOUND EFFECTS</div>
                        <div className="text-[10px] text-amber-800 tracking-wider">AUDIO FEEDBACK FOR SYSTEM EVENTS</div>
                      </div>
                      <button onClick={() => handleToggle('soundEffects')} className="text-amber-500">
                        {toggles.soundEffects ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-amber-900" />}
                      </button>
                   </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">[ NOTIFICATIONS ]</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-black border-2 border-amber-900/50 relative">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                      <div className="flex items-center gap-3">
                        <Bell size={20} className="text-amber-700" />
                        <div>
                          <div className="font-medium text-amber-400 text-sm tracking-wide">EMAIL DIGEST</div>
                          <div className="text-[10px] text-amber-800 tracking-wider">DAILY INTELLIGENCE SUMMARIES</div>
                        </div>
                      </div>
                      <button onClick={() => handleToggle('emailNotifs')} className="text-amber-500">
                        {toggles.emailNotifs ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-amber-900" />}
                      </button>
                   </div>
                </div>
              </div>

               <div>
                <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">[ SYSTEM ]</h3>
                <div className="p-4 bg-black border-2 border-amber-900/50 flex items-center gap-4 relative">
                   <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                   <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                   <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                   <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                   <HardDrive size={24} className="text-amber-700" />
                   <div className="flex-1">
                     <div className="flex justify-between mb-1">
                       <span className="text-sm font-medium text-amber-400 tracking-wide">LOCAL STORAGE USAGE</span>
                       <span className="text-[10px] text-amber-600 tracking-wider font-bold">45%</span>
                     </div>
                     <div className="w-full h-2 bg-amber-950/50 overflow-hidden">
                       <div className="h-full bg-amber-500 w-[45%]"></div>
                     </div>
                   </div>
                   <button
                     onClick={handleClearCache}
                     className="px-3 py-1.5 text-[10px] bg-amber-950/30 hover:bg-rose-950/30 hover:text-rose-400 text-amber-700 border border-amber-900/50 hover:border-rose-900 transition-colors font-bold tracking-wider"
                   >
                     CLEAR CACHE
                   </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Account' && (
            <div className="space-y-8 max-w-2xl">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-amber-950/30 border-2 border-amber-500 flex items-center justify-center text-3xl font-bold text-amber-500">
                  JP
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-amber-500 tracking-wide">JOHN PILOT</h3>
                  <p className="text-amber-700 text-sm tracking-wide">john.pilot@example.com</p>
                  <div className="mt-4 flex gap-3">
                    <button className="px-4 py-2 bg-amber-950/30 text-amber-400 text-[10px] font-bold border border-amber-900/50 hover:bg-amber-950/50 hover:border-amber-500 transition-colors tracking-wider">
                      EDIT PROFILE
                    </button>
                    <button className="px-4 py-2 bg-amber-950/30 text-rose-400 text-[10px] font-bold border border-rose-900/50 hover:bg-rose-950/30 hover:border-rose-500 flex items-center gap-2 transition-colors tracking-wider">
                      <LogOut size={14} /> SIGN OUT
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-amber-900/50 pt-8">
                <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">[ SUBSCRIPTION ]</h3>
                <div className="bg-amber-950/20 border-2 border-amber-900/50 p-6 relative">
                   <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
                   <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
                   <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
                   <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
                   <div className="flex justify-between items-center mb-4">
                     <div>
                       <div className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-1">CURRENT PLAN</div>
                       <h4 className="text-2xl font-bold text-amber-500 tracking-wide">PRO PIONEER</h4>
                     </div>
                     <span className="px-3 py-1 bg-emerald-950/30 text-emerald-400 text-[10px] font-bold border border-emerald-500/50 tracking-wider">ACTIVE</span>
                   </div>
                   <div className="space-y-2 mb-6">
                     <div className="flex items-center gap-2 text-sm text-amber-400 tracking-wide"><CheckCircle2 size={16} className="text-amber-600" /> UNLIMITED INTELLIGENCE CALLS</div>
                     <div className="flex items-center gap-2 text-sm text-amber-400 tracking-wide"><CheckCircle2 size={16} className="text-amber-600" /> ADVANCED BIOS FEATURES</div>
                     <div className="flex items-center gap-2 text-sm text-amber-400 tracking-wide"><CheckCircle2 size={16} className="text-amber-600" /> 100GB CLOUD STORAGE</div>
                   </div>
                   <div className="flex gap-4">
                     <button className="px-4 py-2 bg-amber-500 text-black font-bold hover:bg-amber-400 text-[10px] flex items-center gap-2 tracking-wider transition-colors">
                       <CreditCard size={14} /> MANAGE BILLING
                     </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Intelligence' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">[ AI CONFIGURATION ]</h3>
                <div className="bg-black border-2 border-amber-900/50 p-6 space-y-6 relative">
                   <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
                   <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
                   <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
                   <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
                   <div>
                     <label className="block text-[10px] font-bold text-amber-600 mb-2 tracking-wider">PRIMARY MODEL</label>
                     <select className="w-full bg-black border-2 border-amber-900/50 p-3 text-amber-400 outline-none focus:border-amber-500 text-sm tracking-wide">
                       <option>Gemini 2.5 Flash (Recommended)</option>
                       <option>Gemini 2.5 Pro (Higher Reasoning)</option>
                     </select>
                     <p className="text-[10px] text-amber-800 mt-2 tracking-wider">FLASH OPTIMIZED FOR SPEED AND EFFICIENCY</p>
                   </div>

                   <div>
                     <label className="block text-[10px] font-bold text-amber-600 mb-2 tracking-wider">API KEY STATUS</label>
                     <div className="flex items-center gap-3 p-3 bg-emerald-950/20 border-2 border-emerald-900/50 relative">
                       <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500"></div>
                       <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500"></div>
                       <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500"></div>
                       <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500"></div>
                       <Shield size={20} className="text-emerald-400" />
                       <div className="flex-1">
                         <div className="text-sm font-bold text-emerald-400 tracking-wide">SECURELY CONFIGURED</div>
                         <div className="text-[10px] text-emerald-700 tracking-wider">ENV VAR: process.env.API_KEY</div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">[ PERSONALIZATION ]</h3>
                <div className="p-4 bg-black border-2 border-amber-900/50 relative">
                   <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                   <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                   <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                   <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                   <p className="text-sm text-amber-700 mb-4 tracking-wide">
                     CLEAR AI MEMORY OF CONVERSATIONAL CONTEXT. DOES NOT DELETE MEMORYOS NOTES.
                   </p>
                   <button className="px-4 py-2 bg-amber-950/30 text-amber-400 text-[10px] font-bold border border-amber-900/50 hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-900 transition-colors tracking-wider">
                     RESET COPILOT CONTEXT
                   </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Integrations' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">[ CONNECTED APPS ]</h3>

              {[
                { name: 'Google Calendar', icon: '📅', connected: true, desc: 'Sync events and tasks.' },
                { name: 'Slack', icon: '#', connected: false, desc: 'Forward notifications and summaries.' },
                { name: 'Notion', icon: 'N', connected: false, desc: 'Import pages to MemoryOS.' },
                { name: 'Github', icon: '🐙', connected: true, desc: 'Track issues in LifeOS.' },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black border-2 border-amber-900/50 relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-950/20 border border-amber-900/50 flex items-center justify-center text-xl">
                      {app.icon}
                    </div>
                    <div>
                      <div className="font-medium text-amber-400 tracking-wide">{app.name.toUpperCase()}</div>
                      <div className="text-[10px] text-amber-800 tracking-wider">{app.desc.toUpperCase()}</div>
                    </div>
                  </div>
                  <button
                    className={`px-4 py-2 text-[10px] font-bold border transition-colors tracking-wider ${
                      app.connected
                        ? 'bg-transparent border-amber-900/50 text-amber-700 hover:text-rose-400 hover:border-rose-900 hover:bg-rose-950/20'
                        : 'bg-amber-500 border-amber-500 text-black hover:bg-amber-400'
                    }`}
                  >
                    {app.connected ? 'DISCONNECT' : 'CONNECT'}
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
