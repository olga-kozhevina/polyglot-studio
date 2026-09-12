import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TargetLanguage } from '@/store/useSettingsStore';

export interface LastSession {
  id: string;
  title: string;
  level: string;
  targetLanguage: TargetLanguage;
}

interface ReaderState {
  // --- Последние сессии по языкам (сохраняются в localStorage) ---
  lastSessionsByLang: Partial<Record<TargetLanguage, LastSession>>;
  setLastSession: (session: LastSession) => void;

  // --- Состояния аудиоплеера (НЕ сохраняются в localStorage) ---
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;

  // --- Синхронизация и ридер ---
  activeSentenceIndex: number | null;
  isAutoScrollEnabled: boolean;
  isSentenceLoopEnabled: boolean;

  // --- Управление Popover (слово / фраза) ---
  activePopoverId: string | null;

  // --- Действия (Actions) ---
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (currentTime: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setActiveSentenceIndex: (index: number | null) => void;
  toggleAutoScroll: () => void;
  toggleSentenceLoop: () => void;
  setActivePopoverId: (id: string | null) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      // Хранилище сессий по ключам языков: { EN: {...}, FR: {...}, TR: {...} }
      lastSessionsByLang: {},

      // Обновление/добавление сессии для конкретного языка
      setLastSession: (session) =>
        set((state) => ({
          lastSessionsByLang: {
            ...state.lastSessionsByLang,
            [session.targetLanguage]: session,
          },
        })),

      // Начальные состояния плеера
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      playbackRate: 1.0,
      activeSentenceIndex: null,
      isAutoScrollEnabled: true,
      isSentenceLoopEnabled: false,
      activePopoverId: null,

      // Методы обновления плеера
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setPlaybackRate: (playbackRate) => set({ playbackRate }),
      setActiveSentenceIndex: (activeSentenceIndex) => set({ activeSentenceIndex }),
      toggleAutoScroll: () =>
        set((state) => ({ isAutoScrollEnabled: !state.isAutoScrollEnabled })),
      toggleSentenceLoop: () =>
        set((state) => ({ isSentenceLoopEnabled: !state.isSentenceLoopEnabled })),
      setActivePopoverId: (activePopoverId) => set({ activePopoverId }),
    }),
    {
      name: 'polyglot-reader-session',
      storage: createJSONStorage(() => localStorage),
      // Сохраняем ТОЛЬКО словарь сессий, чтобы состояние плеера сбрасывалось при перезагрузке
      partialize: (state) => ({ lastSessionsByLang: state.lastSessionsByLang }),
    }
  )
);