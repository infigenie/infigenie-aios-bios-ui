/**
 * Local Storage Utility
 * Provides type-safe localStorage access with error handling and data validation
 */

import { Task, Habit, Goal, CalendarEvent, Note, Transaction, Budget, HealthMetric, Course, MediaItem, Workflow, SocialPost, BrandProfile, CompetitorAnalysis, ChatMessage } from '../types';

// Storage keys
export const STORAGE_KEYS = {
  TASKS: 'infigenie_tasks',
  HABITS: 'infigenie_habits',
  GOALS: 'infigenie_goals',
  CALENDAR_EVENTS: 'infigenie_calendar_events',
  NOTES: 'infigenie_notes',
  TRANSACTIONS: 'infigenie_transactions',
  BUDGETS: 'infigenie_budgets',
  HEALTH_METRICS: 'infigenie_health_metrics',
  COURSES: 'infigenie_courses',
  MEDIA_ITEMS: 'infigenie_media_items',
  WORKFLOWS: 'infigenie_workflows',
  SOCIAL_POSTS: 'infigenie_social_posts',
  BRAND_PROFILES: 'infigenie_brand_profiles',
  COMPETITOR_PROFILES: 'infigenie_competitor_profiles',
  CHAT_HISTORY: 'infigenie_chat_history',
  SETTINGS: 'infigenie_settings',
  SCHEMA_VERSION: 'infigenie_schema_version',
} as const;

// Current schema version for migrations
const CURRENT_SCHEMA_VERSION = 1;

// Generic storage interface
interface StorageAdapter<T> {
  get: () => T[];
  save: (data: T[]) => void;
  add: (item: T) => void;
  update: (id: string, updates: Partial<T>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

/**
 * Create a storage adapter for a specific data type
 */
function createStorageAdapter<T extends { id: string }>(key: string): StorageAdapter<T> {
  const get = (): T[] => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return [];
    }
  };

  const save = (data: T[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      // Handle quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some data.');
      }
      throw error;
    }
  };

  const add = (item: T): void => {
    const data = get();
    data.push(item);
    save(data);
  };

  const update = (id: string, updates: Partial<T>): void => {
    const data = get();
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      save(data);
    }
  };

  const remove = (id: string): void => {
    const data = get();
    const filtered = data.filter(item => item.id !== id);
    save(filtered);
  };

  const clear = (): void => {
    localStorage.removeItem(key);
  };

  return { get, save, add, update, remove, clear };
}

// Create storage adapters for each data type
export const storage = {
  tasks: createStorageAdapter<Task>(STORAGE_KEYS.TASKS),
  habits: createStorageAdapter<Habit>(STORAGE_KEYS.HABITS),
  goals: createStorageAdapter<Goal>(STORAGE_KEYS.GOALS),
  calendarEvents: createStorageAdapter<CalendarEvent>(STORAGE_KEYS.CALENDAR_EVENTS),
  notes: createStorageAdapter<Note>(STORAGE_KEYS.NOTES),
  transactions: createStorageAdapter<Transaction>(STORAGE_KEYS.TRANSACTIONS),
  budgets: createStorageAdapter<Budget>(STORAGE_KEYS.BUDGETS),
  healthMetrics: createStorageAdapter<HealthMetric>(STORAGE_KEYS.HEALTH_METRICS),
  courses: createStorageAdapter<Course>(STORAGE_KEYS.COURSES),
  mediaItems: createStorageAdapter<MediaItem>(STORAGE_KEYS.MEDIA_ITEMS),
  workflows: createStorageAdapter<Workflow>(STORAGE_KEYS.WORKFLOWS),
  socialPosts: createStorageAdapter<SocialPost>(STORAGE_KEYS.SOCIAL_POSTS),
  brandProfiles: createStorageAdapter<BrandProfile & { id: string }>(STORAGE_KEYS.BRAND_PROFILES),
  competitorProfiles: createStorageAdapter<CompetitorAnalysis & { id: string }>(STORAGE_KEYS.COMPETITOR_PROFILES),
  chatHistory: createStorageAdapter<ChatMessage>(STORAGE_KEYS.CHAT_HISTORY),

  // Settings (non-array storage)
  settings: {
    get: () => {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : {};
      } catch (error) {
        console.error('Error reading settings:', error);
        return {};
      }
    },
    save: (settings: Record<string, any>) => {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
      }
    },
    update: (updates: Record<string, any>) => {
      const current = storage.settings.get();
      storage.settings.save({ ...current, ...updates });
    },
    clear: () => {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    }
  },

  // Utility functions
  getSchemaVersion: (): number => {
    try {
      const version = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
      return version ? parseInt(version, 10) : 0;
    } catch {
      return 0;
    }
  },

  setSchemaVersion: (version: number): void => {
    localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, version.toString());
  },

  // Export all data
  exportAll: (): string => {
    const data = {
      version: CURRENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      tasks: storage.tasks.get(),
      habits: storage.habits.get(),
      goals: storage.goals.get(),
      calendarEvents: storage.calendarEvents.get(),
      notes: storage.notes.get(),
      transactions: storage.transactions.get(),
      budgets: storage.budgets.get(),
      healthMetrics: storage.healthMetrics.get(),
      courses: storage.courses.get(),
      mediaItems: storage.mediaItems.get(),
      workflows: storage.workflows.get(),
      socialPosts: storage.socialPosts.get(),
      brandProfiles: storage.brandProfiles.get(),
      competitorProfiles: storage.competitorProfiles.get(),
      chatHistory: storage.chatHistory.get(),
      settings: storage.settings.get(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Import all data
  importAll: (jsonString: string): void => {
    try {
      const data = JSON.parse(jsonString);

      // Validate version
      if (data.version > CURRENT_SCHEMA_VERSION) {
        throw new Error('Data was exported from a newer version. Please update the app.');
      }

      // Import each data type
      if (data.tasks) storage.tasks.save(data.tasks);
      if (data.habits) storage.habits.save(data.habits);
      if (data.goals) storage.goals.save(data.goals);
      if (data.calendarEvents) storage.calendarEvents.save(data.calendarEvents);
      if (data.notes) storage.notes.save(data.notes);
      if (data.transactions) storage.transactions.save(data.transactions);
      if (data.budgets) storage.budgets.save(data.budgets);
      if (data.healthMetrics) storage.healthMetrics.save(data.healthMetrics);
      if (data.courses) storage.courses.save(data.courses);
      if (data.mediaItems) storage.mediaItems.save(data.mediaItems);
      if (data.workflows) storage.workflows.save(data.workflows);
      if (data.socialPosts) storage.socialPosts.save(data.socialPosts);
      if (data.brandProfiles) storage.brandProfiles.save(data.brandProfiles);
      if (data.competitorProfiles) storage.competitorProfiles.save(data.competitorProfiles);
      if (data.chatHistory) storage.chatHistory.save(data.chatHistory);
      if (data.settings) storage.settings.save(data.settings);

      storage.setSchemaVersion(CURRENT_SCHEMA_VERSION);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data. Please check the file format.');
    }
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Get storage usage stats
  getUsageStats: (): { used: number; percentUsed: number; itemCounts: Record<string, number> } => {
    let totalSize = 0;
    const itemCounts: Record<string, number> = {};

    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
        try {
          const parsed = JSON.parse(item);
          itemCounts[name] = Array.isArray(parsed) ? parsed.length : 1;
        } catch {
          itemCounts[name] = 0;
        }
      } else {
        itemCounts[name] = 0;
      }
    });

    // Approximate localStorage limit (5MB for most browsers)
    const maxSize = 5 * 1024 * 1024;
    const percentUsed = (totalSize / maxSize) * 100;

    return {
      used: totalSize,
      percentUsed: Math.min(percentUsed, 100),
      itemCounts
    };
  }
};

// Initialize schema version if not set
if (storage.getSchemaVersion() === 0) {
  storage.setSchemaVersion(CURRENT_SCHEMA_VERSION);
}
