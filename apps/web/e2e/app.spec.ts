import { test, expect } from '@playwright/test';

test('Login page loads', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await expect(page.locator('input[type="email"]')).toBeVisible();
});

test('Register page loads', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await expect(page.locator('input[type="text"]')).toBeVisible();
});
