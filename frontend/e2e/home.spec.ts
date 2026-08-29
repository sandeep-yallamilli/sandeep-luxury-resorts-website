import { test, expect } from '@playwright/test';
import { mockResortApi } from './helpers/mock-api';

test.describe('Home Page Verification', () => {
  test.beforeEach(async ({ page }) => {
    await mockResortApi(page);
    await page.goto('/');
  });

  test('should load the home page and header correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/SANDEEP/i);

    // Check main navigation links
    const nav = page.locator('header');
    await expect(nav).toBeVisible();
    await expect(page.getByRole('link', { name: /Resorts/i }).first()).toBeVisible();
  });

  test('should render hero section and call-to-actions', async ({ page }) => {
    // Check main heading
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();

    // Check search button in booking widget
    const searchBtn = page.getByRole('button', { name: /Search/i }).first();
    await expect(searchBtn).toBeVisible();
  });

  test('should render the footer with links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
