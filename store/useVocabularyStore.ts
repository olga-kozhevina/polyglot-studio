import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

export type MasteryStatus = 'new' | 'learning' | 'mastered';

export type LanguageCode = 'EN' | 'FR' | 'TR'

export interface VocabularyItem {
  id: string;
  original: string;
  translation: string;
  transcription?: string;
  contextSentence?: string;
  sourceLang: string; // 'EN' | 'FR' | 'TR'
  targetLang: string; // 'RU'
  createdAt: number; // Сортировка по новизне
  status: MasteryStatus;
}

interface VocabularyState {
  items: VocabularyItem[];
  sessionQueue: VocabularyItem[];
  activeCustomIds: string[]; // Список ID текущей активной сессии

  // Внутреннее хранилище по email: { "user@mail.com": [...] }
  userItems: Record<string, VocabularyItem[]>;

  // Синхронизация при смене пользователя (логин/выход)
  syncUserVocabulary: () => void;
  addItem: (
    item: Omit<VocabularyItem, 'id' | 'createdAt' | 'status'>
  ) => void;
  removeItem: (id: string) => void;
  reviewItem: (id: string, decision: 'repeat' | 'mastered') => void;
  updateItemStatus: (id: string, status: MasteryStatus) => void;

  // Методы запуска тренировок
  startPracticeSession: () => void;
  startCustomPracticeSession: (itemIds: string[]) => void;

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
      sessionQueue: [],
      activeCustomIds: [],
      userItems: {},

      syncUserVocabulary: () => {
        const userKey = getCurrentUserKey();
        if (!userKey) {
          set({ items: [], sessionQueue: [], activeCustomIds: [] });
          return;
        }
        const currentUserWords = get().userItems[userKey] || [];

        // Если в localStorage уже есть сохраненная очередь тренировки (хвост), 
        // просто синхронизируем данные слов с актуальным списком пользователя
        const currentQueue = get().sessionQueue;
        if (currentQueue.length > 0) {
          const syncedQueue = currentQueue
            .map((qItem) => currentUserWords.find((w) => w.id === qItem.id))
            .filter((w): w is VocabularyItem => w !== undefined);

        set({
          items: currentUserWords,
          sessionQueue: syncedQueue,
        });
          return;
        }
        
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
        };

        const currentItems = get().userItems[userKey] || [];
        const updatedItems = [newItem, ...currentItems];

        // Новые слова падают исключительно в общий список, не затрагивая текущую тренировку
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
        const updatedQueue = get().sessionQueue.filter((i) => i.id !== id);
        const updatedActiveIds = get().activeCustomIds.filter((i) => i !== id);

        set((state) => ({
          items: updatedItems,
          sessionQueue: updatedQueue,
          activeCustomIds: updatedActiveIds,
          userItems: {
            ...state.userItems,
            [userKey]: updatedItems,
          },
        }));
      },

      reviewItem: (id, decision) => {
        const userKey = getCurrentUserKey();
        if (!userKey) return;

        const currentItems = get().userItems[userKey] || [];

        const updatedItems = currentItems.map((item) => {
          if (item.id !== id) return item;

          const newStatus: MasteryStatus = decision === 'mastered' ? 'mastered' : 'learning';

          return {
            ...item,
            status: newStatus,
          };
        });

        // Убираем отвеченное слово из текущей очереди тренировки
        const updatedQueue = get().sessionQueue.filter((item) => item.id !== id);

        // Также удаляем ID из активных, чтобы при перезагрузке оно точно не вернулось
        const updatedActiveIds = get().activeCustomIds.filter((activeId) => activeId !== id);

        // Если очередь полностью пройдена, полностью очищаем активный список
        const finalActiveIds = updatedQueue.length === 0 ? [] : updatedActiveIds;

        set((state) => ({
          items: updatedItems,
          sessionQueue: updatedQueue,
          activeCustomIds: finalActiveIds,
          userItems: {
            ...state.userItems,
            [userKey]: updatedItems,
          },
        }));
      },

      updateItemStatus: (id, newStatus) => {
    const userKey = getCurrentUserKey();
    if (!userKey) return;

    const currentItems = get().userItems[userKey] || [];

    const updatedItems = currentItems.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        status: newStatus,
      };
    });

    // Также обновляем слово в очереди сессии, если оно там есть
    const updatedQueue = get().sessionQueue.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        status: newStatus,
      };
    });

    set((state) => ({
      items: updatedItems,
      sessionQueue: updatedQueue,
      userItems: {
        ...state.userItems,
        [userKey]: updatedItems,
      },
    }));
  },

      startPracticeSession: () => {
        set({ sessionQueue: [], activeCustomIds: [] });
      },

      startCustomPracticeSession: (itemIds) => {
        const userKey = getCurrentUserKey();
        if (!userKey) return;

        const currentItems = get().userItems[userKey] || [];
        const queue = currentItems.filter((item) => itemIds.includes(item.id));

        set({
          sessionQueue: queue,
          activeCustomIds: itemIds
        });
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
          sessionQueue: [],
          activeCustomIds: [],
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
      // Сохраняем userItems и текущие параметры сессии, чтобы они переживали перезагрузку
      partialize: (state) => ({
        userItems: state.userItems,
        sessionQueue: state.sessionQueue,
        activeCustomIds: state.activeCustomIds,
      }),
      onRehydrateStorage: () => (state) => {
        // Сразу после восстановления из localStorage синхронизируем данные текущего пользователя
        if (state) {
          state.syncUserVocabulary();
        }
      },
    }
  )
);