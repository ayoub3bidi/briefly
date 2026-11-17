import { useState } from 'react'
import { createElement } from 'react'
import type { Lang, Question, TemplateId } from '../data/types'
import type { BrieflyStore, ClientProfile } from '../store/briefly-store'
import { copyText } from '../lib/brief-export'

type Props = {
  profile: ClientProfile
  questions: Question[]
  store: BrieflyStore
  template: TemplateId
  language: Lang
  copy: Record<string, string>
}

// Stable identity so React attaches it once. showModal traps focus, makes the page inert, handles
// Escape, and focuses the first button (Cancel), so the safe choice is the default.
function openAsModal(node: HTMLDialogElement | null) {
  if (node && !node.open) node.showModal()
}

export function DoneScreen({ profile, questions, store, template, language, copy }: Props) {
  const [pdfState, setPdfState] = useState<'idle' | 'preparing' | 'failed'>('idle')
  const [createdAt] = useState(() => new Date())
  const [emailCopied, setEmailCopied] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const contactEmail = (import.meta.env.VITE_CONTACT_EMAIL ?? '').trim()
  const contactWhatsApp = (import.meta.env.VITE_CONTACT_WA ?? '').replace(/\D/g, '')
  const project = profile.projectName || profile.name
  const emailSubject = copy.emailSubject.replace('{project}', project)
  const emailBody = copy.emailBody.replace('{next}', copy.doneNext)
  const whatsappBody = copy.whatsappBody
    .replace('{project}', project)
    .replace('{next}', copy.doneNext)
  const emailHref = `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
  const whatsappHref = `https://wa.me/${contactWhatsApp}?text=${encodeURIComponent(whatsappBody)}`
  async function copyContactEmail() {
    const copied = await copyText(contactEmail)
    setEmailCopied(copied)
  }

  async function downloadPdf() {
    setPdfState('preparing')
    try {
      const [{ pdf }, { BriefPdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../print/BriefPdf'),
      ])
      const document = createElement(BriefPdf, {
        profile,
        questions,
        answers: store.getState().answers,
        template,
        language,
        createdAt,
        copy,
      })
      const blob = await pdf(document).toBlob()
      const objectUrl = URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      const filename = (profile.projectName || profile.name || 'brief')
        .normalize('NFKD')
        .replace(/[^\p{L}\p{N}-]+/gu, '-')
        .replace(/^-|-$/g, '')
      link.href = objectUrl
      link.download = `briefly-${filename || 'brief'}.pdf`
      window.document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
      setPdfState('idle')
    } catch (error) {
      console.error('PDF generation failed', error)
      setPdfState('failed')
    }
  }

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {copy.doneTitle}
      </h1>
      <section className="mt-6 rounded-2xl bg-ink/5 p-5" aria-labelledby="next-steps-title">
        <h2 id="next-steps-title" className="text-base font-semibold text-ink">
          {copy.whatNext}
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink">{copy.doneNext}</p>
      </section>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink cursor-pointer hover:bg-ink/5 hover:text-ink hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto"
        >
          <svg
            aria-hidden="true"
            className="size-5 shrink-0 rtl:-scale-x-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {copy.startOver}
        </button>
        <button
          type="button"
          onClick={() => void downloadPdf()}
          disabled={pdfState === 'preparing'}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-5 text-sm font-semibold text-paper shadow-sm cursor-pointer transition-[background-color,box-shadow] duration-300 ease-in-out hover:bg-ink/85 hover:shadow-lg active:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          <svg aria-hidden="true" className="size-5 shrink-0" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
          {pdfState === 'preparing' ? copy.pdfPreparing : copy.downloadPdf}
        </button>
        {pdfState === 'failed' && (
          <p role="status" className="col-span-2 text-sm text-error">
            {copy.pdfFailed}
          </p>
        )}
      </div>

      {/* Mounted only while open: a hidden-but-mounted confirm stayed keyboard-reachable. */}
      {confirmReset && (
        <dialog
          ref={openAsModal}
          aria-labelledby="start-over-title"
          onClose={() => setConfirmReset(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) event.currentTarget.close()
          }}
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-paper text-ink shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        >
          <div className="p-6">
            <h2 id="start-over-title" className="text-lg font-semibold text-ink">
              {copy.startOver}
            </h2>
            <p className="mt-2 text-sm text-muted">{copy.startOverConfirm}</p>
          </div>
          <div className="border-t border-line p-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="min-h-11 rounded-xl px-4 text-sm font-medium text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {copy.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                store.getState().reset()
                setConfirmReset(false)
              }}
              className="min-h-11 rounded-xl bg-error px-5 text-sm font-medium text-paper hover:bg-error/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
            >
              {copy.confirmStartOver}
            </button>
          </div>
        </dialog>
      )}

      <section className="mt-7 border-t border-line pt-5">
        {(contactEmail || contactWhatsApp) && (
          <div className="flex flex-wrap items-center gap-3">
            {contactWhatsApp && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-line px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <svg
                  aria-hidden="true"
                  className="size-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 0 7h0.12" />
                </svg>
                {copy.sendWhatsapp}
              </a>
            )}
            {contactEmail && (
              <>
                <a
                  href={emailHref}
                  className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-ink/40 px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {copy.sendEmail}
                </a>
                <button
                  type="button"
                  onClick={() => void copyContactEmail()}
                  aria-label={`${emailCopied ? copy.copied : copy.copyEmail}: ${contactEmail}`}
                  className="group relative inline-flex min-h-12 w-full max-w-full items-center justify-center overflow-hidden rounded-xl border border-line px-6 text-sm font-semibold text-ink cursor-pointer transition-colors duration-200 hover:border-ink/40 hover:bg-ink/5 hover:text-ink focus-visible:border-ink/40 focus-visible:bg-ink/5 focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none sm:w-auto"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4 shrink-0 me-1.5 opacity-100 transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <rect x="2" y="2" width="13" height="13" rx="2" ry="2" />
                    <path d="M4 11h10" />
                    <path d="M4 15h10" />
                  </svg>
                  <span className="transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none">
                    {emailCopied ? copy.copied : copy.copyEmail}
                  </span>
                  <span
                    aria-hidden="true"
                    dir="ltr"
                    className="user-text absolute inset-0 flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap px-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                  >
                    {contactEmail}
                  </span>
                </button>
              </>
            )}
          </div>
        )}
        {contactEmail ? (
          <p className="mt-3 text-sm leading-6 text-muted">{copy.emailAttachHint}</p>
        ) : (
          <p className="text-sm leading-6 text-muted" role="status">
            {copy.contactNotConfigured}
          </p>
        )}
      </section>
    </div>
  )
}
