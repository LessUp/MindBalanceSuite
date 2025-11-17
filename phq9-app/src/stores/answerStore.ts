import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AnswerState {
  answers: Record<string, number[]>
  setAnswer: (scaleId: string, questionIndex: number, value: number) => void
  getAnswers: (scaleId: string) => number[]
  clearAnswers: (scaleId: string) => void
  clearAllAnswers: () => void
}

export const useAnswerStore = create<AnswerState>()(
  persist(
    (set, get) => ({
      answers: {},
      setAnswer: (scaleId: string, questionIndex: number, value: number) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [scaleId]: [
              ...(state.answers[scaleId] || []),
              ...Array(questionIndex - (state.answers[scaleId]?.length || 0)).fill(null),
              value
            ]
          }
        }))
      },
      getAnswers: (scaleId: string) => {
        return get().answers[scaleId] || []
      },
      clearAnswers: (scaleId: string) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [scaleId]: []
          }
        }))
      },
      clearAllAnswers: () => set({ answers: {} })
    }),
    {
      name: 'phq9-answers'
    }
  )
)