# Briefly

A client-facing project questionnaire that turns project ideas into a clear brief.

## Development

```sh
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` and set the contact details used by the export flow.

## Build

```sh
pnpm build
pnpm preview
```

## Checks

```sh
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

GitHub Actions runs these checks for pull requests and pushes to `main`. A successful push to `main` deploys the Worker and static assets to Cloudflare.

## Deployment

```sh
pnpm run deploy
```

The Worker custom domain is configured as `briefly.ayoub3bidi.me` in `wrangler.jsonc`. Cloudflare creates the subdomain DNS record and certificate when the custom domain is deployed, provided the `ayoub3bidi.me` zone is active in the deploying account and no conflicting CNAME exists.

To enable GitHub Actions deployments, add these repository Actions secrets:

- `CLOUDFLARE_API_TOKEN`: a token scoped to the Cloudflare account and the `ayoub3bidi.me` zone with Cloudflare Workers edit access.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID containing the zone.

Add these repository Actions variables to enable the email and WhatsApp export links:

- `VITE_CONTACT_EMAIL`: the email address clients should send the brief to.
- `VITE_CONTACT_WA`: the WhatsApp phone number in international format.

Keep the API token in GitHub Actions secrets, not in this repository. Contact values are public in the built client application.

## Release

Releases are tag-driven. Push a version tag (SemVer, e.g. `v0.1.0`) to cut an official release:

```sh
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions then runs the quality checks (format, lint, tests, build), creates a GitHub Release with auto-generated release notes from the conventional commits since the last tag, and deploys the Worker and static assets to Cloudflare.

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) format (e.g. `feat:`, `fix:`, `refactor:`, `test:`) — they are validated on pull requests and drive the release changelog.

To trigger a release manually from the Actions tab, use the "Release" workflow and supply the tag to cut.
