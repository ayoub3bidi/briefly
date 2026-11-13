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
      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={() => void downloadPdf()}
          disabled={pdfState === 'preparing'}
          className="min-h-12 rounded-xl border border-slate-300 px-4 text-start text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          {pdfState === 'preparing' ? copy.pdfPreparing : copy.downloadPdf}
        </button>
        {pdfState === 'failed' && (
          <p role="status" className="text-sm text-rose-700">
            {copy.pdfFailed}
          </p>
        )}
      </div>

      {contactEmail ? (
        <section className="mt-7 border-t border-slate-100 pt-5">
          <h2 className="text-base font-semibold text-slate-900">{copy.sendEmail}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a
              href={emailHref}
              className="inline-flex min-h-12 items-center rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white hover:bg-indigo-800"
            >
              {copy.sendEmail}
            </a>
            <button
              type="button"
              onClick={() => void copyContactEmail()}
              className="min-h-12 rounded-xl px-4 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              {emailCopied ? copy.copied : copy.copyEmail}
            </button>
          </div>
          <p className="user-text mt-2 text-sm text-slate-600" dir="ltr">
            {contactEmail}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{copy.emailAttachHint}</p>
        </section>
      ) : (
        <p className="mt-6 text-sm leading-6 text-slate-600" role="status">
          {copy.contactNotConfigured}
        </p>
      )}

      {contactWhatsApp ? (
        <section className="mt-6 border-t border-slate-100 pt-5">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            {copy.sendWhatsapp}
          </a>
        </section>
      ) : (
        <p className="mt-3 text-sm text-slate-600" role="status">
          {copy.whatsappNotConfigured}
        </p>
      )}
    </div>
  )
}
