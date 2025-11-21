import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Search, FileText, Plus, Save, MessageSquare, Network, LayoutGrid, Trash2, Archive, Tag as TagIcon } from 'lucide-react';
import { smartSearch } from '../services/geminiService';
import { storage } from '../utils/storage';
import { useToast } from './ui/Toast';
import { ConfirmDialog } from './ui/Modal';

export const MemoryOS: React.FC = () => {
  const toast = useToast();
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Load notes from storage on mount
  useEffect(() => {
    const savedNotes = storage.notes.get();
    if (savedNotes.length > 0) {
      // Convert lastModified strings back to Date objects
      const notesWithDates = savedNotes.map(note => ({
        ...note,
        lastModified: new Date(note.lastModified)
      }));
      setNotes(notesWithDates);
      if (notesWithDates.length > 0) {
        setActiveNoteId(notesWithDates[0].id);
      }
    } else {
      // Initialize with demo data only if storage is empty
      const demoNotes: Note[] = [
        { id: '1', title: 'Project Phoenix Ideas', content: '# Phoenix\n- Focus on scalability\n- React 18 is a must\n- Use Gemini for intelligence layer', tags: ['Work', 'Ideas'], lastModified: new Date(), linkedIds: ['2'] },
        { id: '2', title: 'Meeting Notes: Marketing', content: 'Key takeaways:\n1. Q4 Budget increased\n2. Focus on organic growth', tags: ['Work'], lastModified: new Date(), linkedIds: ['1'] },
        { id: '3', title: 'Personal Goals 2025', content: '- Run a marathon\n- Read 50 books', tags: ['Personal'], lastModified: new Date(), linkedIds: [] }
      ];
      setNotes(demoNotes);
      setActiveNoteId(demoNotes[0].id);
      storage.notes.save(demoNotes);
    }
  }, []);

  // Save notes to storage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      storage.notes.save(notes);
    }
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleSave = (content: string) => {
    if (activeNoteId) {
      setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content, lastModified: new Date() } : n));
    }
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      lastModified: new Date(),
      linkedIds: []
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setViewMode('list');
  };

  const handleAiSearch = async () => {
    if(!searchQuery) return;
    setIsSearching(true);
    try {
      const answer = await smartSearch(searchQuery, notes);
      setAiAnswer(answer);
    } catch (error) {
      toast.error('Failed to search notes. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }

  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      setNotes(notes.filter(n => n.id !== noteToDelete));
      toast.success('Note deleted successfully');

      // Reset active note if deleted
      if (activeNoteId === noteToDelete) {
        const remainingNotes = notes.filter(n => n.id !== noteToDelete);
        setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      }

      setNoteToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col font-mono">
      {/* Header / Toolbar */}
      <div className="flex justify-between items-center mb-6 h-12 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ KNOWLEDGE BASE ]</div>
          <h2 className="text-2xl font-bold text-amber-500 tracking-wide">MEMORY OS</h2>
        </div>
        <div className="flex gap-2 bg-black p-1 border-2 border-amber-900/50">
           <button
             onClick={() => setViewMode('list')}
             className={`p-2 transition-colors border-l-2 ${viewMode === 'list' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 hover:text-amber-400 border-transparent'}`}
             title="List View"
           >
             <LayoutGrid size={18} />
           </button>
           <button
             onClick={() => setViewMode('graph')}
             className={`p-2 transition-colors border-l-2 ${viewMode === 'graph' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 hover:text-amber-400 border-transparent'}`}
             title="Graph View"
           >
             <Network size={18} />
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Sidebar / Graph Container */}
        <div className={`flex flex-col border-r-2 border-amber-900/50 pr-6 transition-all duration-300 ${viewMode === 'graph' ? 'w-full' : 'w-1/3'}`}>

          {viewMode === 'list' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.2em]">[ ALL NOTES ]</div>
                <button onClick={createNote} className="p-1 hover:bg-amber-950/20 text-amber-500 border border-amber-900/50 hover:border-amber-700">
                  <Plus size={18} />
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="ASK YOUR SECOND BRAIN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  className="w-full bg-black border border-amber-900/50 py-2 pl-9 pr-4 text-xs text-amber-400 placeholder-amber-900 focus:border-amber-500 outline-none tracking-wide"
                />
                <Search className="w-4 h-4 text-amber-700 absolute left-3 top-2.5" />
                {searchQuery && (
                  <button onClick={handleAiSearch} className="absolute right-2 top-1.5 p-1 text-fuchsia-400 hover:text-fuchsia-300">
                    <MessageSquare size={14} />
                  </button>
                )}
              </div>

              {aiAnswer && (
                <div className="mb-4 p-3 bg-fuchsia-950/20 border border-fuchsia-900/50 text-xs text-fuchsia-100 animate-in fade-in slide-in-from-top-2">
                  <div className="font-bold text-fuchsia-400 mb-1 flex items-center gap-2 tracking-wider">
                    <SparkleIcon /> AI INSIGHT
                  </div>
                  {isSearching ? 'ANALYZING...' : aiAnswer}
                  <button onClick={() => setAiAnswer(null)} className="mt-2 text-[10px] text-fuchsia-400 underline block tracking-wider">CLEAR</button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto space-y-2">
                {notes.map(note => (
                  <div
                    key={note.id}
                    className={`group p-3 cursor-pointer transition-colors relative border-2 ${
                      activeNoteId === note.id ? 'bg-amber-950/20 border-amber-700' : 'bg-black border-amber-900/30 hover:border-amber-700/50'
                    }`}
                  >
                    {/* Corner brackets for active note */}
                    {activeNoteId === note.id && (
                      <>
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                      </>
                    )}
                    <div onClick={() => setActiveNoteId(note.id)}>
                      <div className="font-bold text-amber-500 truncate pr-8 text-sm tracking-wide">{note.title}</div>
                      <div className="text-[10px] text-amber-700 mt-1 flex justify-between items-center tracking-wide">
                        <span>{note.lastModified.toLocaleDateString().toUpperCase()}</span>
                        <span className="truncate max-w-[100px] opacity-70">{note.content.substring(0, 20)}...</span>
                      </div>
                      {note.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {note.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-950/20 border border-amber-900/50 text-[9px] text-amber-600 tracking-wider">
                              {tag.toUpperCase()}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="text-[9px] text-amber-700">+{note.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 hover:bg-amber-950/20 text-amber-800 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete note"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {viewMode === 'graph' && (
            <div className="flex-1 bg-black border-2 border-amber-900/50 relative overflow-hidden flex items-center justify-center">
               {/* Simplified CSS Graph Visualization */}
               <div className="relative w-full h-full">
                 <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#FFB800 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                 {notes.map((note, i) => {
                    // Simple manual positioning for demo
                    const top = 20 + (i * 20) + '%';
                    const left = 20 + (i * 25) + '%';
                    return (
                      <div
                        key={note.id}
                        className="absolute w-32 p-2 bg-black border-2 border-amber-700 shadow-xl cursor-pointer hover:scale-105 transition-transform group relative"
                        style={{top, left}}
                        onClick={() => { setActiveNoteId(note.id); setViewMode('list'); }}
                      >
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>

                        <div className="w-1.5 h-1.5 bg-amber-500 absolute -top-1 -left-1"></div>
                        <div className="text-[10px] font-bold text-amber-500 truncate tracking-wide">{note.title}</div>
                        {/* Fake connection lines would go here in a real canvas implementation */}
                      </div>
                    )
                 })}
                 <div className="absolute bottom-4 right-4 text-[10px] text-amber-700 bg-black px-2 py-1 border border-amber-900/50 tracking-wider">
                   GRAPH VIEW (PREVIEW)
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Editor */}
        {viewMode === 'list' && (
          <div className="flex-1 flex flex-col bg-black border-2 border-amber-900/50 overflow-hidden animate-in fade-in duration-300 relative">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500 z-10"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500 z-10"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500 z-10"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500 z-10"></div>

            {activeNote ? (
              <>
                <div className="p-4 border-b-2 border-amber-900/50 bg-black">
                  <div className="flex justify-between items-center mb-3">
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => setNotes(notes.map(n => n.id === activeNoteId ? { ...n, title: e.target.value, lastModified: new Date() } : n))}
                      className="bg-transparent text-lg font-bold text-amber-500 outline-none w-full tracking-wide"
                      placeholder="UNTITLED NOTE"
                    />
                    <div className="flex gap-2 text-amber-700">
                      <Save size={18} className="hover:text-amber-500 cursor-pointer" />
                    </div>
                  </div>

                  {/* Tag Management */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeNote.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-amber-950/20 border border-amber-900/50 text-[10px] text-amber-600 tracking-wider"
                      >
                        <TagIcon size={10} />
                        {tag.toUpperCase()}
                        <button
                          onClick={() => {
                            const updatedTags = activeNote.tags.filter((_, i) => i !== idx);
                            setNotes(notes.map(n => n.id === activeNoteId ? { ...n, tags: updatedTags, lastModified: new Date() } : n));
                            toast.success('Tag removed');
                          }}
                          className="ml-1 hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTag.trim()) {
                          e.preventDefault();
                          if (!activeNote.tags.includes(newTag.trim())) {
                            setNotes(notes.map(n => n.id === activeNoteId ? { ...n, tags: [...n.tags, newTag.trim()], lastModified: new Date() } : n));
                            toast.success('Tag added');
                            setNewTag('');
                          } else {
                            toast.warning('Tag already exists');
                            setNewTag('');
                          }
                        }
                      }}
                      placeholder="ADD TAG..."
                      className="flex-1 min-w-[100px] bg-black border border-amber-900/50 px-2 py-1 text-[10px] text-amber-400 placeholder-amber-900 outline-none focus:border-amber-500 tracking-wider"
                    />
                  </div>
                </div>
                <textarea
                  className="flex-1 w-full bg-black p-6 text-amber-400 resize-none outline-none font-mono text-xs leading-relaxed tracking-wide"
                  value={activeNote.content}
                  onChange={(e) => handleSave(e.target.value)}
                  placeholder="START WRITING..."
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-amber-700 flex-col gap-4">
                <FileText size={48} />
                <p className="tracking-wider text-xs">SELECT OR CREATE A NOTE</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Note Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setNoteToDelete(null);
        }}
        onConfirm={confirmDeleteNote}
        title="Delete Note?"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962l6.135-1.583A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0l1.583 6.135a2 2 0 0 0 1.437 1.437l6.135 1.583a.5.5 0 0 1 0 .962l-6.135 1.583a2 2 0 0 0-1.437 1.437l-1.583 6.135a.5.5 0 0 1-.962 0z"/>
  </svg>
);