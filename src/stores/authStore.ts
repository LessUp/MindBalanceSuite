import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, name: string) => void
  logout: () => void
  updateProfile: (name: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, name: string) => {
        const user: User = {
          id: Date.now().toString(),
          name,
          email,
          createdAt: new Date().toISOString()
        }
        set({ user, isAuthenticated: true })
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      updateProfile: (name: string) => {
        set((state) => ({
          user: state.user ? { ...state.user, name } : null
        }))
      }
    }),
    {
      name: 'phq9-auth'
    }
  )
)