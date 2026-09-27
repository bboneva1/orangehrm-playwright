# Page objects

## No base class (yet)

**What the page objects share today:** `LoginPage` and `EmployeeListPage` both store the `page` and
have a `goTo()` that calls `page.goto(url)`. Only the URL differs. `AddEmployeePage` needs neither.

**Why that isn't enough for a base class:** it would save about four lines per file, at the cost of
an inheritance hierarchy (`extends BasePage`, `super(page)` in every constructor) and a shared file
that tends to grow into a dumping ground. `AddEmployeePage` would inherit code it never uses.

**What would change this:** real shared _behaviour_, not shared structure. The likely candidates are:

- the custom Vue dropdown ("click to open, click the option by text"), expected in both PIM and Admin
- sidebar navigation, if tests start moving between modules through the menu instead of by URL

Revisit after Step 5 (Admin). Even then, a small helper that page objects call (composition) may fit
better than a base class they inherit from.
