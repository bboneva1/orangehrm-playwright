# QA Automation Project

A Playwright + TypeScript test automation framework, built against a self-hosted
[OrangeHRM](https://www.orangehrm.com/) instance running locally in Docker.

This is a learning/portfolio project focused on writing a maintainable, real-world test framework
from scratch — fixtures, CI-friendly config, secret scanning, and test design decisions explained
rather than just implemented.

Self-hosted rather than the public OrangeHRM demo on purpose: shared demo data changes under you and
produces phantom failures that look like flake but aren't.

## Stack

- [Playwright](https://playwright.dev/) + TypeScript
- Docker Compose (OrangeHRM + MariaDB, persistent volume)
- ESLint, Prettier
- Husky + gitleaks (pre-commit secret scanning)

## Getting started

You'll need Node 20+ and Docker Desktop.

```bash
npm install
npm run app:up                    # start OrangeHRM + MariaDB
```

Open http://localhost:8080 and complete the OrangeHRM install wizard. Create the admin user and note
the credentials — the tests need them.

```bash
cp .env.example .env              # PowerShell: Copy-Item .env.example .env
```

Fill in `.env` with the admin username, password and full name you just created. `.env` is
gitignored and must stay that way.

```bash
npx playwright install chromium firefox webkit
npm test
```

The suite runs in four projects: **chromium**, **firefox**, **webkit** (Playwright's own WebKit build,
close to Safari) and **mobile** (Chromium imitating a Pixel 7 phone). Run a single one with
`npx playwright test --project=firefox`.

## Preconditions

To run the Leave-related specs, you need to pre-create a leave type to use in the test.

1. Create a leave type in OrangeHRM (Leave → Configure → Leave Types)
2. Give the admin user an entitlement for that type for the current leave period (Leave → Entitlements → Add)
3. Set LEAVE_TYPE in .env to that leave type's exact name
   note that the entitlement has to be renewed each year.

## Commands

| Task               | Command                                                 |
| ------------------ | ------------------------------------------------------- |
| Start / stop app   | `npm run app:up` / `npm run app:down`                   |
| Wipe + restart app | `npm run app:reset`                                     |
| Run tests          | `npm test`                                              |
| Interactive runner | `npm run test:ui`                                       |
| View last report   | `npm run report`                                        |
| Lint / format      | `npm run lint` / `npm run format` / `npm run typecheck` |

## Layout

```
tests/            specs
  auth.setup.ts   logs in once per run, saves the session
  auth/           logged-out specs (login, failed login)
  pim/            employees: add, search, edit
  admin/          user management: search, add; job titles
  leave/          apply for leave and cancel it
src/fixtures/     custom fixtures (authenticated page, page objects)
src/pages/        page objects, one folder per module
src/utils/        env reading, shared paths
```

Imports use path aliases — `@pages/*`, `@fixtures/*`, `@utils/*` — so moving a spec between folders
doesn't break its imports.

## How authentication works

Logging in through the UI in every test is slow, and it gives every failure a second possible cause.
Instead:

1. A **setup project** runs first and logs in once, saving the browser session to
   `playwright/.auth/admin.json` (gitignored — it holds a live session cookie).
2. Every **browser project** declares `dependencies: ['setup']` and loads that session via
   `storageState`, so every test starts already authenticated.
3. A **custom fixture** hands tests a page already landed on the dashboard, so specs don't each
   repeat the same `goto`.
4. **The specs in `tests/auth/` opt out** with `test.use({ storageState: { cookies: [], origins: [] } })`
   — they're the ones that must exercise the login form for real, including failed logins.

## Cross-browser and mobile

**Mobile runs a subset.** Only tests tagged `@mobile` run in the mobile project (`grep: /@mobile/`
in the config). On a phone-sized screen OrangeHRM hides the sidebar and the user's name behind the
menu, and folds the search filters on list pages away. Tests that rely on those are desktop tests by
nature. Making every page object handle both layouts would add branching to all of them for little
extra coverage. A documented subset is simpler and honest about what mobile covers.

**Tests that create data use unique values per browser.** All projects share one OrangeHRM database
and run in parallel, so two browsers creating the same thing at once collide (e.g. the same leave
dates, or the same auto-suggested Employee Id). Each test generates its own unique values until
Phase D gives every test its own data.

**Workers are capped at 2 locally.** Four projects at the default worker count overloaded the
machine and browsers froze mid-action. Fewer workers is slower but stable.

## Conventions

Locator priority is `getByRole` → `getByLabel` → `getByText` → `data-testid` → CSS as a last resort.
No hard waits — web-first assertions only. Page objects expose actions, not locators, and assertions
live in specs. Full list in [CLAUDE.md](CLAUDE.md).

Instance-specific values (credentials, admin name, base URL) come from `.env`. Nothing about one
person's container is hardcoded — anyone cloning this runs their own.

## Status

🚧 Work in progress.

- **Phase A — Foundation** ✅ Docker Compose, TypeScript, Playwright config, `.env` handling, linting, pre-commit secret scan, first login test
- **Phase B — Auth & Fixtures** ✅ storage state, setup project, dependency ordering, first custom fixture
- **Phase C — Page objects, locators & accessibility** 🚧 page objects for login, PIM, Admin and Leave; page objects provided via fixtures; Chromium, Firefox, WebKit and a mobile subset. Accessibility next.
- Phases D–G: test data & API testing, CI, hardening, QA process artefacts
