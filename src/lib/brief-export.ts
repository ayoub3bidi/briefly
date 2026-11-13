import type { Answer, Question } from '../data/types'
import type { ClientProfile } from '../store/briefly-store'
import { roleAnswerLines } from './role-answer'

type Entry = { name?: string; url?: string; note?: string }
type Feature = { title?: string; description?: string; priority?: string }

function answerText(question: Question, answer: Answer): string {
  if (answer.notSure) return '[Not sure yet]'
  const value = answer.value
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (question.id === 'roles') {
    const roles = roleAnswerLines(value, question.options ?? [], 'en')
    return roles.length ? roles.map((role) => `- ${role}`).join('\n') : '[Left blank]'
  }
  if (question.type === 'features' && Array.isArray(value)) {
    const items = (value as Feature[])
      .filter((feature) => feature.title?.trim() || feature.description?.trim())
      .map((feature) => {
        const priority = feature.priority ? ` (${feature.priority})` : ' (not prioritized yet)'
        return `- ${[feature.title, feature.description].filter(Boolean).join(': ')}${priority}`
      })
    return items.length ? items.join('\n') : '[Left blank]'
  }
  if ((question.type === 'list' || question.type === 'links') && Array.isArray(value)) {
    const entries = (value as Entry[])
      .filter((entry) => entry.name?.trim() || entry.url?.trim() || entry.note?.trim())
      .map((entry) => `- ${[entry.name ?? entry.url, entry.note].filter(Boolean).join(' — ')}`)
    return entries.length ? entries.join('\n') : '[Left blank]'
  }
  if (question.type === 'single' || question.type === 'multi') {
    const structured =
      typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
    const selected = question.allowNote ? structured.selected : value
    const ids = Array.isArray(selected) ? selected : typeof selected === 'string' ? [selected] : []
    const labels = ids.map(
      (id) => question.options?.find((option) => option.id === id)?.label.en ?? id,
    )
    if (typeof structured.note === 'string' && structured.note.trim())
      labels.push(structured.note.trim())
    return labels.length ? labels.map((label) => `- ${label}`).join('\n') : '[Left blank]'
  }
  return '[Left blank]'
}

export function formatBriefText(
  profile: ClientProfile,
  templateName: string,
  questions: Question[],
  answers: Record<string, Answer>,
) {
  const lines = [
    '# Project brief',
    '',
    `- Client: ${profile.name || '[Not provided]'}`,
    `- Company: ${profile.company || '[Not provided]'}`,
    `- Email: ${profile.email || '[Not provided]'}`,
    `- Phone / WhatsApp: ${profile.phone || '[Not provided]'}`,
    `- Project: ${profile.projectName || '[Not provided]'}`,
    `- Type: ${templateName}`,
    `- Date: ${new Date().toLocaleDateString('en-CA')}`,
    '',
  ]

  for (const question of questions) {
    lines.push(`## ${question.label.en}`, '', answerText(question, answers[question.id] ?? {}), '')
  }
  return lines.join('\n')
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the selection-based copy path for browsers with restricted clipboard access.
  }

  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.append(field)
  field.select()
  const copied = document.execCommand('copy')
  field.remove()
  return copied
}
