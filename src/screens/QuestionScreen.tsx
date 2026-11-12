import { useStore } from 'zustand'
import type { Lang, Question } from '../data/types'
import type { BrieflyStore } from '../store/briefly-store'

type Copy = Record<string, string>

type Props = {
  questions: Question[]
  language: Lang
  copy: Copy
  store: BrieflyStore
  onBackToAbout: () => void
  onFinish: () => void
}

type Entry = { name?: string; url?: string; note?: string }
const emptyAnswer = {}

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {}
}

export function QuestionScreen({ questions, language, copy, store, onBackToAbout, onFinish }: Props) {
  const index = useStore(store, (state) => state.questionIndex)
  const question = questions[index]
  const answer = useStore(store, (state) => state.answers[question.id] ?? emptyAnswer)
  const setAnswer = useStore(store, (state) => state.setAnswer)
  const setQuestionIndex = useStore(store, (state) => state.setQuestionIndex)
  const value = answer.value
  const textValue = typeof value === 'string' ? value : ''
  const selectedValue = Array.isArray(value) ? value as string[] : typeof value === 'string' ? [value] : []
  const structured = record(value)
  const selected = Array.isArray(structured.selected) ? structured.selected as string[] : typeof structured.selected === 'string' ? [structured.selected] : []

  function update(nextValue: unknown) {
    setAnswer(question.id, { value: nextValue })
  }

  function back() {
    if (index === 0) onBackToAbout()
    else setQuestionIndex(index - 1)
  }

  function next() {
    if (index === questions.length - 1) onFinish()
    else setQuestionIndex(index + 1)
  }

  function updateEntries(entries: Entry[]) {
    update(entries.filter((entry) => (entry.name ?? entry.url ?? '').trim() || entry.note?.trim()))
  }

  return (
    <div className="mt-9">
      <div className="mb-7">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-600">
          <span>{copy.questionProgress.replace('{current}', String(index + 1)).replace('{total}', String(questions.length))}</span>
          <span aria-hidden="true">{Math.round(((index + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={copy.progress} aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={index + 1}>
          <div className="h-full rounded-full bg-indigo-700 transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">{question.label[language]}</h1>
      {question.help && <p className="mt-3 text-base leading-7 text-slate-600">{question.help[language] ?? question.help.en}</p>}
      {question.example && (
        <details className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-950">
          <summary className="cursor-pointer font-semibold">{copy.seeExample}</summary>
          <p className="mt-3 leading-6">{question.example[language] ?? question.example.en}</p>
        </details>
      )}

      <div className="mt-6 space-y-3">
        {(question.type === 'longText' || question.type === 'features') && (
          <textarea aria-label={question.label[language]} value={textValue} onChange={(event) => update(event.target.value)} rows={question.type === 'features' ? 3 : 5} className="user-text min-h-32 w-full rounded-xl border border-slate-300 p-4 text-start leading-7 text-slate-900 outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
        )}
        {question.type === 'shortText' && (
          <input aria-label={question.label[language]} value={textValue} onChange={(event) => update(event.target.value)} className="user-text min-h-12 w-full rounded-xl border border-slate-300 px-4 text-start text-slate-900 outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
        )}
        {(question.type === 'list' || question.type === 'links') && (() => {
          const entries = Array.isArray(value) ? value as Entry[] : []
          const placeholder = question.type === 'links' ? copy.url : copy.itemName
          const key = question.type === 'links' ? 'url' : 'name'
          return <div className="space-y-3">{entries.map((entry, entryIndex) => (
            <div key={entryIndex} className="rounded-xl border border-slate-200 p-3">
              <div className="flex gap-2">
                <input aria-label={`${placeholder} ${entryIndex + 1}`} value={entry[key] ?? ''} onChange={(event) => updateEntries(entries.map((item, i) => i === entryIndex ? { ...item, [key]: event.target.value } : item))} placeholder={placeholder} className="user-text min-h-12 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-start" />
                <button type="button" onClick={() => updateEntries(entries.filter((_, i) => i !== entryIndex))} className="min-h-12 rounded-lg px-3 text-sm font-medium text-rose-700 hover:bg-rose-50">{copy.remove}</button>
              </div>
              <input aria-label={copy.itemNote} value={entry.note ?? ''} onChange={(event) => updateEntries(entries.map((item, i) => i === entryIndex ? { ...item, note: event.target.value } : item))} placeholder={copy.itemNote} className="user-text mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-start" />
            </div>
          ))}<button type="button" onClick={() => updateEntries([...entries, { [key]: '' }])} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">+ {copy.addItem}</button></div>
        })()}
        {(question.type === 'single' || question.type === 'multi') && question.options?.map((option) => {
          const multi = question.type === 'multi'
          const checked = multi ? (question.allowNote ? selected : selectedValue).includes(option.id) : (question.allowNote ? structured.selected === option.id : value === option.id)
          return <label key={option.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-start hover:border-indigo-300 has-[:checked]:border-indigo-700 has-[:checked]:bg-indigo-50">
            <input type={multi ? 'checkbox' : 'radio'} name={question.id} checked={checked} onChange={() => {
              if (question.allowNote) {
                const selection = multi ? (checked ? selected.filter((id) => id !== option.id) : [...selected, option.id]) : option.id
                update({ selected: selection, note: typeof structured.note === 'string' ? structured.note : '' })
              } else if (multi) update(checked ? selectedValue.filter((id) => id !== option.id) : [...selectedValue, option.id])
              else update(option.id)
            }} className="h-4 w-4 accent-indigo-700" />
            <span className="text-sm text-slate-800">{option.label[language]}</span>
          </label>
        })}
        {question.allowNote && (selected.includes('other') || (question.type === 'single' && !!structured.selected)) && (
          <textarea aria-label={copy.additionalDetails} placeholder={copy.additionalDetails} value={typeof structured.note === 'string' ? structured.note : ''} onChange={(event) => update({ ...structured, note: event.target.value })} rows={3} className="user-text min-h-24 w-full rounded-xl border border-slate-300 p-4 text-start" />
        )}
      </div>

      <button type="button" aria-pressed={answer.notSure === true} onClick={() => setAnswer(question.id, answer.notSure ? {} : { notSure: true })} className={`mt-5 min-h-11 rounded-lg px-3 text-sm font-medium ${answer.notSure ? 'bg-indigo-100 text-indigo-900' : 'text-slate-600 hover:bg-slate-100'}`}>{copy.notSure}</button>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <button type="button" onClick={back} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100">{copy.back}</button>
        <button type="button" onClick={next} className="min-h-12 rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white hover:bg-indigo-800">{index === questions.length - 1 ? copy.reviewTitle : copy.next}</button>
      </div>
    </div>
  )
}
