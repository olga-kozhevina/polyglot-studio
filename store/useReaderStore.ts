import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TargetLanguage } from '@/store/useSettingsStore';
import { useAuthStore } from './useAuthStore';

export interface LastSession {
  id: string;
  title: string;
  level: string;
  targetLanguage: TargetLanguage;
}

interface ReaderState {
  // Флаг гидратации storage
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // --- Хранилище сессий по юзерам: { 'user_abc': { EN: [Session1, Session2] } } ---
  userSessions: Record<string, Partial<Record<TargetLanguage, LastSession[]>>>;

  // Временная гостевая сессия до входа в аккаунт
  guestSessions: Partial<Record<TargetLanguage, LastSession>>;

  // Текущие активные сессии ридера (отображаются в UI)
  lastSessionsByLang: Partial<Record<TargetLanguage, LastSession[]>>;
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

  // --- Управление сессиями при логине / логауте ---
  syncUserReaderSession: (userId: string | null) => void;
  resetReaderState: () => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      userSessions: {},
      guestSessions: {},
      lastSessionsByLang: {},

      // Сохранение сессии (автоматически определит: залогинен юзер или это гость)
      setLastSession: (session: LastSession) => {
        // Получаем текущего пользователя из useAuthStore
        const currentUser = useAuthStore.getState().user;
        const userId = currentUser?.id;
        const lang = session.targetLanguage;
        const updatedSession = { ...session, updatedAt: Date.now() };

        set((state) => {
          if (userId) {
            // 1. ЕСЛИ ПОЛЬЗОВАТЕЛЬ ЗАЛОГИНЕН — сохраняем список сессий
            const userCurrentSessions = state.userSessions[userId] || {};
            const rawLangHistory = userCurrentSessions[lang];

            // Безопасно приводим к массиву (даже если ранее сохранился один объект или undefined)
            const langHistory = Array.isArray(rawLangHistory)
              ? rawLangHistory
              : rawLangHistory
              ? [rawLangHistory] // Если лежал одиночный объект, заворачиваем его в массив
              : [];
            
            // Убираем старую версию этого же текста и добавляем свежую в начало списка
            const filteredHistory = langHistory.filter((item) => item.id !== session.id);
            const newLangHistory = [updatedSession, ...filteredHistory];

            const updatedUserSessions = {
              ...userCurrentSessions,
              [lang]: newLangHistory,
            };

            return {
              lastSessionsByLang: updatedUserSessions,
              userSessions: {
                ...state.userSessions,
                [userId]: updatedUserSessions,
              },
            };
          } else {
            // 2. Если ЭТО ГОСТЬ — сохраняем строго один последний текст
            const updatedGuestSessions = {
              ...state.guestSessions,
              [lang]: updatedSession,
            };

            // Преобразуем единичный объект гостя в массив для единообразия в lastSessionsByLang
            const guestSessionsAsArrays = Object.entries(updatedGuestSessions).reduce(
              (acc, [lang, sess]) => {
                if (sess) {
                  acc[lang as TargetLanguage] = [sess];
                }
                return acc;
              },
              {} as Partial<Record<TargetLanguage, LastSession[]>>
            );

            return {
              lastSessionsByLang: guestSessionsAsArrays,
              guestSessions: updatedGuestSessions,
            };
          }
        });
      },

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

      // Синхронизация сессий ридера при смене авторизации
      syncUserReaderSession: (userId) => {
        const state = get();

        if (userId) {
          // --- ВХОД В АККАУНТ ---
          const userSavedSessions = state.userSessions[userId] || {};
          const tempGuestSessions = state.guestSessions;

          const mergedSessions = { ...userSavedSessions };

          // Переносим гостевые тексты в начало списков соответствующего языка пользователя
          Object.entries(tempGuestSessions).forEach(([lang, guestSession]) => {
            if (guestSession) {
              const targetLang = lang as TargetLanguage;
              const currentList = mergedSessions[targetLang] || [];

              const filteredList = currentList.filter((item) => item.id !== guestSession.id);
              mergedSessions[targetLang] = [guestSession, ...filteredList];
            }
          });

          set({
            lastSessionsByLang: mergedSessions,
            userSessions: {
              ...state.userSessions,
              [userId]: mergedSessions,
            },
            guestSessions: {}, // Очищаем гостя после успешного переноса
          });
        } else {
          // --- ВЫХОД ИЗ АККАУНТА (LOGOUT) ---
          set({
            guestSessions: {},
            lastSessionsByLang: {},
          });
        }
      },

      // Полная очистка состояния плеера и временных UI-флагов
      resetReaderState: () =>
        set({
          isPlaying: false,
          currentTime: 0,
          activeSentenceIndex: null,
          activePopoverId: null,
        }),
    }),
    {
      name: 'polyglot-reader-session',
      storage: createJSONStorage(() => localStorage),
      // В localStorage храним только профили пользователей
      partialize: (state) => ({ userSessions: state.userSessions }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);