import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

export const db = drizzle(
  createClient({
    url: process.env.SECRET_TURSO_DB_URL || '',
    authToken: process.env.SECRET_TURSO_AUTH_TOKEN || '',
  }),
  {
    schema,
  }
)
