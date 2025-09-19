import { StudyProgress } from '@/types/study';

interface SavedProgress {
  mode: 'flashcard' | 'quiz';
  currentIndex: number;
  progress: StudyProgress;
  timestamp: number;
  totalQuestions: number;
}

const STORAGE_KEY = 'flashquiz-progress';

export const progressStorage = {
  save: (mode: 'flashcard' | 'quiz', currentIndex: number, progress: StudyProgress, totalQuestions: number) => {
    const savedProgress: SavedProgress = {
      mode,
      currentIndex,
      progress,
      timestamp: Date.now(),
      totalQuestions
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProgress));
  },

  load: (): SavedProgress | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      
      const parsed = JSON.parse(saved) as SavedProgress;
      
      // Check if saved progress is less than 24 hours old
      const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
      if (!isRecent) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      return parsed;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  exists: (): boolean => {
    return progressStorage.load() !== null;
  }
};