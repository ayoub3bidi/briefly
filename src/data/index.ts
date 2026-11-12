import { autoQuestions } from './auto'
import { coreQuestions } from './core'
import { genericQuestions } from './generic'
import { mobileQuestions } from './mobile'
import { webQuestions } from './web'
import type { Lang, Question, TemplateId } from './types'

const templateQuestions: Record<TemplateId, Question[]> = {
  web: webQuestions,
  mobile: mobileQuestions,
  auto: autoQuestions,
  generic: genericQuestions,
}

export function resolveTemplate(value: string | null | undefined): TemplateId {
  if (value === 'web' || value === 'mobile' || value === 'auto' || value === 'generic') {
    return value
  }
  return 'generic'
}

export function resolveLanguage(
  urlLanguage: string | null | undefined,
  savedLanguage: string | null | undefined,
  browserLanguage: string | null | undefined,
): Lang {
  const supported = (value: string | null | undefined): value is Lang =>
    value === 'en' || value === 'fr' || value === 'ar'

  if (supported(urlLanguage)) return urlLanguage
  if (supported(savedLanguage)) return savedLanguage

  const browserShortLanguage = browserLanguage?.toLowerCase().split('-')[0]
  if (supported(browserShortLanguage)) return browserShortLanguage

  return 'en'
}

export function loadFormConfig(
  search: string | URLSearchParams,
  savedLanguage?: string | null,
  browserLanguage?: string | null,
) {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search
  const template = resolveTemplate(params.get('t'))
  const language = resolveLanguage(params.get('lang'), savedLanguage, browserLanguage)

  return {
    template,
    language,
    questions: [...coreQuestions, ...templateQuestions[template]],
  }
}

export { coreQuestions, templateQuestions }
export type { Answer, Lang, L10n, Question, QuestionOption, QuestionType, TemplateId } from './types'
