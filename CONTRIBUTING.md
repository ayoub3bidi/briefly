# Contributing to Briefly

Thanks for your interest in improving Briefly. This guide covers what you need to open a good pull request.

## Before you start

- For anything bigger than a small fix, open an issue first so we can agree on the approach.
- Briefly is frontend-only and promises clients that their answers never leave their browser. The only network request is the GitHub star count in the header. Pull requests that add analytics, other network calls or third-party scripts will not be accepted unless they also change that promise, after discussion.

## Setup

Requires Node 24 and pnpm 10 (`corepack enable` picks up the pinned version).

```sh
pnpm install
pnpm dev
```

## Checks

CI runs these four commands. Run them before you push:

```sh
pnpm format:check   # `pnpm format` to fix
pnpm lint
pnpm test
pnpm build
```

The build prints a ">500 kB chunk" warning for the PDF renderer. This is expected.

Add or update tests next to the code you change (`*.test.ts(x)`).

## Commit messages

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, ...). commitlint checks them on every pull request, and they generate the release notes.

## Project rules

[AGENTS.md](AGENTS.md) documents the architecture in detail. The rules that trip people up most often:

- **Answer rendering lives in three places.** A new question type or a changed answer shape must update `src/screens/QuestionScreen.tsx`, `src/screens/ReviewScreen.tsx` and `src/print/pdf-content.ts`.
- **Question ids are persistence keys.** Renaming or removing one silently drops saved answers. Ids must be unique across `src/data/core.ts` and every template.
- **Every string is translated.** Question labels need `en`, `fr` and `ar`. UI strings go in `src/i18n/en.ts`, `fr.ts` and `ar.ts`. A missing key fails the type-check. Put localized help text in `src/data/question-locales.ts`.
- **RTL first.** Use logical utilities (`start`/`end`, `ps`/`pe`, `text-start`, `rtl:`), never `left`/`right`. Check your change with `?lang=ar`.
- **Theme tokens only.** Use the semantic colors (`ink`, `paper`, `line`, `muted`, `error`, `highlighter`, `on-highlight`). The dark palette in `src/index.css` is defined twice. Update both.
- **Accessibility.** Keep touch targets at `min-h-11` or larger, use `focus-visible:` outlines, and give animations a `motion-reduce:` fallback.

## Pull requests

- Keep each pull request focused on one change.
- Fill in the pull request template, including screenshots for UI changes (light and dark, LTR and RTL where relevant).
- Make sure CI is green.

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
