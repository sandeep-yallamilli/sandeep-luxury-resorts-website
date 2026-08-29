import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should display login page form fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    // Check inputs exist
    const usernameOrEmailInput = page.locator('input[type="text"], input[type="email"], input[name="username"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.getByRole('button', { name: /sign in/i }).first();

    await expect(usernameOrEmailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should display register page form fields', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/\/register/);

    const inputs = page.locator('input');
    await expect(inputs.first()).toBeVisible();
    const submitButton = page.getByRole('button', { name: /create.*account/i }).first();
    await expect(submitButton).toBeVisible();
  });
});
