import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Lazy initialisation. Importing this module must NOT throw when DATABASE_URL is
// absent — the core visa checker (embedded data) runs fine without a database.
// Only features that actually touch the DB (newsletter, alerts, my-travels,
// admin) require DATABASE_URL, and they fail gracefully via the API error
// handler if it is missing.
let _pool: pg.Pool | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getPool(): pg.Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set to use the database. This feature is disabled until a Postgres connection string is configured.",
      );
    }
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool;
}

function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

// Proxies so `pool` / `db` can be imported anywhere without side effects. The
// underlying connection is created on first property access — which only
// happens when a route actually runs a query.
export const pool: pg.Pool = new Proxy({} as pg.Pool, {
  get(_t, prop, receiver) {
    return Reflect.get(getPool(), prop, receiver);
  },
});

export const db: ReturnType<typeof drizzle<typeof schema>> = new Proxy(
  {} as ReturnType<typeof drizzle<typeof schema>>,
  {
    get(_t, prop, receiver) {
      return Reflect.get(getDb(), prop, receiver);
    },
  },
);

export * from "./schema";
