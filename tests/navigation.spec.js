import { test, expect } from '@playwright/test';

test.describe('Pillora Navigation', () => {

  test('Home nav link works', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('https://www.pillora.in/');
  });

  test('Login / Sign Up nav link works', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    await page.getByRole('link', { name: 'Login / Sign Up' }).click();
    await expect(page).toHaveURL(/login/);
  });

  test('Footer - About Us link works', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    await page.getByRole('link', { name: 'About Us' }).click();
    await expect(page).toHaveURL(/about/);
  });

  test('Footer - Blood Connect link works', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    // Use the footer-specific link to avoid ambiguity
    await page.getByRole('contentinfo').getByRole('link', { name: 'Blood Connect' }).click();
    await expect(page).toHaveURL(/blood-bank/);
  });

  test('Footer - Hospitals link works', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    // Use footer-specific link since "Hospitals" appears in both nav and footer
    await page.getByRole('contentinfo').getByRole('link', { name: 'Hospitals' }).click();
    await expect(page).toHaveURL(/hospitals/);
  });

  test('Footer - Privacy Policy link works', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    await page.getByRole('link', { name: 'Privacy Policy' }).click();
    await expect(page).toHaveURL(/privacy/);
  });

  test('Footer - Terms & Conditions link works', async ({ page }) => {
    await page.goto('https://www.pillora.in');
    await page.getByRole('link', { name: 'Terms & Conditions' }).click();
    await expect(page).toHaveURL(/terms/);
  });

});
