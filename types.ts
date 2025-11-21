
export enum OSMode {
  AIOS = 'AIOS',
  BIOS = 'BIOS'
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  LIFE_OS = 'LIFE_OS',
  MEMORY_OS = 'MEMORY_OS',
  FINANCE_OS = 'FINANCE_OS',
  HEALTH_OS = 'HEALTH_OS',
  LEARN_OS = 'LEARN_OS',
  MEDIA_OS = 'MEDIA_OS',
  WORKFLOW_OS = 'WORKFLOW_OS',
  BRAND_INTEL = 'BRAND_INTEL',
  COMPETITOR_INTEL = 'COMPETITOR_INTEL',
  CREATOR_STUDIO = 'CREATOR_STUDIO',
  CIOS = 'CIOS',
  DIOS = 'DIOS',
  EIOS = 'EIOS',
  GIOS = 'GIOS',
  MARKETPLACE = 'MARKETPLACE',
  SETTINGS = 'SETTINGS'
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate?: string;
  recurrence?: 'Daily' | 'Weekly' | 'Monthly' | 'None';
  tags: string[];
  subtasks?: SubTask[];
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  frequency: 'Daily' | 'Weekly';
}

export interface Goal {
  id: string;
  title: string;
  deadline: string;
  progress: number; // 0-100
  status: 'On Track' | 'At Risk' | 'Behind';
  milestones: { id: string; title: string; completed: boolean }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'Meeting' | 'Task' | 'Reminder';
  source: 'Local' | 'Google';
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown
  tags: string[];
  lastModified: Date;
  linkedIds?: string[];
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  type: 'expense' | 'income';
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface HealthMetric {
  id: string;
  type: 'Sleep' | 'Water' | 'Steps' | 'Weight' | 'Mood';
  value: number | string;
  unit: string;
  date: string;
  timestamp: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  modules: CourseModule[];
  status: 'Active' | 'Completed' | 'Archived';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'Video' | 'Article' | 'Podcast' | 'Book';
  url?: string;
  status: 'To Consume' | 'In Progress' | 'Done';
  rating?: number; // 1-5
  notes: string;
  takeaways?: string[];
}

export interface WorkflowStep {
  id: string;
  type: 'Trigger' | 'Action' | 'Logic';
  label: string;
  icon?: string; // Lucide icon name
  config: Record<string, string>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  lastRun?: string;
  steps: WorkflowStep[];
}

export interface BrandProfile {
  name: string;
  coreValues: string;
  targetAudience: string;
  toneVoice: string;
}

export interface CompetitorAnalysis {
  name: string;
  marketShareEstimate: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  status: 'Active' | 'On Hold' | 'Completed';
  dueDate: string;
}

export interface SocialPost {
  id: string;
  content: string;
  platform: 'Twitter' | 'LinkedIn' | 'Instagram' | 'Blog';
  status: 'Draft' | 'Scheduled' | 'Published';
  scheduledDate?: string;
  imagePrompt?: string;
  imageUrl?: string;
  videoUrl?: string;
  engagement?: { likes: number; shares: number; comments: number };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  groundingMetadata?: {
    web?: { uri: string; title: string }[];
    maps?: { uri: string; title: string }[];
  };
}
