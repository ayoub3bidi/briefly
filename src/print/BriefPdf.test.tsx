import { isValidElement, type ReactNode } from 'react'
import { Text } from '@react-pdf/renderer'
import { describe, expect, it } from 'vitest'
import { loadFormConfig } from '../data'
import { messages } from '../i18n'
import { BriefPdf } from './BriefPdf'
import { getPdfAnswerLines, textDirection } from './pdf-content'

function flatten(node: ReactNode): ReactNode[] {
  if (Array.isArray(node)) return node.flatMap(flatten)
  if (!isValidElement(node)) return [node]
  return [node, ...flatten((node.props as { children?: ReactNode }).children)]
}

describe('BriefPdf', () => {
  it('includes Arabic content, RTL direction, and Briefly footer on every page', () => {
    const questions = loadFormConfig('?t=generic&lang=ar').questions
    const document = BriefPdf({
      profile: {
        name: 'ليلى',
        company: 'متجر',
        email: '',
        phone: '',
        projectName: 'متجر إلكتروني',
      },
      questions,
      answers: {
        problem: { value: 'تنظيم الطلبات' },
        roles: { value: { selected: ['customers'], custom: [] } },
      },
      template: 'generic',
      language: 'ar',
      createdAt: new Date('2026-11-13T10:00:00Z'),
      copy: messages.ar,
    })
    const nodes = flatten(document)
    const page = nodes.find(
      (node) =>
        isValidElement(node) &&
        node.type !== Text &&
        'size' in (node.props as Record<string, unknown>),
    )
    expect(page).toBeDefined()
    const pageStyle = (page as { props: { style: Array<Record<string, unknown>> } }).props.style
    expect(pageStyle.some((style) => style.direction === 'rtl')).toBe(true)

    expect(getPdfAnswerLines(questions[0], { value: 'تنظيم الطلبات' }, 'ar', messages.ar)).toEqual([
      'تنظيم الطلبات',
    ])
    expect(
      getPdfAnswerLines(
        questions[1],
        {
          value: { selected: ['customers'], custom: [] },
        },
        'ar',
        messages.ar,
      ),
    ).toEqual(['العملاء'])

    const footer = nodes.find(
      (node) =>
        isValidElement(node) &&
        node.type === Text &&
        (node.props as { fixed?: boolean }).fixed === true,
    )
    expect(footer).toBeDefined()
    expect((footer as { props: { children: string } }).props.children).toBe('Made with Briefly')
  })

  it('gives Arabic header text an explicit direction, since react-pdf does not inherit it', () => {
    const nodes = flatten(
      BriefPdf({
        profile: { name: 'ليلى', company: '', email: '', phone: '', projectName: 'متجر إلكتروني' },
        questions: loadFormConfig('?t=generic').questions,
        answers: {},
        template: 'generic',
        language: 'ar',
        createdAt: new Date('2026-11-13T10:00:00Z'),
        copy: messages.ar,
      }),
    )
    const title = nodes.find(
      (node) =>
        isValidElement(node) && (node.props as { children?: unknown }).children === 'متجر إلكتروني',
    ) as { props: { style: Array<Record<string, unknown>> } }
    const style = Object.assign({}, ...title.props.style)
    expect(style.direction).toBe('rtl')
    // Shrink-to-fit box: right alignment would be measured against the page and push text out.
    expect(style.textAlign).toBe('left')
  })
})

describe('textDirection', () => {
  it.each([
    ['العملاء', 'rtl'],
    ['17 نوفمبر 2026', 'rtl'],
    ['What should it be able to do?', 'ltr'],
    ['Online ordering | أساسية', 'ltr'],
    ['2026', 'ltr'],
  ])('reads %s as %s from its first strong character', (text, expected) => {
    expect(textDirection(text)).toBe(expected)
  })
})
