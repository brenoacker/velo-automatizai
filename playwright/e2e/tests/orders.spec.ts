import { test, expect } from '../../support/fixtures'
import { generateRandomOrderId } from '../../support/helpers'

test.describe('Order Lookup', () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('displays approved order details with green badge', async ({ app, orderFactory }) => {
    const orderData = await orderFactory.seedOrder({
      color: 'lunar-white',
      wheel_type: 'aero',
      customer_name: 'BRENO ACKER',
      customer_email: 'brenoacker@gmail.com',
      payment_method: 'avista',
      status: 'APROVADO'
    })

    await app.orderLookup.searchOrder(orderData.order_number)

    await app.orderLookup.expectOrderAriaSnapshot(orderData.uiDetails)
    const statusBadge = await app.orderLookup.validateStatusBadge(orderData.status)
    await app.orderLookup.validateStatusIcon(statusBadge, orderData.status)
  })

  test('displays not found message for non-existing order', async ({ app }) => {
    const nonExistingOrderId = generateRandomOrderId()

    await app.orderLookup.searchOrder(nonExistingOrderId)

    await app.orderLookup.expectOrderAriaSnapshotForOrderNotFound()
  })

  test('displays order in analysis with yellow badge and clock icon', async ({ app, orderFactory }) => {
    const orderData = await orderFactory.seedOrder({
      color: 'midnight-black',
      wheel_type: 'aero',
      customer_name: 'Lean Klau',
      customer_email: 'lean@gmail.com',
      payment_method: 'avista',
      status: 'EM_ANALISE'
    })

    await app.orderLookup.searchOrder(orderData.order_number)

    await app.orderLookup.expectOrderAriaSnapshot(orderData.uiDetails)
    const statusBadge = await app.orderLookup.validateStatusBadge(orderData.status)
    await app.orderLookup.validateStatusIcon(statusBadge, orderData.status)
  })

  test('displays rejected order with red badge', async ({ app, orderFactory }) => {
    const orderData = await orderFactory.seedOrder({
      color: 'glacier-blue',
      wheel_type: 'sport',
      customer_name: 'John Doe',
      customer_email: 'john@gmail.com',
      payment_method: 'avista',
      status: 'REPROVADO'
    })

    await app.orderLookup.searchOrder(orderData.order_number)

    await app.orderLookup.expectOrderAriaSnapshot(orderData.uiDetails)
    const statusBadge = await app.orderLookup.validateStatusBadge(orderData.status)
    await app.orderLookup.validateStatusIcon(statusBadge, orderData.status)
  })

  test('find order button is disabled with empty field or with spaces', async ({ app }) => {
    await expect(app.orderLookup.elements.searchButton).toBeDisabled()
    await app.orderLookup.elements.orderInput.fill('   ')
    await expect(app.orderLookup.elements.searchButton).toBeDisabled()
  });
})