'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useVocabularyStore } from './useVocabularyStore'
import { useReaderStore } from './useReaderStore'

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
        const userId = `user_${cleanEmail}`

        set({
          user: {
            id: userId,
            email: cleanEmail,
            name: userName,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
          },
          isAuthenticated: true,
          isAuthModalOpen: false,
        })
        // Подгружаем словарь вошедшего юзера
        useVocabularyStore.getState().syncUserVocabulary()

        // Синхронизируем и переносим сессии ридера для вошедшего юзера
        useReaderStore.getState().syncUserReaderSession(userId)
      },

      loginWithGoogle: () => {
        const googleUserId = 'google_user_777'

        set({
          user: {
            id: googleUserId,
            email: 'user.polyglot@gmail.com',
            name: 'User',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          },
          isAuthenticated: true,
          isAuthModalOpen: false,
        })
        // Подгружаем словарь Google-аккаунта
        useVocabularyStore.getState().syncUserVocabulary()

        // Синхронизируем и переносим сессии ридера для Google-юзера
        useReaderStore.getState().syncUserReaderSession(googleUserId)
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAuthModalOpen: false,
        })
        // Синхронизируем словарь (для гостя массив items станет пустым, но сохраненные слова НЕ удлятся!)
        useVocabularyStore.getState().syncUserVocabulary()

        // Переключаем ридер на гостевой режим (чистая сессия) и сбрасываем плеер
        useReaderStore.getState().syncUserReaderSession(null)
        useReaderStore.getState().resetReaderState()
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
          const userId = useAuthStore.getState().user?.id || null
          useVocabularyStore.getState().syncUserVocabulary()
          useReaderStore.getState().syncUserReaderSession(userId)
        }, 0)
      },
    }
  )
)