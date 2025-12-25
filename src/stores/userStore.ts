/**
 * 增强的用户管理 Store
 * 支持用户配置、历史记录和AI设置
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIConfig } from '../services/aiInterpretation'

export interface UserProfile {
  id: string
  nickname: string
  avatar?: string
  email?: string
  createdAt: string
  lastActive: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en'
  notifications: boolean
  autoSaveResults: boolean
  showTips: boolean
  reminderFrequency: 'daily' | 'weekly' | 'monthly' | 'never'
}

export interface UserStats {
  totalAssessments: number
  streakDays: number
  lastAssessmentDate?: string
  favoriteScales: string[]
  gameScores: Record<string, number>
}

export interface GratitudeEntry {
  id: string
  content: string
  date: string
  mood?: number
}

export interface MoodEntry {
  date: string
  mood: number // 1-5
  note?: string
  tags?: string[]
}

interface UserState {
  profile: UserProfile | null
  preferences: UserPreferences
  stats: UserStats
  aiConfig: AIConfig | null
  gratitudeEntries: GratitudeEntry[]
  moodEntries: MoodEntry[]
  
  // Actions
  setProfile: (profile: UserProfile | null) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  setPreferences: (preferences: Partial<UserPreferences>) => void
  setAIConfig: (config: AIConfig | null) => void
  
  // Stats
  incrementAssessments: () => void
  updateStreak: () => void
  addFavoriteScale: (scaleId: string) => void
  removeFavoriteScale: (scaleId: string) => void
  updateGameScore: (gameId: string, score: number) => void
  
  // Gratitude Journal
  addGratitudeEntry: (content: string, mood?: number) => void
  removeGratitudeEntry: (id: string) => void
  
  // Mood Tracking
  addMoodEntry: (mood: number, note?: string, tags?: string[]) => void
  setMoodEntry: (date: string, mood: number, note?: string, tags?: string[]) => void
  getMoodHistory: (days: number) => MoodEntry[]

  importMoodEntries: (entries: MoodEntry[]) => void
  importGratitudeEntries: (entries: GratitudeEntry[]) => void
  
  // Reset
  resetUser: () => void
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'zh-CN',
  notifications: true,
  autoSaveResults: true,
  showTips: true,
  reminderFrequency: 'weekly'
}

const defaultStats: UserStats = {
  totalAssessments: 0,
  streakDays: 0,
  favoriteScales: [],
  gameScores: {}
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      preferences: defaultPreferences,
      stats: defaultStats,
      aiConfig: null,
      gratitudeEntries: [],
      moodEntries: [],
      
      setProfile: (profile) => set({ profile }),
      
      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates, lastActive: new Date().toISOString() } : null
      })),
      
      setPreferences: (preferences) => set((state) => ({
        preferences: { ...state.preferences, ...preferences }
      })),
      
      setAIConfig: (config) => set({ aiConfig: config }),
      
      incrementAssessments: () => set((state) => ({
        stats: {
          ...state.stats,
          totalAssessments: state.stats.totalAssessments + 1,
          lastAssessmentDate: new Date().toISOString()
        }
      })),
      
      updateStreak: () => {
        const state = get()
        const today = new Date().toDateString()
        const lastDate = state.stats.lastAssessmentDate 
          ? new Date(state.stats.lastAssessmentDate).toDateString()
          : null
        
        if (lastDate === today) return // 今天已经更新过
        
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        const newStreak = lastDate === yesterday.toDateString()
          ? state.stats.streakDays + 1
          : 1
        
        set({
          stats: {
            ...state.stats,
            streakDays: newStreak
          }
        })
      },
      
      addFavoriteScale: (scaleId) => set((state) => ({
        stats: {
          ...state.stats,
          favoriteScales: state.stats.favoriteScales.includes(scaleId)
            ? state.stats.favoriteScales
            : [...state.stats.favoriteScales, scaleId]
        }
      })),
      
      removeFavoriteScale: (scaleId) => set((state) => ({
        stats: {
          ...state.stats,
          favoriteScales: state.stats.favoriteScales.filter(id => id !== scaleId)
        }
      })),
      
      updateGameScore: (gameId, score) => set((state) => ({
        stats: {
          ...state.stats,
          gameScores: {
            ...state.stats.gameScores,
            [gameId]: Math.max(state.stats.gameScores[gameId] || 0, score)
          }
        }
      })),
      
      addGratitudeEntry: (content, mood) => {
        const entry: GratitudeEntry = {
          id: Date.now().toString(),
          content,
          date: new Date().toISOString(),
          mood
        }
        set((state) => ({
          gratitudeEntries: [entry, ...state.gratitudeEntries].slice(0, 365) // 保留最近365条
        }))
      },
      
      removeGratitudeEntry: (id) => set((state) => ({
        gratitudeEntries: state.gratitudeEntries.filter(e => e.id !== id)
      })),
      
      addMoodEntry: (mood, note, tags) => {
        const today = new Date().toISOString().split('T')[0]
        get().setMoodEntry(today, mood, note, tags)
      },

      setMoodEntry: (date, mood, note, tags) => {
        const day = String(date).slice(0, 10)
        const entry: MoodEntry = { date: day, mood, note, tags }

        set((state) => {
          const existingIndex = state.moodEntries.findIndex(e => e.date === day)
          if (existingIndex >= 0) {
            const updated = [...state.moodEntries]
            updated[existingIndex] = entry
            return { moodEntries: updated }
          }
          return { moodEntries: [entry, ...state.moodEntries].slice(0, 365) }
        })
      },
      
      getMoodHistory: (days) => {
        const state = get()
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        return state.moodEntries.filter(e => new Date(e.date) >= cutoff)
      },

      importMoodEntries: (entries) => {
        set((state) => {
          const map = new Map<string, MoodEntry>()
          for (const m of state.moodEntries) map.set(m.date, m)
          for (const m of entries) map.set(m.date, m)
          const merged = Array.from(map.values())
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 365)
          return { moodEntries: merged }
        })
      },

      importGratitudeEntries: (entries) => {
        set((state) => {
          const map = new Map<string, GratitudeEntry>()
          for (const g of state.gratitudeEntries) map.set(g.id, g)
          for (const g of entries) map.set(g.id, g)
          const merged = Array.from(map.values())
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 365)
          return { gratitudeEntries: merged }
        })
      },
      
      resetUser: () => set({
        profile: null,
        preferences: defaultPreferences,
        stats: defaultStats,
        aiConfig: null,
        gratitudeEntries: [],
        moodEntries: []
      })
    }),
    {
      name: 'mindbalance-user'
    }
  )
)
