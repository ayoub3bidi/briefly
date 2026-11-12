import { useEffect, useState, type FormEvent } from 'react'
import { useStore } from 'zustand'
import { loadFormConfig, resolveLanguage, resolveTemplate } from './data'
import type { Lang } from './data/types'
import { messages } from './i18n'
import { getBrieflyStore } from './store/briefly-store'
import { useLanguageStore } from './store/language-store'
import { getStorageStatus } from './store/storage'
import { QuestionScreen } from './screens/QuestionScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { PrintView } from './print/PrintView'
import { DoneScreen } from './screens/DoneScreen'
import { isInAppBrowser } from './lib/browser'

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
  const profile = useStore(formStore, (state) => state.profile)
  const screen = useStore(formStore, (state) => state.screen)
  const setProfile = useStore(formStore, (state) => state.setProfile)
  const setScreen = useStore(formStore, (state) => state.setScreen)
  const [nameError, setNameError] = useState(false)
  const saveLanguage = useLanguageStore((state) => state.setLanguage)

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
    const name = profile.name.trim()
    if (!name) {
      setNameError(true)
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
    setNameError(false)
    setScreen('questions')
  }

  return (
    <>
      <main
        id="app-ui"
        className="flex min-h-screen items-center justify-center px-6 py-16 font-sans"
      >
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <header className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold tracking-wide text-indigo-700">
              {copy.brand} <span className="text-slate-400">/ {copy.category}</span>
            </p>
            <label className="sr-only" htmlFor="language-picker">
              {copy.language}
            </label>
            <select
              id="language-picker"
              value={language}
              onChange={(event) => changeLanguage(event.target.value as Lang)}
              className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
            >
              <option value="en">{copy.langEnglish}</option>
              <option value="fr">{copy.langFrench}</option>
              <option value="ar">{copy.langArabic}</option>
            </select>
          </header>

          {!storageAvailable && (
            <p
              className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-start text-sm leading-6 text-amber-900"
              role="status"
            >
              {copy.storageWarning}
            </p>
          )}

          {inAppBrowser && (
            <p
              className="mt-6 rounded-xl bg-indigo-50 px-4 py-3 text-start text-sm leading-6 text-indigo-950"
              role="status"
            >
              {copy.inAppBrowser}
            </p>
          )}

          {screen === 'intro' && (
            <>
              <h1 className="mt-10 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                {copy.headline}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">{copy.intro}</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">{copy.finishSameDevice}</p>
              <p className="mt-6 text-sm leading-6 text-slate-600">{copy.whoYouAre}</p>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                <span className="text-sm font-medium text-indigo-700">{copy.duration}</span>
                <button
                  type="button"
                  onClick={() => setScreen('about')}
                  className="min-h-12 rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
                >
                  {copy.start}
                </button>
              </div>
            </>
          )}

          {screen === 'about' && (
            <>
              <h1 className="mt-10 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {copy.aboutTitle}
              </h1>
              <form className="mt-8 space-y-5" noValidate onSubmit={saveAboutYou}>
                <div>
                  <label
                    className="mb-2 block text-start text-sm font-medium text-slate-700"
                    htmlFor="client-name"
                  >
                    {copy.name} <span className="text-rose-700">*</span>
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
                    className="user-text min-h-12 w-full rounded-xl border border-slate-300 px-4 text-start text-slate-900 outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100"
                  />
                  {nameError && (
                    <p className="mt-2 text-sm text-rose-700" id="name-error">
                      {copy.nameRequired}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="mb-2 block text-start text-sm font-medium text-slate-700"
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
                    className="user-text min-h-12 w-full rounded-xl border border-slate-300 px-4 text-start text-slate-900 outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label
                    className="mb-2 block text-start text-sm font-medium text-slate-700"
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
                    onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                    className="user-text min-h-12 w-full rounded-xl border border-slate-300 px-4 text-start text-slate-900 outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label
                    className="mb-2 block text-start text-sm font-medium text-slate-700"
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
                    className="user-text min-h-12 w-full rounded-xl border border-slate-300 px-4 text-start text-slate-900 outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label
                    className="mb-2 block text-start text-sm font-medium text-slate-700"
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
                    className="user-text min-h-12 w-full rounded-xl border border-slate-300 px-4 text-start text-slate-900 outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 pt-3">
                  <button
                    type="button"
                    onClick={() => setScreen('intro')}
                    className="min-h-12 rounded-xl px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
                  >
                    {copy.back}
                  </button>
                  <button
                    type="submit"
                    className="min-h-12 rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
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
              copy={copy}
            />
          )}
        </section>
      </main>
      {screen === 'done' && (
        <PrintView
          store={formStore}
          questions={questions}
          profile={profile}
          template={template}
          language={language}
          copy={copy}
        />
      )}
    </>
  )
}

export default App
