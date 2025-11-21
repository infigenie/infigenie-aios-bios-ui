
import React, { useState } from 'react';
import { MediaItem } from '../types';
import { summarizeContent, repurposeContent, transcribeAudio, generateSpeech, analyzeVideo } from '../services/geminiService';
import { 
  PlaySquare, 
  Book, 
  Headphones, 
  Plus, 
  Star, 
  Sparkles, 
  FileText, 
  Twitter, 
  PenTool, 
  Mic,
  ExternalLink,
  CheckCircle2,
  Circle,
  Volume2,
  Video as VideoIcon
} from 'lucide-react';

export const MediaOS: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>([
    { 
      id: '1', 
      title: 'The Future of AI Agents', 
      type: 'Article', 
      status: 'Done', 
      rating: 5, 
      url: 'https://example.com', 
      notes: 'Key point: Agents will replace traditional apps.',
      takeaways: ['Agents reduce friction', 'Context is king', 'Multi-modal input is standard']
    },
    {
      id: '2',
      title: 'Tech Conference Keynote',
      type: 'Video',
      status: 'To Consume',
      url: 'https://example.com/video',
      notes: ''
    }
  ]);

  const [activeTab, setActiveTab] = useState<'All' | 'Video' | 'Article' | 'Podcast' | 'Book'>('All');
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<MediaItem['type']>('Article');
  
  // AI State
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [repurposedContent, setRepurposedContent] = useState<string | null>(null);
  const [contentType, setContentType] = useState<'tweet' | 'blog' | 'email'>('tweet');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [isAnalyzingVideo, setIsAnalyzingVideo] = useState(false);

  // Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);

  const filteredItems = activeTab === 'All' ? items : items.filter(i => i.type === activeTab);

  const addItem = () => {
    if (!newItemTitle.trim()) return;
    const newItem: MediaItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      type: newItemType,
      status: 'To Consume',
      notes: ''
    };
    setItems([newItem, ...items]);
    setNewItemTitle('');
  };

  const updateStatus = (id: string, status: MediaItem['status']) => {
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
    if (activeItem?.id === id) setActiveItem({ ...activeItem, status });
  };

  const handleSummarize = async () => {
    if (!activeItem?.notes) return;
    setIsSummarizing(true);
    const summary = await summarizeContent(activeItem.notes);
    
    const updatedItem = { ...activeItem, takeaways: summary };
    setItems(items.map(i => i.id === activeItem.id ? updatedItem : i));
    setActiveItem(updatedItem);
    setIsSummarizing(false);
  };

  const handleVideoAnalysis = async () => {
    if (!activeItem || activeItem.type !== 'Video') return;
    setIsAnalyzingVideo(true);
    const result = await analyzeVideo(activeItem.url || '', "Summarize this video and extract key insights.");
    
    const updatedItem = { ...activeItem, notes: activeItem.notes + `\n\n[Video Analysis]:\n${result}` };
    setItems(items.map(i => i.id === activeItem.id ? updatedItem : i));
    setActiveItem(updatedItem);
    setIsAnalyzingVideo(false);
  };

  const handleRepurpose = async () => {
    if (!activeItem?.notes && !activeItem?.takeaways) return;
    setIsRepurposing(true);
    const content = activeItem.takeaways?.join('\n') || activeItem.notes;
    const result = await repurposeContent(content, contentType);
    setRepurposedContent(result);
    setIsRepurposing(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        setAudioBlob(blob);
        handleTranscribe(blob);
      };
      
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleTranscribe = async (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        if (activeItem) {
             const text = await transcribeAudio(base64);
             const updated = { ...activeItem, notes: activeItem.notes + "\n\n[Transcript]: " + text };
             setActiveItem(updated);
             setItems(items.map(i => i.id === activeItem.id ? updated : i));
        }
    };
  };

  const handleTTS = async () => {
    if (!activeItem?.takeaways?.length) return;
    setIsPlayingTTS(true);
    const text = activeItem.takeaways.join('. ');
    const audioData = await generateSpeech(text);
    
    if (audioData) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const binaryString = atob(audioData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
        
        try {
            const buffer = await audioContext.decodeAudioData(bytes.buffer);
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(0);
            source.onended = () => setIsPlayingTTS(false);
        } catch(e) {
            setIsPlayingTTS(false);
        }
    } else {
        setIsPlayingTTS(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="flex justify-between items-center mb-6 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ CONTENT INTELLIGENCE ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">MEDIA OS</h2>
          <p className="text-amber-700 text-sm tracking-wide">CONSUME • ANALYZE • CREATE</p>
        </div>
        <div className="bg-black p-1 border-2 border-amber-900/50 flex">
          {['All', 'Video', 'Article', 'Podcast', 'Book'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 text-[10px] font-bold transition-colors tracking-wider border-l-2 ${
                activeTab === tab ? 'bg-amber-950/30 text-amber-500 border-l-amber-500' : 'text-amber-700 hover:text-amber-400 border-l-transparent'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        
        {/* Left: Library */}
        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Quick Add */}
          <div className="bg-black border-2 border-amber-900/50 p-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="PASTE URL OR ENTER TITLE..."
                value={newItemTitle}
                onChange={e => setNewItemTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                className="flex-1 bg-black border border-amber-900/50 px-3 py-2 text-xs text-amber-400 placeholder-amber-900 outline-none focus:border-amber-500 tracking-wide"
              />
              <button
                onClick={addItem}
                className="bg-amber-500 hover:bg-amber-400 text-black px-3 border-2 border-amber-400 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex gap-2">
              {['Article', 'Video', 'Podcast', 'Book'].map(type => (
                <button
                  key={type}
                  onClick={() => setNewItemType(type as any)}
                  className={`flex-1 py-1 text-[10px] border tracking-wider font-bold transition-colors ${
                    newItemType === type
                      ? 'bg-amber-950/30 border-amber-500 text-amber-500'
                      : 'border-amber-900/50 text-amber-800 hover:bg-amber-950/20'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`p-4 border-2 cursor-pointer transition-all relative ${
                  activeItem?.id === item.id
                    ? 'bg-amber-950/30 border-amber-500'
                    : 'bg-black border-amber-900/50 hover:border-amber-700'
                }`}
              >
                {activeItem?.id === item.id && (
                  <>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-400"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-400"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-400"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-400"></div>
                  </>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 border ${activeItem?.id === item.id ? 'bg-amber-950/20 border-amber-700 text-amber-500' : 'bg-amber-950/10 border-amber-900/50 text-amber-700'}`}>
                      {item.type === 'Video' && <PlaySquare size={14} />}
                      {item.type === 'Article' && <FileText size={14} />}
                      {item.type === 'Podcast' && <Headphones size={14} />}
                      {item.type === 'Book' && <Book size={14} />}
                    </div>
                    <span className={`font-medium text-sm tracking-wide ${activeItem?.id === item.id ? 'text-amber-500' : 'text-amber-700'}`}>
                      {item.title}
                    </span>
                  </div>
                  {item.rating && (
                    <div className="flex items-center text-amber-500 gap-0.5">
                      <Star size={10} fill="currentColor" />
                      <span className="text-xs font-bold">{item.rating}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                   <span className={`text-[10px] px-2 py-0.5 border tracking-wider font-bold ${
                     item.status === 'Done' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900' :
                     item.status === 'In Progress' ? 'bg-amber-950/30 text-amber-400 border-amber-900' :
                     'bg-black text-amber-700 border-amber-900/50'
                   }`}>
                     {item.status.toUpperCase()}
                   </span>
                   {item.url && <ExternalLink size={12} className="text-amber-800" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center/Right: Detail View */}
        <div className="lg:col-span-2 bg-black border-2 border-amber-900/50 overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

          {activeItem ? (
            <div className="flex flex-col h-full">
              {/* Item Header */}
              <div className="p-6 border-b-2 border-amber-900/50 bg-amber-950/10">
                <div className="flex justify-between items-start">
                   <div>
                     <h1 className="text-2xl font-bold text-amber-500 mb-2 tracking-wide">{activeItem.title.toUpperCase()}</h1>
                     <a href={activeItem.url} target="_blank" rel="noreferrer" className="text-xs text-amber-600 hover:text-amber-400 flex items-center gap-1 tracking-wider">
                       {activeItem.url || 'NO URL PROVIDED'} <ExternalLink size={12} />
                     </a>
                   </div>
                   <div className="flex items-center gap-2 bg-black p-1 border-2 border-amber-900/50">
                     <button
                       onClick={() => updateStatus(activeItem.id, 'To Consume')}
                       title="To Consume"
                       className={`p-2 border-l-2 hover:bg-amber-950/20 transition-colors ${activeItem.status === 'To Consume' ? 'text-amber-500 border-l-amber-500' : 'text-amber-700 border-l-transparent'}`}
                     ><Circle size={18} /></button>
                     <button
                       onClick={() => updateStatus(activeItem.id, 'In Progress')}
                       title="In Progress"
                       className={`p-2 border-l-2 hover:bg-amber-950/20 transition-colors ${activeItem.status === 'In Progress' ? 'text-amber-400 border-l-amber-500' : 'text-amber-700 border-l-transparent'}`}
                     ><PlaySquare size={18} /></button>
                     <button
                       onClick={() => updateStatus(activeItem.id, 'Done')}
                       title="Done"
                       className={`p-2 border-l-2 hover:bg-amber-950/20 transition-colors ${activeItem.status === 'Done' ? 'text-emerald-400 border-l-emerald-500' : 'text-amber-700 border-l-transparent'}`}
                     ><CheckCircle2 size={18} /></button>
                   </div>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Notes & Takeaways */}
                <div className="flex-1 p-6 overflow-y-auto border-r-2 border-amber-900/50">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">[ NOTES & HIGHLIGHTS ]</h3>
                     <div className="flex gap-2">
                        {activeItem.type === 'Video' && (
                            <button
                              onClick={handleVideoAnalysis}
                              disabled={isAnalyzingVideo}
                              className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold transition-colors bg-rose-950/20 text-rose-400 hover:bg-rose-950/30 border border-rose-900/50 disabled:opacity-50 tracking-wider"
                            >
                                <VideoIcon size={14} /> {isAnalyzingVideo ? 'ANALYZING...' : 'ANALYZE VIDEO'}
                            </button>
                        )}
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold transition-colors tracking-wider border ${isRecording ? 'bg-rose-600 text-white animate-pulse border-rose-500' : 'bg-black text-amber-700 hover:text-amber-400 border-amber-900/50'}`}
                        >
                            <Mic size={14} /> {isRecording ? 'STOP RECORDING' : 'TRANSCRIBE AUDIO'}
                        </button>
                     </div>
                  </div>

                  <textarea
                    className="w-full h-48 bg-black border-2 border-amber-900/50 p-4 text-amber-400 text-xs leading-relaxed outline-none focus:border-amber-500 mb-6 resize-none placeholder-amber-900 tracking-wide"
                    placeholder="PASTE TRANSCRIPT OR TAKE NOTES HERE TO ENABLE AI SUMMARY..."
                    value={activeItem.notes}
                    onChange={(e) => {
                      const updated = { ...activeItem, notes: e.target.value };
                      setActiveItem(updated);
                      setItems(items.map(i => i.id === activeItem.id ? updated : i));
                    }}
                  />

                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">[ AI TAKEAWAYS ]</h3>
                    <div className="flex gap-2">
                        <button
                          onClick={handleTTS}
                          disabled={!activeItem.takeaways?.length}
                          className={`text-[10px] px-3 py-1.5 flex items-center gap-1 transition-colors font-bold tracking-wider border ${isPlayingTTS ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900' : 'bg-black text-amber-700 hover:text-amber-400 border-amber-900/50'}`}
                          title="Read aloud"
                        >
                           <Volume2 size={12} /> {isPlayingTTS ? 'PLAYING...' : 'LISTEN'}
                        </button>
                        <button
                          onClick={handleSummarize}
                          disabled={isSummarizing || !activeItem.notes}
                          className="text-[10px] bg-fuchsia-950/30 hover:bg-fuchsia-950/50 text-fuchsia-300 px-3 py-1.5 border border-fuchsia-900/50 flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-wider"
                        >
                          {isSummarizing ? <Sparkles className="animate-spin" size={12} /> : <Sparkles size={12} />}
                          {isSummarizing ? 'ANALYZING...' : 'GENERATE'}
                        </button>
                    </div>
                  </div>

                  {activeItem.takeaways && activeItem.takeaways.length > 0 ? (
                    <ul className="space-y-3">
                      {activeItem.takeaways.map((t, i) => (
                        <li key={i} className="flex gap-3 text-sm text-amber-400 bg-amber-950/20 p-3 border border-amber-900/50 tracking-wide">
                          <span className="text-amber-600 font-bold">•</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-amber-800 py-8 border border-dashed border-amber-900/50">
                      <Sparkles className="mx-auto mb-2 opacity-20" size={24} />
                      <p className="text-[10px] tracking-wider">ADD NOTES TO GENERATE TAKEAWAYS</p>
                    </div>
                  )}
                </div>

                {/* Repurposing Studio */}
                <div className="w-1/3 p-6 bg-amber-950/10 overflow-y-auto flex flex-col">
                  <h3 className="text-[10px] font-bold text-amber-700 uppercase mb-4 tracking-widest">[ CREATOR STUDIO ]</h3>

                  <div className="space-y-4 mb-6">
                     <div className="grid grid-cols-3 gap-2">
                       <button
                         onClick={() => setContentType('tweet')}
                         className={`flex flex-col items-center gap-1 p-2 border transition-colors ${contentType === 'tweet' ? 'bg-amber-950/30 border-amber-500 text-amber-500' : 'border-amber-900/50 text-amber-700 hover:bg-amber-950/20'}`}
                       >
                         <Twitter size={16} />
                         <span className="text-[10px] font-bold tracking-wider">TWEET</span>
                       </button>
                       <button
                         onClick={() => setContentType('blog')}
                         className={`flex flex-col items-center gap-1 p-2 border transition-colors ${contentType === 'blog' ? 'bg-amber-950/30 border-amber-500 text-amber-500' : 'border-amber-900/50 text-amber-700 hover:bg-amber-950/20'}`}
                       >
                         <PenTool size={16} />
                         <span className="text-[10px] font-bold tracking-wider">BLOG</span>
                       </button>
                       <button
                         onClick={() => setContentType('email')}
                         className={`flex flex-col items-center gap-1 p-2 border transition-colors ${contentType === 'email' ? 'bg-amber-950/30 border-amber-500 text-amber-500' : 'border-amber-900/50 text-amber-700 hover:bg-amber-950/20'}`}
                       >
                         <Mic size={16} />
                         <span className="text-[10px] font-bold tracking-wider">EMAIL</span>
                       </button>
                     </div>

                     <button
                       onClick={handleRepurpose}
                       disabled={isRepurposing || (!activeItem.notes && !activeItem.takeaways?.length)}
                       className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold tracking-widest transition-colors disabled:opacity-50 border-2 border-amber-400"
                     >
                       {isRepurposing ? 'DRAFTING...' : 'REPURPOSE CONTENT'}
                     </button>
                  </div>

                  {repurposedContent && (
                    <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-emerald-400 tracking-wider">DRAFT READY</span>
                        <button className="text-[10px] text-amber-700 hover:text-amber-400 font-bold tracking-wider">COPY</button>
                      </div>
                      <div className="flex-1 bg-black border-2 border-amber-900/50 p-4 text-sm text-amber-400 whitespace-pre-wrap overflow-y-auto custom-scrollbar tracking-wide">
                        {repurposedContent}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-amber-700">
              <PlaySquare size={64} className="mb-4 opacity-20" />
              <p className="tracking-wide">SELECT AN ITEM TO VIEW DETAILS</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
