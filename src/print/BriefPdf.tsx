import {
  Document,
  Font,
  G,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer'
import cairoArabic400 from '@fontsource/cairo/files/cairo-arabic-400-normal.woff'
import cairoArabic700 from '@fontsource/cairo/files/cairo-arabic-700-normal.woff'
import cairoLatin400 from '@fontsource/cairo/files/cairo-latin-400-normal.woff'
import cairoLatin700 from '@fontsource/cairo/files/cairo-latin-700-normal.woff'
import type { Answer, Lang, Question, TemplateId } from '../data/types'
import type { ClientProfile } from '../store/briefly-store'
import { getPdfAnswerLines, textDirection } from './pdf-content'
import { PEN_STROKE } from '../components/PaperBackground'

// Brand palette (light theme tokens from index.css): the PDF is always printed on white.
const ink = '#141414'
const accent = '#FFE14D'

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
    color: ink,
    fontFamily: 'Cairo Latin',
  },
  header: {
    borderBottomWidth: 4,
    borderBottomColor: accent,
    paddingBottom: 15,
    marginBottom: 18,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brand: { fontSize: 10, fontWeight: 700, color: ink },
  // Highlighter swipe behind the title; padding on a View, since Text backgrounds hug the line box.
  titleMark: {
    alignSelf: 'flex-start',
    backgroundColor: accent,
    marginTop: 9,
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
  title: { fontSize: 22, fontWeight: 700, lineHeight: 1.3 },
  subtitle: { color: '#5C5C58', marginTop: 5, fontSize: 9 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 4 },
  metaItem: { width: '48%', fontSize: 9 },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    borderBottomWidth: 2,
    borderBottomColor: accent,
    paddingBottom: 3,
    marginBottom: 6,
  },
  row: { marginTop: 7 },
  question: { fontSize: 10, fontWeight: 700, marginBottom: 2 },
  context: { color: '#5C5C58', fontSize: 8, marginBottom: 3 },
  answer: { marginBottom: 2, gap: 4 },
  answerText: { flex: 1 },
  tag: {
    color: ink,
    backgroundColor: accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    fontSize: 9,
    marginTop: 2,
  },
  featureGroup: { marginTop: 5 },
  groupTitle: { fontSize: 9, fontWeight: 700, marginBottom: 2 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 42,
    right: 42,
    borderTopWidth: 1,
    borderTopColor: accent,
    paddingTop: 5,
    color: '#5C5C58',
    fontSize: 8,
  },
})

// RTL layout in react-pdf needs explicit help:
// - `direction` is not inherited (unlike textAlign or fontFamily), so each Text sets its own;
// - RTL text is aligned against the page width rather than its box, so textAlign is always
//   explicit: right for full-width blocks, left inside shrink-to-fit boxes (title, tags);
// - flex rows and alignSelf don't mirror, so those flip by language.
function directional(language: Lang) {
  const rtl = language === 'ar'
  return {
    text: (content: string) =>
      ({ direction: textDirection(content), textAlign: rtl ? 'right' : 'left' }) as const,
    fit: (content: string) => ({ direction: textDirection(content), textAlign: 'left' }) as const,
    row: { flexDirection: rtl ? 'row-reverse' : 'row' },
    start: { alignSelf: rtl ? 'flex-end' : 'flex-start' },
    indent: rtl ? { marginRight: 9 } : { marginLeft: 9 },
  } as const
}

// The app's BrandMark: a pen stroke running into a highlighter swipe (same geometry, PDF primitives).
function Logo() {
  return (
    <Svg viewBox="0 0 420 200" style={{ width: 54, height: 26 }}>
      <G transform="rotate(-1.2 309 122)">
        <Path
          d={`${PEN_STROKE} L 240 121`}
          fill="none"
          stroke={ink}
          strokeWidth={12}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Rect x={214} y={92} width={190} height={60} rx={10} fill={accent} />
        <Path
          d="M206 122 L 384 121"
          fill="none"
          stroke={ink}
          strokeWidth={12}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  )
}

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
  const dir = directional(language)
  const label = open ? question.label.en : question.label[language]
  const context = open ? question.label[language] : question.label.en
  return (
    <View style={styles.row}>
      <Text style={[styles.question, dir.text(label)]}>{label}</Text>
      {language !== 'en' && <Text style={[styles.context, dir.text(context)]}>{context}</Text>}
      {answer.notSure ? (
        <Text style={[styles.tag, dir.fit(copy.clientUnsure), dir.start]}>{copy.clientUnsure}</Text>
      ) : lines.length === 0 ? (
        <Text style={[styles.tag, dir.fit(copy.leftBlank), dir.start]}>{copy.leftBlank}</Text>
      ) : (
        lines.map((line, index) => (
          // Bullet in its own column: textkit leaves a leading bullet on the left in RTL lines.
          <View key={`${question.id}-${index}`} style={[styles.answer, dir.row, dir.indent]}>
            <Text>•</Text>
            <Text style={[styles.answerText, dir.text(line)]}>{line}</Text>
          </View>
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
  const dir = directional(language)
  return (
    <View style={styles.section}>
      <View wrap={false} break={id === 'constraints'}>
        <Text style={[styles.sectionTitle, dir.text(sectionNames[id][language])]}>
          {sectionNames[id][language]}
        </Text>
        {language !== 'en' && (
          <Text style={[styles.context, dir.text(sectionNames[id].en)]}>{sectionNames[id].en}</Text>
        )}
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
  const dir = directional(language)
  const brand = `Briefly · ${templateNames[template][language]}`
  const title = profile.projectName || copy.doneTitle
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
          <View style={[styles.brandRow, dir.row]}>
            <Logo />
            <Text style={[styles.brand, dir.fit(brand)]}>{brand}</Text>
          </View>
          {/* Cairo's Arabic glyphs sit lower in the line box, so descenders need more room. */}
          <View
            style={[styles.titleMark, dir.start, language === 'ar' ? { paddingBottom: 12 } : {}]}
          >
            <Text style={[styles.title, dir.fit(title)]}>{title}</Text>
          </View>
          {language !== 'en' && (
            <Text style={[styles.subtitle, dir.text('Project brief')]}>Project brief</Text>
          )}
          <View style={[styles.meta, dir.row]}>
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
              // "(optional)" is form wording; it is noise in the brief, and textkit garbles the
              // ")" + ":" sequence in Arabic runs.
              .map(([field, value]) => [field.replace(/\s*\([^)]*\)$/, ''), value])
              .map(([label, value]) => (
                <Text key={label} style={[styles.metaItem, dir.text(label)]}>
                  <Text style={[{ fontWeight: 700 }, dir.text(label)]}>{label}: </Text>
                  {value}
                </Text>
              ))}
            <Text style={[styles.metaItem, dir.text(date)]}>{date}</Text>
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
            <Text style={dir.text(copy.leftBlank)}>{copy.leftBlank}</Text>
          )}
        </Section>
        <Text fixed style={[styles.footer, { direction, fontFamily, textAlign: 'center' }]}>
          Made with Briefly
        </Text>
      </Page>
    </Document>
  )
}
