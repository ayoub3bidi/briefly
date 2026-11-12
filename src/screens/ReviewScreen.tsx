import { useStore } from 'zustand'
import type { Lang, Question } from '../data/types'
import type { BrieflyStore } from '../store/briefly-store'

type Props = {
  questions: Question[]
  language: Lang
  copy: Record<string, string>
  store: BrieflyStore
  onGoBack: (questionIndex: number) => void
  onFinish: () => void
}

type Feature = { title?: string; description?: string; priority?: string }
type Entry = { name?: string; url?: string; note?: string }

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {}
}

function isMeaningful(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'number' || typeof value === 'boolean') return true
  if (Array.isArray(value)) return value.some(isMeaningful)
  if (typeof value === 'object' && value !== null) return Object.entries(value).some(([key, child]) => key !== 'id' && isMeaningful(child))
  return false
}

function priorityLabel(priority: string | undefined, copy: Record<string, string>) {
  if (priority === 'must-have') return copy.mustHave
  if (priority === 'nice-to-have') return copy.niceToHave
  if (priority === 'later') return copy.later
  return copy.notPrioritized
}

export function ReviewScreen({ questions, language, copy, store, onGoBack, onFinish }: Props) {
  const answers = useStore(store, (state) => state.answers)

  return (
    <div className="mt-9">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{copy.reviewTitle}</h1>
      <div className="mt-6 space-y-4">
        {questions.map((question, index) => {
          const answer = answers[question.id] ?? {}
          const value = answer.value
          const structured = asRecord(value)
          const blank = !answer.notSure && !isMeaningful(value)
          let display: string[] = []

          if (question.type === 'features' && Array.isArray(value)) {
            display = (value as Feature[]).filter((feature) => !!feature.title?.trim() || !!feature.description?.trim()).map((feature) => {
              const parts = [feature.title, feature.description].filter(Boolean)
              parts.push(priorityLabel(feature.priority, copy))
              return parts.join(' — ')
            })
          } else if ((question.type === 'list' || question.type === 'links') && Array.isArray(value)) {
            display = (value as Entry[]).filter(isMeaningful).map((entry) => [entry.name ?? entry.url, entry.note].filter(Boolean).join(' — '))
          } else if (question.type === 'single' || question.type === 'multi') {
            const selected = question.allowNote ? structured.selected : value
            const ids = Array.isArray(selected) ? selected : typeof selected === 'string' ? [selected] : []
            display = ids.map((id) => question.options?.find((option) => option.id === id)?.label[language] ?? id)
            if (typeof structured.note === 'string' && structured.note.trim()) display.push(structured.note)
          } else if (typeof value === 'string' && value.trim()) {
            display = [value]
          }

          return (
            <article key={question.id} className="rounded-2xl border border-slate-200 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-start text-base font-semibold leading-6 text-slate-900">{question.label[language]}</h2>
                <button type="button" onClick={() => onGoBack(index)} className="min-h-10 shrink-0 rounded-lg px-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">{copy.goBack}</button>
              </div>
              {(answer.notSure || blank) && (
                <p className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900">
                  {answer.notSure ? copy.clientUnsure : copy.leftBlank}
                </p>
              )}
              {display.length > 0 && (
                <ul className="mt-3 list-inside list-disc space-y-1 text-start text-sm leading-6 text-slate-700">
                  {display.map((line, itemIndex) => <li key={`${question.id}-${itemIndex}`} className="whitespace-pre-wrap">{line}</li>)}
                </ul>
              )}
            </article>
          )
        })}
      </div>
      <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
        <button type="button" onClick={onFinish} className="min-h-12 rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white hover:bg-indigo-800">{copy.finish}</button>
      </div>
    </div>
  )
}
