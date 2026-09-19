import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

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
  // Актуальный массив слов ТЕКУЩЕГО пользователя
  items: VocabularyItem[];

  // Внутреннее хранилище по email: { "user@mail.com": [...] }
  userItems: Record<string, VocabularyItem[]>;

  // Синхронизация при смене пользователя (логин/выход)
  syncUserVocabulary: () => void;

  addItem: (
    item: Omit<
      VocabularyItem,
      'id' | 'createdAt' | 'status' | 'nextReviewDate' | 'intervalDays' | 'easeFactor'
    >) => void;
  removeItem: (id: string) => void;
  reviewItem: (id: string, grade: 'again' | 'hard' | 'easy') => void;
  hasItem: (original: string) => boolean;
  clearVocabulary: () => void;
}

// Вспомогательная функция для получения e-mail текущего пользователя
const getCurrentUserKey = (): string | null => {
  const user = useAuthStore.getState().user;
  return user?.email ? user.email.toLowerCase().trim() : null;
};

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      items: [],
      userItems: {},

      syncUserVocabulary: () => {
        const userKey = getCurrentUserKey();
        if (!userKey) {
          set({ items: [] });
          return;
        }
        const currentUserWords = get().userItems[userKey] || [];
        set({ items: currentUserWords });
      },

      addItem: (item) => {
        const userKey = getCurrentUserKey();
        if (!userKey) return; // Гость не может добавлять слова

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

        const currentItems = get().userItems[userKey] || [];
        const updatedItems = [newItem, ...currentItems];

        set((state) => ({
          items: updatedItems,
          userItems: {
            ...state.userItems,
            [userKey]: updatedItems,
          },
        }));
      },

      removeItem: (id) => {
        const userKey = getCurrentUserKey();
        if (!userKey) return;

        const currentItems = get().userItems[userKey] || [];
        const updatedItems = currentItems.filter((i) => i.id !== id);

        set((state) => ({
          items: updatedItems,
          userItems: {
            ...state.userItems,
            [userKey]: updatedItems,
          },
        }));
      },

      reviewItem: (id, grade) => {
        const userKey = getCurrentUserKey();
        if (!userKey) return;

        const now = Date.now();
        const DAY_IN_MS = 86400000;

        const currentItems = get().userItems[userKey] || [];

        const updatedItems = currentItems.map((item) => {
          if (item.id !== id) return item;

          let newInterval = item.intervalDays;
          let newStatus = item.status;

          if (grade === 'again') {
            return {
              ...item,
              status: 'learning' as MasteryStatus,
              intervalDays: 0,
              nextReviewDate: now + 60000, // +1 мин
            };
          }

          if (grade === 'hard') {
            newInterval = Math.max(1, Math.round(item.intervalDays * 1.5));
            newStatus = 'learning';
          }

          if (grade === 'easy') {
            newInterval =
              item.intervalDays === 0 ? 3 : Math.round(item.intervalDays * 2.5);
            newStatus = newInterval >= 14 ? 'mastered' : 'learning';
          }

          return {
            ...item,
            status: newStatus,
            intervalDays: newInterval,
            nextReviewDate: now + newInterval * DAY_IN_MS,
          };
        });

        set((state) => ({
          items: updatedItems,
          userItems: {
            ...state.userItems,
            [userKey]: updatedItems,
          },
        }));
      },

      hasItem: (original) => {
        const cleanOriginal = original.trim().toLowerCase();
        return get().items.some(
          (i) => i.original.trim().toLowerCase() === cleanOriginal
        );
      },

      clearVocabulary: () => {
        const userKey = getCurrentUserKey();
        if (!userKey) return;

        set((state) => ({
          items: [],
          userItems: {
            ...state.userItems,
            [userKey]: [],
          },
        }));
      },
    }),
    {
      name: 'polyglot-vocabulary',
      storage: createJSONStorage(() => localStorage),
    }
  )
);