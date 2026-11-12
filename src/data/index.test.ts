import { describe, expect, it } from 'vitest'
import { loadFormConfig, resolveLanguage, resolveTemplate } from './index'

describe('template and language resolution', () => {
  it.each([
    ['web', 'web'],
    ['mobile', 'mobile'],
    ['auto', 'auto'],
    ['generic', 'generic'],
    ['unknown', 'generic'],
    [null, 'generic'],
  ])('resolves template %s to %s', (input, expected) => {
    expect(resolveTemplate(input)).toBe(expected)
  })

  it.each([
    ['ar', 'fr', 'en-US', 'ar'],
    ['fr', 'ar', 'en-US', 'fr'],
    ['unsupported', 'ar', 'fr-FR', 'ar'],
    [null, null, 'fr-FR', 'fr'],
    [null, null, 'ar-TN', 'ar'],
    [null, null, 'de-DE', 'en'],
  ])('resolves language with precedence (%s, %s, %s)', (url, saved, browser, expected) => {
    expect(resolveLanguage(url, saved, browser)).toBe(expected)
  })

  it.each([
    ['web', 15],
    ['generic', 15],
    ['mobile', 15],
    ['auto', 15],
  ] as const)('loads the core and %s question set', (template, questionCount) => {
    const config = loadFormConfig(`?t=${template}&lang=fr`)
    expect(config.template).toBe(template)
    expect(config.language).toBe('fr')
    expect(config.questions).toHaveLength(questionCount)
    expect(new Set(config.questions.map(({ id }) => id)).size).toBe(questionCount)
  })

  it('falls back to Generic when the template is missing or unknown', () => {
    expect(loadFormConfig('').template).toBe('generic')
    expect(loadFormConfig('?t=made-up').questions.map(({ id }) => id)).toEqual(
      loadFormConfig('?t=generic').questions.map(({ id }) => id),
    )
  })

  it('provides localized labels and valid stable option identifiers for every question', () => {
    const templates = (['web', 'mobile', 'auto', 'generic'] as const).map(
      (template) => loadFormConfig(`?t=${template}`).questions,
    )

    for (const question of [...loadFormConfig('?t=generic').questions, ...templates.flat()]) {
      for (const language of ['en', 'fr', 'ar'] as const) {
        expect(question.label[language], `${question.id} label (${language})`).toBeTruthy()
        for (const copy of [question.help, question.example]) {
          if (copy) expect(copy[language], `${question.id} guidance (${language})`).toBeTruthy()
        }
      }
      const optionIds = question.options?.map(({ id }) => id) ?? []
      expect(new Set(optionIds).size, `${question.id} option ids`).toBe(optionIds.length)
      for (const option of question.options ?? []) {
        for (const language of ['en', 'fr', 'ar'] as const) {
          expect(option.label[language], `${question.id}.${option.id} (${language})`).toBeTruthy()
        }
      }
    }
  })
})
