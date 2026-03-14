import { test, expect } from '@playwright/test';
import { generateRandomOrderId } from '../../support/helpers';
import { OrderLookupPage } from '../../support/pages/OrderLookupPage';

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
  const orderLookupPage = new OrderLookupPage(page)
  orderLookupPage.searchOrder(order.number)

  // Assert
  await orderLookupPage.expectOrderAriaSnapshot(order);

    const statusBadge = await orderLookupPage.validateStatusBadge(order.status)
    await orderLookupPage.validateStatusIcon(statusBadge, order.status)

  });

test('displays not found message for non-existing order', async ({ page }) => {
  // Arrange
  const nonExistingOrderId = generateRandomOrderId();

  // Act
  const orderLookupPage = new OrderLookupPage(page)
  orderLookupPage.searchOrder(nonExistingOrderId)
  
  // Assert
  await orderLookupPage.expectOrderAriaSnapshotForOrderNotFound();
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
  const orderLookupPage = new OrderLookupPage(page)
  orderLookupPage.searchOrder(order.number)

  // Assert
  await orderLookupPage.expectOrderAriaSnapshot(order);

  const statusBadge = await orderLookupPage.validateStatusBadge(order.status)
  await orderLookupPage.validateStatusIcon(statusBadge, order.status)
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
  const orderLookupPage = new OrderLookupPage(page)
  orderLookupPage.searchOrder(order.number)

  // Assert
  await orderLookupPage.expectOrderAriaSnapshot(order);

  const statusBadge = await orderLookupPage.validateStatusBadge(order.status)
  await orderLookupPage.validateStatusIcon(statusBadge, order.status)
})