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
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {copy.doneTitle}
      </h1>
      <section className="mt-6 rounded-2xl bg-indigo-50 p-5" aria-labelledby="next-steps-title">
        <h2 id="next-steps-title" className="text-base font-semibold text-indigo-950">
          {copy.whatNext}
        </h2>
        <p className="mt-2 text-sm leading-6 text-indigo-950">{copy.doneNext}</p>
      </section>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 sm:w-auto"
        >
          <svg
            aria-hidden="true"
            className="size-5 shrink-0"
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
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white shadow-sm cursor-pointer transition-[background-color,box-shadow] duration-300 ease-in-out hover:bg-indigo-600 hover:shadow-lg active:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 motion-reduce:transition-none disabled:cursor-wait disabled:opacity-70 sm:w-auto"
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
          <p role="status" className="col-span-2 text-sm text-rose-700">
            {copy.pdfFailed}
          </p>
        )}
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-out ${confirmReset ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setConfirmReset(false)}
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out"
          onClick={(event) => event.stopPropagation()}
        />
        <div
          className={`relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl mx-4 transition-all duration-300 ease-out ${confirmReset ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-950">{copy.startOver}</h2>
            <p className="mt-2 text-sm text-slate-600">{copy.startOverConfirm}</p>
          </div>
          <div className="border-t border-slate-200 p-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="min-h-11 rounded-xl px-4 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
            >
              {copy.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                store.getState().reset()
                setConfirmReset(false)
              }}
              className="min-h-11 rounded-xl bg-rose-600 px-5 text-sm font-medium text-white hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              {copy.confirmStartOver}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-7 border-t border-slate-100 pt-5">
        {(contactEmail || contactWhatsApp) && (
          <div className="flex flex-wrap items-center gap-3">
            {contactWhatsApp && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-green-200 px-5 text-sm font-semibold text-green-800 transition-colors hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
                  className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-indigo-200 px-5 text-sm font-semibold text-indigo-800 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
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
                  className="group relative inline-flex min-h-12 w-full max-w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 px-6 text-sm font-semibold text-slate-700 cursor-pointer transition-colors duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800 focus-visible:border-indigo-300 focus-visible:bg-indigo-50 focus-visible:text-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 motion-reduce:transition-none sm:w-auto"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4 shrink-0 mr-1.5 opacity-100 transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none"
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
          <p className="mt-3 text-sm leading-6 text-slate-600">{copy.emailAttachHint}</p>
        ) : (
          <p className="text-sm leading-6 text-slate-600" role="status">
            {copy.contactNotConfigured}
          </p>
        )}
      </section>
    </div>
  )
}
