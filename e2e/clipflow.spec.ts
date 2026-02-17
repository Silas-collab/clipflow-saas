import { test, expect } from '@playwright/test';

test.describe('ClipFlow E2E', () => {
  test('Login flow', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'novo@clipflow.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/app');
    expect(page.url()).toContain('/app');
  });

  test('Dashboard loads', async ({ page }) => {
    await page.goto('http://localhost:5173/app');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    expect(content).toContain('ClipFlow');
  });
});
