import { NextRequest, NextResponse } from 'next/server';
import { getSession, getAccessiblesPaises } from '@/lib/auth/helpers';
import { getDbForCountry } from '@/lib/db';
import { handleApiError } from '@/lib/crud/helpers';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const paises = getAccessiblesPaises(session);
    const db = getDbForCountry(paises[0]);

    const venta = await db.selectFrom('venta').selectAll()
      .where('id_venta', '=', Number(id)).executeTakeFirst();

    if (!venta) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    const detalles = await db.selectFrom('detalle_venta').selectAll()
      .where('id_venta', '=', Number(id)).execute();

    return NextResponse.json({ ...venta, detalles });
  } catch (e) { return handleApiError(e); }
}