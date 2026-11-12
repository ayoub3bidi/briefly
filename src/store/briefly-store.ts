import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { loadFormConfig } from '../data'
import type { Answer, TemplateId } from '../data/types'
import { createSafeStorage } from './storage'

const storageVersion = 1

export type ClientProfile = {
  name: string
  company: string
  email: string
  phone: string
  projectName: string
}

export type FormScreen = 'intro' | 'about' | 'questions' | 'review' | 'done'

const emptyProfile: ClientProfile = {
  name: '',
  company: '',
  email: '',
  phone: '',
  projectName: '',
}

export type BrieflyState = {
  answers: Record<string, Answer>
  profile: ClientProfile
  screen: FormScreen
  questionIndex: number
  setAnswer: (questionId: string, answer: Answer) => void
  getAnswer: (questionId: string) => Answer
  clearAnswer: (questionId: string) => void
  setProfile: (profile: ClientProfile) => void
  setScreen: (screen: FormScreen) => void
  setQuestionIndex: (index: number) => void
}

export type BrieflyStore = UseBoundStore<StoreApi<BrieflyState>>

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

function sanitizeProfile(value: unknown): ClientProfile {
  if (!isRecord(value)) return { ...emptyProfile }
  return {
    name: typeof value.name === 'string' ? value.name : '',
    company: typeof value.company === 'string' ? value.company : '',
    email: typeof value.email === 'string' ? value.email : '',
    phone: typeof value.phone === 'string' ? value.phone : '',
    projectName: typeof value.projectName === 'string' ? value.projectName : '',
  }
}

function sanitizeScreen(value: unknown): FormScreen {
  if (value === 'intro' || value === 'about' || value === 'questions' || value === 'review' || value === 'done') {
    return value
  }
  return 'intro'
}

function sanitizeQuestionIndex(value: unknown, questionCount: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || questionCount < 1) return 0
  return Math.min(Math.max(value, 0), questionCount - 1)
}

export function createBrieflyStore(template: TemplateId) {
  const knownQuestionIds = new Set(
    loadFormConfig(`?t=${template}`).questions.map((question) => question.id),
  )
  const questionCount = knownQuestionIds.size
  const storage = createSafeStorage(`briefly:${template}`)

  const createStore = () =>
    create<BrieflyState>()(
      persist(
        (set, get) => ({
          answers: {},
          profile: { ...emptyProfile },
          screen: 'intro',
          questionIndex: 0,
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
          setProfile: (profile) => set({ profile }),
          setScreen: (screen) => set({ screen }),
          setQuestionIndex: (questionIndex) =>
            set({ questionIndex: sanitizeQuestionIndex(questionIndex, questionCount) }),
        }),
        {
          name: `briefly:${template}`,
          storage: createJSONStorage(() => storage),
          version: storageVersion,
          partialize: (state) => ({
            answers: state.answers,
            profile: state.profile,
            screen: state.screen,
            questionIndex: state.questionIndex,
          }),
          migrate: (persistedState) => ({
            answers: sanitizeAnswers(
              isRecord(persistedState) ? persistedState.answers : undefined,
              knownQuestionIds,
            ),
            profile: sanitizeProfile(isRecord(persistedState) ? persistedState.profile : undefined),
            screen: sanitizeScreen(isRecord(persistedState) ? persistedState.screen : undefined),
            questionIndex: sanitizeQuestionIndex(
              isRecord(persistedState) ? persistedState.questionIndex : undefined,
              questionCount,
            ),
          }),
          merge: (persistedState, currentState) => ({
            ...currentState,
            answers: sanitizeAnswers(
              isRecord(persistedState) ? persistedState.answers : undefined,
              knownQuestionIds,
            ),
            profile: sanitizeProfile(isRecord(persistedState) ? persistedState.profile : undefined),
            screen: sanitizeScreen(isRecord(persistedState) ? persistedState.screen : undefined),
            questionIndex: sanitizeQuestionIndex(
              isRecord(persistedState) ? persistedState.questionIndex : undefined,
              questionCount,
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
