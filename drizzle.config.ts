import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.SECRET_TURSO_DB_URL || '',
    authToken: process.env.SECRET_TURSO_AUTH_TOKEN || '',
  },
} satisfies Config;