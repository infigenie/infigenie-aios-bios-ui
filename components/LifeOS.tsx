import React, { useState, useEffect } from 'react';
import { Task, Habit, CalendarEvent, SubTask, Goal } from '../types';
import {
  Plus,
  CheckCircle2,
  Circle,
  Sparkles,
  Calendar as CalendarIcon,
  ListTodo,
  Activity,
  Flame,
  ChevronDown,
  ChevronRight,
  Copy,
  RefreshCw,
  Repeat,
  Flag,
  Target,
  Trophy,
  Rocket,
  ArrowRight,
  Edit2,
  Trash2
} from 'lucide-react';
import { suggestTasksFromGoal, suggestHabitsForGoal, suggestSubtasksForTask, suggestMilestonesForGoal } from '../services/geminiService';
import { storage } from '../utils/storage';
import { useToast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/Modal';
import { TaskEditModal } from './LifeOS/TaskEditModal';

type Tab = 'tasks' | 'habits' | 'calendar' | 'goals';

const TEMPLATES = [
  { title: 'Weekly Review', subtasks: ['Clear Inbox', 'Review Calendar', 'Update Goals', 'Plan Next Week'], tags: ['Productivity'] },
  { title: 'Grocery List', subtasks: ['Milk', 'Eggs', 'Vegetables', 'Fruits'], tags: ['Personal'] },
  { title: 'Project Kickoff', subtasks: ['Define Scope', 'Assign Roles', 'Set Timeline', 'Schedule Kickoff Meeting'], tags: ['Work'] },
];

export const LifeOS: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  // Task State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('Medium');
  const [newTaskRecurrence, setNewTaskRecurrence] = useState<Task['recurrence']>('None');

  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Edit/Delete State
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Habit State
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitFocus, setHabitFocus] = useState('');
  const [isGeneratingHabits, setIsGeneratingHabits] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [isDeleteHabitDialogOpen, setIsDeleteHabitDialogOpen] = useState(false);

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isGoogleSynced, setIsGoogleSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Goal State
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [isGeneratingMilestones, setIsGeneratingMilestones] = useState(false);
  const [isGeneratingMilestonesForId, setIsGeneratingMilestonesForId] = useState<string | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [isDeleteGoalDialogOpen, setIsDeleteGoalDialogOpen] = useState(false);

  // Load tasks from storage on mount
  useEffect(() => {
    const savedTasks = storage.tasks.get();
    if (savedTasks.length > 0) {
      setTasks(savedTasks);
    } else {
      // Initialize with demo data only if storage is empty
      const demoTasks: Task[] = [
        { id: '1', title: 'Review quarterly goals', completed: false, priority: 'High', recurrence: 'None', tags: ['Strategy'], dueDate: '2025-11-25', subtasks: [{id: 's1', title: 'Check Q3 metrics', completed: true}, {id: 's2', title: 'Draft Q4 objectives', completed: false}] },
        { id: '2', title: 'Email marketing draft', completed: true, priority: 'Medium', recurrence: 'None', tags: ['Marketing'], dueDate: '2025-11-20' },
        { id: '3', title: 'Schedule dentist appointment', completed: false, priority: 'Low', recurrence: 'None', tags: ['Personal'] },
      ];
      setTasks(demoTasks);
      storage.tasks.save(demoTasks);
    }
  }, []);

  // Save tasks to storage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      storage.tasks.save(tasks);
    }
  }, [tasks]);

  // Load habits from storage on mount
  useEffect(() => {
    const savedHabits = storage.habits.get();
    if (savedHabits.length > 0) {
      setHabits(savedHabits);
    } else {
      // Initialize with demo data only if storage is empty
      const demoHabits: Habit[] = [
        { id: '1', name: 'Morning Meditation', streak: 5, completedToday: true, frequency: 'Daily' },
        { id: '2', name: 'Read 30 mins', streak: 12, completedToday: false, frequency: 'Daily' },
        { id: '3', name: 'Zero Inbox', streak: 2, completedToday: false, frequency: 'Daily' },
      ];
      setHabits(demoHabits);
      storage.habits.save(demoHabits);
    }
  }, []);

  // Save habits to storage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      storage.habits.save(habits);
    }
  }, [habits]);

  // Load goals from storage on mount
  useEffect(() => {
    const savedGoals = storage.goals.get();
    if (savedGoals.length > 0) {
      setGoals(savedGoals);
    } else {
      // Initialize with demo data only if storage is empty
      const demoGoals: Goal[] = [
        { id: 'g1', title: 'Launch MVP', deadline: '2025-12-31', progress: 75, status: 'On Track', milestones: [{id: 'm1', title: 'Design System', completed: true}, {id: 'm2', title: 'Core Features', completed: true}, {id: 'm3', title: 'User Testing', completed: false}] },
        { id: 'g2', title: 'Run a Marathon', deadline: '2026-04-15', progress: 20, status: 'At Risk', milestones: [{id: 'm1', title: 'Buy Shoes', completed: true}, {id: 'm2', title: 'Run 5k', completed: false}] }
      ];
      setGoals(demoGoals);
      storage.goals.save(demoGoals);
    }
  }, []);

  // Save goals to storage whenever they change
  useEffect(() => {
    if (goals.length > 0) {
      storage.goals.save(goals);
    }
  }, [goals]);

  // Load calendar events from storage on mount
  useEffect(() => {
    const savedEvents = storage.calendarEvents.get();
    if (savedEvents.length > 0) {
      setCalendarEvents(savedEvents);
    } else {
      // Initialize with demo data only if storage is empty
      const demoEvents: CalendarEvent[] = [
        { id: 'e1', title: 'Q4 Planning', date: '2025-11-20', type: 'Meeting', source: 'Local' },
        { id: 'e2', title: 'Dentist', date: '2025-11-25', type: 'Task', source: 'Local' }
      ];
      setCalendarEvents(demoEvents);
      storage.calendarEvents.save(demoEvents);
    }
  }, []);

  // Save calendar events to storage whenever they change
  useEffect(() => {
    if (calendarEvents.length > 0) {
      storage.calendarEvents.save(calendarEvents);
    }
  }, [calendarEvents]);

  // --- Task Handlers ---
  const addTask = () => {
    if (!newTaskInput.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTaskInput,
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDate || undefined,
      recurrence: newTaskRecurrence,
      tags: [],
      subtasks: []
    };
    setTasks([task, ...tasks]);
    setNewTaskInput('');
    setNewTaskDate('');
    setNewTaskPriority('Medium');
    setNewTaskRecurrence('None');
    toast.success('Task created successfully!');
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (task) {
      toast.success(task.completed ? 'Task unmarked' : 'Task completed!');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    toast.success('Task updated successfully!');
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(t => t.id !== taskToDelete));
      toast.success('Task deleted successfully');
      setTaskToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsEditModalOpen(true);
  };

  const toggleTaskExpansion = (id: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedTasks(newExpanded);
  };

  const handleMagicDecompose = async () => {
    if (!newTaskInput.trim()) return;
    setIsGeneratingTasks(true);
    try {
      const suggestions = await suggestTasksFromGoal(newTaskInput);
      const newTasks: Task[] = suggestions.map((s, idx) => ({
        id: Date.now().toString() + idx,
        title: s.title,
        completed: false,
        priority: s.priority,
        recurrence: 'None',
        tags: ['AI-Generated'],
        subtasks: []
      }));
      setTasks([...newTasks, ...tasks]);
      setNewTaskInput('');
      toast.success(`Created ${newTasks.length} tasks from your goal!`);
    } catch (error) {
      toast.error('Failed to generate tasks. Please try again.');
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    const task: Task = {
      id: Date.now().toString(),
      title: template.title,
      completed: false,
      priority: 'Medium',
      recurrence: 'None',
      tags: template.tags,
      subtasks: template.subtasks.map((st, i) => ({ id: `st-${Date.now()}-${i}`, title: st, completed: false }))
    };
    setTasks([task, ...tasks]);
    setShowTemplates(false);
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newSubtask: SubTask = { id: `st-${Date.now()}`, title, completed: false };
        return { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
      }
      return t;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        };
      }
      return t;
    }));
  };

  const handleAiSubtasks = async (taskId: string, taskTitle: string) => {
    try {
      const suggestions = await suggestSubtasksForTask(taskTitle);
      if (suggestions.length > 0) {
        setTasks(tasks.map(t => {
          if (t.id === taskId) {
            const newSubtasks = suggestions.map((s, i) => ({ id: `ai-st-${Date.now()}-${i}`, title: s, completed: false }));
            return { ...t, subtasks: [...(t.subtasks || []), ...newSubtasks] };
          }
          return t;
        }));
        if (!expandedTasks.has(taskId)) toggleTaskExpansion(taskId);
        toast.success(`Added ${suggestions.length} AI-suggested subtasks!`);
      } else {
        toast.info('No subtask suggestions available for this task.');
      }
    } catch (error) {
      toast.error('Failed to generate subtasks. Please try again.');
    }
  };

  // --- Habit Handlers ---
  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const newCompleted = !h.completedToday;
        return {
          ...h,
          completedToday: newCompleted,
          streak: newCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  const handleSuggestHabits = async () => {
    if (!habitFocus.trim()) return;
    setIsGeneratingHabits(true);
    try {
      const suggestions = await suggestHabitsForGoal(habitFocus);
      const newHabits: Habit[] = suggestions.map((s, idx) => ({
        id: 'ai-' + Date.now() + idx,
        name: s,
        streak: 0,
        completedToday: false,
        frequency: 'Daily'
      }));
      setHabits([...newHabits, ...habits]);
      setHabitFocus('');
      toast.success(`Added ${newHabits.length} AI-suggested habits!`);
    } catch (error) {
      toast.error('Failed to generate habits. Please try again.');
    } finally {
      setIsGeneratingHabits(false);
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabitToDelete(habitId);
    setIsDeleteHabitDialogOpen(true);
  };

  const confirmDeleteHabit = () => {
    if (habitToDelete) {
      setHabits(habits.filter(h => h.id !== habitToDelete));
      toast.success('Habit deleted successfully');
      setHabitToDelete(null);
      setIsDeleteHabitDialogOpen(false);
    }
  };

  // --- Calendar Handlers ---
  const syncGoogleCalendar = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsGoogleSynced(true);
      const googleEvents: CalendarEvent[] = [
        { id: 'g1', title: 'Client Call', date: '2025-11-21', type: 'Meeting', source: 'Google' },
        { id: 'g2', title: 'Deep Work Block', date: '2025-11-22', type: 'Task', source: 'Google' },
        { id: 'g3', title: 'Team Sync', date: '2025-11-24', type: 'Meeting', source: 'Google' },
      ];
      setCalendarEvents([...calendarEvents, ...googleEvents]);
      setIsSyncing(false);
    }, 1500);
  };

  // --- Goal Handlers ---
  const addGoal = async () => {
    if (!newGoalTitle) return;
    setIsGeneratingMilestones(true);

    try {
      // Create basic goal first
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: newGoalTitle,
        deadline: '2025-12-31', // default
        progress: 0,
        status: 'On Track',
        milestones: []
      };

      // Fetch AI milestones
      const milestones = await suggestMilestonesForGoal(newGoalTitle);
      newGoal.milestones = milestones.map((m, i) => ({ id: `gm-${i}`, title: m, completed: false }));

      setGoals([newGoal, ...goals]);
      setNewGoalTitle('');
      toast.success('Goal created with AI-generated milestones!');
    } catch (error) {
      toast.error('Failed to create goal. Please try again.');
    } finally {
      setIsGeneratingMilestones(false);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoalToDelete(goalId);
    setIsDeleteGoalDialogOpen(true);
  };

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      setGoals(goals.filter(g => g.id !== goalToDelete));
      toast.success('Goal deleted successfully');
      setGoalToDelete(null);
      setIsDeleteGoalDialogOpen(false);
    }
  };

  const handleSuggestMilestones = async (goalId: string, goalTitle: string) => {
    setIsGeneratingMilestonesForId(goalId);
    try {
      const newMilestones = await suggestMilestonesForGoal(goalTitle);

      setGoals(goals.map(g => {
        if (g.id === goalId) {
           const addedMilestones = newMilestones.map((m, i) => ({
             id: `gm-${Date.now()}-${i}`,
             title: m,
             completed: false
           }));
           const allMilestones = [...g.milestones, ...addedMilestones];
           // Recalculate progress
           const completedCount = allMilestones.filter(m => m.completed).length;
           const progress = Math.round((completedCount / allMilestones.length) * 100);
           return { ...g, milestones: allMilestones, progress };
        }
        return g;
      }));
      toast.success(`Added ${newMilestones.length} milestones to goal!`);
    } catch (error) {
      toast.error('Failed to generate milestones. Please try again.');
    } finally {
      setIsGeneratingMilestonesForId(null);
    }
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        const updatedMilestones = g.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        return { ...g, milestones: updatedMilestones, progress };
      }
      return g;
    }));
  };

  const handleDecomposeGoalToTasks = async (goalTitle: string) => {
    setIsGeneratingTasks(true);
    const suggestions = await suggestTasksFromGoal(goalTitle);
    const newTasks: Task[] = suggestions.map((s, idx) => ({
      id: Date.now().toString() + idx,
      title: s.title,
      completed: false,
      priority: s.priority,
      recurrence: 'None',
      tags: ['Goal-Derived'],
      subtasks: []
    }));
    setTasks(prev => [...newTasks, ...prev]);
    setIsGeneratingTasks(false);
    setActiveTab('tasks');
  };

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="flex items-center justify-between mb-6 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest mb-1">[ PERSONAL OPERATIONS ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">LIFE OS</h2>
          <p className="text-amber-700 text-sm tracking-wide">ENERGY MANAGEMENT SYSTEM</p>
        </div>
        <div className="flex bg-black p-1 border-2 border-amber-900/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 text-[10px] font-bold tracking-wider transition-all flex items-center gap-2 whitespace-nowrap border-l-2 ${activeTab === 'tasks' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 hover:text-amber-400 border-transparent'}`}
          >
            <ListTodo size={14} /> TASKS
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2 text-[10px] font-bold tracking-wider transition-all flex items-center gap-2 whitespace-nowrap border-l-2 ${activeTab === 'goals' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 hover:text-amber-400 border-transparent'}`}
          >
            <Target size={14} /> GOALS
          </button>
          <button
            onClick={() => setActiveTab('habits')}
            className={`px-4 py-2 text-[10px] font-bold tracking-wider transition-all flex items-center gap-2 whitespace-nowrap border-l-2 ${activeTab === 'habits' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 hover:text-amber-400 border-transparent'}`}
          >
            <Activity size={14} /> HABITS
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 text-[10px] font-bold tracking-wider transition-all flex items-center gap-2 whitespace-nowrap border-l-2 ${activeTab === 'calendar' ? 'bg-amber-950/30 text-amber-500 border-amber-500' : 'text-amber-700 hover:text-amber-400 border-transparent'}`}
          >
            <CalendarIcon size={14} /> CALENDAR
          </button>
        </div>
      </div>

      {/* TASKS VIEW */}
      {activeTab === 'tasks' && (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-black p-4 border-2 border-amber-900/50 mb-6 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>
            <div className="flex flex-col gap-3">
              {/* Input Row */}
              <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="ADD NEW TASK OR GOAL TO DECOMPOSE..."
                  className="flex-1 min-w-[200px] bg-black border border-amber-900/50 px-4 py-2 text-amber-400 text-sm placeholder-amber-900 focus:border-amber-500 outline-none tracking-wide"
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />

                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="bg-black border border-amber-900/50 px-3 py-2 text-amber-600 text-[10px] outline-none focus:border-amber-500 [color-scheme:dark]"
                    title="Due Date"
                  />

                  <div className="relative group">
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      className="appearance-none bg-black border border-amber-900/50 pl-8 pr-4 py-2 text-amber-600 text-[10px] outline-none focus:border-amber-500 cursor-pointer tracking-wide"
                    >
                      <option value="Low">LOW</option>
                      <option value="Medium">MEDIUM</option>
                      <option value="High">HIGH</option>
                      <option value="Urgent">URGENT</option>
                    </select>
                    <Flag size={14} className="absolute left-2.5 top-3 text-amber-700 pointer-events-none" />
                  </div>

                  <div className="relative group">
                     <select
                      value={newTaskRecurrence}
                      onChange={(e) => setNewTaskRecurrence(e.target.value as any)}
                      className="appearance-none bg-black border border-amber-900/50 pl-8 pr-4 py-2 text-amber-600 text-[10px] outline-none focus:border-amber-500 cursor-pointer tracking-wide"
                    >
                      <option value="None">NO REPEAT</option>
                      <option value="Daily">DAILY</option>
                      <option value="Weekly">WEEKLY</option>
                      <option value="Monthly">MONTHLY</option>
                    </select>
                    <Repeat size={14} className="absolute left-2.5 top-3 text-amber-700 pointer-events-none" />
                  </div>
                </div>

                <button
                  onClick={addTask}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 font-bold transition-all border-2 border-amber-400"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              {/* Tools Row */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={handleMagicDecompose}
                  disabled={isGeneratingTasks}
                  className="bg-fuchsia-950/30 hover:bg-fuchsia-950/50 text-fuchsia-300 border border-fuchsia-900/50 px-3 py-1.5 text-[10px] font-bold tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                  title="Use AI to break this goal into tasks"
                >
                  <Sparkles size={14} />
                  {isGeneratingTasks ? 'ANALYZING...' : 'AI DECOMPOSE'}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="bg-amber-950/20 hover:bg-amber-950/30 text-amber-600 border border-amber-900/50 px-3 py-1.5 text-[10px] font-bold tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Copy size={14} /> TEMPLATES
                  </button>

                  {showTemplates && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-black border-2 border-amber-700 shadow-xl z-10 overflow-hidden animate-in zoom-in-95 duration-100">
                      {TEMPLATES.map((t, i) => (
                        <button
                          key={i}
                          onClick={() => applyTemplate(t)}
                          className="w-full text-left px-4 py-3 hover:bg-amber-950/20 text-amber-400 text-xs flex flex-col gap-1 border-b border-amber-900/30 last:border-0"
                        >
                          <span className="font-bold tracking-wide">{t.title}</span>
                          <span className="text-[10px] text-amber-700 flex items-center gap-2 tracking-wide">
                             <span>{t.subtasks.length} SUBTASKS</span>
                             <span className="w-1 h-1 bg-amber-700"></span>
                             <span>{t.tags.join(', ').toUpperCase()}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`border-2 transition-all duration-200 flex flex-col group relative ${
                  task.completed
                    ? 'bg-black/30 border-amber-900/30'
                    : 'bg-black border-amber-900/50 hover:border-amber-700'
                }`}
              >
                {/* Corner brackets */}
                {!task.completed && (
                  <>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                  </>
                )}

                {/* Main Task Row */}
                <div className="p-4 flex items-start gap-4">
                  <button onClick={() => toggleTask(task.id)} className="mt-1 text-amber-700 hover:text-emerald-500 transition-colors">
                    {task.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-sm truncate tracking-wide ${task.completed ? 'line-through text-amber-900' : 'text-amber-400'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {task.recurrence && task.recurrence !== 'None' && (
                           <span className="text-[10px] text-amber-600 flex items-center gap-1 bg-amber-950/20 px-2 py-1 border border-amber-900/50 tracking-wider">
                             <Repeat size={10} /> {task.recurrence.toUpperCase()}
                           </span>
                        )}
                        {task.dueDate && (
                          <span className={`text-[10px] px-2 py-1 bg-black border flex items-center gap-1 tracking-wider ${new Date(task.dueDate) < new Date() && !task.completed ? 'text-rose-400 border-rose-800' : 'text-amber-600 border-amber-900/50'}`}>
                            <CalendarIcon size={10} />
                            {new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}).toUpperCase()}
                          </span>
                        )}
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-1.5 hover:bg-amber-950/20 text-amber-800 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Edit task"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 hover:bg-amber-950/20 text-amber-800 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete task"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => toggleTaskExpansion(task.id)}
                          className="p-1 hover:bg-amber-950/20 text-amber-700 hover:text-amber-500"
                        >
                          {expandedTasks.has(task.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar for Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="mt-2 w-full max-w-[200px] h-1 bg-amber-950/30 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${task.completed ? 'bg-emerald-600' : 'bg-amber-500'}`}
                          style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                        ></div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-2 items-center flex-wrap">
                      {task.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-amber-950/20 text-amber-600 border border-amber-900/50 tracking-wider">
                          {tag.toUpperCase()}
                        </span>
                      ))}
                      <span className={`text-[10px] px-2 py-0.5 font-bold flex items-center gap-1 tracking-wider ${
                        task.priority === 'High' ? 'bg-rose-950/30 text-rose-400 border border-rose-900/50' :
                        task.priority === 'Urgent' ? 'bg-purple-950/30 text-purple-400 border border-purple-900/50' :
                        task.priority === 'Low' ? 'bg-amber-950/20 text-amber-700 border border-amber-900/50' :
                        'bg-blue-950/30 text-blue-400 border border-blue-900/50'
                      }`}>
                        <Flag size={10} /> {task.priority.toUpperCase()}
                      </span>
                      {task.subtasks && task.subtasks.length > 0 && (
                         <span className="text-[10px] text-amber-700 ml-2 tracking-wider">
                           {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} SUBTASKS
                         </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtasks Section */}
                {expandedTasks.has(task.id) && (
                  <div className="px-4 pb-4 pl-12 animate-in slide-in-from-top-2">
                    <div className="space-y-2 mb-3 relative">
                      <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-amber-900/30"></div>
                      {task.subtasks?.map(sub => (
                        <div key={sub.id} className="flex items-center gap-3 group/sub">
                          <button
                            onClick={() => toggleSubtask(task.id, sub.id)}
                            className="text-amber-700 hover:text-emerald-500"
                          >
                            {sub.completed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Circle size={14} />}
                          </button>
                          <span className={`text-xs tracking-wide ${sub.completed ? 'line-through text-amber-900' : 'text-amber-500'}`}>
                            {sub.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ADD SUBTASK..."
                        className="flex-1 bg-black border border-amber-900/50 px-2 py-1 text-xs text-amber-400 placeholder-amber-900 outline-none focus:border-amber-500 tracking-wide"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addSubtask(task.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAiSubtasks(task.id, task.title)}
                        className="text-[10px] bg-fuchsia-950/30 text-fuchsia-300 px-2 border border-fuchsia-900/50 hover:bg-fuchsia-950/50 flex items-center gap-1 tracking-wider font-bold"
                        title="Suggest subtasks with AI"
                      >
                        <Sparkles size={12} /> AI
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GOALS VIEW */}
      {activeTab === 'goals' && (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-black p-6 border-2 border-amber-900/50 mb-6 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

             <div className="flex gap-4 items-end">
               <div className="flex-1">
                 <label className="text-[10px] font-bold text-amber-700 uppercase mb-2 block tracking-widest">[ NEW OBJECTIVE ]</label>
                 <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="DEFINE YOUR MISSION..."
                    className="w-full bg-black border border-amber-900/50 p-3 text-amber-400 text-sm placeholder-amber-900 outline-none focus:border-amber-500 tracking-wide"
                    onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                 />
               </div>
               <button
                 onClick={addGoal}
                 disabled={isGeneratingMilestones}
                 className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 font-bold text-sm tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50 border-2 border-amber-400"
               >
                 {isGeneratingMilestones ? <Sparkles className="animate-spin" size={20} /> : <Rocket size={20} />}
                 {isGeneratingMilestones ? 'DEPLOYING...' : 'LAUNCH'}
               </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2">
            {goals.map(goal => (
              <div key={goal.id} className="bg-black border-2 border-amber-900/50 p-6 relative overflow-hidden group hover:border-amber-700 transition-all flex flex-col">
                 {/* Corner brackets */}
                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
                 <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

                 <div className="flex justify-between items-start mb-4">
                   <div className="flex-1">
                     <h3 className="text-lg font-bold text-amber-500 tracking-wide">{goal.title}</h3>
                     <span className={`text-[10px] px-2 py-1 mt-2 inline-block border tracking-widest font-bold ${
                       goal.status === 'On Track' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900' :
                       goal.status === 'At Risk' ? 'bg-amber-950/30 text-amber-400 border-amber-900' :
                       'bg-rose-950/30 text-rose-400 border-rose-900'
                     }`}>
                       {goal.status.toUpperCase()}
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => handleDeleteGoal(goal.id)}
                       className="p-2 hover:bg-amber-950/20 text-amber-800 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                       title="Delete goal"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                   <div className="text-right">
                     <div className="text-2xl font-bold text-amber-500">{goal.progress}%</div>
                     <div className="text-[10px] text-amber-700 tracking-wider">COMPLETE</div>
                   </div>
                 </div>

                 <div className="w-full h-1.5 bg-amber-950/30 overflow-hidden mb-6">
                   <div className="h-full bg-amber-500 transition-all duration-500" style={{width: `${goal.progress}%`}}></div>
                 </div>

                 <div className="space-y-3 flex-1">
                   <div className="flex justify-between items-center">
                     <h4 className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Trophy size={14} /> MILESTONES
                     </h4>
                     <button
                        onClick={(e) => { e.stopPropagation(); handleSuggestMilestones(goal.id, goal.title); }}
                        className="text-[10px] text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 tracking-wider font-bold"
                        disabled={isGeneratingMilestonesForId === goal.id}
                      >
                        {isGeneratingMilestonesForId === goal.id ? <Sparkles size={12} className="animate-spin"/> : <Sparkles size={12} />}
                        AI
                     </button>
                   </div>

                   {goal.milestones.map(milestone => (
                     <div
                       key={milestone.id}
                       onClick={() => toggleMilestone(goal.id, milestone.id)}
                       className="flex items-center gap-3 cursor-pointer group/m"
                     >
                       <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                         milestone.completed
                           ? 'bg-emerald-500 border-emerald-500 text-black'
                           : 'border-amber-700 hover:border-emerald-500'
                       }`}>
                         {milestone.completed && <CheckCircle2 size={14} />}
                       </div>
                       <span className={`text-xs transition-colors tracking-wide ${milestone.completed ? 'text-amber-800 line-through' : 'text-amber-500 group-hover/m:text-amber-400'}`}>
                         {milestone.title}
                       </span>
                     </div>
                   ))}
                 </div>

                 <button
                  onClick={(e) => { e.stopPropagation(); handleDecomposeGoalToTasks(goal.title); }}
                  className="mt-4 w-full text-[10px] bg-fuchsia-950/30 hover:bg-fuchsia-950/50 text-fuchsia-300 py-2 border border-fuchsia-900/50 flex items-center justify-center gap-2 transition-colors group/btn font-bold tracking-wider"
                >
                  <Sparkles size={14} className="group-hover/btn:text-fuchsia-200 transition-colors" />
                  <span className="group-hover/btn:text-fuchsia-200 transition-colors">GENERATE TASKS</span>
                  <ArrowRight size={12} className="opacity-0 group-hover/btn:opacity-100 transition-opacity -ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HABITS VIEW */}
      {activeTab === 'habits' && (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <div className="col-span-2 flex flex-col">
               <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                 {habits.map(habit => (
                   <div key={habit.id} className="bg-black border-2 border-amber-900/50 p-4 flex items-center justify-between group hover:border-amber-700 transition-colors relative">
                     {/* Corner brackets */}
                     <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                     <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                     <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                     <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>

                     <div className="flex items-center gap-4 flex-1">
                       <button
                         onClick={() => toggleHabit(habit.id)}
                         className={`w-8 h-8 flex items-center justify-center transition-all border-2 ${
                           habit.completedToday
                           ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                           : 'bg-black text-amber-700 border-amber-900/50 hover:border-amber-700'
                         }`}
                       >
                         {habit.completedToday && <CheckCircle2 size={20} />}
                       </button>
                       <div className="flex-1">
                         <h3 className="text-sm font-bold text-amber-500 tracking-wide">{habit.name}</h3>
                         <p className="text-[10px] text-amber-700 tracking-wider">{habit.frequency.toUpperCase()}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="flex items-center gap-2 bg-amber-950/20 px-3 py-1.5 border border-amber-900/50">
                         <Flame className={`w-4 h-4 ${habit.streak > 3 ? 'text-orange-500 fill-orange-500' : 'text-amber-700'}`} />
                         <span className="font-mono font-bold text-amber-500 text-sm">{habit.streak}</span>
                       </div>
                       <button
                         onClick={() => handleDeleteHabit(habit.id)}
                         className="p-2 hover:bg-amber-950/20 text-amber-800 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                         title="Delete habit"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="col-span-1 bg-black border-2 border-amber-900/50 p-6 relative">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

              <h3 className="font-bold text-amber-500 mb-4 flex items-center gap-2 tracking-wide">
                <Sparkles size={16} className="text-fuchsia-400" /> AI HABIT COACH
              </h3>
              <p className="text-xs text-amber-600 mb-4 tracking-wide">
                Define your objective and I'll generate daily habits to achieve it.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="E.G., 'BETTER SLEEP', 'LEARN PYTHON'"
                  className="w-full bg-black border border-amber-900/50 p-3 text-xs text-amber-400 placeholder-amber-900 focus:border-amber-500 outline-none tracking-wide"
                  value={habitFocus}
                  onChange={(e) => setHabitFocus(e.target.value)}
                />
                <button
                  onClick={handleSuggestHabits}
                  disabled={isGeneratingHabits}
                  className="w-full bg-fuchsia-950/30 hover:bg-fuchsia-950/50 text-fuchsia-300 py-2 border border-fuchsia-900/50 font-bold text-[10px] tracking-widest transition-colors disabled:opacity-50"
                >
                  {isGeneratingHabits ? 'ANALYZING...' : 'GENERATE HABITS'}
                </button>
              </div>

              <div className="mt-8 pt-8 border-t-2 border-amber-900/50">
                <div className="text-[10px] font-bold text-amber-700 uppercase mb-2 tracking-[0.2em]">[ COMPLETION RATE ]</div>
                <div className="w-full h-1.5 bg-amber-950/30 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[65%]"></div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-amber-600 tracking-wider">
                  <span>WEEKLY AVG</span>
                  <span>65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="flex-1 bg-black border-2 border-amber-900/50 p-6 animate-in fade-in zoom-in-95 duration-200 relative">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
               <h3 className="text-lg font-bold text-amber-500 tracking-widest">NOVEMBER 2025</h3>
               {!isGoogleSynced ? (
                 <button
                   onClick={syncGoogleCalendar}
                   disabled={isSyncing}
                   className="text-[10px] bg-blue-950/30 hover:bg-blue-950/50 text-blue-400 border border-blue-900/50 px-3 py-1.5 flex items-center gap-1.5 transition-colors disabled:opacity-50 font-bold tracking-wider"
                 >
                   <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                   {isSyncing ? 'SYNCING...' : 'SYNC GOOGLE'}
                 </button>
               ) : (
                 <span className="text-[10px] bg-emerald-950/30 text-emerald-400 px-3 py-1.5 flex items-center gap-1.5 border border-emerald-900/50 font-bold tracking-wider">
                   <CheckCircle2 size={12} /> SYNCED
                 </span>
               )}
            </div>
            <div className="flex gap-2">
               <button className="px-3 py-1 bg-amber-950/20 border border-amber-900/50 hover:bg-amber-950/30 text-amber-500 text-[10px] font-bold tracking-wider">TODAY</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-amber-900/30 border-2 border-amber-900/50 overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-black p-4 text-center text-[10px] font-bold text-amber-700 uppercase tracking-[0.2em]">
                {day}
              </div>
            ))}
            {/* Mock Calendar Days */}
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 4; // Start from previous month
              const isCurrentMonth = dayNum > 0 && dayNum <= 30;
              const isToday = dayNum === 20;

              // Find events for this day
              const dateStr = `2025-11-${dayNum.toString().padStart(2, '0')}`;
              const dayEvents = calendarEvents.filter(e => e.date === dateStr);

              return (
                <div key={i} className={`min-h-[100px] bg-black p-2 hover:bg-amber-950/10 transition-colors relative group flex flex-col ${!isCurrentMonth && 'opacity-30'}`}>
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center mb-1 border ${isToday ? 'bg-amber-500 text-black border-amber-400' : 'text-amber-600 border-transparent'}`}>
                    {dayNum > 0 && dayNum <= 30 ? dayNum : (dayNum <= 0 ? 31 + dayNum : dayNum - 30)}
                  </span>

                  <div className="flex-1 flex flex-col gap-1.5 mt-1">
                    {dayEvents.map(ev => (
                       <div
                         key={ev.id}
                         className={`text-[9px] px-2 py-1 truncate border flex items-center gap-1 tracking-wide ${
                           ev.source === 'Google'
                             ? 'bg-blue-950/30 text-blue-300 border-blue-900/50 hover:bg-blue-950/50'
                             : 'bg-amber-950/20 text-amber-400 border-amber-900/50 hover:bg-amber-950/30'
                         }`}
                         title={`${ev.title} (${ev.source})`}
                       >
                         <div className={`w-1 h-1 ${ev.source === 'Google' ? 'bg-blue-400' : 'bg-amber-500'}`}></div>
                         {ev.title}
                       </div>
                    ))}

                    {/* Auto-inject tasks with due dates */}
                    {tasks.filter(t => t.dueDate === dateStr).map(t => (
                      <div key={t.id} className="text-[9px] bg-emerald-950/20 text-emerald-300 px-2 py-1 truncate border border-emerald-900/50 hover:bg-emerald-950/30 flex items-center gap-1 tracking-wide">
                        <div className="w-1 h-1 bg-emerald-500"></div>
                        {t.title}
                      </div>
                    ))}
                  </div>

                  {/* Add button on hover */}
                  <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-amber-950/20 border border-amber-900/50 hover:text-amber-400 text-amber-700 transition-all">
                    <Plus size={12} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        mode={editingTask ? 'edit' : 'create'}
      />

      {/* Delete Task Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDeleteTask}
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Delete Habit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteHabitDialogOpen}
        onClose={() => {
          setIsDeleteHabitDialogOpen(false);
          setHabitToDelete(null);
        }}
        onConfirm={confirmDeleteHabit}
        title="Delete Habit?"
        message="Are you sure you want to delete this habit? This will reset your streak and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Delete Goal Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteGoalDialogOpen}
        onClose={() => {
          setIsDeleteGoalDialogOpen(false);
          setGoalToDelete(null);
        }}
        onConfirm={confirmDeleteGoal}
        title="Delete Goal?"
        message="Are you sure you want to delete this goal and all its milestones? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};