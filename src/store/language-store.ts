import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Lang } from '../data/types'
import { createSafeStorage } from './storage'

const supportedLanguages = new Set<Lang>(['en', 'fr', 'ar'])
const storageVersion = 1

export type LanguageState = {
  language: Lang
  setLanguage: (language: Lang) => void
}

function readPersistedLanguage(value: unknown): Lang {
  if (
    typeof value === 'object' &&
    value !== null &&
    'language' in value &&
    typeof value.language === 'string' &&
    supportedLanguages.has(value.language as Lang)
  ) {
    return value.language as Lang
  }
  return 'en'
}

function createLanguageStore() {
  const storage = createSafeStorage('briefly:lang')

  return create<LanguageState>()(
    persist(
      (set) => ({
        language: 'en',
        setLanguage: (language) => set({ language }),
      }),
      {
        name: 'briefly:lang',
        storage: createJSONStorage(() => storage),
        version: storageVersion,
        partialize: (state) => ({ language: state.language }),
        migrate: (persistedState) => ({ language: readPersistedLanguage(persistedState) }),
        merge: (persistedState, currentState) => ({
          ...currentState,
          language: readPersistedLanguage(persistedState),
        }),
      },
    ),
  )

}

export const useLanguageStore = createLanguageStore()
