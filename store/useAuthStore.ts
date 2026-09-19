'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useVocabularyStore } from './useVocabularyStore'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isAuthModalOpen: boolean
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  openAuthModal: () => void
  closeAuthModal: () => void
  login: (email: string, name?: string) => void
  loginWithGoogle: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      login: (email: string, name?: string) => {
        const cleanEmail = email.trim().toLowerCase()
        const userName = name?.trim() || email.split('@')[0]

        set({
          user: {
            id: `user_${cleanEmail}`,
            email: cleanEmail,
            name: userName,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
          },
          isAuthenticated: true,
          isAuthModalOpen: false,
        })
        // Подгружаем словарь вошедшего юзера
        useVocabularyStore.getState().syncUserVocabulary()
      },

      loginWithGoogle: () => {
        set({
          user: {
            id: 'google_user_777',
            email: 'user.polyglot@gmail.com',
            name: 'User',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          },
          isAuthenticated: true,
          isAuthModalOpen: false,
        })
        // Подгружаем словарь Google-аккаунта
        useVocabularyStore.getState().syncUserVocabulary()
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAuthModalOpen: false,
        })
        // Синхронизируем словарь (для гостя массив items станет пустым, но сохраненные слова НЕ удлятся!)
        useVocabularyStore.getState().syncUserVocabulary()
      },
    }),
    {
      name: 'polyglot-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
        // Синхронизируем словарь после гидрации auth-стора из localStorage
        setTimeout(() => {
          useVocabularyStore.getState().syncUserVocabulary()
        }, 0)
      },
    }
  )
)