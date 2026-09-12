import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VocabularyItem {
  id: string;
  original: string;
  translation: string;
  contextSentence?: string;
  sourceLang: string;
  targetLang: string;
  createdAt: number;
}

interface VocabularyState {
  items: VocabularyItem[];
  addItem: (item: Omit<VocabularyItem, 'id' | 'createdAt'>) => void;
  removeItem: (id: string) => void;
  hasItem: (original: string) => boolean;
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const newItem: VocabularyItem = {
          ...item,
          id: `${item.original.toLowerCase()}-${Date.now()}`,
          createdAt: Date.now(),
        };
        set((state) => ({ items: [newItem, ...state.items] }));
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      hasItem: (original) => {
        return get().items.some(
          (i) => i.original.toLowerCase() === original.trim().toLowerCase()
        );
      },
    }),
    {
      name: 'polyglot-vocabulary',
    }
  )
);