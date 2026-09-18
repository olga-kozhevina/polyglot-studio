import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type MasteryStatus = 'new' | 'learning' | 'mastered';

export interface VocabularyItem {
  id: string;
  original: string;
  translation: string;
  contextSentence?: string;
  sourceLang: string; // 'EN' | 'FR' | 'TR'
  targetLang: string; // 'RU'
  createdAt: number;

  // Поля для Spaced Repetition
  status: MasteryStatus;
  nextReviewDate: number;
  intervalDays: number;
  easeFactor: number;
}

interface VocabularyState {
  items: VocabularyItem[];
  addItem: (item: Omit<VocabularyItem, 'id' | 'createdAt' | 'status' | 'nextReviewDate' | 'intervalDays' | 'easeFactor'>) => void;
  removeItem: (id: string) => void;
  reviewItem: (id: string, grade: 'again' | 'hard' | 'easy') => void;
  hasItem: (original: string) => boolean;
  clearVocabulary: () => void;
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const now = Date.now();
        const newItem: VocabularyItem = {
          ...item,
          id: `${item.original.toLowerCase()}-${now}`,
          createdAt: now,
          status: 'new',
          nextReviewDate: now,
          intervalDays: 0,
          easeFactor: 2.5,
        };
        set((state) => ({ items: [newItem, ...state.items] }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      reviewItem: (id, grade) => {
        const now = Date.now();
        const DAY_IN_MS = 86400000;

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;

            let newInterval = item.intervalDays;
            let newStatus = item.status;

            if (grade === 'again') {
              return {
                ...item,
                status: 'learning',
                intervalDays: 0,
                nextReviewDate: now + 60000, // +1 мин
              };
            }

            if (grade === 'hard') {
              newInterval = Math.max(1, Math.round(item.intervalDays * 1.5));
              newStatus = 'learning';
            }

            if (grade === 'easy') {
              newInterval = item.intervalDays === 0 ? 3 : Math.round(item.intervalDays * 2.5);
              newStatus = newInterval >= 14 ? 'mastered' : 'learning';
            }

            return {
              ...item,
              status: newStatus,
              intervalDays: newInterval,
              nextReviewDate: now + newInterval * DAY_IN_MS,
            };
          }),
        }));
      },

      hasItem: (original) => {
        return get().items.some(
          (i) => i.original.toLowerCase() === original.trim().toLowerCase()
        );
      },
      clearVocabulary: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'polyglot-vocabulary',
      storage: createJSONStorage(() => localStorage),
    }
  )
);