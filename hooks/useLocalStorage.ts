import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for syncing state with localStorage
 * Provides auto-save with debouncing and error handling
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceMs = 500
): [T, (value: T | ((prev: T) => T)) => void, { isSaving: boolean; error: Error | null }] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pendingSave, setPendingSave] = useState<NodeJS.Timeout | null>(null);

  // Save to localStorage with debouncing
  const saveToStorage = useCallback((value: T) => {
    setIsSaving(true);
    setError(null);

    try {
      localStorage.setItem(key, JSON.stringify(value));
      setIsSaving(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save to localStorage');
      setError(error);
      setIsSaving(false);
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;

      // Clear any pending save
      if (pendingSave) {
        clearTimeout(pendingSave);
      }

      // Debounce the save
      const timeout = setTimeout(() => {
        saveToStorage(newValue);
      }, debounceMs);

      setPendingSave(timeout);

      return newValue;
    });
  }, [debounceMs, pendingSave, saveToStorage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pendingSave) {
        clearTimeout(pendingSave);
      }
    };
  }, [pendingSave]);

  return [storedValue, setValue, { isSaving, error }];
}

/**
 * Hook for immediate localStorage sync (no debouncing)
 */
export function useLocalStorageImmediate<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;

      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }

      return newValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
