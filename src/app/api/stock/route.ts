import { NextRequest, NextResponse } from 'next/server';
import { getSession, getAccessiblesPaises, isSuperAdmin } from '@/lib/auth/helpers';
import { getDbForCountry, getAllDbs } from '@/lib/db';
import { handleApiError } from '@/lib/crud/helpers';
import { stockSchema } from '@/lib/validations';

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
        db.selectFrom('stock')
          .leftJoin('sucursal', 'sucursal.id_sucursal', 'stock.id_sucursal')
          .leftJoin('medicamento', 'medicamento.id_medicamento', 'stock.id_medicamento')
          .selectAll('stock')
          .select(['sucursal.nombre as nombre_sucursal', 'medicamento.nombre as nombre_medicamento'])
          .where('stock.pais', '=', pais)
          .orderBy('stock.id_stock', 'desc').offset((page - 1) * pageSize).fetch(pageSize).execute()
      ));
      return NextResponse.json({ data: results.flat(), page, pageSize });
    }

    const db = getDbForCountry(paises[0]);
    const data = await db.selectFrom('stock')
      .leftJoin('sucursal', 'sucursal.id_sucursal', 'stock.id_sucursal')
      .leftJoin('medicamento', 'medicamento.id_medicamento', 'stock.id_medicamento')
      .selectAll('stock')
      .select(['sucursal.nombre as nombre_sucursal', 'medicamento.nombre as nombre_medicamento'])
      .where('stock.pais', '=', paises[0])
      .orderBy('stock.id_stock', 'desc')
      .offset((page - 1) * pageSize).fetch(pageSize).execute();
    return NextResponse.json({ data, page, pageSize });
  } catch (e) { return handleApiError(e); }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const parsed = stockSchema.parse(body);
    
    let targetPais = session.user.pais;
    if (isSuperAdmin(session)) {
      targetPais = body.pais;
    }
    if (!targetPais) return NextResponse.json({ error: 'País no especificado' }, { status: 400 });

    const db = getDbForCountry(targetPais);
    await db.insertInto('stock').values({ pais: targetPais, ...parsed }).executeTakeFirst();
    return NextResponse.json({ success: true });
  } catch (e) { return handleApiError(e); }
}export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const { id_stock, pais, ...data } = body;
    if (!id_stock || !pais) return NextResponse.json({ error: 'ID o pas faltante' }, { status: 400 });

    if (!isSuperAdmin(session) && session.user.pais !== pais) {
      return NextResponse.json({ error: 'No tienes permiso para editar en este nodo' }, { status: 403 });
    }

    const parsed = stockSchema.parse(data);
    const db = getDbForCountry(pais);
    
    await db.updateTable('stock')
      .set(parsed)
      .where('id_stock', '=', id_stock)
      .where('pais', '=', pais)
      .executeTakeFirst();
      
    return NextResponse.json({ success: true });
  } catch (e) { return handleApiError(e); }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    const pais = searchParams.get('pais');
    if (!id || !pais) return NextResponse.json({ error: 'Faltan parmetros' }, { status: 400 });

    if (!isSuperAdmin(session) && session.user.pais !== pais) {
      return NextResponse.json({ error: 'No tienes permiso para eliminar en este nodo' }, { status: 403 });
    }

    const db = getDbForCountry(pais as any);
    await db.deleteFrom('stock')
      .where('id_stock', '=', id)
      .where('pais', '=', pais as any)
      .executeTakeFirst();

    return NextResponse.json({ success: true });
  } catch (e) { return handleApiError(e); }
}
