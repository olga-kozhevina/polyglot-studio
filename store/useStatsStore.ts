import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';
import { TargetLanguage } from './useSettingsStore';

export interface DailyActivity {
  date: string; // Формат YYYY-MM-DD
  seconds: number;
}

export interface LangStats {
  secondsListened: number;
  wordsLearned: number;
  masteredWordIds: string[]; // Массив уникальных ID слов, когда-либо достигнувших статуса mastered
}

export interface UserStats {
  streak: number;
  lastActivityDate: string | null;
  languages: Record<TargetLanguage, LangStats>;
  activityHistory: DailyActivity[];
}

interface StatsState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  userStats: Record<string, UserStats>; // Ключ - email пользователя

  // Экшены
  addListeningTime: (seconds: number, lang: TargetLanguage) => void;
  markWordAsMastered: (lang: TargetLanguage, wordId: string) => void; // Отмечает слово как освоенное
  getCurrentUserStats: () => UserStats | null;
}

const getCurrentUserKey = (): string | null => {
  const user = useAuthStore.getState().user;
  return user?.email ? user.email.toLowerCase().trim() : null;
};

const getTodayDateStr = () => new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'

const defaultLangStats: LangStats = {
  secondsListened: 0,
  wordsLearned: 0,
  masteredWordIds: [],
};

const defaultUserStats: UserStats = {
  streak: 0,
  lastActivityDate: null,
  languages: {
    EN: { ...defaultLangStats },
    FR: { ...defaultLangStats },
    TR: { ...defaultLangStats },
  },
  activityHistory: [],
};

const calculateStreak = (currentStats: UserStats, today: string): { streak: number; lastActivityDate: string } => {
  const { streak, lastActivityDate } = currentStats;
  if (!lastActivityDate) return { streak: 1, lastActivityDate: today };
  if (lastActivityDate === today) return { streak, lastActivityDate: today };

  const lastDate = new Date(lastActivityDate);
  const currDate = new Date(today);
  const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return { streak: streak + 1, lastActivityDate: today };
  return { streak: 1, lastActivityDate: today };
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      userStats: {},

      getCurrentUserStats: () => {
        const userKey = getCurrentUserKey();
        if (!userKey) return null;
        return get().userStats[userKey] || defaultUserStats;
      },

      addListeningTime: (seconds, lang) => {
        const userKey = getCurrentUserKey();
        if (!userKey || seconds <= 0) return;

        set((state) => {
          const today = getTodayDateStr();
          const currentStats = state.userStats[userKey]
            ? JSON.parse(JSON.stringify(state.userStats[userKey]))
            : JSON.parse(JSON.stringify(defaultUserStats));

          const streakData = calculateStreak(currentStats, today);
          currentStats.streak = streakData.streak;
          currentStats.lastActivityDate = streakData.lastActivityDate;

          if (!currentStats.languages[lang]) {
            currentStats.languages[lang] = { ...defaultLangStats };
          }

          currentStats.languages[lang].secondsListened += seconds;

          const todayHistory = currentStats.activityHistory.find((h: DailyActivity) => h.date === today);
          if (todayHistory) {
            todayHistory.seconds += seconds;
          } else {
            currentStats.activityHistory.push({ date: today, seconds });
          }

          return { userStats: { ...state.userStats, [userKey]: currentStats } };
        });
      },

      markWordAsMastered: (lang, wordId) => {
        const userKey = getCurrentUserKey();
        if (!userKey || !wordId) return;

        set((state) => {
          const currentStats = state.userStats[userKey]
            ? JSON.parse(JSON.stringify(state.userStats[userKey]))
            : JSON.parse(JSON.stringify(defaultUserStats));

          if (!currentStats.languages[lang]) {
            currentStats.languages[lang] = { ...defaultLangStats };
          }

          const langStats = currentStats.languages[lang];
          if (!langStats.masteredWordIds) {
            langStats.masteredWordIds = [];
          }

          // Проверяем, учил ли пользователь это слово ранее
          if (!langStats.masteredWordIds.includes(wordId)) {
            langStats.masteredWordIds.push(wordId);
            langStats.wordsLearned = langStats.masteredWordIds.length;
          }

          return { userStats: { ...state.userStats, [userKey]: currentStats } };
        });
      },
    }),
    {
      name: 'polyglot-stats',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);