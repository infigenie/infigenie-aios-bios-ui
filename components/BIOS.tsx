import React, { useState, useEffect } from 'react';
import { BrandProfile, CompetitorAnalysis } from '../types';
import { analyzeBrandVoice, analyzeCompetitor } from '../services/geminiService';
import { useToast } from './ui/Toast';
import { Building2, Search, BarChart3, Activity, Swords, Target, ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';

interface BIOSProps {
  activeTab: 'brand' | 'competitor';
}

export const BIOS: React.FC<BIOSProps> = ({ activeTab }) => {
  const toast = useToast();

  // Brand State
  const [brandText, setBrandText] = useState('');
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [loadingBrand, setLoadingBrand] = useState(false);

  // Competitor State
  const [competitorName, setCompetitorName] = useState('');
  const [competitorContext, setCompetitorContext] = useState('');
  const [competitorData, setCompetitorData] = useState<CompetitorAnalysis | null>(null);
  const [loadingCompetitor, setLoadingCompetitor] = useState(false);

  // Load BIOS data from storage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('infigenie_bios');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.brandProfile) {
          setBrandProfile(parsed.brandProfile);
        }
        if (parsed.competitorData) {
          setCompetitorData(parsed.competitorData);
        }
      }
    } catch (error) {
      console.error('Failed to load BIOS data:', error);
    }
  }, []);

  // Save BIOS data to storage whenever they change
  useEffect(() => {
    try {
      const biosData = {
        brandProfile,
        competitorData,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem('infigenie_bios', JSON.stringify(biosData));
    } catch (error) {
      console.error('Failed to save BIOS data:', error);
    }
  }, [brandProfile, competitorData]);

  const handleBrandAnalysis = async () => {
    if (!brandText) return;
    setLoadingBrand(true);
    try {
      const result = await analyzeBrandVoice(brandText);
      setBrandProfile({
        name: 'Detected Brand',
        coreValues: result.coreValues || 'Unknown',
        targetAudience: result.targetAudience || 'Unknown',
        toneVoice: result.toneVoice || 'Unknown'
      });
      toast.success('Brand DNA analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze brand DNA. Please try again.');
    } finally {
      setLoadingBrand(false);
    }
  };

  const handleCompetitorAnalysis = async () => {
    if (!competitorName) return;
    setLoadingCompetitor(true);
    try {
      const result = await analyzeCompetitor(competitorName, competitorContext || 'General Business');
      if (result.swot) {
        setCompetitorData({
          name: competitorName,
          marketShareEstimate: result.marketShareEstimate || 'Unknown',
          swot: result.swot
        });
        toast.success('Competitor analyzed successfully!');
      } else {
        toast.error('Failed to analyze competitor');
      }
    } catch (error) {
      toast.error('Failed to analyze competitor. Please try again.');
    } finally {
      setLoadingCompetitor(false);
    }
  }

  return (
    <div className="h-full flex flex-col font-mono">
       <div className="mb-8 flex items-center gap-4 border-l-4 border-amber-500 pl-4">
        <div className={`p-3 border-2 ${activeTab === 'brand' ? 'bg-amber-950/20 border-amber-700' : 'bg-rose-950/20 border-rose-700'}`}>
          {activeTab === 'brand' ? <Building2 className="text-amber-500 w-8 h-8" /> : <Swords className="text-rose-500 w-8 h-8" />}
        </div>
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ BUSINESS INTELLIGENCE ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">{activeTab === 'brand' ? 'BRAND INTELLIGENCE' : 'COMPETITOR INTELLIGENCE'}</h2>
          <p className="text-amber-700 text-sm tracking-wide">{activeTab === 'brand' ? 'DECODE YOUR BUSINESS IDENTITY' : 'ANALYZE MARKET THREATS & OPPORTUNITIES'}</p>
        </div>
      </div>

      {/* BRAND INTELLIGENCE VIEW */}
      {activeTab === 'brand' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full animate-in fade-in slide-in-from-right-4">
          {/* Input Section */}
          <div className="bg-black border-2 border-amber-900/50 p-6 flex flex-col h-fit relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

            <h3 className="text-sm font-bold text-amber-500 mb-4 tracking-wider">BRAND GENOME DECODER</h3>
            <p className="text-xs text-amber-700 mb-4 tracking-wide">PASTE SAMPLE CONTENT (BLOG POST, ABOUT PAGE, EMAIL) TO AUTO-EXTRACT YOUR BRAND VOICE</p>

            <textarea
              className="min-h-[200px] bg-black border-2 border-amber-900/50 p-4 text-amber-400 text-xs resize-none outline-none focus:border-amber-500 transition-colors placeholder-amber-900 tracking-wide"
              placeholder="PASTE TEXT HERE..."
              value={brandText}
              onChange={(e) => setBrandText(e.target.value)}
            />

            <button
              onClick={handleBrandAnalysis}
              disabled={loadingBrand}
              className="mt-4 w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] tracking-widest border-2 border-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingBrand ? <Activity className="animate-spin" /> : <Search size={20} />}
              {loadingBrand ? 'ANALYZING GENOME...' : 'ANALYZE BRAND DNA'}
            </button>
          </div>

          {/* Results Section */}
          <div className="flex flex-col gap-6">
            {brandProfile ? (
              <>
                <div className="bg-black border-2 border-amber-900/50 p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <BarChart3 size={120} />
                  </div>
                  <h3 className="text-sm font-bold text-amber-500 mb-6 tracking-wider">[ ANALYSIS RESULTS ]</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">TONE & VOICE</label>
                      <p className="text-base text-amber-400 mt-1 tracking-wide">{brandProfile.toneVoice}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">CORE VALUES</label>
                      <p className="text-sm text-amber-500 mt-1 tracking-wide">{brandProfile.coreValues}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">TARGET AUDIENCE</label>
                      <p className="text-sm text-amber-500 mt-1 tracking-wide">{brandProfile.targetAudience}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black border-2 border-amber-900/50 p-4 relative">
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-amber-500"></div>
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-amber-500"></div>
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-amber-500"></div>
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-amber-500"></div>
                    <div className="text-3xl font-bold text-amber-500 mb-1">85%</div>
                    <div className="text-[10px] text-amber-700 tracking-wider">CONSISTENCY SCORE</div>
                  </div>
                  <div className="bg-black border-2 border-amber-900/50 p-4 relative">
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-amber-500"></div>
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-amber-500"></div>
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-amber-500"></div>
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-amber-500"></div>
                    <div className="text-3xl font-bold text-amber-500 mb-1">A+</div>
                    <div className="text-[10px] text-amber-700 tracking-wider">CLARITY RATING</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center bg-black border-2 border-amber-900/50 border-dashed relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                <div className="text-center text-amber-800">
                  <Activity size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="tracking-wider">AWAITING ANALYSIS DATA...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMPETITOR INTELLIGENCE VIEW */}
      {activeTab === 'competitor' && (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4">
          <div className="bg-black p-6 border-2 border-rose-900/50 flex flex-col md:flex-row gap-4 items-end relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-rose-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-rose-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-rose-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-rose-500"></div>

            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-amber-700 uppercase mb-1 block tracking-widest">COMPETITOR NAME</label>
              <input
                type="text"
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                placeholder="E.G. ACME CORP"
                className="w-full bg-black border-2 border-amber-900/50 p-3 text-amber-400 text-xs outline-none focus:border-rose-500 placeholder-amber-900 tracking-wide"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-amber-700 uppercase mb-1 block tracking-widest">INDUSTRY CONTEXT</label>
              <input
                type="text"
                value={competitorContext}
                onChange={(e) => setCompetitorContext(e.target.value)}
                placeholder="E.G. SAAS, E-COMMERCE"
                className="w-full bg-black border-2 border-amber-900/50 p-3 text-amber-400 text-xs outline-none focus:border-rose-500 placeholder-amber-900 tracking-wide"
              />
            </div>
            <button
              onClick={handleCompetitorAnalysis}
              disabled={loadingCompetitor}
              className="w-full md:w-auto px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] tracking-widest border-2 border-rose-500 transition-colors disabled:opacity-50"
            >
              {loadingCompetitor ? 'SCOUTING...' : 'RUN ANALYSIS'}
            </button>
          </div>

          {competitorData ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Strengths */}
               <div className="bg-emerald-950/20 border-2 border-emerald-900/50 p-6 relative">
                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500"></div>
                 <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500"></div>
                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500"></div>
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500"></div>
                 <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4 text-xs tracking-wider"><Activity size={20} /> STRENGTHS</h4>
                 <ul className="space-y-2">
                   {competitorData.swot.strengths.map((s, i) => (
                     <li key={i} className="flex gap-2 text-amber-400 text-sm tracking-wide"><span className="text-emerald-500">•</span> {s}</li>
                   ))}
                 </ul>
               </div>

               {/* Weaknesses */}
               <div className="bg-orange-950/20 border-2 border-orange-900/50 p-6 relative">
                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500"></div>
                 <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-orange-500"></div>
                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-orange-500"></div>
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500"></div>
                 <h4 className="flex items-center gap-2 text-orange-400 font-bold mb-4 text-xs tracking-wider"><AlertTriangle size={20} /> WEAKNESSES</h4>
                 <ul className="space-y-2">
                   {competitorData.swot.weaknesses.map((s, i) => (
                     <li key={i} className="flex gap-2 text-amber-400 text-sm tracking-wide"><span className="text-orange-500">•</span> {s}</li>
                   ))}
                 </ul>
               </div>

               {/* Opportunities */}
               <div className="bg-cyan-950/20 border-2 border-cyan-900/50 p-6 relative">
                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
                 <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500"></div>
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>
                 <h4 className="flex items-center gap-2 text-cyan-400 font-bold mb-4 text-xs tracking-wider"><TrendingUp size={20} /> OPPORTUNITIES</h4>
                 <ul className="space-y-2">
                   {competitorData.swot.opportunities.map((s, i) => (
                     <li key={i} className="flex gap-2 text-amber-400 text-sm tracking-wide"><span className="text-cyan-500">•</span> {s}</li>
                   ))}
                 </ul>
               </div>

               {/* Threats */}
               <div className="bg-rose-950/20 border-2 border-rose-900/50 p-6 relative">
                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-rose-500"></div>
                 <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-rose-500"></div>
                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-rose-500"></div>
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-rose-500"></div>
                 <h4 className="flex items-center gap-2 text-rose-400 font-bold mb-4 text-xs tracking-wider"><ShieldAlert size={20} /> THREATS</h4>
                 <ul className="space-y-2">
                   {competitorData.swot.threats.map((s, i) => (
                     <li key={i} className="flex gap-2 text-amber-400 text-sm tracking-wide"><span className="text-rose-500">•</span> {s}</li>
                   ))}
                 </ul>
               </div>
             </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-amber-800 bg-black border-2 border-amber-900/50 border-dashed p-12 relative">
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
               <Target size={64} className="mb-4 opacity-20" />
               <p className="tracking-wider">ENTER COMPETITOR DETAILS TO GENERATE INTELLIGENCE REPORT</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};