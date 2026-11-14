import { describe, expect, it, vi } from 'vitest'
import { loadFormConfig } from '../data'
import type { Answer } from '../data/types'
import type { ClientProfile } from '../store/briefly-store'
import { copyText, formatBriefText } from './brief-export'

const profile: ClientProfile = {
  name: '  Ayoub  ',
  company: 'Studio',
  email: 'ayoub@example.com',
  phone: '+216 00 000 000',
  projectName: 'Briefly',
}

describe('formatBriefText', () => {
  const questions = loadFormConfig('?t=web').questions

  it('formats client details, free text, stable choices, notes, links and feature priorities', () => {
    const answers: Record<string, Answer> = {
      problem: { value: '  Reduce duplicate work  ' },
      roles: { value: [{ name: 'Customers', note: 'External users' }] },
      walkthrough: { value: 'Open the dashboard and review new orders.' },
      features: {
        value: [
          { title: 'Order tracking', description: 'Show delivery status', priority: 'must-have' },
          { title: 'Reports', description: '', priority: undefined },
        ],
      },
      inspiration: { value: [{ url: 'https://example.com', note: 'Simple layout' }] },
      services: { value: { selected: ['payments', 'other'], note: 'Accounting API' } },
    }

    const output = formatBriefText(profile, 'Website', questions, answers)

    expect(output).toContain('- Client:   Ayoub  ')
    expect(output).toContain('- Project: Briefly')
    expect(output).toContain(
      '## What problem are you trying to solve, and how do you deal with it today?\n\nReduce duplicate work',
    )
    expect(output).toContain('- Customers | External users')
    expect(output).toContain('- Order tracking: Show delivery status (must-have)')
    expect(output).toContain('- Reports (not prioritized yet)')
    expect(output).toContain('- https://example.com | Simple layout')
    expect(output).toContain('- Payments')
    expect(output).toContain('- Accounting API')
  })

  it('distinguishes unsure, blank, and whitespace-only answers', () => {
    const output = formatBriefText(profile, 'Website', questions, {
      problem: { notSure: true },
      roles: { value: [] },
      walkthrough: { value: '  ' },
    })

    expect(output).toContain('[Not sure yet]')
    expect(output).toContain('[Left blank]')
  })

  it('uses English choice labels regardless of selected id and includes unknown ids as fallback', () => {
    const output = formatBriefText(profile, 'Website', questions, {
      'web.device': { value: 'phone' },
      services: { value: { selected: ['unknown-service'], note: '' } },
    })

    expect(output).toContain('- Phone')
    expect(output).toContain('- unknown-service')
  })
})

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
