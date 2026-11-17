# CLAUDE.md

Playwright + TypeScript framework testing a self-hosted OrangeHRM. Repo is **public**.

## Commands

| Task                  | Command                                                 |
| --------------------- | ------------------------------------------------------- |
| Start app             | `npm run app:up` (http://localhost:8080)                |
| Stop app              | `npm run app:down`                                      |
| Wipe + restart app    | `npm run app:reset`                                     |
| Run tests             | `npm test`                                              |
| API tests only        | `npx playwright test --project=api`                     |
| Python exercise       | `python\.venv\Scripts\python.exe -m pytest python`      |
| Interactive runner    | `npm run test:ui`                                       |
| View report           | `npm run report`                                        |
| Lint / format / types | `npm run lint` / `npm run format` / `npm run typecheck` |

## Directory map

```
tests/          UI specs
tests/api/      API specs: own 'api' project, no browser
src/pages/      page objects
src/api/        API helpers, one class per resource
src/fixtures/   custom fixtures, incl. test data and cleanup
src/utils/      helpers, factories
python/         Python side exercise (pytest + requests), own .venv
```

Import via aliases: `@pages/*`, `@fixtures/*`, `@utils/*`, `@api/*`.

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

## Test data

- **Test data comes from factories** in `src/utils/factories.ts` (`buildEmployee()`), not inline
  `Date.now()`. A factory only builds data in memory; saving it is the API helper's job.
- **Data a test needs but isn't testing is created through the API**, in a fixture (e.g.
  `testEmployee`). Only the thing under test goes through the screen.
- **Cleanup lives in fixture teardown** (code after `await use()`), which runs even when the test
  fails. Never as the last lines of a test. Data the test creates itself on screen: push its id or
  name into `employeesToDelete` / `usersToDelete` / `jobTitlesToDelete`.
- **API helpers live in `src/api/`.** They take an `APIRequestContext`, contain no `expect`, and
  throw with the status and body when a response isn't OK.
- **Known gap:** leave requests can't be deleted, only cancelled, so `apply-leave` leaves rows behind.

## OrangeHRM API patterns

- Endpoints are under `/web/index.php/api/v2/`. Find a new one in DevTools → Network → Fetch/XHR
  while doing the action by hand.
- **Not textbook — test what it does:** create answers `200` (not 201); a missing item answers `422`
  (not 404); invalid fields are listed in `error.data.invalidParamKeys`; no session answers `401`
  with `Session expired`.
- Lists return `data` (an array) and `meta.total`. Delete is `DELETE <endpoint>` with a body
  `{ "ids": [...] }`.
- The `request` fixture is already logged in (same `storageState`). For a logged-out request, use
  `test.use({ storageState: { cookies: [], origins: [] } })` inside a `test.describe`.

## OrangeHRM locator patterns

- **Inputs with no placeholder have no accessible name.** Find the `.oxd-input-group` containing the
  label text, then the textbox inside it:
  `page.locator('.oxd-input-group').filter({ hasText: 'Username' }).getByRole('textbox')`.
- **Dropdowns are custom widgets, no `<select>`, so `selectOption()` doesn't work.** Find the group by its label, click "-- Select --" to open it, then click the option by role and name.
- **Autocomplete fields fill the text, then click the suggestion by its option role.** Use two actions with `.fill()` and next `.click()` in separate rows.
- **Tables have proper row/cell roles.** The `.filter(...)` keeps rows that contain a cell, which drops the header row, because the header has column headings, not cells.
- **Icon-only buttons (trash, pencil) have no name.** scope to the row, then pick the button by its icon class.
- **Save loads a new page.** In the spec, wait with `await expect(page).toHaveURL(/.../)`
  before reading the next page, or the read can crash mid-navigation (flaky).
- **Accessibility: the axe settings and the known-violations list live only in the axe fixture.** `axe` doesn't wait, so wait for the page to load before `analyze()`.

## Working rule

Bily attempts first, then asks for review. Exception: config and boilerplate.
Do not write test bodies unless asked.
Explain in detail — Bily is learning Docker, Git and the terminal. Give the reasoning and what to
expect on screen, not just the command to run.
Bily is new to Python. For a new concept, either explain it first or show the finished code with a
note on each line — don't describe the steps in prose and leave the syntax to guess.

<!-- Add every style correction you give Claude to this file. Keep it short. -->
