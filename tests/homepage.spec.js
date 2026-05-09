import { test, expect } from '@playwright/test';

test.describe('Pillora Homepage', () => {

  test('Page loads with correct title', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    await expect(page).toHaveTitle(/Pillora/);
  });

  test('Logo is visible', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    const logo = page.locator('img[alt="Pillora"]').first();
    await expect(logo).toBeVisible();
  });

  test('Hero section headline is visible', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    await expect(page.getByText('Need blood urgently?')).toBeVisible();
  });

  test('"Request blood now" button works', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    await page.getByRole('link', { name: 'Request blood now' }).click();
    await expect(page).toHaveURL(/blood-bank/);
  });

  test('Health Tips section is visible', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    await expect(page.getByText('Health Tips of the Day')).toBeVisible();
  });

  test('Health Hub section is visible', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    // Health Hub is rendered by HealthHubSection component — scroll to it
    const healthHub = page.getByRole('heading', { name: 'Health Hub' });
    await healthHub.scrollIntoViewIfNeeded();
    await expect(healthHub).toBeVisible({ timeout: 10000 });
  });

  test('Footer copyright is visible', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    await expect(page.getByText('© 2026 Pillora Inc.')).toBeVisible();
  });

});
