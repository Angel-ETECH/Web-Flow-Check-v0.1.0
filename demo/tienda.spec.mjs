import { expect, test } from '@playwright/test';

test('Tienda · dos cuadernos de S/ 30 suman S/ 60', async ({ page }) => {
  await page.goto('/tienda');
  await page.getByRole('button', { name: 'Agregar cuaderno al carrito' }).click();
  const subtotal = page.getByRole('status', { name: 'Subtotal' });
  await expect(subtotal).toHaveText('S/ 30.00');
  await page.getByRole('spinbutton', { name: 'Cantidad' }).fill('2');
  await expect(subtotal, 'El subtotal debe actualizarse con la cantidad').toHaveText('S/ 60.00');
});