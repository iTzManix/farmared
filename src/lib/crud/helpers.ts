import { NextResponse } from 'next/server';
import { getSession, getAccessiblesPaises, isSuperAdmin } from '@/lib/auth/helpers';
import { getDbForCountry } from '@/lib/db';
import { Kysely } from 'kysely';
import type { FarmaredDB, Pais } from '@/types/database';
import { z } from 'zod';

export interface ApiHandler<T> {
  table: keyof FarmaredDB;
  schema?: z.ZodType<T>;
  allowedMethods?: ('GET' | 'POST' | 'PUT' | 'DELETE')[];
}

export async function handleApiError(error: unknown): Promise<NextResponse> {
  const message = error instanceof Error ? error.message : String(error);
  console.error('[API Error]', error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function getSessionOrFail() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  return session;
}

export function buildCountryFilter(paises: Pais[]): (qb: any) => any {
  return (qb: any) => {
    if (paises.length === 1) {
      return qb.where('pais', '=', paises[0]);
    }
    return qb;
  };
}

export async function getPaginated(
  db: Kysely<FarmaredDB>,
  table: keyof FarmaredDB,
  page = 1,
  pageSize = 10,
  filters?: Record<string, unknown>
) {
  const offset = (page - 1) * pageSize;
  const query = db
    .selectFrom(table)
    .selectAll()
    .offset(offset)
    .fetch(pageSize);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        (query as any).where(key, '=', value);
      }
    });
  }

  const data = await query.execute();
  const total = await db
    .selectFrom(table)
    .select(db.fn.countAll<number>().as('count'))
    .executeTakeFirst();

  return {
    data,
    total: Number(total?.count ?? 0),
    page,
    pageSize,
    totalPages: Math.ceil(Number(total?.count ?? 0) / pageSize),
  };
}

export function createApiResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}