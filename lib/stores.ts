// lib/stores.ts
import { create } from 'zustand'

type User = {
  id: string
  email: string
  partnerId?: string
}

type AuthStore = {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

type NotificationStore = {
  message: string | null
  type: 'success' | 'error' | 'info'
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
  clearNotification: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  message: null,
  type: 'info',
  showNotification: (message, type) => set({ message, type }),
  clearNotification: () => set({ message: null }),
}))
