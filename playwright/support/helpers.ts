/**
 * Generates a random order ID following the pattern: VVLO-6AWB2D
 * Pattern: 'VVLO-' + digit + 3 uppercase letters/digits + digit + uppercase letter
 * Example: VVLO-6AWB2D
 */
export function generateRandomOrderId(): string {
  const prefix = 'VLO-SEAR'
  const randomDigit = () => Math.floor(Math.random() * 10).toString()
  return prefix + randomDigit() + randomDigit()
}

import { randomUUID } from 'crypto'
import type { OrderDetails } from './actions/orderLookupActions'
import { Tables } from '../../src/integrations/supabase/types'

export type OrderDbRow = Tables<'orders'>

export type DynamicOrder = OrderDbRow & {
  uiDetails: OrderDetails
}

export function buildDynamicOrder(overrides: Partial<OrderDbRow> = {}): DynamicOrder {
  const dbOrder: OrderDbRow = {
    id: randomUUID(),
    order_number: generateRandomOrderId(),
    color: 'lunar-white',
    wheel_type: 'aero',
    customer_name: 'Dynamic Customer',
    customer_email: 'dynamic@example.com',
    customer_phone: '(11) 99999-9999',
    customer_cpf: '000.000.000-00',
    payment_method: 'avista',
    total_price: 50500,
    status: 'APROVADO',
    optionals: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }

  const formatColor: Record<string, string> = {
    'lunar-white': 'Lunar White',
    'midnight-black': 'Midnight Black',
    'glacier-blue': 'Glacier Blue'
  }
  
  const formatPayment: Record<string, string> = {
    'avista': 'À Vista',
    'financiamento': 'Financiamento'
  }

  const uiDetails: OrderDetails = {
    number: dbOrder.order_number,
    status: dbOrder.status,
    color: formatColor[dbOrder.color] || dbOrder.color,
    wheels: dbOrder.wheel_type + ' Wheels',
    interior: 'cream',
    customer: {
      name: dbOrder.customer_name,
      email: dbOrder.customer_email
    },
    payment: formatPayment[dbOrder.payment_method] || dbOrder.payment_method
  }

  return {
    ...dbOrder,
    uiDetails
  }
}
