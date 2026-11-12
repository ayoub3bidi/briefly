import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  try {
    window.localStorage.clear()
  } catch {
    // Some storage tests deliberately make localStorage inaccessible.
  }
})
