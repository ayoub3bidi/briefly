import { useRef } from 'react'
import type { Lang, Question } from '../data/types'
import { createCustomRole, readRoleAnswer } from '../lib/role-answer'

type Props = {
  value: unknown
  question: Question
  language: Lang
  copy: Record<string, string>
  onChange: (value: unknown) => void
}

export function RoleEditor({ value, question, language, copy, onChange }: Props) {
  const answer = readRoleAnswer(value)
  const pendingFocusId = useRef<string | null>(null)

  function updateCustom(id: string, field: 'name' | 'note', next: string) {
    onChange({
      ...answer,
      custom: answer.custom.map((role) => (role.id === id ? { ...role, [field]: next } : role)),
    })
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options?.map((option) => (
          <label
            key={option.id}
            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-start hover:border-indigo-300 has-[:checked]:border-indigo-700 has-[:checked]:bg-indigo-50"
          >
            <input
              type="checkbox"
              checked={answer.selected.includes(option.id)}
              onChange={() =>
                onChange({
                  ...answer,
                  selected: answer.selected.includes(option.id)
                    ? answer.selected.filter((id) => id !== option.id)
                    : [...answer.selected, option.id],
                })
              }
              className="h-4 w-4 accent-indigo-700"
            />
            <span className="text-sm text-slate-800">{option.label[language]}</span>
          </label>
        ))}
      </div>

      {answer.custom.map((role, index) => (
        <fieldset key={role.id} className="rounded-xl border border-slate-200 p-3">
          <legend className="sr-only">
            {copy.customRole} {index + 1}
          </legend>
          <div className="flex gap-2">
            <input
              ref={(node) => {
                if (node && pendingFocusId.current === role.id) {
                  node.focus()
                  pendingFocusId.current = null
                }
              }}
              aria-label={`${copy.customRole} ${index + 1}`}
              value={role.name}
              onChange={(event) => updateCustom(role.id, 'name', event.target.value)}
              placeholder={copy.customRole}
              className="user-text min-h-12 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-start"
            />
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...answer,
                  custom: answer.custom.filter((item) => item.id !== role.id),
                })
              }
              className="min-h-12 rounded-lg px-3 text-sm font-medium text-rose-700 hover:bg-rose-50"
            >
              {copy.remove}
            </button>
          </div>
          <input
            aria-label={`${copy.itemNote} ${index + 1}`}
            value={role.note}
            onChange={(event) => updateCustom(role.id, 'note', event.target.value)}
            placeholder={copy.itemNote}
            className="user-text mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-start"
          />
        </fieldset>
      ))}

      <button
        type="button"
        onClick={() => {
          const custom = createCustomRole()
          pendingFocusId.current = custom.id
          onChange({ ...answer, custom: [...answer.custom, custom] })
        }}
        className="min-h-11 rounded-lg px-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
      >
        + {copy.addCustomRole}
      </button>
    </div>
  )
}
