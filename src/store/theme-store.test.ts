import { describe, expect, it } from 'vitest'
import { readPersistedTheme } from './theme-store'

describe('readPersistedTheme', () => {
  it('keeps a valid theme', () => {
    expect(readPersistedTheme({ theme: 'dark' })).toBe('dark')
  })

  it('falls back to system for invalid values', () => {
    expect(readPersistedTheme({ theme: 'neon' })).toBe('system')
    expect(readPersistedTheme(null)).toBe('system')
    expect(readPersistedTheme('dark')).toBe('system')
  })
})
