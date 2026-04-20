import { test, expect } from '../../support/fixtures'
import { generateRandomOrderId } from '../../support/helpers'
import type { OrderDetails } from '../../support/actions/orderLookupActions'


test.describe('Order Lookup', () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('displays approved order details with green badge', async ({ app }) => {
    // Arrange
    const order: OrderDetails = {
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
    await app.orderLookup.searchOrder(order.number)

    // Assert
    await app.orderLookup.expectOrderAriaSnapshot(order)
    const statusBadge = await app.orderLookup.validateStatusBadge(order.status)
    await app.orderLookup.validateStatusIcon(statusBadge, order.status)
  })

  test('displays not found message for non-existing order', async ({ app }) => {
    // Arrange
    const nonExistingOrderId = generateRandomOrderId()
    // Act
    await app.orderLookup.searchOrder(nonExistingOrderId)
    // Assert
    await app.orderLookup.expectOrderAriaSnapshotForOrderNotFound()
  })

  test('displays order in analysis with yellow badge and clock icon', async ({ app }) => {
    // Arrange
    const order: OrderDetails = {
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
    await app.orderLookup.searchOrder(order.number)

    // Assert
    await app.orderLookup.expectOrderAriaSnapshot(order)
    const statusBadge = await app.orderLookup.validateStatusBadge(order.status)
    await app.orderLookup.validateStatusIcon(statusBadge, order.status)
  })

  test('displays rejected order with red badge', async ({ app }) => {
    // Arrange
    const order: OrderDetails = {
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
    await app.orderLookup.searchOrder(order.number)
    // Assert
    await app.orderLookup.expectOrderAriaSnapshot(order)
    const statusBadge = await app.orderLookup.validateStatusBadge(order.status)
    await app.orderLookup.validateStatusIcon(statusBadge, order.status)
  })

  test('find order button is disabled with empty field or with spaces', async ({ app }) => {
    await expect(app.orderLookup.elements.searchButton).toBeDisabled()
    await app.orderLookup.elements.orderInput.fill('   ')
    await expect(app.orderLookup.elements.searchButton).toBeDisabled()
  });
})