import { APIRequestContext } from '@playwright/test';

const JOBTITLES = '/web/index.php/api/v2/admin/job-titles';

export class JobTitlesApi {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async findId(title: string): Promise<number | undefined> {
    const response = await this.request.get(JOBTITLES, { params: { limit: 0 } });

    if (!response.ok()) {
      throw new Error(`Finding job title failed: ${response.status()} ${await response.text()}`);
    }

    const body = (await response.json()) as { data: { id: number; title: string }[] };
    const jobTitle = body.data.find((item) => item.title === title);
    return jobTitle?.id;
  }

  async delete(id: number): Promise<void> {
    const response = await this.request.delete(JOBTITLES, { data: { ids: [id] } });
    if (!response.ok()) {
      throw new Error(`Deleting job title failed: ${response.status()} ${await response.text()}`);
    }
  }
}
