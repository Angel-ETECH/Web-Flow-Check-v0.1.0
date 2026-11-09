import { expect, test } from '@playwright/test';

test('La página de inicio muestra el encabezado esperado', async ({ page, baseURL }) => {
  await page.goto(baseURL);
  // Cambia "Inicio" por el encabezado visible que debe mostrar tu página.
  await expect(page.getByRole('heading', { name: 'Inicio', exact: true })).toBeVisible();
});
