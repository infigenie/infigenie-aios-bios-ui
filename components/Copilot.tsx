
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, User, Bot, BrainCircuit, Globe, MapPin, Mic, Trash2 } from 'lucide-react';
import { ChatMessage, View } from '../types';
import { getChatResponse } from '../services/geminiService';
import { LiveSession } from './LiveSession';
import { useToast } from './ui/Toast';

interface CopilotProps {
  currentView: View;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init',
  role: 'assistant',
  content: 'Hello! I am Infigenie. Ask me anything, search the web, or press the mic for a live conversation.',
  timestamp: Date.now()
};

export const Copilot: React.FC<CopilotProps> = ({ currentView }) => {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useDeepThink, setUseDeepThink] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation history and preferences on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('infigenie_copilot_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (parsed.messages && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setMessages(parsed.messages);
        }
        if (typeof parsed.useDeepThink === 'boolean') {
          setUseDeepThink(parsed.useDeepThink);
        }
      }
    } catch (error) {
      console.error('Failed to load Copilot history:', error);
    }
  }, []);

  // Save conversation history and preferences whenever they change
  useEffect(() => {
    try {
      const historyData = {
        messages,
        useDeepThink,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem('infigenie_copilot_history', JSON.stringify(historyData));
    } catch (error) {
      console.error('Failed to save Copilot history:', error);
    }
  }, [messages, useDeepThink]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getChatResponse(userMsg.content, messages, currentView, useDeepThink);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content || "No response.",
      timestamp: Date.now(),
      groundingMetadata: response.groundingMetadata
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    toast.success('Conversation history cleared');
  };

  return (
    <>
      <LiveSession isOpen={isLiveOpen} onClose={() => setIsLiveOpen(false)} />
    
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50 font-mono">
         <button
           onClick={() => setIsLiveOpen(true)}
           className="w-14 h-14 border-2 border-rose-600 shadow-2xl flex items-center justify-center bg-black text-rose-500 hover:bg-rose-950/30 hover:scale-105 transition-all duration-300 relative"
           title="Start Live Conversation"
         >
           <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>
           <Mic size={24} className="relative z-10" />
         </button>

         <button
           onClick={() => setIsOpen(!isOpen)}
           className={`w-14 h-14 border-2 shadow-2xl flex items-center justify-center transition-all duration-300 group relative ${
             isOpen ? 'bg-black text-amber-600 rotate-90 border-amber-700' : 'bg-black text-amber-500 hover:bg-amber-950/30 hover:scale-105 border-amber-500'
           }`}
         >
           <div className="absolute inset-0 bg-amber-500/10 animate-pulse"></div>
           {isOpen ? <X size={24} className="relative z-10" /> : <Sparkles size={24} className="group-hover:animate-pulse relative z-10" />}
         </button>
      </div>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 w-96 h-[600px] bg-black border-2 border-amber-500 shadow-2xl z-40 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right font-mono relative ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none translate-y-10'
      }`}>
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 z-50"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 z-50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 z-50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 z-50"></div>

        {/* Header */}
        <div className="p-4 bg-amber-950/20 border-b-2 border-amber-900/50 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 border-2 border-amber-500 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-amber-500/10 animate-pulse"></div>
               <Sparkles size={16} className="text-amber-500 relative z-10" />
             </div>
             <div>
               <h3 className="font-bold text-amber-500 tracking-wider text-sm">INFIGENIE</h3>
               <div className="flex items-center gap-1.5 text-[10px] text-amber-700">
                 <span className="w-1.5 h-1.5 bg-amber-500 animate-pulse"></span>
                 GEMINI 3 PRO
               </div>
             </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearHistory}
              className="p-2 border border-amber-900/50 text-amber-700 hover:text-rose-400 hover:border-rose-600 transition-all"
              title="Clear Conversation History"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setUseDeepThink(!useDeepThink)}
              className={`p-2 border transition-all ${useDeepThink ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'border-amber-900/50 text-amber-700 hover:text-amber-500'}`}
              title="Toggle Deep Thinking Mode"
            >
              <BrainCircuit size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black relative z-10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-black border-amber-700 text-amber-600' : 'bg-amber-950/20 border-amber-700 text-amber-500'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 text-xs leading-relaxed border ${
                  msg.role === 'user'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-700'
                    : 'bg-black text-amber-300 border-amber-900/50'
                }`}>
                  {msg.content}
                </div>
              </div>

              {/* Grounding Chips */}
              {msg.groundingMetadata && (
                <div className="ml-11 flex flex-wrap gap-2">
                  {msg.groundingMetadata.web?.map((src, i) => (
                    <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 px-2 py-1 rounded-full transition-colors">
                      <Globe size={10} /> {src.title}
                    </a>
                  ))}
                  {msg.groundingMetadata.maps?.map((src, i) => (
                    <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 px-2 py-1 rounded-full transition-colors">
                      <MapPin size={10} /> {src.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300">
                <Bot size={16} />
              </div>
              <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={useDeepThink ? "Ask complex questions..." : "Ask anything..."}
              className={`w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white outline-none shadow-inner focus:border-indigo-500 ${useDeepThink ? 'border-purple-500/30 focus:border-purple-500' : ''}`}
              autoFocus={isOpen}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors disabled:opacity-0 disabled:pointer-events-none ${useDeepThink ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
