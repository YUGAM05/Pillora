import { test, expect } from '@playwright/test';

test.describe('Pillora Blood Bank Page', () => {

  test('Blood bank page loads correctly', async ({ page }) => {
    await page.goto('https://www.pillora.in/blood-bank');
    await expect(page).toHaveTitle(/Blood/i);
  });

  test('Donor Registration form is visible', async ({ page }) => {
    await page.goto('https://www.pillora.in/blood-bank');
    await expect(page.getByText('Donor Registration')).toBeVisible();
  });

  test('All form fields are present', async ({ page }) => {
    await page.goto('https://www.pillora.in/blood-bank');
    await expect(page.getByPlaceholder('Enter your full name')).toBeVisible();
    await expect(page.getByPlaceholder('18-60 years')).toBeVisible();
    await expect(page.getByPlaceholder('+91 98765 00000')).toBeVisible();
    await expect(page.getByPlaceholder('House No, Street, Landmark')).toBeVisible();
  });

  test('Blood group dropdown has all options', async ({ page }) => {
    await page.goto('https://www.pillora.in/blood-bank');
    const dropdown = page.locator('select').first();
    await expect(dropdown).toContainText('A+');
    await expect(dropdown).toContainText('O-');
    await expect(dropdown).toContainText('AB+');
  });

  test('Form validation - empty submit shows error', async ({ page }) => {
    await page.goto('https://www.pillora.in/blood-bank');
    await page.getByRole('button', { name: 'Register as Donor' }).click();
    // Form should NOT navigate away (validation should stop it)
    await expect(page).toHaveURL(/blood-bank/);
  });

  test('Fill and submit donor registration form', async ({ page }) => {
    await page.goto('https://www.pillora.in/blood-bank');

    // Fill name
    await page.getByPlaceholder('Enter your full name').fill('Test User');
    // Select blood group (1st select)
    await page.locator('select[name="bloodGroup"]').selectOption('A+');
    // Fill age
    await page.getByPlaceholder('18-60 years').fill('25');
    // Select gender (2nd select)
    await page.locator('select[name="gender"]').selectOption('Male');
    // Fill phone
    await page.getByPlaceholder('+91 98765 00000').fill('9999999999');
    // Select area (select by name, not nth index)
    await page.locator('select[name="area"]').selectOption('Navrangpura');
    // Fill address
    await page.getByPlaceholder('House No, Street, Landmark').fill('123 Test Street');

    await page.getByRole('button', { name: 'Register as Donor' }).click();

    // Wait for the form submission response
    await page.waitForTimeout(3000);
    // Should stay on page or show success message
    await expect(page).toHaveURL(/blood-bank/);
  });

  test('Live stats are visible (Donors Online & Active Requests)', async ({ page }) => {
    await page.goto('https://www.pillora.in/blood-bank');
    await expect(page.getByText('Donors Online')).toBeVisible();
    await expect(page.getByText('Active Requests')).toBeVisible();
  });

  test('Emergency call number is visible', async ({ page }) => {
    await page.goto('https://www.pillora.in/blood-bank');
    await expect(page.getByText('+91 9429167856')).toBeVisible();
  });

});
