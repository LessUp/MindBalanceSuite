import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AnswerValue = number | null

interface AnswerState {
  answers: Record<string, AnswerValue[]>
  setAnswer: (scaleId: string, questionIndex: number, value: number) => void
  getAnswers: (scaleId: string) => AnswerValue[]
  clearAnswers: (scaleId: string) => void
  clearAllAnswers: () => void
}

export const useAnswerStore = create<AnswerState>()(
  persist(
    (set, get) => ({
      answers: {},
      setAnswer: (scaleId: string, questionIndex: number, value: number) => {
        set((state) => {
          const next = state.answers[scaleId] ? [...state.answers[scaleId]] : []
          const missing = questionIndex - next.length
          if (missing >= 0) {
            next.push(...Array(missing + 1).fill(null))
          }
          next[questionIndex] = value

          return {
            answers: {
              ...state.answers,
              [scaleId]: next
            }
          }
        })
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