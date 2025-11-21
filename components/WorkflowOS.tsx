
import React, { useState, useEffect } from 'react';
import { Workflow, WorkflowStep } from '../types';
import { generateWorkflow } from '../services/geminiService';
import { useToast } from './ui/Toast';
import {
  GitBranch,
  PlayCircle,
  PauseCircle,
  Plus,
  Zap,
  Clock,
  Mail,
  CheckSquare,
  ArrowDown,
  MoreVertical,
  Sparkles,
  Trash2
} from 'lucide-react';

export const WorkflowOS: React.FC = () => {
  const toast = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load workflows from storage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('infigenie_workflows');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.workflows && Array.isArray(parsed.workflows)) {
          setWorkflows(parsed.workflows);
          if (parsed.workflows.length > 0) {
            setSelectedWorkflowId(parsed.workflows[0].id);
          }
        }
      }

      // Initialize with demo data if empty
      if (!savedData || (savedData && JSON.parse(savedData).workflows?.length === 0)) {
        const demoWorkflows: Workflow[] = [
          {
            id: '1',
            name: 'Morning Briefing',
            description: 'Compile tasks and weather into a daily summary.',
            isActive: true,
            lastRun: 'Today, 8:00 AM',
            steps: [
              { id: 's1', type: 'Trigger', label: 'Every Day at 8:00 AM', icon: 'Clock', config: { time: '08:00' } },
              { id: 's2', type: 'Action', label: 'Generate Daily Brief', icon: 'Zap', config: { model: 'Gemini' } },
              { id: 's3', type: 'Action', label: 'Send Notification', icon: 'Mail', config: { to: 'me' } },
            ]
          },
          {
            id: '2',
            name: 'Task Logger',
            description: 'Log completed high-priority tasks to MemoryOS.',
            isActive: false,
            steps: [
              { id: 's1', type: 'Trigger', label: 'Task Completed', icon: 'CheckSquare', config: { filter: 'High Priority' } },
              { id: 's2', type: 'Action', label: 'Create Note in Memory', icon: 'Zap', config: { folder: 'Archive' } },
            ]
          }
        ];
        setWorkflows(demoWorkflows);
        setSelectedWorkflowId(demoWorkflows[0].id);
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  }, []);

  // Save workflows to storage whenever they change
  useEffect(() => {
    if (workflows.length > 0) {
      try {
        const workflowData = {
          workflows,
          lastModified: new Date().toISOString()
        };
        localStorage.setItem('infigenie_workflows', JSON.stringify(workflowData));
      } catch (error) {
        console.error('Failed to save workflows:', error);
      }
    }
  }, [workflows]);

  const activeWorkflow = workflows.find(w => w.id === selectedWorkflowId);

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(w => {
      if (w.id === id) {
        const newStatus = !w.isActive;
        toast.success(`Workflow ${newStatus ? 'activated' : 'deactivated'}`);
        return { ...w, isActive: newStatus };
      }
      return w;
    }));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const newWorkflowData = await generateWorkflow(prompt);

      if (newWorkflowData.name) {
        const newWorkflow: Workflow = {
          id: Date.now().toString(),
          name: newWorkflowData.name || 'Untitled Workflow',
          description: newWorkflowData.description || 'AI Generated',
          isActive: false,
          steps: newWorkflowData.steps || []
        };
        setWorkflows([newWorkflow, ...workflows]);
        setSelectedWorkflowId(newWorkflow.id);
        setPrompt('');
        toast.success('Workflow generated successfully!');
      } else {
        toast.error('Failed to generate workflow');
      }
    } catch (error) {
      toast.error('Failed to generate workflow. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Clock': return <Clock size={18} />;
      case 'Mail': return <Mail size={18} />;
      case 'CheckSquare': return <CheckSquare size={18} />;
      case 'Zap': return <Zap size={18} />;
      default: return <Zap size={18} />;
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="flex justify-between items-center mb-6 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ AUTOMATION CONTROL ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">WORKFLOW OS</h2>
          <p className="text-amber-700 text-sm tracking-wide">INTELLIGENT TASK ORCHESTRATION</p>
        </div>
        <div className="bg-black px-4 py-2 border-2 border-emerald-900/50 flex items-center gap-2">
           <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-[10px] font-bold tracking-wider">SYSTEM ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        
        {/* Sidebar List */}
        <div className="flex flex-col gap-4 h-full overflow-hidden">
           {/* AI Creator */}
           <div className="bg-fuchsia-950/20 border-2 border-fuchsia-900/50 p-5 relative">
             <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-fuchsia-500"></div>
             <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-fuchsia-500"></div>
             <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-fuchsia-500"></div>
             <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-fuchsia-500"></div>

             <h3 className="font-bold text-fuchsia-400 mb-3 flex items-center gap-2 tracking-wider">
               <Sparkles size={16} /> AI WORKFLOW BUILDER
             </h3>
             <textarea
               placeholder="DESCRIBE AUTOMATION (E.G., 'WHEN INVOICE EMAIL, SAVE TO FINANCEOA')"
               className="w-full bg-black border border-fuchsia-900/50 p-3 text-xs text-fuchsia-300 placeholder-fuchsia-900 outline-none focus:border-fuchsia-500 resize-none h-20 mb-3 tracking-wide"
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
             />
             <button
               onClick={handleGenerate}
               disabled={isGenerating}
               className="w-full bg-fuchsia-950/30 hover:bg-fuchsia-950/50 text-fuchsia-300 py-2 border border-fuchsia-900/50 text-[10px] font-bold tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
             >
               {isGenerating ? 'GENERATING...' : 'GENERATE AUTOMATION'}
             </button>
           </div>

           {/* List */}
           <div className="flex-1 bg-black border-2 border-amber-900/50 overflow-hidden flex flex-col relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>

              <div className="p-4 border-b-2 border-amber-900/50 flex justify-between items-center">
                <h3 className="font-bold text-amber-500 tracking-wider">MY WORKFLOWS</h3>
                <button className="p-1 hover:bg-amber-950/20 text-amber-700 hover:text-amber-400 transition-colors"><Plus size={16} /></button>
              </div>
              <div className="overflow-y-auto p-2 space-y-2">
                {workflows.map(workflow => (
                  <div
                    key={workflow.id}
                    onClick={() => setSelectedWorkflowId(workflow.id)}
                    className={`p-3 cursor-pointer transition-all border-l-2 group ${
                      selectedWorkflowId === workflow.id
                        ? 'bg-amber-950/30 border-l-amber-500'
                        : 'bg-transparent border-l-transparent hover:bg-amber-950/10 hover:border-l-amber-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-semibold text-sm tracking-wide ${selectedWorkflowId === workflow.id ? 'text-amber-500' : 'text-amber-700'}`}>
                        {workflow.name}
                      </h4>
                      <div onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleWorkflow(workflow.id)}
                          className={`transition-colors ${workflow.isActive ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-800 hover:text-amber-600'}`}
                        >
                          {workflow.isActive ? <PlayCircle size={18} /> : <PauseCircle size={18} />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-amber-800 line-clamp-2 tracking-wide">{workflow.description}</p>
                    {workflow.isActive && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400 tracking-wider">
                         <div className="w-1 h-1 bg-emerald-500"></div> ACTIVE
                      </div>
                    )}
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Builder Canvas */}
        <div className="lg:col-span-2 bg-black border-2 border-amber-900/50 overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

          {activeWorkflow ? (
            <>
              <div className="p-6 border-b-2 border-amber-900/50 bg-amber-950/10 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-amber-500 mb-1 tracking-wide">{activeWorkflow.name.toUpperCase()}</h2>
                  <p className="text-amber-700 text-sm tracking-wide">{activeWorkflow.description}</p>
                  {activeWorkflow.lastRun && (
                    <p className="text-[10px] text-amber-800 mt-2 tracking-wider">LAST RUN: {activeWorkflow.lastRun.toUpperCase()}</p>
                  )}
                </div>
                <div className="flex gap-2">
                   <button
                     onClick={() => toggleWorkflow(activeWorkflow.id)}
                     className={`px-4 py-2 text-xs font-bold tracking-wider flex items-center gap-2 transition-colors border-2 ${
                       activeWorkflow.isActive
                         ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50 hover:bg-emerald-950/30'
                         : 'bg-black text-amber-700 border-amber-900/50 hover:text-amber-500'
                     }`}
                   >
                     {activeWorkflow.isActive ? 'ACTIVE' : 'INACTIVE'}
                   </button>
                   <button className="p-2 bg-black border-2 border-amber-900/50 hover:bg-rose-950/30 hover:border-rose-700 hover:text-rose-400 text-amber-700 transition-colors">
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 relative">
                {/* Canvas Grid Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#FFB800 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

                <div className="max-w-xl mx-auto relative z-10 pb-10">
                  {activeWorkflow.steps.map((step, index) => (
                    <div key={step.id} className="relative">
                      {/* Connection Line */}
                      {index < activeWorkflow.steps.length - 1 && (
                        <div className="absolute left-8 top-12 bottom-[-24px] w-0.5 bg-amber-900/50"></div>
                      )}

                      <div className="flex gap-4 items-start mb-6">
                        {/* Icon Circle */}
                        <div className={`w-16 h-16 flex items-center justify-center flex-shrink-0 border-2 shadow-xl z-10 relative ${
                          step.type === 'Trigger' ? 'bg-black border-amber-500 text-amber-500' :
                          step.type === 'Logic' ? 'bg-black border-fuchsia-500 text-fuchsia-500' :
                          'bg-black border-emerald-500 text-emerald-500'
                        }`}>
                          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-amber-400"></div>
                          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-amber-400"></div>
                          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-amber-400"></div>
                          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-amber-400"></div>
                          {renderIcon(step.icon)}
                        </div>

                        {/* Config Card */}
                        <div className="flex-1 bg-black border-2 border-amber-900/50 p-4 hover:border-amber-700 transition-colors relative">
                          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>

                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                step.type === 'Trigger' ? 'text-amber-500' :
                                step.type === 'Logic' ? 'text-fuchsia-500' :
                                'text-emerald-500'
                              }`}>
                                [ {step.type} ]
                              </span>
                              <h4 className="text-lg font-bold text-amber-500 tracking-wide">{step.label}</h4>
                            </div>
                            <button className="text-amber-700 hover:text-amber-400"><MoreVertical size={16} /></button>
                          </div>

                          {/* Configuration Key-Values */}
                          <div className="space-y-1">
                            {step.config && Object.entries(step.config).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2 text-sm">
                                <span className="text-amber-700 capitalize tracking-wide">{key}:</span>
                                <span className="text-amber-400 font-mono bg-amber-950/20 border border-amber-900/50 px-1.5 py-0.5 text-xs">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {index < activeWorkflow.steps.length - 1 && (
                        <div className="flex justify-center w-16 mb-6">
                          <ArrowDown size={16} className="text-amber-700" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Step Button */}
                  <div className="flex gap-4 items-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer group">
                    <div className="w-16 flex justify-center">
                      <div className="w-8 h-8 border-2 border-dashed border-amber-800 flex items-center justify-center text-amber-800 group-hover:border-amber-500 group-hover:text-amber-500">
                        <Plus size={16} />
                      </div>
                    </div>
                    <span className="text-sm text-amber-800 group-hover:text-amber-500 font-bold tracking-wider">ADD STEP</span>
                  </div>

                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-amber-700">
              <GitBranch size={64} className="mb-4 opacity-20" />
              <p className="tracking-wide">SELECT OR GENERATE A WORKFLOW TO BEGIN AUTOMATING.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
