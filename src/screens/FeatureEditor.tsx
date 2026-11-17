import { useRef } from 'react'
import type { Lang } from '../data/types'

export type Feature = {
  id: string
  title: string
  description: string
  priority?: 'must-have' | 'nice-to-have' | 'later'
}

type Props = {
  value: unknown
  language: Lang
  copy: Record<string, string>
  onChange: (features: Feature[]) => void
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function FeatureEditor({ value, language, copy, onChange }: Props) {
  const features = Array.isArray(value) ? (value as Feature[]) : []
  const pendingFocusId = useRef<string | null>(null)

  function move(index: number, offset: -1 | 1) {
    const destination = index + offset
    if (destination < 0 || destination >= features.length) return
    const reordered = [...features]
    ;[reordered[index], reordered[destination]] = [reordered[destination], reordered[index]]
    onChange(reordered)
  }

  return (
    <div>
      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
        {features.map((feature, index) => (
          <fieldset key={feature.id} className="min-w-0 rounded-xl border border-line p-3">
            <legend className="sr-only">
              {copy.featureTitle} {index + 1}
            </legend>
            <div>
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <div className="flex min-w-0 flex-1 basis-full gap-2 sm:basis-auto">
                  <input
                    ref={(node) => {
                      if (node && pendingFocusId.current === feature.id) {
                        node.focus()
                        pendingFocusId.current = null
                      }
                    }}
                    aria-label={`${copy.featureTitle} ${index + 1}`}
                    name={`feature-title-${index}`}
                    value={feature.title}
                    onChange={(event) =>
                      onChange(
                        features.map((item, i) =>
                          i === index ? { ...item, title: event.target.value } : item,
                        ),
                      )
                    }
                    placeholder={copy.featureTitle}
                    className="user-text min-h-12 min-w-0 flex-1 rounded-lg border border-line px-3 text-start"
                  />
                  <button
                    type="button"
                    aria-label={`${copy.remove} ${index + 1}`}
                    onClick={() => onChange(features.filter((_, i) => i !== index))}
                    className="min-h-12 shrink-0 rounded-lg px-3 text-sm font-medium text-error hover:bg-error/10"
                  >
                    {copy.remove}
                  </button>
                </div>
                <div className="flex w-full justify-end gap-1 sm:w-auto">
                  <button
                    type="button"
                    disabled={index === 0}
                    aria-label={`${copy.moveUp} ${index + 1}`}
                    onClick={() => move(index, -1)}
                    className="min-h-12 min-w-12 rounded-lg text-lg text-ink hover:bg-ink/5 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === features.length - 1}
                    aria-label={`${copy.moveDown} ${index + 1}`}
                    onClick={() => move(index, 1)}
                    className="min-h-12 min-w-12 rounded-lg text-lg text-ink hover:bg-ink/5 disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <div>
                <input
                  aria-label={`${copy.featureDescription} ${index + 1}`}
                  name={`feature-description-${index}`}
                  value={feature.description}
                  onChange={(event) =>
                    onChange(
                      features.map((item, i) =>
                        i === index ? { ...item, description: event.target.value } : item,
                      ),
                    )
                  }
                  placeholder={copy.featureDescription}
                  className="user-text mt-2 min-h-11 w-full rounded-lg border border-line px-3 text-start"
                />
                <label className="mt-3 block text-start text-sm font-medium text-ink">
                  {copy.priority}
                  <select
                    aria-label={`${copy.priority} ${index + 1}`}
                    value={feature.priority ?? ''}
                    onChange={(event) => {
                      const priority = event.target.value as Feature['priority'] | ''
                      onChange(
                        features.map((item, i) =>
                          i === index ? { ...item, priority: priority || undefined } : item,
                        ),
                      )
                    }}
                    className="mt-1 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-start"
                  >
                    <option value="">{copy.notPrioritized}</option>
                    <option value="must-have">{copy.mustHave}</option>
                    <option value="nice-to-have">{copy.niceToHave}</option>
                    <option value="later">{copy.later}</option>
                  </select>
                </label>
              </div>
            </div>
            <span className="sr-only" lang={language}>
              {copy.featureTitle}
            </span>
          </fieldset>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          const feature = { id: newId(), title: '', description: '' }
          pendingFocusId.current = feature.id
          onChange([...features, feature])
        }}
        className="min-h-11 rounded-lg px-3 text-sm font-semibold text-ink hover:bg-ink/5"
      >
        + {copy.addItem}
      </button>
    </div>
  )
}
