import { NextRequest, NextResponse } from 'next/server';
import { getSession, getAccessiblesPaises, isSuperAdmin } from '@/lib/auth/helpers';
import { getDbForCountry, getAllDbs } from '@/lib/db';
import { handleApiError } from '@/lib/crud/helpers';
import { ventaSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const paises = getAccessiblesPaises(session);

    if (isSuperAdmin(session)) {
      const results = await Promise.all(getAllDbs().map(({ pais, db }) =>
        db.selectFrom('venta')
          .leftJoin('sucursal', 'sucursal.id_sucursal', 'venta.id_sucursal')
          .leftJoin('cliente', 'cliente.id_cliente', 'venta.id_cliente')
          .leftJoin('medicamento', 'medicamento.id_medicamento', 'venta.id_medicamento')
          .selectAll('venta')
          .select(['sucursal.nombre as nombre_sucursal', 'cliente.nombre as nombre_cliente', 'medicamento.nombre as nombre_medicamento'])
          .where('venta.pais', '=', pais)
          .orderBy('venta.id_venta', 'desc').offset((page - 1) * pageSize).fetch(pageSize).execute()
      ));
      return NextResponse.json({ data: results.flat(), page, pageSize });
    }

    const db = getDbForCountry(paises[0]);
    const data = await db.selectFrom('venta')
      .leftJoin('sucursal', 'sucursal.id_sucursal', 'venta.id_sucursal')
      .leftJoin('cliente', 'cliente.id_cliente', 'venta.id_cliente')
      .leftJoin('medicamento', 'medicamento.id_medicamento', 'venta.id_medicamento')
      .selectAll('venta')
      .select(['sucursal.nombre as nombre_sucursal', 'cliente.nombre as nombre_cliente', 'medicamento.nombre as nombre_medicamento'])
      .where('venta.pais', '=', paises[0])
      .orderBy('venta.id_venta', 'desc')
      .offset((page - 1) * pageSize).fetch(pageSize).execute();
    return NextResponse.json({ data, page, pageSize });
  } catch (e) { return handleApiError(e); }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const parsed = ventaSchema.parse(body);
    
    let targetPais = session.user.pais;
    if (isSuperAdmin(session)) {
      targetPais = body.pais;
    }
    if (!targetPais) return NextResponse.json({ error: 'País no especificado' }, { status: 400 });

    const db = getDbForCountry(targetPais);
    const result = await db.insertInto('venta').values({
      pais: targetPais,
      id_sucursal: parsed.id_sucursal,
      id_empleado: parsed.id_empleado ?? null,
      id_cliente: parsed.id_cliente ?? null,
      id_medicamento: parsed.id_medicamento,
      cantidad: parsed.cantidad,
      moneda: parsed.moneda,
      monto_total: parsed.monto_total,
      fecha_local: new Date(),
      fecha_utc: new Date(),
    }).executeTakeFirst();

    // Auto-deduct stock: create detalle_venta and decrement stock
    if (body.detalles) {
      for (const detalle of body.detalles) {
        await db.insertInto('detalle_venta').values({
          id_venta: Number(result.insertId),
          id_medicamento: detalle.id_medicamento,
          pais: targetPais,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal,
        }).execute();
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) { return handleApiError(e); }
}