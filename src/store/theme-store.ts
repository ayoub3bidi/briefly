import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createSafeStorage } from './storage'

export type Theme = 'system' | 'light' | 'dark'

const themes = new Set<Theme>(['system', 'light', 'dark'])
const storageVersion = 1

export type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export function readPersistedTheme(value: unknown): Theme {
  if (
    typeof value === 'object' &&
    value !== null &&
    'theme' in value &&
    typeof value.theme === 'string' &&
    themes.has(value.theme as Theme)
  ) {
    return value.theme as Theme
  }
  return 'system'
}

function createThemeStore() {
  const storage = createSafeStorage('briefly:theme')

  return create<ThemeState>()(
    persist(
      (set) => ({
        theme: 'system',
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'briefly:theme',
        storage: createJSONStorage(() => storage),
        version: storageVersion,
        partialize: (state) => ({ theme: state.theme }),
        migrate: (persistedState) => ({ theme: readPersistedTheme(persistedState) }),
        merge: (persistedState, currentState) => ({
          ...currentState,
          theme: readPersistedTheme(persistedState),
        }),
      },
    ),
  )
}

export const useThemeStore = createThemeStore()
