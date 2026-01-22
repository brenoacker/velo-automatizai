import { test, expect } from '@playwright/test';

test('Search for a non-existing order', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();

  // Act
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await page.getByTestId('search-order-id').click();
  await page.getByTestId('search-order-id').fill('abcd');
  await page.getByTestId('search-order-button').click();
  
  // Assert
  await expect(page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible();
  await expect(page.getByText('Verifique o número do pedido')).toBeVisible();
});

test('Search for an existing order', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();

  // Act
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await page.getByTestId('search-order-id').click();
  await page.getByTestId('search-order-id').fill('VLO-6AWB2D');
  await page.getByTestId('search-order-button').click();
  
  // Assert
  await expect(page.getByTestId('order-result-id')).toBeVisible();
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-6AWB2D');
  await expect(page.getByTestId('order-result-status')).toBeVisible();
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');
});

