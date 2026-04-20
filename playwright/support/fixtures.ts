import { test as base } from '@playwright/test'
import { createOrderLookupActions } from './actions/orderLookupActions'
import { createConfiguratorActions } from './actions/configuratorActions'

type App = {
    orderLookup: ReturnType<typeof createOrderLookupActions>
    configurator: ReturnType<typeof createConfiguratorActions>
}

import { insertOrders, deleteOrdersById } from './lib/db'
import { buildDynamicOrder, DynamicOrder, OrderDbRow } from './helpers'

type OrderFactory = {
  seedOrder: (overrides?: Partial<OrderDbRow>) => Promise<DynamicOrder>
}

export const test = base.extend<{ app: App; orderFactory: OrderFactory }>({
  app: async ({ page }, use) => {
    const app: App = {
      orderLookup: createOrderLookupActions(page),
      configurator: createConfiguratorActions(page),
    }
    await use(app)
  },
  
  orderFactory: async ({}, use) => {
    const trackedOrderIds: string[] = []

    const factory: OrderFactory = {
      seedOrder: async (overrides = {}) => {
        const order = buildDynamicOrder(overrides)
        // We only insert DbModel fields, so we need to omit uiDetails
        const { uiDetails, ...dbRecord } = order
        await insertOrders([dbRecord])
        trackedOrderIds.push(order.id)
        return order
      }
    }

    await use(factory)

    // Teardown: Cleanup all orders created by this factory
    if (trackedOrderIds.length > 0) {
      await deleteOrdersById(trackedOrderIds)
    }
  }
})

export { expect } from '@playwright/test'
