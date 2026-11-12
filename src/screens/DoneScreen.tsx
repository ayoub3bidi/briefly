import { useState } from 'react'
import type { Lang, Question, TemplateId } from '../data/types'
import type { BrieflyStore, ClientProfile } from '../store/briefly-store'
import { formatBriefText, copyText } from '../lib/brief-export'
import { printBrief } from '../print/print'
import { isIOSSafari } from '../lib/browser'

type Props = {
  profile: ClientProfile
  questions: Question[]
  store: BrieflyStore
  template: TemplateId
  copy: Record<string, string>
}

const templateNames: Record<TemplateId, Record<Lang, string>> = {
  web: { en: 'Website', fr: 'Site web', ar: 'موقع إلكتروني' },
  mobile: { en: 'Mobile app', fr: 'Application mobile', ar: 'تطبيق جوّال' },
  auto: { en: 'Automation', fr: 'Automatisation', ar: 'أتمتة' },
  generic: { en: 'General project', fr: 'Projet général', ar: 'مشروع عام' },
}

export function DoneScreen({ profile, questions, store, template, copy }: Props) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [emailCopied, setEmailCopied] = useState(false)
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL.trim()
  const contactWhatsApp = import.meta.env.VITE_CONTACT_WA.replace(/\D/g, '')
  const briefText = formatBriefText(profile, templateNames[template].en, questions, store.getState().answers)
  const project = profile.projectName || profile.name
  const emailSubject = copy.emailSubject.replace('{project}', project)
  const emailBody = copy.emailBody.replace('{next}', copy.doneNext)
  const whatsappBody = copy.whatsappBody.replace('{project}', project).replace('{next}', copy.doneNext)
  const emailHref = `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
  const whatsappHref = `https://wa.me/${contactWhatsApp}?text=${encodeURIComponent(whatsappBody)}`
  const iosSafari = isIOSSafari(navigator.userAgent)

  async function copyBrief() {
    const copied = await copyText(briefText)
    setCopyState(copied ? 'copied' : 'failed')
  }

  async function copyContactEmail() {
    const copied = await copyText(contactEmail)
    setEmailCopied(copied)
  }

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{copy.doneTitle}</h1>
      <section className="mt-6 rounded-2xl bg-indigo-50 p-5" aria-labelledby="next-steps-title">
        <h2 id="next-steps-title" className="text-base font-semibold text-indigo-950">{copy.whatNext}</h2>
        <p className="mt-2 text-sm leading-6 text-indigo-950">{copy.doneNext}</p>
      </section>
      {iosSafari && <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-start text-sm leading-6 text-slate-700" role="note">{copy.iosPrintTip}</p>}

      <div className="mt-6 grid gap-3">
        <button type="button" onClick={() => void copyBrief()} className="min-h-12 rounded-xl border border-indigo-700 px-4 text-start text-sm font-semibold text-indigo-800 hover:bg-indigo-50">{copy.copyText}</button>
        {copyState !== 'idle' && <p role="status" className="text-sm text-slate-600">{copyState === 'copied' ? copy.copied : copy.copyFailed}</p>}
        <button type="button" onClick={() => void printBrief(profile)} className="min-h-12 rounded-xl border border-slate-300 px-4 text-start text-sm font-semibold text-slate-800 hover:bg-slate-50">{copy.downloadPdf}</button>
      </div>

      {contactEmail ? (
        <section className="mt-7 border-t border-slate-100 pt-5">
          <h2 className="text-base font-semibold text-slate-900">{copy.sendEmail}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a href={emailHref} className="inline-flex min-h-12 items-center rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white hover:bg-indigo-800">{copy.sendEmail}</a>
            <button type="button" onClick={() => void copyContactEmail()} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">{emailCopied ? copy.copied : copy.copyEmail}</button>
          </div>
          <p className="user-text mt-2 text-sm text-slate-600" dir="ltr">{contactEmail}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{copy.emailAttachHint}</p>
        </section>
      ) : <p className="mt-6 text-sm leading-6 text-slate-600" role="status">{copy.contactNotConfigured}</p>}

      {contactWhatsApp ? (
        <section className="mt-6 border-t border-slate-100 pt-5">
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50">{copy.sendWhatsapp}</a>
        </section>
      ) : <p className="mt-3 text-sm text-slate-600" role="status">{copy.whatsappNotConfigured}</p>}
    </div>
  )
}
