import { test, expect } from '@playwright/test';
import { generateRandomOrderId } from '../../support/helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Velô Sprint', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Consultar Pedido' })).toBeVisible();
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('textbox', { name: 'Número do Pedido' })).toBeVisible();

})

test('displays approved order details with green badge', async ({ page }) => {
  // Arrange
  const order = {
      number: 'VLO-6AWB2D',
      status: 'APROVADO',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      interior: 'cream',
      customer: {
        name: 'BRENO ACKER',
        email: 'brenoacker@gmail.com'
      },
      payment: 'À Vista'
  }

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).click()
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
  await expect(page.getByRole('button', {name: 'Buscar Pedido'})).toBeVisible()
  await page.getByRole('button', {name: 'Buscar Pedido'}).click();
  
  // Assert
  // const orderContainer = page.getByRole('paragraph')
  //   .filter({ hasText: /^Pedido$/ })
  //   .locator('..');
    
  // await expect(orderContainer).toBeVisible({timeout: 10_000});
  // await expect(orderContainer).toContainText(existingOrderId)
  // await expect(page.getByText('APROVADO')).toBeVisible();

  // Assert
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: ${order.interior}
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    const statusBadge = page.getByRole('status').filter({hasText: order.status})

    await expect(statusBadge).toHaveClass(/bg-green-100/)
    await expect(statusBadge).toHaveClass(/text-green-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide-circle-check-big/)

  });

test('displays not found message for non-existing order', async ({ page }) => {
  // Arrange
  const nonExistingOrderId = generateRandomOrderId();

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).click();
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(nonExistingOrderId);
  await expect(page.getByRole('button', {name: 'Buscar Pedido'})).toBeVisible()
  await page.getByRole('button', {name: 'Buscar Pedido'}).click();
  
  // Assert
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
  `);
});

test('displays order in analysis with yellow badge and clock icon', async ({ page }) => {
  // Arrange
  const order = {
    number: 'VLO-2S9U6E',
    status: 'EM_ANALISE',
    color: 'Midnight Black',
    wheels: 'aero Wheels',
    interior: 'cream',
    customer: {
      name: 'Lean Klau',
      email: 'lean@gmail.com'
    },
    payment: 'À Vista'
  }

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).click();
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
  await expect(page.getByRole('button', {name: 'Buscar Pedido'})).toBeVisible()
  await page.getByRole('button', {name: 'Buscar Pedido'}).click();

  // Assert
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: ${order.interior}
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
  `);

  const statusBadge = page.getByRole('status').filter({hasText: order.status})

  await expect(statusBadge).toHaveClass(/bg-yellow-100/)
  await expect(statusBadge).toHaveClass(/text-yellow-700/)

  const statusIcon = statusBadge.locator('svg')
  await expect(statusIcon).toHaveClass(/lucide-loader-circle/)
})

test('displays rejected order with red badge', async ({ page }) => {
  // Arrange
  const order = {
    number: 'VLO-G01ABZ',
    status: 'REPROVADO',
    color: 'Glacier Blue',
    wheels: 'sport Wheels',
    interior: 'cream',
    customer: {
      name: 'John Doe',
      email: 'john@gmail.com'
    },
    payment: 'À Vista'
  }

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).click();
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
  await expect(page.getByRole('button', {name: 'Buscar Pedido'})).toBeVisible()
  await page.getByRole('button', {name: 'Buscar Pedido'}).click();

  // Assert
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: ${order.interior}
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
  `);

  const statusBadge = page.getByRole('status').filter({hasText: order.status})

  await expect(statusBadge).toHaveClass(/bg-red-100/)
  await expect(statusBadge).toHaveClass(/text-red-700/)

  const statusIcon = statusBadge.locator('svg')
  await expect(statusIcon).toHaveClass(/lucide-circle-x/)
})