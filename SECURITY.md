# Security Policy

## Supported versions

Only the latest version on `main` (and the instance deployed from it) receives security fixes.

## Reporting a vulnerability

Please do not report security issues in public issues or pull requests.

Report them privately through [GitHub private vulnerability reporting](https://github.com/ayoub3bidi/briefly/security/advisories/new). Include:

- a description of the issue and its impact,
- steps to reproduce, or a proof of concept,
- the affected browser or environment, if relevant.

You should get an acknowledgement within 7 days. Once a fix ships, you will be credited in the advisory unless you prefer otherwise.

## Scope

Briefly is a static, frontend-only app. Client answers stay in the browser's `localStorage`, and the contact details set through `VITE_*` variables are public by design. Issues that are especially relevant include XSS, injection through URL parameters or stored answers, and anything that could leak answers off the device.
