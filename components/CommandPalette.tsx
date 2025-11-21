import React, { useState, useEffect } from 'react';
import { Search, Zap, ArrowRight, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (command: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onExecute }) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose(); else { /* Handled by parent usually, but here for symmetry */ }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onExecute(input);
      setInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/90 backdrop-blur-sm transition-all font-mono">
      <div className="w-full max-w-2xl bg-black border-2 border-amber-500 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400"></div>

        {/* Search Header */}
        <form onSubmit={handleSubmit} className="relative flex items-center border-b-2 border-amber-900/50 p-4 bg-amber-950/10">
          <Search className="w-5 h-5 text-amber-600 absolute left-4" />
          <input
            autoFocus
            type="text"
            className="w-full bg-transparent border-none outline-none text-sm text-amber-400 placeholder-amber-900 pl-10 pr-10 tracking-wide"
            placeholder="ENTER COMMAND OR QUERY..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 p-1 hover:bg-amber-950/30 transition-colors"
          >
            <X className="w-4 h-4 text-amber-600" />
          </button>
        </form>

        {/* Suggestions (Mock) */}
        <div className="p-2">
          <div className="text-[10px] font-bold text-amber-800 px-3 py-2 tracking-[0.2em]">[ QUICK ACTIONS ]</div>
          {['Create new task', 'Summarize recent notes', 'Draft email to client', 'Analyze brand voice'].map((cmd, i) => (
            <button
              key={i}
              onClick={() => { onExecute(cmd); onClose(); }}
              className="w-full text-left px-3 py-2 flex items-center justify-between text-amber-500 hover:bg-amber-950/30 border-l-2 border-transparent hover:border-amber-700 transition-all group text-xs tracking-wide"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                {cmd}
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-amber-600" />
            </button>
          ))}
        </div>

        <div className="bg-amber-950/20 p-2 border-t-2 border-amber-900/50 flex justify-between px-4">
          <span className="text-[10px] text-amber-800 tracking-wider">TACTICAL COMMAND v1.0</span>
          <div className="flex gap-2">
            <span className="text-[10px] bg-amber-950/50 text-amber-700 px-1.5 border border-amber-900 tracking-wider">ESC</span>
            <span className="text-[10px] text-amber-800">TO ABORT</span>
          </div>
        </div>
      </div>
    </div>
  );
};