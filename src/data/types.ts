export type Lang = 'en' | 'fr' | 'ar'

export type L10n = Record<Lang, string>

export type TemplateId = 'web' | 'mobile' | 'auto' | 'generic'

export type QuestionType =
  | 'longText'
  | 'shortText'
  | 'list'
  | 'links'
  | 'features'
  | 'single'
  | 'multi'

export type QuestionOption = {
  id: string
  label: L10n
}

export type Question = {
  id: string
  type: QuestionType
  label: L10n
  help?: L10n
  example?: L10n
  options?: QuestionOption[]
  allowNote?: boolean
}

export type Answer = {
  notSure?: boolean
  value?: unknown
}
