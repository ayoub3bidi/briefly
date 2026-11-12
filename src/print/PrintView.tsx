import { useState } from 'react'
import { useStore } from 'zustand'
import type { Answer, Lang, Question, TemplateId } from '../data/types'
import type { BrieflyStore, ClientProfile } from '../store/briefly-store'

type Copy = Record<string, string>
type Props = {
  store: BrieflyStore
  questions: Question[]
  profile: ClientProfile
  template: TemplateId
  language: Lang
  copy: Copy
}

type Feature = { id: string; title?: string; description?: string; priority?: string }
type Entry = { name?: string; url?: string; note?: string }

const sectionCopy: Record<string, Record<Lang, string>> = {
  project: { en: 'Project summary', fr: 'Résumé du projet', ar: 'ملخص المشروع' },
  roles: { en: 'People and roles', fr: 'Personnes et rôles', ar: 'الأشخاص والأدوار' },
  walkthrough: { en: 'Typical use', fr: 'Utilisation type', ar: 'طريقة الاستخدام المعتادة' },
  features: { en: 'Features', fr: 'Fonctionnalités', ar: 'الوظائف' },
  inspiration: { en: 'Inspiration', fr: 'Sources d’inspiration', ar: 'مصادر الإلهام' },
  services: { en: 'Services and languages', fr: 'Services et langues', ar: 'الخدمات واللغات' },
  constraints: { en: 'Constraints', fr: 'Contraintes', ar: 'القيود' },
  template: { en: 'Project-specific details', fr: 'Détails propres au projet', ar: 'تفاصيل خاصة بالمشروع' },
  open: { en: 'Open questions for our call', fr: 'Questions à préciser ensemble', ar: 'أسئلة لمناقشتها معًا' },
}

const templateNames: Record<TemplateId, Record<Lang, string>> = {
  web: { en: 'Website', fr: 'Site web', ar: 'موقع إلكتروني' },
  mobile: { en: 'Mobile app', fr: 'Application mobile', ar: 'تطبيق جوّال' },
  auto: { en: 'Automation', fr: 'Automatisation', ar: 'أتمتة' },
  generic: { en: 'General project', fr: 'Projet général', ar: 'مشروع عام' },
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {}
}

function hasContent(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.some(hasContent)
  if (typeof value === 'object' && value !== null) return Object.entries(value).some(([key, child]) => key !== 'id' && hasContent(child))
  return false
}

function contextLine(text: string, language: Lang, className = '') {
  return language === 'en' ? null : <p className={`print-context ${className}`} lang="en" dir="ltr">{text}</p>
}

function Section({ id, language, children }: { id: string; language: Lang; children?: React.ReactNode }) {
  const title = sectionCopy[id][language]
  return (
    <section className="print-section">
      <h2>{title}</h2>
      {contextLine(sectionCopy[id].en, language)}
      {children}
    </section>
  )
}

function answerLines(question: Question, answer: Answer, language: Lang, copy: Copy): string[] {
  const value = answer.value
  const structured = asRecord(value)
  if (question.type === 'features' && Array.isArray(value)) {
    return (value as Feature[]).filter((item) => item.title?.trim() || item.description?.trim()).map((item) => {
      const priority = item.priority === 'must-have' ? copy.mustHave : item.priority === 'nice-to-have' ? copy.niceToHave : item.priority === 'later' ? copy.later : copy.notPrioritized
      return [item.title, item.description, priority].filter(Boolean).join(' — ')
    })
  }
  if ((question.type === 'list' || question.type === 'links') && Array.isArray(value)) {
    return (value as Entry[]).filter((item) => item.name?.trim() || item.url?.trim() || item.note?.trim()).map((item) => [item.name ?? item.url, item.note].filter(Boolean).join(' — '))
  }
  if (question.type === 'single' || question.type === 'multi') {
    const selected = question.allowNote ? structured.selected : value
    const ids = Array.isArray(selected) ? selected : typeof selected === 'string' ? [selected] : []
    const labels = ids.map((id) => question.options?.find((option) => option.id === id)?.label[language] ?? id)
    if (typeof structured.note === 'string' && structured.note.trim()) labels.push(structured.note)
    return labels
  }
  return typeof value === 'string' && value.trim() ? [value] : []
}

function QuestionAnswer({ question, answer, language, copy, openLabel }: { question: Question; answer: Answer; language: Lang; copy: Copy; openLabel?: string }) {
  const lines = answerLines(question, answer, language, copy)
  return (
    <div className="print-row">
      <h3>{language === 'en' && !openLabel ? question.label.en : openLabel ?? question.label[language]}</h3>
      {openLabel ? language !== 'en' && <p className="print-context">{question.label[language]}</p> : contextLine(question.label.en, language)}
      {answer.notSure ? <p className="print-tag">{copy.clientUnsure}</p> : lines.length === 0 ? <p className="print-tag">{copy.leftBlank}</p> : (
        <ul>{lines.map((line, index) => <li key={`${question.id}-${index}`} className="user-text">{line}</li>)}</ul>
      )}
    </div>
  )
}

function ContactLine({ label, value }: { label: string; value: string }) {
  return value ? <p className="user-text"><strong>{label}:</strong> {value}</p> : null
}

export function PrintView({ store, questions, profile, template, language, copy }: Props) {
  const answers = useStore(store, (state) => state.answers)
  const questionById = new Map(questions.map((question) => [question.id, question]))
  const get = (id: string) => questionById.get(id)
  const openQuestions = questions.filter((question) => {
    const answer = answers[question.id] ?? {}
    return answer.notSure || !hasContent(answer.value)
  })
  const [now] = useState(() => new Date())
  const date = new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(now)
  const priorityGroups: Array<{ key: string; label: string }> = [
    { key: 'must-have', label: copy.mustHave },
    { key: 'nice-to-have', label: copy.niceToHave },
    { key: 'later', label: copy.later },
    { key: 'unset', label: copy.notPrioritized },
  ]

  return (
    <article id="print-view" lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="print-header">
        <p className="print-brand">Briefly · {templateNames[template][language]}</p>
        <h1>{profile.projectName || copy.doneTitle}</h1>
        {contextLine('Project brief', language, 'print-header-context')}
        <div className="print-meta">
          <ContactLine label={copy.name} value={profile.name} />
          <ContactLine label={copy.company} value={profile.company} />
          <ContactLine label={copy.email} value={profile.email} />
          <ContactLine label={copy.phone} value={profile.phone} />
          <p><strong>{copy.projectName}:</strong> {profile.projectName || copy.leftBlank}</p>
          <p><strong>{sectionCopy.template[language]}:</strong> {templateNames[template][language]}</p>
          <p><strong>{copy.language}:</strong> {language.toUpperCase()}</p>
          <p><strong>{date}</strong></p>
        </div>
      </header>

      <Section id="project" language={language}>
        {get('problem') && <QuestionAnswer question={get('problem')!} answer={answers.problem ?? {}} language={language} copy={copy} />}
      </Section>
      <Section id="roles" language={language}>
        {get('roles') && <QuestionAnswer question={get('roles')!} answer={answers.roles ?? {}} language={language} copy={copy} />}
      </Section>
      <Section id="walkthrough" language={language}>
        {get('walkthrough') && <QuestionAnswer question={get('walkthrough')!} answer={answers.walkthrough ?? {}} language={language} copy={copy} />}
      </Section>
      <Section id="features" language={language}>
        {get('features') && (() => {
          const question = get('features')!
          const answer = answers.features ?? {}
          const features = Array.isArray(answer.value) ? answer.value as Feature[] : []
          return <div className="print-row">
            <h3>{question.label[language]}</h3>
            {contextLine(question.label.en, language)}
            {answer.notSure ? <p className="print-tag">{copy.clientUnsure}</p> : features.length === 0 ? <p className="print-tag">{copy.leftBlank}</p> : priorityGroups.map((group) => {
              const grouped = features.filter((feature) => (feature.priority ?? 'unset') === group.key && (feature.title?.trim() || feature.description?.trim()))
              if (!grouped.length) return null
              return <div key={group.key} className="print-feature-group">
                <h4>{group.label}</h4>
                {contextLine(group.key === 'must-have' ? 'Must-have' : group.key === 'nice-to-have' ? 'Nice-to-have' : group.key === 'later' ? 'Later' : 'Not prioritized yet', language)}
                <ul>{grouped.map((feature) => <li key={feature.id} className="user-text">{[feature.title, feature.description].filter(Boolean).join(' — ')}</li>)}</ul>
              </div>
            })}
          </div>
        })()}
      </Section>
      <Section id="inspiration" language={language}>
        {get('inspiration') && <QuestionAnswer question={get('inspiration')!} answer={answers.inspiration ?? {}} language={language} copy={copy} />}
      </Section>
      <Section id="services" language={language}>
        {get('services') && <QuestionAnswer question={get('services')!} answer={answers.services ?? {}} language={language} copy={copy} />}
        {get('languages') && <QuestionAnswer question={get('languages')!} answer={answers.languages ?? {}} language={language} copy={copy} />}
      </Section>
      <Section id="constraints" language={language}>
        {get('deadline') && <QuestionAnswer question={get('deadline')!} answer={answers.deadline ?? {}} language={language} copy={copy} />}
        {get('budget') && <QuestionAnswer question={get('budget')!} answer={answers.budget ?? {}} language={language} copy={copy} />}
        {get('success') && <QuestionAnswer question={get('success')!} answer={answers.success ?? {}} language={language} copy={copy} />}
        {get('outOfScope') && <QuestionAnswer question={get('outOfScope')!} answer={answers.outOfScope ?? {}} language={language} copy={copy} />}
      </Section>
      <Section id="template" language={language}>
        {questions.filter((question) => !['problem', 'roles', 'walkthrough', 'features', 'inspiration', 'services', 'languages', 'deadline', 'budget', 'success', 'outOfScope'].includes(question.id)).map((question) => (
          <QuestionAnswer key={question.id} question={question} answer={answers[question.id] ?? {}} language={language} copy={copy} />
        ))}
      </Section>
      <Section id="open" language={language}>
        {openQuestions.length === 0 ? <p>{copy.leftBlank}</p> : openQuestions.map((question) => (
          <QuestionAnswer key={question.id} question={question} answer={answers[question.id] ?? {}} language={language} copy={copy} openLabel={question.label.en} />
        ))}
      </Section>
    </article>
  )
}
