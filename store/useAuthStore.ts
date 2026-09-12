import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, // Измените на true для проверки авторизованного режима
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));