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
- Python side exercise: pytest + requests

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
| API tests only     | `npx playwright test --project=api`                     |
| Python exercise    | see [Python side exercise](#python-side-exercise)       |
| Interactive runner | `npm run test:ui`                                       |
| View last report   | `npm run report`                                        |
| Lint / format      | `npm run lint` / `npm run format` / `npm run typecheck` |

## Layout

```
tests/            specs
  auth.setup.ts   logs in once per run, saves the session
  auth/           logged-out specs (login, failed login)
  api/            API contract tests for the employees endpoint
  pim/            employees: add, search, edit
  admin/          user management: search, add; job titles
  leave/          apply for leave and cancel it
  a11y.spec.ts    accessibility scans: dashboard, PIM, Admin
src/api/          API helpers: create, find and delete employees, users, job titles
src/fixtures/     custom fixtures (authenticated page, page objects, axe, test data + cleanup)
src/pages/        page objects, one folder per module
src/utils/        env reading, shared paths, test data factories
python/           Python side exercise (pytest + requests)
```

Imports use path aliases — `@pages/*`, `@fixtures/*`, `@utils/*`, `@api/*` — so moving a spec
between folders doesn't break its imports.

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
dates, or the same auto-suggested Employee Id). Test employees come from a factory that combines the
time with a random number, so no two tests get the same name or Id (see [Test data](#test-data)).

**Workers are capped at 2 locally.** Four projects at the default worker count overloaded the
machine and browsers froze mid-action. Fewer workers is slower but stable.

## Test data

**Test data comes from a factory.** `buildEmployee()` in `src/utils/factories.ts` returns a unique
first name, last name and Employee Id. Last names start with `PW`, so test data is easy to tell
apart from real data. The factory only builds the data in memory. Saving it is a separate step, so
the same data works for a UI test or an API test.

**Setup goes through the API; the screen is only for what's being tested.** `edit-employee` tests
editing, so it doesn't click through the Add Employee form first. The `testEmployee` fixture creates
the employee with one API request and hands it to the test. That's faster, and it removes a chain of
clicks that could fail for reasons that have nothing to do with editing.

### Cleanup

Data created by tests is deleted in a fixture, after the test. This was chosen because the code
after `await use()` runs even if the test fails.

**Why not the alternatives** — deleting at the end of the test (inside the test itself) risks that,
if the test fails before it gets there, the data is never cleaned up. Resetting the database wipes
out everything, including the admin and its credentials, so the login setup would fail on the next
run. Creating a new admin for every run would add unnecessary steps to the setup.

**What it doesn't catch** — if a whole run crashes or is stopped, the fixtures never get to clean
up. This could be fixed with a script that runs before or after each run and deletes everything
carrying the test marker (last names starting with `PW`). Leave requests can't be deleted at all,
only cancelled — that's an OrangeHRM restriction — so `apply-leave` still leaves cancelled rows
behind.

## API tests

`tests/api/` tests the OrangeHRM API on its own, without a browser. These are **contract tests**:
they check the shape of the answer (which fields come back, and what type each one is), not the
screen. The OrangeHRM web page relies on those answers; if `firstName` were renamed, the page would
show blanks. A contract test catches that in milliseconds.

**They run in their own `api` project, once per run.** Under chromium, firefox and webkit they would
send the same requests three times and prove nothing new, so the browser projects ignore
`tests/api/`. The `api` project still depends on `setup`: it reuses the saved session, so its
requests are logged in.

**The tests describe what OrangeHRM actually does**, which isn't always what a textbook API does:

| Request                       | Textbook answer | OrangeHRM answers                                         |
| ----------------------------- | --------------- | --------------------------------------------------------- |
| create an employee            | 201 Created     | 200                                                       |
| read a deleted employee       | 404 Not Found   | 422 Invalid Parameter                                     |
| create without `firstName`    | 400 or 422      | 422, the field listed under `error.data.invalidParamKeys` |
| any request without a session | 401             | 401, message `Session expired`                            |

## Python side exercise

`python/` repeats three of the API tests in Python, with [pytest](https://docs.pytest.org/) (a test
runner) and [requests](https://requests.readthedocs.io/) (a library for sending HTTP requests): the
employee list returns 200; create, read and delete an employee; a missing `firstName` returns 422.
The framework itself stays TypeScript.

The Python tests log in on their own, the way the login form does: they read a one-time token from
the login page, then send it with the username and password from `.env`. They don't need the
Playwright setup to run first.

You'll need Python 3, the app running and `.env` filled in. From the project root (Windows):

```
py -m venv python\.venv
python\.venv\Scripts\python.exe -m pip install -r python\requirements.txt
python\.venv\Scripts\python.exe -m pytest python
```

The first line creates a private package folder for the exercise, the second installs pytest,
requests and python-dotenv into it, and the third runs the tests. Only the third is needed on later
runs. On macOS or Linux, use `python3 -m venv python/.venv`, then `python/.venv/bin/python` in place
of `python\.venv\Scripts\python.exe`.

## Accessibility checks

`tests/a11y.spec.ts` scans the dashboard, the PIM employee list and the Admin user list with
[axe-core](https://github.com/dequelabs/axe-core), after each page has finished loading.

**Only new kinds of problems fail.** The scans run the WCAG 2.0 and 2.1 level A and AA rules.
OrangeHRM already breaks five of them on every page (icon buttons with no name, unlabelled form
fields, text with too little contrast, a missing page language and a malformed menu list), so those
five are switched off. A strict "zero violations" check would have been red from day one, and a
test that is always red gets ignored. The switched-off rules are listed in one place, the `axe`
fixture, with the date the list was made. A rule comes off the list once OrangeHRM fixes it.

**What this deliberately lets through:** best-practice rules, more of the five known problems (a
new unlabelled field still passes), and anything axe can't detect, such as OrangeHRM's custom
dropdowns. They're plain `div`s that a screen reader can't recognise as form fields, so axe can't
either.

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
- **Phase C — Page objects, locators & accessibility** ✅ page objects for login, dashboard, PIM, Admin and Leave; page objects provided via fixtures; Chromium, Firefox, WebKit and a mobile subset; axe accessibility scans with a documented policy
- **Phase D — Test data & API testing** ✅ test data factory; set-up data created through the API; cleanup in fixture teardown; API helpers for employees, users and job titles; contract tests in their own `api` project; Python side exercise with pytest
- Phases E–G: CI, hardening, QA process artefacts
