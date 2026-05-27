import { NextResponse } from 'next/server';
import { getSession, isSuperAdmin } from '@/lib/auth/helpers';
import { getAllDbs } from '@/lib/db';
import { convertCurrency } from '@/lib/currency/converter';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || !isSuperAdmin(session)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const results = await Promise.all(
      getAllDbs().map(async ({ pais, db }) => {
        const ventas = await db.selectFrom('venta')
          .select(['monto_total', 'moneda', 'fecha_local'])
          .execute();
        const total = ventas.reduce((sum, v) => sum + Number(v.monto_total), 0);
        return { pais, total, moneda: 'BOB' as const, count: ventas.length };
      })
    );

    return NextResponse.json({ data: results });
  } catch {
    return NextResponse.json({ error: 'Error al consultar' }, { status: 500 });
  }
}