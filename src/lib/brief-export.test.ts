import { describe, expect, it, vi } from 'vitest'
import { copyText } from './brief-export'

describe('copyText', () => {
  it('uses the asynchronous clipboard when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })

    await expect(copyText('brief')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('brief')
  })

  it('falls back to selection-based copy when clipboard access rejects', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('clipboard denied')) },
    })
    const execCommand = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    })

    await expect(copyText('fallback text')).resolves.toBe(true)
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea[readonly]')).toBeNull()
  })
})
