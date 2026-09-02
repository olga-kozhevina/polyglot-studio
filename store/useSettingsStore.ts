import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type TargetLanguage = 'EN' | 'FR' | 'TR'

interface SettingsState {
  targetLanguage: TargetLanguage
  setTargetLanguage: (lang: TargetLanguage) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      targetLanguage: 'EN',
      setTargetLanguage: (lang) => set({ targetLanguage: lang }),
    }),
    {
      name: 'polyglot-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)