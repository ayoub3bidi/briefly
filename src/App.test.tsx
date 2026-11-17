import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { loadFormConfig } from './data'
import { getBrieflyStore } from './store/briefly-store'
import { useThemeStore } from './store/theme-store'

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
    vi.unstubAllEnvs()
    window.localStorage.clear()
    setRoute('?t=generic&lang=en')
    resetDraft('generic')
  })

  it('toggles the theme between light and dark only', async () => {
    const user = userEvent.setup()
    useThemeStore.getState().setTheme('system')
    render(<App />)

    const toggle = screen.getByRole('button', { name: 'Theme: Light' })
    await user.click(toggle)
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(toggle).toHaveAccessibleName('Theme: Dark')
    await user.click(toggle)
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(toggle).toHaveAccessibleName('Theme: Light')
  })

  it('blocks an invalid email and focuses the first invalid field', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Start your brief' }))

    await user.type(screen.getByLabelText(/Email/), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText(/Your name/)).toHaveFocus()
    expect(screen.getByText('Please enter a valid email address, or leave it empty.')).toBeVisible()

    await user.type(screen.getByLabelText(/Your name/), 'Client One')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    const email = screen.getByLabelText(/Email/)
    expect(email).toHaveFocus()
    expect(email).toHaveAttribute('aria-invalid', 'true')

    await user.clear(email)
    await user.type(email, 'client@example.com')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('button', { name: 'Not sure yet' })).toBeInTheDocument()
  })

  it('keeps a typed answer when "Not sure yet" is toggled on and off', async () => {
    const user = userEvent.setup()
    render(<App />)
    await enterQuestions(user)

    const problem = screen.getByRole('textbox', {
      name: 'What problem are you trying to solve, and how do you deal with it today?',
    })
    await user.type(problem, 'Draft thoughts')
    const notSure = screen.getByRole('button', { name: 'Not sure yet' })
    await user.click(notSure)
    expect(notSure).toHaveAttribute('aria-pressed', 'true')
    await user.click(notSure)
    expect(notSure).toHaveAttribute('aria-pressed', 'false')
    expect(problem).toHaveValue('Draft thoughts')
    expect(screen.queryByRole('button', { name: 'Back to review' })).not.toBeInTheDocument()
  })

  it('validates the required name, saves real answers, reviews blanks, returns to answers, and exports', async () => {
    const user = userEvent.setup()
    vi.stubEnv('VITE_CONTACT_EMAIL', 'hello@example.com')
    vi.stubEnv('VITE_CONTACT_WA', '+216 12 345 678')
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

    const languageMenu = screen.getByRole('button', { name: 'Language: English' })
    await user.click(languageMenu)
    expect(languageMenu).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{End}{Enter}')
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
    expect(languageMenu).toHaveAttribute('aria-expanded', 'false')
    expect(languageMenu).toHaveFocus()
    await user.click(languageMenu)
    await user.click(screen.getByRole('option', { name: 'English' }))
    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
    expect(problem).toHaveValue('Reduce missed customer requests')

    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByLabelText('Customers'))
    await user.click(screen.getByRole('button', { name: /Add a custom role/ }))
    await user.type(screen.getByRole('textbox', { name: 'Custom role 1' }), 'Warehouse team')
    await user.type(screen.getByRole('textbox', { name: 'Optional note 1' }), 'Prepare orders')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: /Add another/ }))
    await user.type(screen.getByRole('textbox', { name: 'Feature name 1' }), 'Track orders')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: /Add another/ }))
    await user.type(screen.getByRole('textbox', { name: 'Website link 1' }), 'https://example.com')
    await user.click(screen.getByRole('button', { name: /Add another/ }))
    expect(screen.getByRole('textbox', { name: 'Website link 2' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Remove 2' }))
    expect(screen.queryByRole('textbox', { name: 'Website link 2' })).not.toBeInTheDocument()
    for (let index = 4; index < loadFormConfig('?t=generic').questions.length - 1; index += 1) {
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

    await user.click(screen.getByRole('button', { name: 'Back to review' }))
    expect(screen.getByRole('heading', { name: 'Review your answers' })).toBeInTheDocument()
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
    expect(screen.queryByRole('button', { name: 'Copy as text' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Download PDF' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Send by WhatsApp' }).getAttribute('href')).toContain(
      '21612345678',
    )
  })

  it('start over wipes the draft and returns to the intro screen', async () => {
    const user = userEvent.setup()
    vi.stubEnv('VITE_CONTACT_EMAIL', 'hello@example.com')
    vi.stubEnv('VITE_CONTACT_WA', '+216 12 345 678')
    render(<App />)

    await enterQuestions(user)

    // Walk through every question to reach the done screen.
    for (let index = 0; index < loadFormConfig('?t=generic').questions.length - 1; index += 1) {
      await user.click(screen.getByRole('button', { name: 'Next' }))
    }
    await user.click(screen.getByRole('button', { name: 'Review your answers' }))
    await user.click(screen.getByRole('button', { name: 'Finish' }))
    expect(screen.getAllByRole('heading', { name: 'Your brief is ready' }).length).toBeGreaterThan(
      0,
    )
    expect(localStorage.getItem('briefly:generic')).not.toBeNull()

    await user.click(screen.getByRole('button', { name: 'Start over' }))

    // Confirmation modal opens
    expect(screen.getByRole('heading', { name: 'Start over' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Yes, start over' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()

    // Confirming wipes the draft and returns to step one
    await user.click(screen.getByRole('button', { name: 'Yes, start over' }))
    expect(screen.getByRole('button', { name: 'Start your brief' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Your brief is ready' })).not.toBeInTheDocument()
    expect(localStorage.getItem('briefly:generic')).toBeNull()
  })

  it('shows contact setup guidance when optional contact values are missing', () => {
    vi.stubEnv('VITE_CONTACT_EMAIL', '')
    vi.stubEnv('VITE_CONTACT_WA', '')
    const store = getBrieflyStore('generic')
    store.getState().setProfile({
      name: 'Client One',
      company: '',
      email: '',
      phone: '',
      projectName: '',
    })
    store.getState().setScreen('done')

    render(<App />)

    expect(screen.getByText(/Email sharing is not set up yet/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Download PDF' })).toBeInTheDocument()
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
