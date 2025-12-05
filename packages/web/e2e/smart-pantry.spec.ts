import { test, expect } from '@playwright/test';

test.describe('Smart Pantry E2E Flow', () => {
  const uniqueId = Date.now();
  const user = {
    username: `user_${uniqueId}`, // 5 символів + 6 цифр = 11 символів (OK < 20)
    email: `e2e_${uniqueId}@test.com`,
    password: 'password123',
  };

  test('should register, add item to shopping list, buy it and check pantry', async ({ page }) => {
    // 1. Реєстрація
    await page.goto('/register');
    // Використовуємо правильні лейбли (якщо ви виправили Input.tsx)
    await page.getByLabel("Ім'я користувача").fill(user.username);
    await page.getByLabel('Електронна пошта').fill(user.email);
    await page.getByLabel('Пароль').fill(user.password);
    await page.getByLabel('Підтвердження пароля').fill(user.password); // Додано підтвердження

    await page.getByRole('button', { name: 'Зареєструватися' }).click();

    // === ВИПРАВЛЕННЯ ТУТ ===
    // Очікуємо перехід одразу на Головну (авто-логін), а не на логін
    await expect(page).toHaveURL('/');

    // Переконуємось, що ми дійсно авторизовані (бачимо заголовок Комора)
    await expect(page.getByRole('heading', { name: /Комора/i })).toBeVisible();

    // (Крок "2. Логін" пропускаємо, бо ми вже увійшли)

    // 3. Перехід до списку покупок
    await page.getByRole('button', { name: 'Список покупок' }).click();
    await expect(page).toHaveURL('/shopping-list');

    // 4. Додавання товару
    await page.getByRole('button', { name: '+ Додати' }).click();

    // Заповнення модалки
    await page.getByLabel('Назва').fill('Playwright Milk');
    await page.getByLabel('Кількість').fill('2');

    // Якщо у вас Input component для кількості теж має лейбл, переконайтесь, що він унікальний
    // Іноді селект краще шукати так:
    await page.locator('select').selectOption('л');

    await page.getByRole('button', { name: 'Додати', exact: true }).click();

    // Перевірка, що товар з'явився у списку
    await expect(page.getByText('Playwright Milk')).toBeVisible();

    // 5. Купівля товару
    // Знаходимо рядок з товаром і чекаємо чекбокс в ньому
    const row = page
      .locator('div')
      .filter({ hasText: 'Playwright Milk' })
      .filter({ has: page.locator('input[type="checkbox"]') });

    await row.locator('input[type="checkbox"]').check();

    // Натискаємо "Купити обрані"
    await page.getByRole('button', { name: /Купити обрані/i }).click();

    // Перевіряємо, що товар зник зі списку
    await expect(page.getByText('Playwright Milk')).toBeHidden();

    // 6. Перевірка Комори
    await page.getByRole('button', { name: /У комору/i }).click();
    await expect(page).toHaveURL('/');

    // Перевіряємо, що товар з'явився в коморі
    await expect(page.getByText('Playwright Milk')).toBeVisible();
    // Playwright іноді шукає точний текст, тому "2 л" може бути окремими елементами
    // Перевіримо просто наявність тексту
    await expect(page.locator('body')).toContainText('2 л');
  });
});
