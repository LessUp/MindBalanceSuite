import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AssessmentResult {
  id: string
  scaleId: string
  scaleTitle: string
  total: number
  max: number
  label: string
  values: number[]
  timestamp: number
}

interface AssessmentStore {
  results: AssessmentResult[]
  currentScale: string
  setCurrentScale: (scaleId: string) => void
  addResult: (result: Omit<AssessmentResult, 'id' | 'timestamp'>) => void
  deleteResult: (id: string) => void
  clearResults: () => void
  getResultsByScale: (scaleId: string) => AssessmentResult[]
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      results: [],
      currentScale: 'phq9',
      setCurrentScale: (scaleId: string) => set({ currentScale: scaleId }),
      addResult: (result) => {
        const newResult: AssessmentResult = {
          ...result,
          id: Date.now().toString(),
          timestamp: Date.now()
        }
        set((state) => ({
          results: [newResult, ...state.results]
        }))
      },
      deleteResult: (id: string) => {
        set((state) => ({
          results: state.results.filter(result => result.id !== id)
        }))
      },
      clearResults: () => set({ results: [] }),
      getResultsByScale: (scaleId: string) => {
        return get().results.filter(result => result.scaleId === scaleId)
      }
    }),
    {
      name: 'phq9-assessments'
    }
  )
)