import { expect, test } from '@fixtures/test';
import { leaveType } from '@utils/env';

test('Apply for leave and cancel it', async ({ applyLeavePage, myLeavePage }) => {
  // TODO Phase D: create the entitlement via the API. Until then it's a manual precondition (README).
  // TODO Phase D: cleanup only runs if the test gets that far. A leftover pending leave
  // blocks these dates on the next run - cancel it by hand in My Leave.

  // Tue-Wed, working days inside the 2026 leave period. Cancelling frees them, so every run reuses them.
  const startDate = '2026-12-01';
  const endDate = '2026-12-02';
  // Unique per run: cancelled rows from earlier runs stay in the list with the same dates.
  const comment = `Playwright ${Date.now()}`;

  await applyLeavePage.goTo();
  await applyLeavePage.addLeave(leaveType, startDate, endDate, comment);

  await myLeavePage.goTo();
  await expect.poll(() => myLeavePage.leaveStatus(comment)).toContain('Pending Approval');

  await myLeavePage.cancelLeave(comment);
  await expect.poll(() => myLeavePage.leaveStatus(comment)).toContain('Cancelled');
});
