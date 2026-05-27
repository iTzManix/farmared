import { boliviaDb } from './bolivia';
import { peruDb } from './peru';
import { chileDb } from './chile';
import type { Kysely } from 'kysely';
import type { FarmaredDB, Pais } from '@/types/database';

export { boliviaDb, peruDb, chileDb };

export function getDbForCountry(pais: Pais): Kysely<FarmaredDB> {
  switch (pais) {
    case 'BO':
      return boliviaDb;
    case 'PE':
      return peruDb;
    case 'CL':
      return chileDb;
  }
}

interface DBEntry {
  pais: Pais;
  db: Kysely<FarmaredDB>;
}

export function getAllDbs(): DBEntry[] {
  return [
    { pais: 'BO', db: boliviaDb },
    { pais: 'PE', db: peruDb },
    { pais: 'CL', db: chileDb },
  ];
}

export async function checkNodeHealth(pais: Pais): Promise<{ healthy: boolean; error?: string; latencyMs?: number }> {
  const start = performance.now();
  try {
    const db = getDbForCountry(pais);
    await db.selectFrom('sucursal').select('id_sucursal').orderBy('id_sucursal', 'asc').offset(0).fetch(1).execute();
    const latency = Math.round(performance.now() - start);
    return { healthy: true, latencyMs: latency };
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    return { healthy: false, error };
  }
}

export async function checkAllNodesHealth(): Promise<
  Record<Pais, { healthy: boolean; error?: string; latencyMs?: number }>
> {
  const results = await Promise.all(
    getAllDbs().map(async ({ pais }) => ({
      pais,
      result: await checkNodeHealth(pais),
    }))
  );

  return results.reduce((acc, { pais, result }) => {
    acc[pais] = result;
    return acc;
  }, {} as Record<Pais, { healthy: boolean; error?: string; latencyMs?: number }>);
}
