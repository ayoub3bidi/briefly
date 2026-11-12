import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { loadFormConfig } from './data'
import { getBrieflyStore } from './store/briefly-store'

function setRoute(search: string) {
  window.history.replaceState({}, '', `/${search}`)
}

function resetDraft(template: 'web' | 'generic' | 'mobile' | 'auto') {
  const store = getBrieflyStore(template)
  const state = store.getState()
  for (const questionId of Object.keys(state.answers)) state.clearAnswer(questionId)
  state.setProfile({ name: '', company: '', email: '', phone: '', projectName: '' })
  state.setQuestionIndex(0)
  state.setScreen('intro')
}

async function enterQuestions(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Start your brief' }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  expect(screen.getByText('Please enter your name to continue.')).toBeInTheDocument()
  await user.type(screen.getByLabelText(/Your name/), 'Client One')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

describe('Briefly flow', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setRoute('?t=generic&lang=en')
    resetDraft('generic')
  })

  it('validates the required name, saves real answers, reviews blanks, returns to answers, and exports', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    render(<App />)

    await enterQuestions(user)

    const problem = screen.getByRole('textbox', {
      name: 'What problem are you trying to solve, and how do you deal with it today?',
    })
    await user.click(screen.getByText('See an example'))
    expect(problem).toHaveValue('')
    await user.click(screen.getByRole('button', { name: 'Not sure yet' }))
    expect(problem).toHaveValue('')
    await user.click(screen.getByRole('button', { name: 'Not sure yet' }))
    await user.type(problem, 'Reduce missed customer requests')

    const languagePicker = screen.getByLabelText('Language')
    await user.selectOptions(languagePicker, 'ar')
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
    await user.selectOptions(languagePicker, 'en')
    expect(problem).toHaveValue('Reduce missed customer requests')

    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: /Add another/ }))
    await user.type(screen.getByRole('textbox', { name: 'Name 1' }), 'Customers')
    expect(screen.getByRole('textbox', { name: 'Name 1' })).toHaveValue('Customers')
    for (let index = 1; index < loadFormConfig('?t=generic').questions.length - 1; index += 1) {
      await user.click(screen.getByRole('button', { name: 'Next' }))
    }
    await user.click(screen.getByRole('button', { name: 'Review your answers' }))

    expect(screen.getByRole('heading', { name: 'Review your answers' })).toBeInTheDocument()
    expect(screen.getAllByText('Left blank').length).toBeGreaterThan(0)
    await user.click(screen.getAllByRole('button', { name: 'Go back' })[1])
    expect(
      screen.getByRole('heading', {
        name: 'Who will use this? (e.g. customers, my staff, me as admin)',
      }),
    ).toBeInTheDocument()

    for (let index = 1; index < loadFormConfig('?t=generic').questions.length - 1; index += 1) {
      await user.click(screen.getByRole('button', { name: 'Next' }))
    }
    await user.click(screen.getByRole('button', { name: 'Review your answers' }))
    await user.click(screen.getByRole('button', { name: 'Finish' }))
    expect(screen.getAllByRole('heading', { name: 'Your brief is ready' }).length).toBeGreaterThan(
      0,
    )
    expect(screen.getByRole('link', { name: 'Send by email' }).getAttribute('href')).toMatch(
      /^mailto:/,
    )
    expect(screen.getByRole('link', { name: 'Send by WhatsApp' }).getAttribute('href')).toMatch(
      /^https:\/\/wa\.me\//,
    )
    expect(JSON.parse(localStorage.getItem('briefly:lang') ?? '{}').state.language).toBe('en')
    await user.click(screen.getByRole('button', { name: 'Copy as text' }))
    expect(await screen.findByText('Copied')).toBeInTheDocument()
    expect(writeText).toHaveBeenCalledOnce()
    expect(writeText.mock.calls[0][0]).toContain('Reduce missed customer requests')
  })

  it.each(['web', 'generic', 'mobile', 'auto'] as const)(
    'reaches the %s template question after the shared core questions',
    async (template) => {
      setRoute(`?t=${template}&lang=en`)
      resetDraft(template)
      const user = userEvent.setup()
      render(<App />)
      await enterQuestions(user)

      const questions = loadFormConfig(`?t=${template}`).questions
      for (let index = 0; index < 11; index += 1) {
        await user.click(screen.getByRole('button', { name: 'Next' }))
      }

      expect(screen.getByRole('heading', { name: questions[11].label.en })).toBeInTheDocument()
    },
  )
})
