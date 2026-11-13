import { describe, expect, it } from 'vitest'
import { readRoleAnswer, roleAnswerLines } from './role-answer'

const options = [{ id: 'customers', label: { en: 'Customers', fr: 'Clients', ar: 'العملاء' } }]

describe('role answers', () => {
  it('reads saved freeform role entries without losing names or notes', () => {
    expect(readRoleAnswer([{ name: 'Dispatch', note: 'Assign drivers' }])).toEqual({
      selected: [],
      custom: [{ id: 'legacy-0', name: 'Dispatch', note: 'Assign drivers' }],
    })
  })

  it('formats selected presets and custom roles in the chosen language', () => {
    expect(
      roleAnswerLines(
        {
          selected: ['customers'],
          custom: [{ id: 'custom-1', name: 'Dispatch', note: 'Assign drivers' }],
        },
        options,
        'fr',
      ),
    ).toEqual(['Clients', 'Dispatch — Assign drivers'])
  })
})
