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
        const userName = name?.trim() || email.split('@')[0]
        set({
          user: {
            id: `user_${Date.now()}`,
            email,
            name: userName,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
          },
          isAuthenticated: true,
          isAuthModalOpen: false,
        })
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
      },

      logout: () => {
        // Очищаем локальный словарь при выходе
        useVocabularyStore.getState().clearVocabulary();

        set({
          user: null,
          isAuthenticated: false,
          isAuthModalOpen: false,
        });
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
      },
    }
  )
)