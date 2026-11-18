import { useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { loadFormConfig, resolveLanguage, resolveTemplate } from './data'
import type { Lang } from './data/types'
import { messages } from './i18n'
import { getBrieflyStore } from './store/briefly-store'
import { useLanguageStore } from './store/language-store'
import { getStorageStatus } from './store/storage'
import { QuestionScreen } from './screens/QuestionScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { DoneScreen } from './screens/DoneScreen'
import { isInAppBrowser } from './lib/browser'
import { useThemeStore } from './store/theme-store'
import { GitHubStars } from './components/GitHubStars'
import { LanguageMenu } from './components/LanguageMenu'
import { PaperBackground, PEN_STROKE } from './components/PaperBackground'

function BrandMark() {
  return (
    <svg viewBox="0 0 420 200" className="brand-mark h-9 w-auto" aria-hidden="true">
      <defs>
        <clipPath id="bm-hl">
          <rect x="214" y="92" width="190" height="60" rx="10" />
        </clipPath>
      </defs>
      <g transform="rotate(-1.2 309 122)">
        <path
          d={`${PEN_STROKE} L 240 121`}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="214" y="92" width="190" height="60" rx="10" fill="var(--color-highlighter)" />
        <g clipPath="url(#bm-hl)">
          <path
            d="M180 119 C 190 120, 198 121, 206 122 L 384 121"
            fill="none"
            stroke="var(--color-on-highlight)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  )
}

type Mode = 'light' | 'dark'

const themeIcons: Record<Mode, ReactNode> = {
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  dark: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
}

// Hardcoded on purpose (not VITE_CONTACT_EMAIL): hosted-copy requests reach the upstream author, forks included.
const HOSTED_CTA_HREF = `mailto:contact@ayoub3bidi.me?subject=${encodeURIComponent('I want a hosted Briefly')}`
const hostedCtaHref = (body: string) => `${HOSTED_CTA_HREF}&body=${encodeURIComponent(body)}`

const darkQuery = '(prefers-color-scheme: dark)'

function subscribeToOsTheme(onChange: () => void) {
  const media = window.matchMedia?.(darkQuery)
  media?.addEventListener('change', onChange)
  return () => media?.removeEventListener('change', onChange)
}

const osPrefersDark = () => window.matchMedia?.(darkQuery).matches ?? false

// Both icons stay mounted so the outgoing one can rotate/fade out while the next one rotates in.
function ThemeIcon({ theme }: { theme: Mode }) {
  return (
    <span className="relative h-5 w-5">
      {(Object.keys(themeIcons) as Mode[]).map((key) => (
        <svg
          key={key}
          viewBox="0 0 24 24"
          className={`theme-icon absolute inset-0 h-5 w-5 transition-[opacity,rotate,scale] duration-300 ease-out motion-reduce:transition-none ${key === theme ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {themeIcons[key]}
        </svg>
      ))}
    </span>
  )
}

// Enable color transitions only for the duration of a user-initiated switch.
function switchTheme(apply: () => void) {
  const root = document.documentElement
  root.classList.add('theme-transition')
  apply()
  window.setTimeout(() => root.classList.remove('theme-transition'), 300)
}

function App() {
  const searchParams = new URLSearchParams(window.location.search)
  const template = resolveTemplate(searchParams.get('t'))
  const formStore = getBrieflyStore(template)
  const questions = loadFormConfig(window.location.search).questions
  const [language, setLanguage] = useState<Lang>(() =>
    resolveLanguage(
      searchParams.get('lang'),
      useLanguageStore.getState().language,
      navigator.language,
    ),
  )
  const [copyrightYear] = useState(() => new Date().getFullYear())
  const profile = useStore(formStore, (state) => state.profile)
  const screen = useStore(formStore, (state) => state.screen)
  const setProfile = useStore(formStore, (state) => state.setProfile)
  const setScreen = useStore(formStore, (state) => state.setScreen)
  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  // Set when the client jumps from Review to a question, so they can return in one click.
  const [editingFromReview, setEditingFromReview] = useState(false)
  const saveLanguage = useLanguageStore((state) => state.setLanguage)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  const storageAvailable = useStore(
    getStorageStatus(`briefly:${template}`),
    (state) => state.available,
  )
  const copy = messages[language]
  const inAppBrowser = isInAppBrowser(navigator.userAgent)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.title = copy.pageTitle
    saveLanguage(language)
  }, [copy.pageTitle, language, saveLanguage])

  useEffect(() => {
    if (theme === 'system') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
  }, [theme])

  const prefersDark = useSyncExternalStore(subscribeToOsTheme, osPrefersDark)
  // Until the user picks one, 'system' follows the OS; the button always shows the theme in effect.
  const activeTheme: Mode = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme
  const themeLabel: Record<Mode, string> = { light: copy.themeLight, dark: copy.themeDark }

  function changeLanguage(nextLanguage: Lang) {
    const params = new URLSearchParams(window.location.search)
    params.set('lang', nextLanguage)
    const query = params.toString()
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
    )
    setLanguage(nextLanguage)
  }

  function saveAboutYou(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const name = profile.name.trim()
    // The form is noValidate so errors render in our own copy; type="email" still does the parsing.
    const emailInput = form.elements.namedItem('email') as HTMLInputElement
    const emailInvalid = profile.email.trim() !== '' && !emailInput.validity.valid
    setNameError(!name)
    setEmailError(emailInvalid)
    if (!name || emailInvalid) {
      const firstInvalid = form.elements.namedItem(name ? 'email' : 'name') as HTMLInputElement
      firstInvalid.focus()
      return
    }

    setProfile({
      ...profile,
      name,
      company: profile.company.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      projectName: profile.projectName.trim(),
    })
    setScreen('questions')
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <PaperBackground />
      <main
        id="app-ui"
        className="flex flex-1 items-start justify-center px-4 py-8 font-sans sm:px-8 sm:py-12 lg:px-12 lg:py-14"
      >
        <section className="w-full max-w-6xl rounded-3xl border border-line bg-paper p-6 sm:p-8 lg:p-12">
          <header className="flex items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-ink">
              <BrandMark />
              <span>
                {copy.brand} <span className="text-muted">/ {copy.category}</span>
              </span>
            </p>
            <div className="flex items-center gap-2">
              <GitHubStars label={copy.starOnGitHub} lang={language} />
              <button
                type="button"
                onClick={() =>
                  switchTheme(() => setTheme(activeTheme === 'dark' ? 'light' : 'dark'))
                }
                aria-label={`${copy.theme}: ${themeLabel[activeTheme]}`}
                title={`${copy.theme}: ${themeLabel[activeTheme]}`}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <ThemeIcon theme={activeTheme} />
              </button>
              <LanguageMenu
                value={language}
                label={copy.language}
                onChange={changeLanguage}
                options={[
                  { value: 'en', label: copy.langEnglish },
                  { value: 'fr', label: copy.langFrench },
                  { value: 'ar', label: copy.langArabic },
                ]}
              />
            </div>
          </header>

          {!storageAvailable && (
            <p
              className="mt-6 rounded-xl bg-highlighter px-4 py-3 text-start text-sm leading-6 text-on-highlight"
              role="status"
            >
              {copy.storageWarning}
            </p>
          )}

          {inAppBrowser && (
            <p
              className="mt-6 rounded-xl bg-ink/5 px-4 py-3 text-start text-sm leading-6 text-ink"
              role="status"
            >
              {copy.inAppBrowser}
            </p>
          )}

          {screen === 'intro' && (
            <>
              <h1 className="mt-10 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
                {copy.headline}
              </h1>
              <p className="mt-5 text-lg leading-8 text-muted">{copy.intro}</p>
              <div
                className="mt-4 rounded-xl bg-ink/5 border border-line px-4 py-3 text-start text-sm leading-6 text-ink"
                role="note"
              >
                <p>{copy.dataPrivacy}</p>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                <span className="text-sm font-medium text-ink">{copy.duration}</span>
                <button
                  type="button"
                  onClick={() => setScreen('about')}
                  className="min-h-12 rounded-xl bg-ink px-5 text-sm font-semibold text-paper transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  {copy.start}
                </button>
              </div>
            </>
          )}

          {screen === 'about' && (
            <>
              <h1 className="mt-10 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {copy.aboutTitle}
              </h1>
              <form className="mt-8 space-y-5" noValidate onSubmit={saveAboutYou}>
                <div>
                  <label
                    className="mb-2 block text-start text-sm font-medium text-ink"
                    htmlFor="client-name"
                  >
                    {copy.name} <span className="text-error">*</span>
                  </label>
                  <input
                    id="client-name"
                    name="name"
                    autoComplete="name"
                    required
                    value={profile.name}
                    aria-invalid={nameError}
                    aria-describedby={nameError ? 'name-error' : undefined}
                    onChange={(event) => {
                      setProfile({ ...profile, name: event.target.value })
                      setNameError(false)
                    }}
                    className="user-text min-h-12 w-full rounded-xl border border-line px-4 text-start text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                  />
                  {nameError && (
                    <p className="mt-2 text-sm text-error" id="name-error">
                      {copy.nameRequired}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="mb-2 block text-start text-sm font-medium text-ink"
                    htmlFor="client-company"
                  >
                    {copy.company}
                  </label>
                  <input
                    id="client-company"
                    name="organization"
                    autoComplete="organization"
                    value={profile.company}
                    onChange={(event) => setProfile({ ...profile, company: event.target.value })}
                    className="user-text min-h-12 w-full rounded-xl border border-line px-4 text-start text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                  />
                </div>
                <div>
                  <label
                    className="mb-2 block text-start text-sm font-medium text-ink"
                    htmlFor="client-email"
                  >
                    {copy.email}
                  </label>
                  <input
                    id="client-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={profile.email}
                    aria-invalid={emailError}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    onChange={(event) => {
                      setProfile({ ...profile, email: event.target.value })
                      setEmailError(false)
                    }}
                    className="user-text min-h-12 w-full rounded-xl border border-line px-4 text-start text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-error" id="email-error">
                      {copy.emailInvalid}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="mb-2 block text-start text-sm font-medium text-ink"
                    htmlFor="client-phone"
                  >
                    {copy.phone}
                  </label>
                  <input
                    id="client-phone"
                    name="tel"
                    type="tel"
                    autoComplete="tel"
                    value={profile.phone}
                    onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
                    className="user-text min-h-12 w-full rounded-xl border border-line px-4 text-start text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                  />
                </div>
                <div>
                  <label
                    className="mb-2 block text-start text-sm font-medium text-ink"
                    htmlFor="project-name"
                  >
                    {copy.projectName}
                  </label>
                  <input
                    id="project-name"
                    name="project-name"
                    value={profile.projectName}
                    onChange={(event) =>
                      setProfile({ ...profile, projectName: event.target.value })
                    }
                    className="user-text min-h-12 w-full rounded-xl border border-line px-4 text-start text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 pt-3">
                  <button
                    type="button"
                    onClick={() => setScreen('intro')}
                    className="min-h-12 rounded-xl px-4 text-sm font-semibold text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {copy.back}
                  </button>
                  <button
                    type="submit"
                    className="min-h-12 rounded-xl bg-ink px-5 text-sm font-semibold text-paper transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {copy.continue}
                  </button>
                </div>
              </form>
            </>
          )}

          {screen === 'questions' && (
            <QuestionScreen
              questions={questions}
              language={language}
              copy={copy}
              store={formStore}
              onBackToAbout={() => setScreen('about')}
              onFinish={() => setScreen('review')}
              onBackToReview={editingFromReview ? () => setScreen('review') : undefined}
            />
          )}

          {screen === 'review' && (
            <ReviewScreen
              questions={questions}
              language={language}
              copy={copy}
              store={formStore}
              onGoBack={(index) => {
                formStore.getState().setQuestionIndex(index)
                setEditingFromReview(true)
                setScreen('questions')
              }}
              onFinish={() => setScreen('done')}
            />
          )}

          {screen === 'done' && (
            <DoneScreen
              profile={profile}
              questions={questions}
              store={formStore}
              template={template}
              language={language}
              copy={copy}
            />
          )}

          {(screen === 'intro' || screen === 'done') && (
            <p className="mt-8 text-sm text-muted">
              <a
                href={hostedCtaHref(copy.hostedCtaBody)}
                className="inline-flex min-h-11 items-center font-medium text-ink underline decoration-line underline-offset-2 transition-colors hover:decoration-ink focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {copy.hostedCta}
              </a>
            </p>
          )}
        </section>
      </main>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-6 text-center text-sm text-muted sm:px-8 lg:px-12">
        © {copyrightYear} {copy.allRightsReserved} {copy.madeBy}{' '}
        <a
          href="https://ayoub3bidi.me"
          className="font-medium text-ink underline decoration-line underline-offset-2 transition-colors hover:text-ink hover:decoration-ink focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Ayoub Abidi
        </a>
      </footer>
    </div>
  )
}

export default App
