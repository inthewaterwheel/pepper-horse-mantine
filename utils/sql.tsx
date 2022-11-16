import postgres from 'postgres';
import { Sql } from 'postgres';

// This is for dev only, if this is ever going into prod, we should use Fly secret management instead.
const DB_URL =
  'postgresql://postgres:easy-pepper-db-password@db.algcbpudjsbowjmogqeq.supabase.co:5432/postgres';

interface typedGlobal {
  conn: null | Sql<{}>;
}

export function getSQL(): Sql<{}> {
  let g = globalThis as unknown as typedGlobal;
  if (!g.conn) {
    g.conn = postgres(DB_URL, { max: 1 });
  }
  return g.conn;
}
