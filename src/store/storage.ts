import { create } from 'zustand'
import type { StateStorage } from 'zustand/middleware'

const memoryStorage = new Map<string, string>()
const storageStatuses = new Map<string, ReturnType<typeof createStorageStatus>>()

function createStorageStatus() {
  return create<{ available: boolean }>()(() => ({ available: true }))
}

export function getStorageStatus(name: string) {
  let status = storageStatuses.get(name)
  if (!status) {
    status = createStorageStatus()
    storageStatuses.set(name, status)
  }
  return status
}

export function createSafeStorage(name: string): StateStorage {
  const status = getStorageStatus(name)

  return {
    getItem(name) {
      try {
        return window.localStorage.getItem(name)
      } catch {
        status.setState({ available: false })
        return memoryStorage.get(name) ?? null
      }
    },
    setItem(name, value) {
      try {
        window.localStorage.setItem(name, value)
        memoryStorage.delete(name)
      } catch {
        status.setState({ available: false })
        memoryStorage.set(name, value)
      }
    },
    removeItem(name) {
      try {
        window.localStorage.removeItem(name)
      } catch {
        status.setState({ available: false })
      }
      memoryStorage.delete(name)
    },
  }
}
