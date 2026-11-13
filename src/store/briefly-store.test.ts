import { describe, expect, it } from 'vitest'
import { createBrieflyStore } from './briefly-store'

describe('template draft store', () => {
  it('keeps drafts isolated by template and ignores unknown question ids', () => {
    const web = createBrieflyStore('web')
    const generic = createBrieflyStore('generic')

    web.getState().setAnswer('problem', { value: 'Website draft' })
    web.getState().setAnswer('removed-question', { value: 'stale data' })

    expect(web.getState().getAnswer('problem')).toEqual({ value: 'Website draft' })
    expect(web.getState().getAnswer('removed-question')).toEqual({})
    expect(generic.getState().getAnswer('problem')).toEqual({})
    expect(JSON.parse(localStorage.getItem('briefly:web') ?? '{}').state.answers.problem).toEqual({
      value: 'Website draft',
    })
    expect(localStorage.getItem('briefly:generic')).toBeNull()
  })

  it('clamps question navigation to valid indices and clears answers', () => {
    const store = createBrieflyStore('generic')
    store.getState().setQuestionIndex(-12)
    expect(store.getState().questionIndex).toBe(0)

    store.getState().setQuestionIndex(10_000)
    expect(store.getState().questionIndex).toBe(14)

    store.getState().setAnswer('problem', { value: 'temporary' })
    store.getState().clearAnswer('problem')
    expect(store.getState().getAnswer('problem')).toEqual({})
  })

  it('migrates old drafts, drops removed questions, sanitizes profile, and bounds navigation', () => {
    localStorage.setItem(
      'briefly:web',
      JSON.stringify({
        state: {
          answers: {
            problem: { value: 'preserved' },
            staleQuestion: { value: 'removed' },
            roles: 'not-an-answer-object',
          },
          profile: { name: 'Client', company: 9, email: null },
          screen: 'unknown-screen',
          questionIndex: 999,
        },
        version: 0,
      }),
    )

    const store = createBrieflyStore('web')

    expect(store.getState().answers).toEqual({ problem: { value: 'preserved' } })
    expect(store.getState().profile).toEqual({
      name: 'Client',
      company: '',
      email: '',
      phone: '',
      projectName: '',
    })
    expect(store.getState().screen).toBe('intro')
    expect(store.getState().questionIndex).toBe(14)
  })

  it('reset wipes in-memory state and removes the draft from localStorage', () => {
    const store = createBrieflyStore('generic')
    store.getState().setAnswer('problem', { value: 'some answer' })
    store.getState().setProfile({
      name: 'Client One',
      company: 'Studio',
      email: 'client@example.com',
      phone: '+216 00 000 000',
      projectName: 'My project',
    })
    store.getState().setScreen('done')
    store.getState().setQuestionIndex(5)

    expect(localStorage.getItem('briefly:generic')).not.toBeNull()

    store.getState().reset()

    expect(store.getState().answers).toEqual({})
    expect(store.getState().profile).toEqual({
      name: '',
      company: '',
      email: '',
      phone: '',
      projectName: '',
    })
    expect(store.getState().screen).toBe('intro')
    expect(store.getState().questionIndex).toBe(0)
    expect(localStorage.getItem('briefly:generic')).toBeNull()
  })
})
