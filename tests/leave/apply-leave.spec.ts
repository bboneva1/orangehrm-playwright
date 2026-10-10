import { expect, test } from '@fixtures/test';
import { leaveType } from '@utils/env';

// Each browser gets separate set of dates to avoid data collision in parallel browser test runs
// TO DO Phase D: own employee per test

const datesByProject: Record<string, { start: string; end: string }> = {
  chromium: { start: '2026-12-01', end: '2026-12-02' },
  firefox: { start: '2026-12-03', end: '2026-12-04' },
  webkit: { start: '2026-12-07', end: '2026-12-08' },
  mobile: { start: '2026-12-09', end: '2026-12-10' },
};

test(
  'Apply for leave and cancel it',
  { tag: '@mobile' },
  async ({ applyLeavePage, myLeavePage }) => {
    // TODO Phase D: create the entitlement via the API. Until then it's a manual precondition (README).
    // TODO Phase D: cleanup only runs if the test gets that far. A leftover pending leave
    // blocks these dates on the next run - cancel it by hand in My Leave.

    const projectName = test.info().project.name;
    const dates = datesByProject[projectName];
    if (!dates)
      throw new Error(`No leave dates for project ${projectName}. Add it to datesByProject`);
    // Unique per run: cancelled rows from earlier runs stay in the list with the same dates.
    const comment = `Playwright ${Date.now()}`;

    await applyLeavePage.goTo();
    await applyLeavePage.addLeave(leaveType, dates.start, dates.end, comment);

    await myLeavePage.goTo();
    await expect.poll(() => myLeavePage.leaveStatus(comment)).toContain('Pending Approval');

    await myLeavePage.cancelLeave(comment);
    await expect.poll(() => myLeavePage.leaveStatus(comment)).toContain('Cancelled');
  }
);
