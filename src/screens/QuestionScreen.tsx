import { useRef } from 'react'
import { useStore } from 'zustand'
import type { Lang, Question } from '../data/types'
import type { BrieflyStore } from '../store/briefly-store'
import { FeatureEditor } from './FeatureEditor'
import { RoleEditor } from './RoleEditor'

type Copy = Record<string, string>

type Props = {
  questions: Question[]
  language: Lang
  copy: Copy
  store: BrieflyStore
  onBackToAbout: () => void
  onFinish: () => void
  onBackToReview?: () => void
}

type Entry = { name?: string; url?: string; note?: string }
const emptyAnswer = {}

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
}

export function QuestionScreen({
  questions,
  language,
  copy,
  store,
  onBackToAbout,
  onFinish,
  onBackToReview,
}: Props) {
  const index = useStore(store, (state) => state.questionIndex)
  const question = questions[index]
  const answer = useStore(store, (state) => state.answers[question.id] ?? emptyAnswer)
  const setAnswer = useStore(store, (state) => state.setAnswer)
  const setQuestionIndex = useStore(store, (state) => state.setQuestionIndex)
  const pendingFocusIndex = useRef<number | null>(null)
  const entryRefs = useRef<Array<HTMLInputElement | null>>([])
  const value = answer.value
  const textValue = typeof value === 'string' ? value : ''
  const selectedValue = Array.isArray(value)
    ? (value as string[])
    : typeof value === 'string'
      ? [value]
      : []
  const structured = record(value)
  const selected = Array.isArray(structured.selected)
    ? (structured.selected as string[])
    : typeof structured.selected === 'string'
      ? [structured.selected]
      : []
  const entries = Array.isArray(value) ? (value as Entry[]) : []

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
    update(entries)
  }

  return (
    <div className="mt-9">
      <div className="mb-7">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm text-muted">
          <span>
            {copy.questionProgress
              .replace('{current}', String(index + 1))
              .replace('{total}', String(questions.length))}
          </span>
          <span aria-hidden="true">{Math.round(((index + 1) / questions.length) * 100)}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-label={copy.progress}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-valuenow={index + 1}
        >
          <div
            className="h-full rounded-full bg-ink transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
        {question.label[language]}
      </h1>
      {question.help && (
        <p className="mt-3 text-base leading-7 text-muted">
          {question.help[language] ?? question.help.en}
        </p>
      )}
      {question.example && (
        <details className="mt-4 rounded-xl bg-ink/5 px-4 py-3 text-sm text-ink">
          <summary className="cursor-pointer font-semibold">{copy.seeExample}</summary>
          <p className="mt-3 leading-6">{question.example[language] ?? question.example.en}</p>
        </details>
      )}

      <div className="mt-6 space-y-3">
        {question.type === 'longText' && (
          <textarea
            aria-label={question.label[language]}
            name={question.id}
            value={textValue}
            onChange={(event) => update(event.target.value)}
            rows={5}
            className="user-text min-h-32 w-full rounded-xl border border-line p-4 text-start leading-7 text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
          />
        )}
        {question.type === 'features' && (
          <FeatureEditor value={value} language={language} copy={copy} onChange={update} />
        )}
        {question.type === 'shortText' && (
          <input
            aria-label={question.label[language]}
            value={textValue}
            onChange={(event) => update(event.target.value)}
            className="user-text min-h-12 w-full rounded-xl border border-line px-4 text-start text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
          />
        )}
        {question.id === 'roles' && (
          <RoleEditor
            value={value}
            question={question}
            language={language}
            copy={copy}
            onChange={update}
          />
        )}
        {(question.type === 'list' || question.type === 'links') &&
          question.id !== 'roles' &&
          (() => {
            const placeholder = question.type === 'links' ? copy.url : copy.itemName
            const key = question.type === 'links' ? 'url' : 'name'
            return (
              <div className="space-y-3">
                {entries.map((entry, entryIndex) => (
                  <div key={entryIndex} className="rounded-xl border border-line p-3">
                    <div className="flex gap-2">
                      <input
                        ref={(node) => {
                          entryRefs.current[entryIndex] = node
                          if (node && pendingFocusIndex.current === entryIndex) {
                            node.focus()
                            pendingFocusIndex.current = null
                          }
                        }}
                        aria-label={`${placeholder} ${entryIndex + 1}`}
                        value={entry[key] ?? ''}
                        onChange={(event) =>
                          updateEntries(
                            entries.map((item, i) =>
                              i === entryIndex ? { ...item, [key]: event.target.value } : item,
                            ),
                          )
                        }
                        placeholder={placeholder}
                        className="user-text min-h-12 min-w-0 flex-1 rounded-lg border border-line px-3 text-start"
                      />
                      <button
                        type="button"
                        aria-label={`${copy.remove} ${entryIndex + 1}`}
                        onClick={() => updateEntries(entries.filter((_, i) => i !== entryIndex))}
                        className="min-h-12 rounded-lg px-3 text-sm font-medium text-error hover:bg-error/10"
                      >
                        {copy.remove}
                      </button>
                    </div>
                    <input
                      aria-label={`${copy.itemNote} ${entryIndex + 1}`}
                      value={entry.note ?? ''}
                      onChange={(event) =>
                        updateEntries(
                          entries.map((item, i) =>
                            i === entryIndex ? { ...item, note: event.target.value } : item,
                          ),
                        )
                      }
                      placeholder={copy.itemNote}
                      className="user-text mt-2 min-h-11 w-full rounded-lg border border-line px-3 text-start"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    pendingFocusIndex.current = entries.length
                    updateEntries([...entries, { [key]: '' }])
                  }}
                  className="min-h-11 rounded-lg px-3 text-sm font-semibold text-ink hover:bg-ink/5"
                >
                  + {copy.addItem}
                </button>
              </div>
            )
          })()}
        {(question.type === 'single' || question.type === 'multi') &&
          question.options?.map((option) => {
            const multi = question.type === 'multi'
            const checked = multi
              ? (question.allowNote ? selected : selectedValue).includes(option.id)
              : question.allowNote
                ? structured.selected === option.id
                : value === option.id
            return (
              <label
                key={option.id}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-start hover:border-ink/40 has-[:checked]:border-ink has-[:checked]:bg-highlighter has-[:checked]:text-on-highlight"
              >
                <input
                  type={multi ? 'checkbox' : 'radio'}
                  name={question.id}
                  checked={checked}
                  onChange={() => {
                    if (question.allowNote) {
                      const selection = multi
                        ? checked
                          ? selected.filter((id) => id !== option.id)
                          : [...selected, option.id]
                        : option.id
                      update({
                        selected: selection,
                        note: typeof structured.note === 'string' ? structured.note : '',
                      })
                    } else if (multi)
                      update(
                        checked
                          ? selectedValue.filter((id) => id !== option.id)
                          : [...selectedValue, option.id],
                      )
                    else update(option.id)
                  }}
                  className="h-4 w-4 accent-on-highlight"
                />
                <span className="text-sm">{option.label[language]}</span>
              </label>
            )
          })}
        {question.allowNote &&
          (selected.includes('other') || (question.type === 'single' && !!structured.selected)) && (
            <textarea
              aria-label={copy.additionalDetails}
              placeholder={copy.additionalDetails}
              value={typeof structured.note === 'string' ? structured.note : ''}
              onChange={(event) => update({ ...structured, note: event.target.value })}
              rows={3}
              className="user-text min-h-24 w-full rounded-xl border border-line p-4 text-start"
            />
          )}
      </div>

      <button
        type="button"
        aria-pressed={answer.notSure === true}
        onClick={() => setAnswer(question.id, { ...answer, notSure: !answer.notSure })}
        className={`mt-5 min-h-11 rounded-lg px-3 text-sm font-medium ${answer.notSure ? 'bg-highlighter text-on-highlight' : 'text-muted hover:bg-ink/5'}`}
      >
        {copy.notSure}
      </button>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5">
        <button
          type="button"
          onClick={back}
          className="min-h-12 rounded-xl px-4 text-sm font-semibold text-ink hover:bg-ink/5"
        >
          {copy.back}
        </button>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {onBackToReview && index < questions.length - 1 && (
            <button
              type="button"
              onClick={onBackToReview}
              className="min-h-12 rounded-xl border border-line px-4 text-sm font-semibold text-ink hover:bg-ink/5"
            >
              {copy.backToReview}
            </button>
          )}
          <button
            type="button"
            onClick={next}
            className="min-h-12 rounded-xl bg-ink px-5 text-sm font-semibold text-paper hover:bg-ink/85"
          >
            {index === questions.length - 1 ? copy.reviewTitle : copy.next}
          </button>
        </div>
      </div>
    </div>
  )
}
