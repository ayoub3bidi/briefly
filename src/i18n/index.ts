import ar from './ar'
import en from './en'
import fr from './fr'
import type { Lang } from '../data/types'

export type UiMessages = { [Key in keyof typeof en]: string }

export const messages: Record<Lang, UiMessages> = { en, fr, ar }

export function formatMessage(message: string, values: Record<string, string | number> = {}) {
  return message.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`))
}
