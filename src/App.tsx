import { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { resolveLanguage, resolveTemplate } from './data'
import type { Lang } from './data/types'
import { messages } from './i18n'
import { getBrieflyStore } from './store/briefly-store'
import { useLanguageStore } from './store/language-store'
import { getStorageStatus } from './store/storage'

function App() {
  const searchParams = new URLSearchParams(window.location.search)
  const template = resolveTemplate(searchParams.get('t'))
  const [language, setLanguage] = useState<Lang>(() =>
    resolveLanguage(
      searchParams.get('lang'),
      useLanguageStore.getState().language,
      navigator.language,
    ),
  )
  const saveLanguage = useLanguageStore((state) => state.setLanguage)

  getBrieflyStore(template)
  const storageAvailable = useStore(
    getStorageStatus(`briefly:${template}`),
    (state) => state.available,
  )
  const copy = messages[language]

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

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 font-sans">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <header className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold tracking-wide text-indigo-700">
            {copy.brand}{' '}
            <span className="text-slate-400">/ {copy.category}</span>
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
          <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-start text-sm leading-6 text-amber-900" role="status">
            {copy.storageWarning}
          </p>
        )}

        <h1 className="mt-10 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
          {copy.headline}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          {copy.intro}
        </p>
        <div className="mt-10 flex items-center justify-end gap-4 border-t border-slate-100 pt-5 text-sm text-slate-500">
          <span className="font-medium text-indigo-700">{copy.duration}</span>
        </div>
      </section>
    </main>
  )
}

export default App
