import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('Search for an existing order', async ({ page }) => {
  // Arrange
  const existingOrderId = 'VLO-6AWB2D'

  await expect(page.getByRole('heading', { name: 'Velô Sprint', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Consultar Pedido' })).toBeVisible();
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).click()
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(existingOrderId);
  await expect(page.getByRole('button', {name: 'Buscar Pedido'})).toBeVisible()
  await page.getByRole('button', {name: 'Buscar Pedido'}).click();
  
  // Assert
  await expect(page.getByText('Pedido', { exact: true })).toBeVisible({timeout: 10_000});
  await expect(page.getByText(existingOrderId)).toBeVisible();
  await expect(page.getByText('APROVADO')).toBeVisible();
});

test('Search for a non-existing order', async ({ page }) => {
  // Arrange
  const nonExistingOrderId = 'abcd';

  await expect(page.getByRole('heading', { name: 'Velô Sprint', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Consultar Pedido' })).toBeVisible();
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();

  // Act
  await expect(page.getByRole('textbox', { name: 'Número do Pedido' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Número do Pedido' }).click();
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(nonExistingOrderId);
  await page.getByRole('button', {name: 'Buscar Pedido'}).click();
  
  // Assert
  await expect(page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible({timeout: 10_000});
  await expect(page.getByText('Verifique o número do pedido')).toBeVisible();
});
