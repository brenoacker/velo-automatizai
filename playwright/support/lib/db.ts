import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import { Database, Tables } from '../../../src/integrations/supabase/types'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined.')
}

export const db = new Kysely<Database['public']['Tables']>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})

export async function insertOrders(orders: Tables<'orders'>[]) {
  try {
    if (orders.length === 0) return

    await db.insertInto('orders')
      .values(orders)
      .onConflict((oc) => oc.columns(['id']).doNothing())
      .execute()
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code !== '23505') {
      throw error // Ignore duplicate key errors from parallel workers
    }
  }
}

export async function deleteOrdersById(ids: string[]) {
  if (ids.length === 0) return
  
  await db.deleteFrom('orders')
    .where('id', 'in', ids)
    .execute()
}

export async function deleteOrdersByNumber(orderNumbers: string[]) {
  if (orderNumbers.length === 0) return
  
  await db.deleteFrom('orders')
    .where('order_number', 'in', orderNumbers)
    .execute()
}
