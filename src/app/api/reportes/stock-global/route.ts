import { NextResponse } from 'next/server';
import { getSession, isSuperAdmin } from '@/lib/auth/helpers';
import { getAllDbs } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || !isSuperAdmin(session)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const results = await Promise.all(
      getAllDbs().map(async ({ pais, db }) => {
        const stock = await db.selectFrom('stock')
          .select(['id_medicamento', 'cantidad_disponible', 'precio_local', 'moneda'])
          .execute();
        const totalStock = stock.reduce((sum, s) => sum + Number(s.cantidad_disponible), 0);
        return { pais, totalStock, count: stock.length };
      })
    );

    return NextResponse.json({ data: results });
  } catch {
    return NextResponse.json({ error: 'Error al consultar' }, { status: 500 });
  }
}