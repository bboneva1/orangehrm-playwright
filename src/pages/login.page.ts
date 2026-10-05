import { Locator, Page } from '@playwright/test';

export type LoginField = 'Username' | 'Password';

export class LoginPage {
  private readonly page: Page;
  private readonly userNameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly invalidCredentials: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.invalidCredentials = page.getByRole('alert');
  }

  async goTo(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
  }

  //login() fills the form and clicks. It doesn't wait for the result.
  //Reason: login() is used by both positive and negative login tests.
  //A failed login never reaches the dashboard, so waiting here would make
  //negative tests time out. Each caller waits for the outcome it expects.
  async login(userName: string, password: string): Promise<void> {
    await this.userNameField.fill(userName);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async errorMessage(): Promise<string> {
    return this.invalidCredentials.innerText();
  }

  //The "Required" messages have no role and both read the same, so the locator
  //scopes to the .oxd-input-group containing the field's label first.
  async emptyFieldError(field: LoginField): Promise<string> {
    return this.page
      .locator('.oxd-input-group')
      .filter({ hasText: field })
      .getByText('Required')
      .innerText();
  }
}
