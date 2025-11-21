
import React, { useState } from 'react';
import { SocialPost } from '../types';
import { generatePostIdeas, draftSocialPost, generateImage, editImage, generateVideo } from '../services/geminiService';
import {
  Calendar,
  PenTool,
  Twitter,
  Linkedin,
  Instagram,
  Sparkles,
  Send,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Wand2,
  Layers,
  Maximize
} from 'lucide-react';

export const CreatorStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Calendar' | 'Create' | 'Studio'>('Calendar');
  const [posts, setPosts] = useState<SocialPost[]>([
    { id: '1', content: 'Launching our new AI features today! #TechLaunch', platform: 'Twitter', status: 'Published', scheduledDate: '2025-11-19', engagement: { likes: 240, shares: 45, comments: 12 } },
  ]);

  // Create State
  const [topic, setTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPost['platform']>('Twitter');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [draft, setDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  // Studio State (Image/Video)
  const [studioMode, setStudioMode] = useState<'ImageGen' | 'ImageEdit' | 'VideoGen'>('ImageGen');
  const [mediaPrompt, setMediaPrompt] = useState('');
  const [generatedMedia, setGeneratedMedia] = useState<string | null>(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [imgSize, setImgSize] = useState<'1K'|'2K'|'4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleGenerateIdeas = async () => {
    if (!topic.trim()) return;
    setIsGeneratingIdeas(true);
    const results = await generatePostIdeas(topic, selectedPlatform);
    setIdeas(results);
    setIsGeneratingIdeas(false);
  };

  const handleDraft = async (idea: string) => {
    setIsDrafting(true);
    const result = await draftSocialPost(idea, selectedPlatform, 'Professional');
    setDraft(result);
    setIsDrafting(false);
  };

  const handleMediaGenerate = async () => {
    if (!mediaPrompt) return;
    setIsGeneratingMedia(true);
    setGeneratedMedia(null);

    try {
        if (studioMode === 'ImageGen') {
            const result = await generateImage(mediaPrompt, imgSize, aspectRatio);
            setGeneratedMedia(result);
        } else if (studioMode === 'ImageEdit' && uploadedImage) {
            const result = await editImage(uploadedImage.split(',')[1], mediaPrompt);
            setGeneratedMedia(result);
        } else if (studioMode === 'VideoGen') {
            const result = await generateVideo(mediaPrompt, uploadedImage ? uploadedImage.split(',')[1] : undefined);
            setGeneratedMedia(result);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsGeneratingMedia(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setUploadedImage(reader.result as string);
        reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="flex justify-between items-center mb-6 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ CONTENT CREATION ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">CREATOR STUDIO</h2>
          <p className="text-amber-700 text-sm tracking-wide">PLAN, CREATE & PUBLISH CONTENT</p>
        </div>
        <div className="bg-black p-1 border-2 border-amber-900/50 flex">
          <button onClick={() => setActiveTab('Calendar')} className={`px-4 py-2 text-[10px] font-bold tracking-wider transition-colors flex items-center gap-2 border-l-2 ${activeTab === 'Calendar' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 hover:text-amber-400 border-transparent'}`}>
            <Calendar size={14} /> CALENDAR
          </button>
          <button onClick={() => setActiveTab('Create')} className={`px-4 py-2 text-[10px] font-bold tracking-wider transition-colors flex items-center gap-2 border-l-2 ${activeTab === 'Create' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 hover:text-amber-400 border-transparent'}`}>
            <PenTool size={14} /> SOCIAL
          </button>
          <button onClick={() => setActiveTab('Studio')} className={`px-4 py-2 text-[10px] font-bold tracking-wider transition-colors flex items-center gap-2 border-l-2 ${activeTab === 'Studio' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 hover:text-amber-400 border-transparent'}`}>
            <Wand2 size={14} /> MEDIA LAB
          </button>
        </div>
      </div>

      {/* CALENDAR TAB */}
      {activeTab === 'Calendar' && (
        <div className="flex-1 bg-black border-2 border-amber-900/50 p-6 relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
          <h3 className="font-bold text-amber-500 mb-4 text-sm tracking-wider">[ SCHEDULED POSTS ]</h3>
          {posts.map(p => (
              <div key={p.id} className="bg-black border-2 border-amber-900/50 p-4 mb-2 relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                  <div className="flex justify-between text-[10px] text-amber-700 mb-1 tracking-wider">
                      <span>{p.platform.toUpperCase()}</span>
                      <span>{p.scheduledDate}</span>
                  </div>
                  <div className="text-amber-400 text-sm tracking-wide">{p.content}</div>
              </div>
          ))}
        </div>
      )}

      {/* SOCIAL CREATE TAB */}
      {activeTab === 'Create' && (
        <div className="flex h-full gap-6">
             <div className="w-1/3 bg-black border-2 border-amber-900/50 p-6 relative">
                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
                 <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
                 <h3 className="font-bold text-amber-500 mb-4 text-sm tracking-wider">[ IDEA GENERATOR ]</h3>
                 <input
                   type="text"
                   className="w-full bg-black border-2 border-amber-900/50 p-2 text-amber-400 mb-2 text-sm tracking-wide outline-none focus:border-amber-500 placeholder-amber-900"
                   placeholder="TOPIC..."
                   value={topic}
                   onChange={e => setTopic(e.target.value)}
                 />
                 <button
                   onClick={handleGenerateIdeas}
                   className="w-full bg-amber-950/30 text-amber-400 hover:bg-amber-500 hover:text-black py-2 border border-amber-900/50 mb-4 text-[10px] font-bold tracking-wider transition-colors"
                 >
                   {isGeneratingIdeas ? 'THINKING...' : 'GENERATE'}
                 </button>
                 <div className="space-y-2">
                     {ideas.map((idea, i) => (
                         <div
                           key={i}
                           onClick={() => handleDraft(idea)}
                           className="p-2 bg-black border border-amber-900/50 text-xs text-amber-600 cursor-pointer hover:border-amber-500 hover:text-amber-400 transition-colors tracking-wide"
                         >
                           {idea}
                         </div>
                     ))}
                 </div>
             </div>
             <div className="flex-1 bg-black border-2 border-amber-900/50 p-6 relative">
                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
                 <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
                 <h3 className="font-bold text-amber-500 mb-4 text-sm tracking-wider">[ EDITOR ]</h3>
                 <textarea
                   className="w-full h-64 bg-black border-2 border-amber-900/50 p-4 text-amber-400 text-sm resize-none outline-none focus:border-amber-500 tracking-wide"
                   value={draft}
                   onChange={e => setDraft(e.target.value)}
                 />
             </div>
        </div>
      )}

      {/* MEDIA STUDIO TAB */}
      {activeTab === 'Studio' && (
        <div className="flex h-full gap-6">
            {/* Controls */}
            <div className="w-1/3 bg-black border-2 border-amber-900/50 p-6 flex flex-col gap-6 overflow-y-auto relative">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

                <div className="flex bg-black p-1 border-2 border-amber-900/50">
                    <button
                      onClick={() => setStudioMode('ImageGen')}
                      className={`flex-1 py-2 text-[10px] font-bold tracking-wider border-l-2 ${studioMode === 'ImageGen' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 border-transparent'}`}
                    >
                      GENERATE
                    </button>
                    <button
                      onClick={() => setStudioMode('ImageEdit')}
                      className={`flex-1 py-2 text-[10px] font-bold tracking-wider border-l-2 ${studioMode === 'ImageEdit' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 border-transparent'}`}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => setStudioMode('VideoGen')}
                      className={`flex-1 py-2 text-[10px] font-bold tracking-wider border-l-2 ${studioMode === 'VideoGen' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 border-transparent'}`}
                    >
                      VIDEO
                    </button>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-amber-700 uppercase mb-2 block tracking-wider">PROMPT</label>
                    <textarea
                        className="w-full bg-black border-2 border-amber-900/50 p-3 text-sm text-amber-400 h-32 resize-none outline-none focus:border-amber-500 tracking-wide placeholder-amber-900"
                        placeholder={studioMode === 'ImageEdit' ? "DESCRIBE EDIT (E.G., 'ADD RETRO FILTER')" : "DESCRIBE WHAT TO GENERATE..."}
                        value={mediaPrompt}
                        onChange={e => setMediaPrompt(e.target.value)}
                    />
                </div>

                {(studioMode === 'ImageEdit' || studioMode === 'VideoGen') && (
                    <div>
                        <label className="text-[10px] font-bold text-amber-700 uppercase mb-2 block tracking-wider">REFERENCE IMAGE</label>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="text-[10px] text-amber-700 w-full tracking-wide" />
                        {uploadedImage && <img src={uploadedImage} alt="Ref" className="mt-2 w-full h-32 object-cover border-2 border-amber-900/50" />}
                    </div>
                )}

                {studioMode === 'ImageGen' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-amber-700 uppercase mb-2 block tracking-wider">SIZE</label>
                            <select
                              className="w-full bg-black border-2 border-amber-900/50 p-2 text-sm text-amber-400 outline-none focus:border-amber-500 tracking-wide"
                              value={imgSize}
                              onChange={(e: any) => setImgSize(e.target.value)}
                            >
                                <option value="1K">1K</option>
                                <option value="2K">2K</option>
                                <option value="4K">4K</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-amber-700 uppercase mb-2 block tracking-wider">RATIO</label>
                            <select
                              className="w-full bg-black border-2 border-amber-900/50 p-2 text-sm text-amber-400 outline-none focus:border-amber-500 tracking-wide"
                              value={aspectRatio}
                              onChange={e => setAspectRatio(e.target.value)}
                            >
                                <option value="1:1">1:1</option>
                                <option value="2:3">2:3</option>
                                <option value="3:2">3:2</option>
                                <option value="3:4">3:4</option>
                                <option value="4:3">4:3</option>
                                <option value="9:16">9:16</option>
                                <option value="16:9">16:9</option>
                                <option value="21:9">21:9</option>
                            </select>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleMediaGenerate}
                    disabled={isGeneratingMedia}
                    className="bg-fuchsia-950/30 border-2 border-fuchsia-900/50 text-fuchsia-400 hover:bg-fuchsia-950/50 hover:border-fuchsia-500 py-3 font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm tracking-wider"
                >
                    {isGeneratingMedia ? <Sparkles className="animate-spin" size={16} /> : <Wand2 size={16} />}
                    {isGeneratingMedia ? 'GENERATING...' : 'CREATE MAGIC'}
                </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-black border-2 border-amber-900/50 flex items-center justify-center overflow-hidden relative p-4">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
                {generatedMedia ? (
                    studioMode === 'VideoGen' ? (
                        <video src={generatedMedia} controls className="max-w-full max-h-full shadow-2xl" autoPlay loop />
                    ) : (
                        <img src={generatedMedia} alt="Generated" className="max-w-full max-h-full shadow-2xl object-contain" />
                    )
                ) : (
                    <div className="text-center text-amber-800">
                        {studioMode === 'VideoGen' ? <Video size={64} className="mx-auto mb-4 opacity-20" /> : <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />}
                        <p className="text-[10px] tracking-widest">OUTPUT WILL APPEAR HERE</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
