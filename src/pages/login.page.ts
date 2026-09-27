import { Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly userNameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
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
}
