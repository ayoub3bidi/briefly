import { useEffect, useState } from 'react'

export const REPO_URL = 'https://github.com/ayoub3bidi/briefly'
const API_URL = 'https://api.github.com/repos/ayoub3bidi/briefly'

// shortcut: one unauthenticated request per page load (60/h per IP), cache in sessionStorage if that ever bites.
export function GitHubStars({ label, lang }: { label: string; lang: string }) {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(API_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.stargazers_count === 'number') setStars(data.stargazers_count)
      })
      // Private repo, rate limit or offline: show the icon without a count.
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      // Hidden on phones: the header has no room for a fourth control below `sm`.
      className="hidden min-h-11 min-w-11 items-center justify-center gap-1.5 sm:inline-flex rounded-lg border border-line px-3 text-sm font-medium text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
      </svg>
      {stars !== null && (
        <span aria-hidden="true">
          {new Intl.NumberFormat(lang, { notation: 'compact' }).format(stars)}
        </span>
      )}
    </a>
  )
}
