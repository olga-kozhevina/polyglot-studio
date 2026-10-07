import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Language } from '@/types/text'

export type TargetLanguage = Language;

interface SettingsState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  targetLanguage: TargetLanguage
  setTargetLanguage: (lang: TargetLanguage) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      targetLanguage: 'EN',
      setTargetLanguage: (lang) => set({ targetLanguage: lang }),
    }),
    {
      name: 'polyglot-settings',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
)