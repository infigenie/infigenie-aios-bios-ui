
import React, { useState, useEffect } from 'react';
import { HealthMetric } from '../types';
import { analyzeHealth } from '../services/geminiService';
import { useToast } from './ui/Toast';
import {
  Heart,
  Moon,
  Droplets,
  Footprints,
  Plus,
  Smile,
  Frown,
  Meh,
  Activity,
  Scale,
  Sparkles
} from 'lucide-react';

export const HealthOS: React.FC = () => {
  const toast = useToast();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);

  const [aiQuery, setAiQuery] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeModal, setActiveModal] = useState<'Sleep' | 'Water' | 'Steps' | null>(null);
  const [inputVal, setInputVal] = useState('');

  // Load health metrics from storage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('infigenie_health');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.metrics && Array.isArray(parsed.metrics)) {
          setMetrics(parsed.metrics);
        }
      }

      // Initialize with demo data if empty
      if (!savedData || (savedData && JSON.parse(savedData).metrics?.length === 0)) {
        const demoMetrics: HealthMetric[] = [
          { id: '1', type: 'Sleep', value: 7.5, unit: 'hrs', date: '2025-11-20', timestamp: Date.now() },
          { id: '2', type: 'Water', value: 2100, unit: 'ml', date: '2025-11-20', timestamp: Date.now() },
          { id: '3', type: 'Steps', value: 8432, unit: 'steps', date: '2025-11-20', timestamp: Date.now() },
          { id: '4', type: 'Weight', value: 72.5, unit: 'kg', date: '2025-11-19', timestamp: Date.now() - 86400000 },
          { id: '5', type: 'Mood', value: 'Good', unit: '', date: '2025-11-20', timestamp: Date.now() },
        ];
        setMetrics(demoMetrics);
      }
    } catch (error) {
      console.error('Failed to load health data:', error);
    }
  }, []);

  // Save health metrics to storage whenever they change
  useEffect(() => {
    if (metrics.length > 0) {
      try {
        const healthData = {
          metrics,
          lastModified: new Date().toISOString()
        };
        localStorage.setItem('infigenie_health', JSON.stringify(healthData));
      } catch (error) {
        console.error('Failed to save health data:', error);
      }
    }
  }, [metrics]);

  const handleAddMetric = (type: 'Sleep' | 'Water' | 'Steps' | 'Weight' | 'Mood', value: string | number) => {
    if (!value) return;
    const newMetric: HealthMetric = {
      id: Date.now().toString(),
      type,
      value,
      unit: type === 'Sleep' ? 'hrs' : type === 'Water' ? 'ml' : type === 'Steps' ? 'steps' : type === 'Weight' ? 'kg' : '',
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };
    setMetrics([newMetric, ...metrics]);
    setActiveModal(null);
    setInputVal('');
    toast.success(`${type} logged successfully`);
  };

  const handleAiCoach = async () => {
    if (!aiQuery.trim()) return;
    setIsAnalyzing(true);
    try {
      const advice = await analyzeHealth(metrics, aiQuery);
      setAiAdvice(advice);
      setAiQuery('');
    } catch (error) {
      toast.error('Failed to get health advice. Please try again.');
      setAiAdvice('Unable to provide advice at this time. Please check your API connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getLatestMetric = (type: string) => {
    return metrics.find(m => m.type === type)?.value || '-';
  };

  const getLatestMood = () => {
    const mood = metrics.find(m => m.type === 'Mood');
    if (!mood) return 'Neutral';
    return mood.value;
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="flex justify-between items-center mb-6 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ BIOMETRIC MONITORING ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">HEALTH OS</h2>
          <p className="text-amber-700 text-sm tracking-wide">OPTIMIZE BIOLOGY & MINDSET</p>
        </div>
        <div className="bg-black px-4 py-2 border-2 border-amber-900/50 flex items-center gap-2 relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
          <Activity size={18} className="text-emerald-500" />
          <span className="text-amber-600 text-xs font-bold tracking-wider">WELLNESS: <span className="text-emerald-400 font-bold">82</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        
        {/* Vitals Grid */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sleep Card */}
            <div className="bg-black border-2 border-indigo-900/50 p-6 relative overflow-hidden group hover:border-indigo-700 transition-all">
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-indigo-500"></div>
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-indigo-500"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-indigo-500"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-indigo-500"></div>
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-indigo-950/30 border border-indigo-900/50 text-indigo-400"><Moon size={24} /></div>
                  <button onClick={() => setActiveModal('Sleep')} className="p-1 hover:bg-amber-950/20 text-amber-700 hover:text-amber-400"><Plus size={18} /></button>
               </div>
               <div className="text-3xl font-bold text-indigo-400 mb-1">{getLatestMetric('Sleep')} <span className="text-base font-normal text-amber-700">HRS</span></div>
               <div className="text-[10px] text-amber-700 tracking-wider">LAST NIGHT</div>
               {/* Mini Chart Visualization */}
               <div className="flex items-end gap-1 h-8 mt-4 opacity-50">
                 {[6, 7, 5.5, 8, 7.5, 6.5, 7.5].map((h, i) => (
                   <div key={i} className="flex-1 bg-indigo-500 hover:bg-indigo-400 transition-colors" style={{height: `${(h/10)*100}%`}}></div>
                 ))}
               </div>
            </div>

            {/* Water Card */}
            <div className="bg-black border-2 border-cyan-900/50 p-6 relative overflow-hidden group hover:border-cyan-700 transition-all">
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-cyan-950/30 border border-cyan-900/50 text-cyan-400"><Droplets size={24} /></div>
                  <button onClick={() => setActiveModal('Water')} className="p-1 hover:bg-amber-950/20 text-amber-700 hover:text-amber-400"><Plus size={18} /></button>
               </div>
               <div className="text-3xl font-bold text-cyan-400 mb-1">{getLatestMetric('Water')} <span className="text-base font-normal text-amber-700">ML</span></div>
               <div className="text-[10px] text-amber-700 tracking-wider">DAILY INTAKE</div>
               <div className="w-full bg-amber-950/30 h-1.5 mt-6 overflow-hidden">
                 <div className="bg-cyan-500 h-full" style={{width: '70%'}}></div>
               </div>
            </div>

            {/* Steps Card */}
            <div className="bg-black border-2 border-orange-900/50 p-6 relative overflow-hidden group hover:border-orange-700 transition-all">
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500"></div>
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-orange-500"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-orange-500"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500"></div>
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-orange-950/30 border border-orange-900/50 text-orange-400"><Footprints size={24} /></div>
                  <button onClick={() => setActiveModal('Steps')} className="p-1 hover:bg-amber-950/20 text-amber-700 hover:text-amber-400"><Plus size={18} /></button>
               </div>
               <div className="text-3xl font-bold text-orange-400 mb-1">{getLatestMetric('Steps')}</div>
               <div className="text-[10px] text-amber-700 tracking-wider">STEPS TODAY</div>
               <div className="flex items-center gap-2 mt-4 text-[10px] text-orange-400 tracking-wider">
                 <Activity size={12} /> ACTIVE NOW
               </div>
            </div>

             {/* Weight Card */}
             <div className="bg-black border-2 border-emerald-900/50 p-6 relative overflow-hidden group hover:border-emerald-700 transition-all">
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500"></div>
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500"></div>
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-emerald-950/30 border border-emerald-900/50 text-emerald-400"><Scale size={24} /></div>
                  <div className="text-[10px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-1 border border-emerald-900/50 tracking-wider">-0.5 KG</div>
               </div>
               <div className="text-3xl font-bold text-emerald-400 mb-1">{getLatestMetric('Weight')} <span className="text-base font-normal text-amber-700">KG</span></div>
               <div className="text-[10px] text-amber-700 tracking-wider">CURRENT WEIGHT</div>
            </div>
          </div>

          {/* Mood Tracker */}
          <div className="bg-black border-2 border-amber-900/50 p-6 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

            <h3 className="font-bold text-amber-500 mb-4 tracking-wider">HOW ARE YOU FEELING TODAY?</h3>
            <div className="flex gap-4">
               {['Great', 'Good', 'Okay', 'Bad'].map((mood) => {
                 const isSelected = getLatestMood() === mood;
                 return (
                   <button
                     key={mood}
                     onClick={() => handleAddMetric('Mood', mood)}
                     className={`flex-1 py-4 border-2 flex flex-col items-center gap-2 transition-all ${
                       isSelected
                       ? 'bg-amber-950/20 border-amber-500 text-amber-400'
                       : 'bg-black border-amber-900/50 text-amber-700 hover:bg-amber-950/10 hover:border-amber-700'
                     }`}
                   >
                     {mood === 'Great' && <Smile size={24} className={isSelected ? 'text-emerald-400' : ''} />}
                     {mood === 'Good' && <Smile size={24} className={isSelected ? 'text-blue-400' : ''} />}
                     {mood === 'Okay' && <Meh size={24} className={isSelected ? 'text-amber-400' : ''} />}
                     {mood === 'Bad' && <Frown size={24} className={isSelected ? 'text-rose-400' : ''} />}
                     <span className="text-xs font-bold tracking-wider">{mood.toUpperCase()}</span>
                   </button>
                 )
               })}
            </div>
          </div>
        </div>

        {/* AI Coach Sidebar */}
        <div className="flex flex-col h-full bg-rose-950/10 border-2 border-rose-900/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rose-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-rose-500"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-rose-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rose-500"></div>

          <div className="p-6 border-b-2 border-rose-900/50">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 tracking-wider">
              <Heart size={18} className="text-rose-500" /> AI HEALTH COACH
            </h3>
            <p className="text-[10px] text-amber-700 mt-1 tracking-wide">GET ADVICE, TRENDS, WORKOUT PLANS</p>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {!aiAdvice && (
              <div className="text-center text-amber-700 mt-10">
                <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-xs tracking-wide">"I noticed your sleep was low yesterday. Try to get 8 hours tonight!"</p>
              </div>
            )}

            {aiAdvice && (
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="w-8 h-8 border-2 border-rose-700 bg-rose-950/20 flex items-center justify-center flex-shrink-0">
                  <Heart size={14} className="text-rose-500" />
                </div>
                <div className="bg-rose-950/20 border border-rose-900/50 p-4 text-xs text-rose-200 leading-relaxed tracking-wide">
                   {aiAdvice}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-black border-t-2 border-rose-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ASK YOUR COACH..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiCoach()}
                className="flex-1 bg-black border border-rose-900/50 px-4 py-2 text-xs text-rose-300 placeholder-rose-900 focus:border-rose-500 outline-none tracking-wide"
              />
              <button
                onClick={handleAiCoach}
                disabled={isAnalyzing}
                className="bg-rose-600 hover:bg-rose-500 text-white p-2 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? <Activity className="animate-spin" size={18} /> : <Sparkles size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Input Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 font-mono" onClick={() => setActiveModal(null)} aria-hidden="true">
          <div role="dialog" aria-modal="true" aria-labelledby="health-modal-title" className="bg-black border-2 border-amber-500 p-6 w-80 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400"></div>

            <h3 id="health-modal-title" className="text-sm font-bold text-amber-500 mb-4 tracking-wider uppercase">[ LOG {activeModal} ]</h3>
            <input
              type="number"
              autoFocus
              placeholder={`ENTER ${activeModal.toUpperCase()} VALUE...`}
              className="w-full bg-black border-2 border-amber-900/50 p-3 text-amber-400 placeholder-amber-900 mb-4 outline-none focus:border-amber-500 text-sm tracking-wide"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddMetric(activeModal, Number(e.currentTarget.value))}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-amber-700 hover:text-amber-400 text-xs font-bold tracking-wider transition-colors">CANCEL</button>
              <button
                onClick={() => handleAddMetric(activeModal, Number(inputVal))}
                className="px-4 py-2 bg-amber-500 text-black hover:bg-amber-400 text-xs font-bold tracking-wider transition-colors"
              >
                SAVE DATA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
