import { APIRequestContext } from '@playwright/test';
import { NewEmployee } from '@utils/factories';

const EMPLOYEES = '/web/index.php/api/v2/pim/employees';

export class EmployeesApi {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async create(employee: NewEmployee): Promise<number> {
    const response = await this.request.post(EMPLOYEES, { data: employee });
    if (!response.ok()) {
      throw new Error(`Creating employee failed: ${response.status()} ${await response.text()}`);
    }
    const responseBody = (await response.json()) as { data: { empNumber: number } };
    return responseBody.data.empNumber;
  }

  async delete(empNumber: number): Promise<void> {
    const response = await this.request.delete(EMPLOYEES, { data: { ids: [empNumber] } });
    if (!response.ok()) {
      throw new Error(`Deleting employee failed: ${response.status()} ${await response.text()}`);
    }
  }
}
