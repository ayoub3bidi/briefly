import { describe, expect, it } from 'vitest'
import { resolveTemplate } from './index'

describe('resolveTemplate', () => {
  it('accepts supported template ids and falls back to generic for unknown values', () => {
    expect(['web', 'mobile', 'auto', 'generic'].map(resolveTemplate)).toEqual([
      'web',
      'mobile',
      'auto',
      'generic',
    ])
    expect(resolveTemplate('unknown')).toBe('generic')
    expect(resolveTemplate(null)).toBe('generic')
  })
})
