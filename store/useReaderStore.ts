import { create } from 'zustand';

interface ReaderState {
  // --- Плеер  ---
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;

  // --- Синхронизация и ридер  ---
  activeSentenceIndex: number | null;
  isAutoScrollEnabled: boolean;
  isSentenceLoopEnabled: boolean;

  // --- Действия (Actions) ---
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (currentTime: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setActiveSentenceIndex: (index: number | null) => void;
  toggleAutoScroll: () => void;
  toggleSentenceLoop: () => void;
}

export const useReaderStore = create<ReaderState>((set) => ({
  // Начальные состояния
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1.0,
  activeSentenceIndex: null,
  isAutoScrollEnabled: true,
  isSentenceLoopEnabled: false,

  // Методы обновления
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setActiveSentenceIndex: (activeSentenceIndex) => set({ activeSentenceIndex }),
  toggleAutoScroll: () => set((state) => ({ isAutoScrollEnabled: !state.isAutoScrollEnabled })),
  toggleSentenceLoop: () => set((state) => ({ isSentenceLoopEnabled: !state.isSentenceLoopEnabled })),
}));