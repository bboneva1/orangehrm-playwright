# CLAUDE.md

Playwright + TypeScript framework testing a self-hosted OrangeHRM. Repo is **public**.

## Commands

| Task                  | Command                                                 |
| --------------------- | ------------------------------------------------------- |
| Start app             | `npm run app:up` (http://localhost:8080)                |
| Stop app              | `npm run app:down`                                      |
| Wipe + restart app    | `npm run app:reset`                                     |
| Run tests             | `npm test`                                              |
| Interactive runner    | `npm run test:ui`                                       |
| View report           | `npm run report`                                        |
| Lint / format / types | `npm run lint` / `npm run format` / `npm run typecheck` |

## Directory map

```
tests/          specs
src/pages/      page objects        (Phase C)
src/fixtures/   custom fixtures     (Phase B)
src/utils/      helpers, factories  (Phase D)
```

Import via aliases: `@pages/*`, `@fixtures/*`, `@utils/*`.

## Conventions

- **Locator priority:** `getByRole` → `getByLabel` → `getByText` → `data-testid` → CSS last resort.
- **OrangeHRM inputs have no `<label for>`.** `getByLabel` is a dead end here. With no label, the
  placeholder becomes the accessible name, so `getByRole('textbox', { name: 'Username' })` works.
- **Never `.first()` to silence a strict-mode violation.** Two matches means the locator is
  ambiguous — scope it to a container and re-run, don't pick by position.
- **No hard waits.** No `waitForTimeout`. Use web-first assertions and auto-waiting.
- Page objects expose **actions**, not locators. No `pageObject.usernameInput` in a spec.
- Assertions live in specs, not in page objects.
- Never commit `.env` or credentials. Pre-commit gitleaks scan is mandatory.
- Instance-specific values (admin name, credentials, base URL) come from `.env` — never hardcoded.
  Anyone cloning this runs their own container with their own admin.
- Every `await`-able call is awaited (`no-floating-promises` is an error).

## Working rule

Bily attempts first, then asks for review. Exception: config and boilerplate.
Do not write test bodies unless asked.
Explain in detail — Bily is learning Docker, Git and the terminal. Give the reasoning and what to
expect on screen, not just the command to run.

<!-- Add every style correction you give Claude to this file. Keep it short. -->
