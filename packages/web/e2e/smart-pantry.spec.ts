import { test, expect } from '@playwright/test';

test.describe('Smart Pantry E2E Flow', () => {
  const uniqueId = Date.now();
  const user = {
    username: `user_${uniqueId}`,
    email: `e2e_${uniqueId}@test.com`,
    password: 'password123',
  };

  test('should register, add item to shopping list, buy it and check pantry', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel("Ім'я користувача").fill(user.username);
    await page.getByLabel('Електронна пошта').fill(user.email);
    await page.getByLabel('Пароль').fill(user.password);
    await page.getByLabel('Підтвердження пароля').fill(user.password);

    await page.getByRole('button', { name: 'Зареєструватися' }).click();

    await expect(page).toHaveURL('/');

    await expect(page.getByRole('heading', { name: /Комора/i })).toBeVisible();

    await page.getByRole('button', { name: 'Список покупок' }).click();
    await expect(page).toHaveURL('/shopping-list');

    await page.getByRole('button', { name: '+ Додати' }).click();

    await page.getByLabel('Назва').fill('Playwright Milk');
    await page.getByLabel('Кількість').fill('2');

    await page.locator('select').selectOption('л');

    await page.getByRole('button', { name: 'Додати', exact: true }).click();

    await expect(page.getByText('Playwright Milk')).toBeVisible();

    const row = page
      .locator('div')
      .filter({ hasText: 'Playwright Milk' })
      .filter({ has: page.locator('input[type="checkbox"]') });

    await row.locator('input[type="checkbox"]').check();

    await page.getByRole('button', { name: /Купити обрані/i }).click();

    await expect(page.getByText('Playwright Milk')).toBeHidden();

    await page.getByRole('button', { name: /У комору/i }).click();
    await expect(page).toHaveURL('/');

    await expect(page.getByText('Playwright Milk')).toBeVisible();

    await expect(page.locator('body')).toContainText('2 л');
  });
});
