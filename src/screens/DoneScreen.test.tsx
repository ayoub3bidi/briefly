import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { loadFormConfig } from '../data'
import { getBrieflyStore } from '../store/briefly-store'
import { DoneScreen } from './DoneScreen'

function renderDoneScreen({
  language = 'en',
  template = 'generic',
}: { language?: string; template?: string } = {}) {
  const store = getBrieflyStore(template as 'web' | 'generic' | 'mobile' | 'auto')
  store.getState().setProfile({
    name: 'Client One',
    company: 'Studio',
    email: 'client@example.com',
    phone: '+216 00 000 000',
    projectName: 'My project',
  })
  store.getState().setAnswer('problem', { value: 'Reduce missed customer requests' })
  store.getState().setScreen('done')

  const questions = loadFormConfig(`?t=${template}`).questions
  const copy = {
    doneTitle: 'Your brief is ready',
    whatNext: 'What happens next',
    doneNext: 'Send this to me and I’ll come back with a plan and an estimate.',
    downloadPdf: 'Download PDF',
    pdfPreparing: 'Preparing your PDF…',
    pdfFailed: 'Could not create the PDF. Please try again.',
    sendEmail: 'Send by email',
    sendWhatsapp: 'Send by WhatsApp',
    copyEmail: 'Copy email address',
    copied: 'Copied',
    contactNotConfigured:
      'Email sharing is not set up yet. Add VITE_CONTACT_EMAIL to the project environment to enable it.',
    emailAttachHint: 'Attach the PDF to this email before sending.',
    emailSubject: 'Project brief | {project}',
    emailBody: 'Hi, I’ve completed my project brief. I’m attaching the PDF.',
    whatsappBody: 'Hi, I’ve completed the brief for {project}. I’ll attach the PDF here.',
    startOver: 'Start over',
    startOverConfirm:
      'This will erase your saved answers and start the brief from the beginning. Are you sure?',
    cancel: 'Cancel',
    confirmStartOver: 'Yes, start over',
  } as Record<string, string>

  render(
    <DoneScreen
      profile={store.getState().profile}
      questions={questions}
      store={store}
      template={template as 'web' | 'generic' | 'mobile' | 'auto'}
      language={language as 'en' | 'fr' | 'ar'}
      copy={copy}
    />,
  )
  return store
}

describe('DoneScreen start over', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.stubEnv('VITE_CONTACT_EMAIL', 'hello@example.com')
    vi.stubEnv('VITE_CONTACT_WA', '+216 12 345 678')
  })

  it('wipes session data and returns to step one when the user confirms', async () => {
    const user = userEvent.setup()

    const store = renderDoneScreen()

    expect(screen.getByRole('button', { name: 'Download PDF' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start over' })).toBeInTheDocument()
    expect(localStorage.getItem('briefly:generic')).not.toBeNull()

    await user.click(screen.getByRole('button', { name: 'Start over' }))

    // Confirmation modal opens
    expect(screen.getByRole('heading', { name: 'Start over' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Yes, start over' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()

    // Confirming wipes the draft and returns to step one
    await user.click(screen.getByRole('button', { name: 'Yes, start over' }))
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

  it('keeps the confirm buttons out of reach until the dialog is opened', async () => {
    const user = userEvent.setup()
    renderDoneScreen()

    expect(screen.queryByRole('button', { name: 'Yes, start over' })).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Start over' }))
    const dialog = screen.getByRole('dialog', { name: 'Start over' })

    // A click on the dialog element itself is a click on its backdrop.
    await user.click(dialog)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps session data when the user cancels the confirmation', async () => {
    const user = userEvent.setup()

    const store = renderDoneScreen()

    await user.click(screen.getByRole('button', { name: 'Start over' }))

    // Confirmation modal opens
    expect(screen.getByRole('heading', { name: 'Start over' })).toBeInTheDocument()

    // Cancelling keeps the data
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(store.getState().answers).toEqual({
      problem: { value: 'Reduce missed customer requests' },
    })
    expect(store.getState().screen).toBe('done')
    expect(localStorage.getItem('briefly:generic')).not.toBeNull()
  })
})
