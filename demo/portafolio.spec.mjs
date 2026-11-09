import { expect, test } from '@playwright/test';

test('Portafolio · el enlace abre la ficha de Huerto', async ({ page }) => {
  await page.goto('/portafolio');
  await page.getByRole('link', { name: 'Ver proyecto Huerto' }).click();
  await expect(page, 'El enlace debe llevar a la ficha de Huerto').toHaveURL(/\/portafolio\/huerto$/);
  await expect(page.getByRole('heading', { name: 'Huerto', exact: true })).toBeVisible();
});