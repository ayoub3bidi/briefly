# AGENTS.md

Guide for coding agents working on **Briefly**: a frontend-only, client-facing project
questionnaire. A prospective client answers guided questions, then downloads a PDF brief and
sends it by email (`mailto:`) or WhatsApp (`wa.me`). Nothing is sent to a server.
Answers live only in `localStorage`.

Live at `briefly.ayoub3bidi.me` (Cloudflare Workers static assets, SPA fallback, `noindex`).

## Stack

- React 19 + TypeScript 7 (`tsc -b`), Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`, tokens in
  `src/index.css` `@theme`; no `tailwind.config`)
- Zustand 5 with `persist` for all state
- `@react-pdf/renderer`, lazy-loaded on PDF download only
- Vitest 5 + jsdom + Testing Library
- oxlint (not ESLint), Prettier (single quotes, no semicolons, trailing commas, width 100)
- pnpm 10.24 (pinned via `packageManager`), Node 24 in CI
- No router, no backend, no API calls

## Commands

```sh
pnpm install
pnpm dev            # Vite dev server
pnpm format:check   # Prettier; `pnpm format` to fix
pnpm lint           # oxlint
pnpm test           # vitest run (pnpm test:watch for watch mode)
pnpm build          # tsc -b && vite build -> dist/
pnpm run deploy     # build + wrangler deploy (needs Cloudflare creds)
```

CI runs `format:check`, `lint`, `test`, and `build` in that order. Run all four before calling
work done. The build prints a ">500 kB chunk" warning. That is expected (react-pdf) and not an
error.

## Layout

```
index.html                 Inline script applies saved theme before first paint (reads `briefly:theme`)
src/main.tsx               Entry; loads Cairo variable font + index.css
src/App.tsx                Shell: header (theme toggle, LanguageMenu), intro + about screens, screen switch
src/screens/               QuestionScreen, ReviewScreen, DoneScreen (export), FeatureEditor, RoleEditor
src/components/            LanguageMenu, PaperBackground (animated backdrop, exports PEN_STROKE path)
src/data/                  Question bank + config
  types.ts                 Lang, TemplateId, QuestionType, Question, Answer
  core.ts                  Questions asked in every template
  web.ts mobile.ts auto.ts generic.ts   Per-template questions
  question-locales.ts      Localized help/example text, merged over each question by id
  index.ts                 resolveTemplate, resolveLanguage, loadFormConfig
src/i18n/                  UI strings: en.ts (source of truth), fr.ts, ar.ts; formatMessage('{key}')
src/store/                 briefly-store (form state, per template), language-store, theme-store, storage
src/lib/                   brief-export (copyText clipboard helper), role-answer, browser (UA sniffing)
src/print/                 BriefPdf (react-pdf document), pdf-content (answer -> lines)
src/test/setup.ts          jest-dom + cleanup + localStorage.clear after each test
```

Tests sit next to the code as `*.test.ts(x)`.

## How it works

**URL drives config.** `?t=web|mobile|auto|generic` picks the template. Anything else falls
back to `generic`. `?lang=en|fr|ar` picks the language. Language priority is URL, then saved,
then `navigator.language`, then `en`. `loadFormConfig` returns `coreQuestions + template
questions`, with `questionGuidance[id]` spread on top.

**Screen flow** (`FormScreen`): `intro → about → questions → review → done`. The current screen
and `questionIndex` are persisted, so a reload resumes where the user left off.

**State and persistence.**

- `getBrieflyStore(template)` returns one cached store per template, persisted under
  `briefly:<template>`. The `migrate`/`merge` hooks sanitize everything on hydrate. Unknown
  question ids are dropped, the profile is coerced to strings, and the index is clamped.
- `briefly:lang` and `briefly:theme` hold language and theme. Theme is `system | light | dark`.
  `system` removes `data-theme` so the OS preference applies.
- `createSafeStorage` falls back to in-memory storage when `localStorage` throws. It also flips
  `getStorageStatus(name).available`, which makes App show a warning banner.

**Answers** are `{ notSure?: boolean; value?: unknown }`. The shape of `value` depends on the
question type:

| type                    | value shape                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| `longText`, `shortText` | `string`                                                                                            |
| `list`                  | `{ name, note }[]`                                                                                  |
| `links`                 | `{ url, note }[]`                                                                                   |
| `features`              | `{ title, description, priority: must-have\|nice-to-have\|later }[]`                                |
| `single`                | option id, or `{ selected, note }` when `allowNote`                                                 |
| `multi`                 | option id[], or `{ selected: id[], note }` when `allowNote`                                         |
| id `roles` (special)    | `{ selected: optionId[], custom: { id, name, note }[] }`; legacy array accepted by `readRoleAnswer` |

**Export** (`DoneScreen`) has three paths:

- PDF: dynamic `import('@react-pdf/renderer')` + `BriefPdf`. Cairo `.woff` fonts are bundled
  for Latin and Arabic, and the page is RTL when `lang=ar`.
- Email: `mailto:` to `VITE_CONTACT_EMAIL`.
- WhatsApp: `wa.me/<digits of VITE_CONTACT_WA>`.

There is deliberately no copy-as-text export. The PDF is the only brief format.

## Rules and gotchas

- **Answer rendering is written out in two places.** These are `ReviewScreen.tsx` and
  `print/pdf-content.ts` (localized PDF), plus input handling in `QuestionScreen.tsx`. A new
  question type, or a changed value shape, must update all three. `roles` is special-cased
  **by id** in each of them.
- **Question ids are persistence keys.** Renaming or removing an id silently drops saved
  answers for that question, because the hydrate step filters unknown ids. Ids must also stay
  unique across `core.ts` and every template.
- **Localized copy.** Every `label` and option `label` needs `en`, `fr` and `ar` (`L10n`).
  `help`/`example` in the question files are English-only placeholders, and the real
  localized text lives in `question-locales.ts`, keyed by question id. Add new guidance there.
- **UI strings.** Add each key to `en.ts`, `fr.ts` and `ar.ts`. `UiMessages` is derived from
  `en`, so a key missing from `fr` or `ar` fails `tsc -b`.
- **RTL.** Arabic sets `dir="rtl"` on `<html>`. Use logical utilities (`start`/`end`, `ps`/`pe`,
  `text-start`, the `rtl:` variant), never `left`/`right`.
- **Theme tokens.** Use the semantic Tailwind colors only: `ink`, `paper`, `line`, `muted`,
  `error`, `highlighter`, `on-highlight`. In `index.css` the dark palette is defined twice:
  once under `prefers-color-scheme: dark` with `:root:not([data-theme='light'])`, and once under
  `:root[data-theme='dark']`. Change both. The `briefly:theme` storage format is also read by
  the inline script in `index.html`, so keep them in sync.
- **Accessibility conventions.** Touch targets are `min-h-11` or `min-h-12`. Interactive
  elements use `focus-visible:outline-*`. Animations need a `motion-reduce:` fallback. Status
  banners use `role="status"`.
- **Env vars** (`VITE_CONTACT_EMAIL`, `VITE_CONTACT_WA`) are baked into the public bundle.
  They are typed in `src/vite-env.d.ts`. Copy `.env.example` to `.env` for local use. Never put
  secrets in `VITE_*`.
- **Privacy promise.** The intro tells users their answers never leave the browser, and that
  the only network request is the GitHub star count (`GitHubStars`). Do not add analytics,
  other fetches, or third-party scripts without changing that copy (`dataPrivacy`).
- **Hosted call to action.** The "Freelancer? Get your own branded copy" link (`HOSTED_CTA_HREF`
  in `App.tsx`, shown on the intro and done screens) uses a hardcoded upstream email on purpose.
  Do not switch it to `VITE_CONTACT_EMAIL`.
- **Tests.** Stores and storage are module singletons. Tests rely on `setup.ts` clearing
  `localStorage`. Follow the existing test files for patterns (`App.test.tsx` drives the full
  flow with `user-event`).

## Git, CI, release

- **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `test:`, ...), enforced by commitlint
  on PRs. The commits also generate the release notes.
- `ci.yml`: quality job on every PR and on pushes to `main`. A push to `main` also deploys to
  Cloudflare. It needs the secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- `release.yml`: pushing a `v*` SemVer tag runs the quality job, creates a GitHub Release with
  generated notes, and deploys. It can also be started manually with a `tag` input.
- Actions use major version tags (e.g. `actions/checkout@v7`), not commit SHAs.

### Known gaps (as of 2026-11-17)

- The `VITE_CONTACT_WA` repository secret is not set, so production builds have no WhatsApp
  number. Add it with `gh secret set VITE_CONTACT_WA`.
