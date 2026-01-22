import { test, expect } from '@playwright/test';

test('Search for a non-existing order', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Checkpoint
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();

  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await page.getByTestId('search-order-id').click();
  await page.getByTestId('search-order-id').fill('abcd');
  await page.getByTestId('search-order-button').click();
  await page.getByRole('heading', { name: 'Pedido não encontrado' }).click();
  
  await expect(page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible();
  await expect(page.getByText('Verifique o número do pedido')).toBeVisible();

});