import { expect, test } from '@fixtures/test';

test('Add a job Title and delete', async ({
  authPage,
  jobTitlesPage,
  addJobTitlePage,
  jobTitlesToDelete,
}) => {
  const jobTitle = `QA Engineer ${Date.now()}`;
  jobTitlesToDelete.push(jobTitle);
  const jobDescription = 'First level';

  await jobTitlesPage.goTo();
  await jobTitlesPage.openJobTitleForm();
  await addJobTitlePage.addJobTitle(jobTitle, jobDescription);
  await expect(authPage).toHaveURL(/\/admin\/viewJobTitleList/);
  await expect
    .poll(() => jobTitlesPage.jobTitles())
    .toContainEqual(expect.stringContaining(jobTitle));
  await jobTitlesPage.deleteJobTitle(jobTitle);
  await expect
    .poll(() => jobTitlesPage.jobTitles())
    .not.toContainEqual(expect.stringContaining(jobTitle));
});
