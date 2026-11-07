import { APIRequestContext } from '@playwright/test';

const USERS = '/web/index.php/api/v2/admin/users';

export class UsersApi {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async findId(username: string): Promise<number> {
    const response = await this.request.get(USERS, { params: { username } });

    if (!response.ok()) {
      throw new Error(`Finding user failed: ${response.status()} ${await response.text()}`);
    }
    const body = (await response.json()) as { data: { id: number }[] };

    const user = body.data[0];
    if (!user) {
      throw new Error(`No user named ${username}`);
    }

    return user.id;
  }

  async delete(id: number): Promise<void> {
    const response = await this.request.delete(USERS, { data: { ids: [id] } });
    if (!response.ok()) {
      throw new Error(`Deleting user failed: ${response.status()} ${await response.text()}`);
    }
  }
}
