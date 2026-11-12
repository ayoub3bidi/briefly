import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { loadFormConfig } from '../data'
import type { Answer, TemplateId } from '../data/types'
import { createSafeStorage } from './storage'

const storageVersion = 1

export type BrieflyState = {
  answers: Record<string, Answer>
  setAnswer: (questionId: string, answer: Answer) => void
  getAnswer: (questionId: string) => Answer
  clearAnswer: (questionId: string) => void
}

type BrieflyStore = UseBoundStore<StoreApi<BrieflyState>>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeAnswers(value: unknown, knownIds: Set<string>): Record<string, Answer> {
  if (!isRecord(value)) return {}

  return Object.fromEntries(
    Object.entries(value).filter(
      ([questionId, answer]) => knownIds.has(questionId) && isRecord(answer),
    ),
  ) as Record<string, Answer>
}

export function createBrieflyStore(template: TemplateId) {
  const knownQuestionIds = new Set(
    loadFormConfig(`?t=${template}`).questions.map((question) => question.id),
  )
  const storage = createSafeStorage(`briefly:${template}`)

  const createStore = () =>
    create<BrieflyState>()(
      persist(
        (set, get) => ({
          answers: {},
          setAnswer: (questionId, answer) => {
            if (!knownQuestionIds.has(questionId)) return
            set((state) => ({
              answers: { ...state.answers, [questionId]: answer },
            }))
          },
          getAnswer: (questionId) => get().answers[questionId] ?? {},
          clearAnswer: (questionId) =>
            set((state) => {
              const answers = { ...state.answers }
              delete answers[questionId]
              return { answers }
            }),
        }),
        {
          name: `briefly:${template}`,
          storage: createJSONStorage(() => storage),
          version: storageVersion,
          partialize: (state) => ({ answers: state.answers }),
          migrate: (persistedState) => ({
            answers: sanitizeAnswers(
              isRecord(persistedState) ? persistedState.answers : undefined,
              knownQuestionIds,
            ),
          }),
          merge: (persistedState, currentState) => ({
            ...currentState,
            answers: sanitizeAnswers(
              isRecord(persistedState) ? persistedState.answers : undefined,
              knownQuestionIds,
            ),
          }),
        },
      ),
    )

  return createStore()
}

const stores = new Map<TemplateId, BrieflyStore>()

export function getBrieflyStore(template: TemplateId) {
  let store = stores.get(template)
  if (!store) {
    store = createBrieflyStore(template)
    stores.set(template, store)
  }
  return store
}
