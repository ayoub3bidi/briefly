import { Document, Font, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import cairoArabic400 from '@fontsource/cairo/files/cairo-arabic-400-normal.woff'
import cairoArabic700 from '@fontsource/cairo/files/cairo-arabic-700-normal.woff'
import cairoLatin400 from '@fontsource/cairo/files/cairo-latin-400-normal.woff'
import cairoLatin700 from '@fontsource/cairo/files/cairo-latin-700-normal.woff'
import type { Answer, Lang, Question, TemplateId } from '../data/types'
import type { ClientProfile } from '../store/briefly-store'
import { getPdfAnswerLines } from './pdf-content'

Font.register({
  family: 'Cairo Arabic',
  fonts: [
    { src: cairoArabic400, fontWeight: 400 },
    { src: cairoArabic700, fontWeight: 700 },
  ],
})
Font.register({
  family: 'Cairo Latin',
  fonts: [
    { src: cairoLatin400, fontWeight: 400 },
    { src: cairoLatin700, fontWeight: 700 },
  ],
})

type Copy = Record<string, string>
type Props = {
  profile: ClientProfile
  questions: Question[]
  answers: Record<string, Answer>
  template: TemplateId
  language: Lang
  createdAt: Date
  copy: Copy
}

const templateNames: Record<TemplateId, Record<Lang, string>> = {
  web: { en: 'Website', fr: 'Site web', ar: 'موقع إلكتروني' },
  mobile: { en: 'Mobile app', fr: 'Application mobile', ar: 'تطبيق جوّال' },
  auto: { en: 'Automation', fr: 'Automatisation', ar: 'أتمتة' },
  generic: { en: 'General project', fr: 'Projet général', ar: 'مشروع عام' },
}

const sectionNames: Record<string, Record<Lang, string>> = {
  project: { en: 'Project summary', fr: 'Résumé du projet', ar: 'ملخص المشروع' },
  roles: { en: 'People and roles', fr: 'Personnes et rôles', ar: 'الأشخاص والأدوار' },
  walkthrough: { en: 'Typical use', fr: 'Utilisation type', ar: 'طريقة الاستخدام المعتادة' },
  features: { en: 'Features', fr: 'Fonctionnalités', ar: 'الوظائف' },
  inspiration: { en: 'Inspiration', fr: 'Sources d’inspiration', ar: 'مصادر الإلهام' },
  services: { en: 'Services and languages', fr: 'Services et langues', ar: 'الخدمات واللغات' },
  constraints: { en: 'Constraints', fr: 'Contraintes', ar: 'القيود' },
  template: {
    en: 'Project-specific details',
    fr: 'Détails propres au projet',
    ar: 'تفاصيل خاصة بالمشروع',
  },
  open: {
    en: 'Open questions for our call',
    fr: 'Questions à préciser ensemble',
    ar: 'أسئلة لمناقشتها معًا',
  },
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 38,
    paddingBottom: 48,
    paddingHorizontal: 42,
    fontSize: 10,
    lineHeight: 1.5,
    color: '#172033',
    fontFamily: 'Cairo Latin',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#4338ca',
    paddingBottom: 15,
    marginBottom: 18,
  },
  brand: { fontSize: 10, fontWeight: 700, color: '#4338ca' },
  title: { fontSize: 22, fontWeight: 700, marginTop: 7, lineHeight: 1.2 },
  subtitle: { color: '#64748b', marginTop: 2, fontSize: 9 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 4 },
  metaItem: { width: '48%', fontSize: 9 },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 3,
    marginBottom: 6,
  },
  row: { marginTop: 7 },
  question: { fontSize: 10, fontWeight: 700, marginBottom: 2 },
  context: { color: '#64748b', fontSize: 8, marginBottom: 3 },
  answer: { marginLeft: 9, marginBottom: 2 },
  tag: { color: '#475569', fontSize: 9, marginTop: 2 },
  featureGroup: { marginTop: 5 },
  groupTitle: { fontSize: 9, fontWeight: 700, marginBottom: 2 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 42,
    right: 42,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 5,
    color: '#64748b',
    fontSize: 8,
  },
})

function hasContent(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.some(hasContent)
  if (typeof value === 'object' && value !== null)
    return Object.entries(value).some(([key, child]) => key !== 'id' && hasContent(child))
  return false
}

function QuestionAnswer({
  question,
  answer,
  language,
  copy,
  open = false,
}: {
  question: Question
  answer: Answer
  language: Lang
  copy: Copy
  open?: boolean
}) {
  const lines = getPdfAnswerLines(question, answer, language, copy)
  return (
    <View style={styles.row}>
      <Text style={styles.question}>{open ? question.label.en : question.label[language]}</Text>
      {language !== 'en' && (
        <Text style={styles.context}>{open ? question.label[language] : question.label.en}</Text>
      )}
      {answer.notSure ? (
        <Text style={styles.tag}>{copy.clientUnsure}</Text>
      ) : lines.length === 0 ? (
        <Text style={styles.tag}>{copy.leftBlank}</Text>
      ) : (
        lines.map((line, index) => (
          <Text key={`${question.id}-${index}`} style={styles.answer}>
            • {line}
          </Text>
        ))
      )}
    </View>
  )
}

function Section({
  id,
  language,
  children,
}: {
  id: string
  language: Lang
  children: React.ReactNode
}) {
  return (
    <View style={styles.section}>
      <View wrap={false} break={id === 'constraints'}>
        <Text style={styles.sectionTitle}>{sectionNames[id][language]}</Text>
        {language !== 'en' && <Text style={styles.context}>{sectionNames[id].en}</Text>}
      </View>
      {children}
    </View>
  )
}

export function BriefPdf({
  profile,
  questions,
  answers,
  template,
  language,
  createdAt,
  copy,
}: Props) {
  const questionMap = new Map(questions.map((question) => [question.id, question]))
  const get = (id: string) => questionMap.get(id)
  const openQuestions = questions.filter((question) => {
    const answer = answers[question.id] ?? {}
    return answer.notSure || !hasContent(answer.value)
  })
  const direction = language === 'ar' ? 'rtl' : 'ltr'
  const fontFamily =
    language === 'ar' ? ['Cairo Arabic', 'Cairo Latin'] : ['Cairo Latin', 'Cairo Arabic']
  const date = new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(createdAt)
  const common = { language, copy }
  const templateQuestionIds = new Set([
    'problem',
    'roles',
    'walkthrough',
    'features',
    'inspiration',
    'services',
    'languages',
    'deadline',
    'budget',
    'success',
    'outOfScope',
  ])

  return (
    <Document
      title={`Briefly | ${profile.projectName || copy.doneTitle}`}
      author="Briefly"
      creator="Briefly"
      producer="Briefly"
      language={language}
    >
      <Page size="A4" style={[styles.page, { direction, fontFamily }]}>
        <View style={styles.header}>
          <Text style={styles.brand}>Briefly · {templateNames[template][language]}</Text>
          <Text style={styles.title}>{profile.projectName || copy.doneTitle}</Text>
          {language !== 'en' && <Text style={styles.subtitle}>Project brief</Text>}
          <View style={styles.meta}>
            {[
              [copy.name, profile.name],
              [copy.company, profile.company],
              [copy.email, profile.email],
              [copy.phone, profile.phone],
              [copy.projectName, profile.projectName || copy.leftBlank],
              [sectionNames.template[language], templateNames[template][language]],
              [copy.language, language.toUpperCase()],
              [date, ''],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <Text key={label} style={styles.metaItem}>
                  <Text style={{ fontWeight: 700 }}>{label}: </Text>
                  {value}
                </Text>
              ))}
            <Text style={styles.metaItem}>{date}</Text>
          </View>
        </View>

        <Section id="project" {...common}>
          {get('problem') && (
            <QuestionAnswer question={get('problem')!} answer={answers.problem ?? {}} {...common} />
          )}
        </Section>
        <Section id="roles" {...common}>
          {get('roles') && (
            <QuestionAnswer question={get('roles')!} answer={answers.roles ?? {}} {...common} />
          )}
        </Section>
        <Section id="walkthrough" {...common}>
          {get('walkthrough') && (
            <QuestionAnswer
              question={get('walkthrough')!}
              answer={answers.walkthrough ?? {}}
              {...common}
            />
          )}
        </Section>
        <Section id="features" {...common}>
          {get('features') && (
            <QuestionAnswer
              question={get('features')!}
              answer={answers.features ?? {}}
              {...common}
            />
          )}
        </Section>
        <Section id="inspiration" {...common}>
          {get('inspiration') && (
            <QuestionAnswer
              question={get('inspiration')!}
              answer={answers.inspiration ?? {}}
              {...common}
            />
          )}
        </Section>
        <Section id="services" {...common}>
          {['services', 'languages'].map(
            (id) =>
              get(id) && (
                <QuestionAnswer
                  key={id}
                  question={get(id)!}
                  answer={answers[id] ?? {}}
                  {...common}
                />
              ),
          )}
        </Section>
        <Section id="constraints" {...common}>
          {['deadline', 'budget', 'success', 'outOfScope'].map(
            (id) =>
              get(id) && (
                <QuestionAnswer
                  key={id}
                  question={get(id)!}
                  answer={answers[id] ?? {}}
                  {...common}
                />
              ),
          )}
        </Section>
        <Section id="template" {...common}>
          {questions
            .filter((question) => !templateQuestionIds.has(question.id))
            .map((question) => (
              <QuestionAnswer
                key={question.id}
                question={question}
                answer={answers[question.id] ?? {}}
                {...common}
              />
            ))}
        </Section>
        <Section id="open" {...common}>
          {openQuestions.length ? (
            openQuestions.map((question) => (
              <QuestionAnswer
                key={question.id}
                question={question}
                answer={answers[question.id] ?? {}}
                open
                {...common}
              />
            ))
          ) : (
            <Text>{copy.leftBlank}</Text>
          )}
        </Section>
        <Text fixed style={[styles.footer, { direction, fontFamily, textAlign: 'center' }]}>
          Made with Briefly
        </Text>
      </Page>
    </Document>
  )
}
