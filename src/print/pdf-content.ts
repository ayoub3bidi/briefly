import type { Answer, Lang, Question } from '../data/types'
import { roleAnswerLines } from '../lib/role-answer'

type Copy = Record<string, string>
type Feature = { title?: string; description?: string; priority?: string }
type Entry = { name?: string; url?: string; note?: string }

export function getPdfAnswerLines(question: Question, answer: Answer, language: Lang, copy: Copy) {
  const value = answer.value
  if (question.id === 'roles') return roleAnswerLines(value, question.options ?? [], language)
  if (question.type === 'features' && Array.isArray(value)) {
    return (value as Feature[])
      .filter((feature) => feature.title?.trim() || feature.description?.trim())
      .map((feature) =>
        [
          feature.title,
          feature.description,
          feature.priority
            ? ({
                'must-have': copy.mustHave,
                'nice-to-have': copy.niceToHave,
                later: copy.later,
              }[feature.priority] ?? copy.notPrioritized)
            : copy.notPrioritized,
        ]
          .filter(Boolean)
          .join(' | '),
      )
  }
  if ((question.type === 'list' || question.type === 'links') && Array.isArray(value)) {
    return (value as Entry[])
      .filter((entry) => entry.name?.trim() || entry.url?.trim() || entry.note?.trim())
      .map((entry) => [entry.name || entry.url, entry.note].filter(Boolean).join(' | '))
  }
  if (question.type === 'single' || question.type === 'multi') {
    const structured =
      typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
    const selected = question.allowNote ? structured.selected : value
    const ids: string[] = Array.isArray(selected)
      ? selected.filter((id): id is string => typeof id === 'string')
      : typeof selected === 'string'
        ? [selected]
        : []
    const labels = ids.map(
      (id) => question.options?.find((option) => option.id === id)?.label[language] ?? id,
    )
    if (typeof structured.note === 'string' && structured.note.trim()) labels.push(structured.note)
    return labels
  }
  return typeof value === 'string' && value.trim() ? [value] : []
}
