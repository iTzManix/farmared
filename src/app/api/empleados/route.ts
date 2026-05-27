import { NextRequest, NextResponse } from 'next/server';
import { getSession, getAccessiblesPaises, isSuperAdmin } from '@/lib/auth/helpers';
import { getDbForCountry, getAllDbs } from '@/lib/db';
import { handleApiError } from '@/lib/crud/helpers';
import { empleadoSchema } from '@/lib/validations';

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
        db.selectFrom('empleado')
          .leftJoin('sucursal', 'sucursal.id_sucursal', 'empleado.id_sucursal')
          .selectAll('empleado')
          .select('sucursal.nombre as nombre_sucursal')
          .where('empleado.pais', '=', pais)
          .orderBy('empleado.id_empleado', 'desc').offset((page - 1) * pageSize).fetch(pageSize).execute()
      ));
      return NextResponse.json({ data: results.flat(), page, pageSize });
    }

    const db = getDbForCountry(paises[0]);
    const data = await db.selectFrom('empleado')
      .leftJoin('sucursal', 'sucursal.id_sucursal', 'empleado.id_sucursal')
      .selectAll('empleado')
      .select('sucursal.nombre as nombre_sucursal')
      .where('empleado.pais', '=', paises[0])
      .orderBy('empleado.id_empleado', 'desc')
      .offset((page - 1) * pageSize).fetch(pageSize).execute();
    return NextResponse.json({ data, page, pageSize });
  } catch (e) { return handleApiError(e); }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const parsed = empleadoSchema.parse(body);
    const { fecha_ingreso, ...parsedData } = parsed;
    
    let targetPais = session.user.pais;
    if (isSuperAdmin(session)) {
      targetPais = body.pais;
    }
    if (!targetPais) return NextResponse.json({ error: 'País no especificado' }, { status: 400 });

    const db = getDbForCountry(targetPais);
    await db.insertInto('empleado').values({ pais: targetPais, ...parsedData }).executeTakeFirst();
    return NextResponse.json({ success: true });
  } catch (e) { return handleApiError(e); }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const { id_empleado, pais, ...data } = body;
    if (!id_empleado || !pais) return NextResponse.json({ error: 'ID o pas faltante' }, { status: 400 });

    if (!isSuperAdmin(session) && session.user.pais !== pais) {
      return NextResponse.json({ error: 'No tienes permiso para editar en este nodo' }, { status: 403 });
    }

    const parsed = empleadoSchema.parse(data);
    const { fecha_ingreso, ...parsedData } = parsed;
    const db = getDbForCountry(pais);
    
    await db.updateTable('empleado')
      .set(parsedData)
      .where('id_empleado', '=', id_empleado)
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
    await db.deleteFrom('empleado')
      .where('id_empleado', '=', id)
      .where('pais', '=', pais as any)
      .executeTakeFirst();

    return NextResponse.json({ success: true });
  } catch (e) { return handleApiError(e); }
}
