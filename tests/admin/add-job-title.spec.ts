import { expect, test } from '@fixtures/test';

test('Add a job Title and delete', async ({ jobTitlesPage, addJobTitlePage }) => {
  // TO DO: Phase D cleanup only runs if the test gets that far
  const jobTitle = `QA Engineer ${Date.now()}`;
  const jobDescription = 'First level';

  await jobTitlesPage.goTo();
  await jobTitlesPage.openJobTitleForm();
  await addJobTitlePage.addJobTitle(jobTitle, jobDescription);
  await expect
    .poll(() => jobTitlesPage.jobTitles())
    .toContainEqual(expect.stringContaining(jobTitle));
  await jobTitlesPage.deleteJobTitle(jobTitle);
  await expect
    .poll(() => jobTitlesPage.jobTitles())
    .not.toContainEqual(expect.stringContaining(jobTitle));
});
