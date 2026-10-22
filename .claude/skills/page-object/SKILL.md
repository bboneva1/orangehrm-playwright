---
name: page-object
description: Add a new page object for an OrangeHRM page, following this repo's house pattern. Use when asked to create or extend a page object in src/pages/.
---

### File and naming:

the file goes in `src/pages/<module>/<name>.page.ts`, and the class is called `<Name>Page`. Example: `src/pages/pim/employee-list.page.ts`.

### Shape:

- The constructor takes Page and stores it. Locators are private readonly. The constructor never calls goto; navigation goes in a `goTo()` method.
- There are three kinds of methods:
  - actions, like `addUser(...)`
  - readers that return data, like `employeeNames()`
  - checks that return true/false, like `widgetLoaded()`
- No expect anywhere. The spec does the waiting.

### Locator ladder: the order you try:

1. role + name
2. the `.oxd-input-group` filter
3. `getByText`
4. CSS, with a comment saying why

OrangeHRM specifics (unnamed inputs, dropdowns, tables, icon buttons): see the locator patterns in CLAUDE.md.

### Finish:

1. Register it in `src/fixtures/test.ts`: add the type, plus a fixture built on `authPage`.
2. Run `npm run typecheck` and `npm run lint`.
3. Check there's no `.first()` anywhere.
