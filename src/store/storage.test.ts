import { describe, expect, it, vi } from 'vitest'
import { createSafeStorage, getStorageStatus } from './storage'

describe('safe storage fallback', () => {
  it('keeps reads and writes working in memory when localStorage is inaccessible', () => {
    const key = 'briefly:test-access-failure'
    const storage = createSafeStorage(key)
    const storageGetter = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('storage access denied')
    })

    storage.setItem(key, 'in memory')

    expect(storage.getItem(key)).toBe('in memory')
    storageGetter.mockRestore()
    storage.removeItem(key)
    expect(storage.getItem(key)).toBeNull()
    expect(getStorageStatus(key).getState().available).toBe(false)
  })
})
