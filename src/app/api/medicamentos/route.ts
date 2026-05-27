import { NextRequest, NextResponse } from 'next/server';
import { sql } from 'kysely';
import { getSession, getAccessiblesPaises, isSuperAdmin } from '@/lib/auth/helpers';
import { getDbForCountry, getAllDbs } from '@/lib/db';
import { medicamentoSchema } from '@/lib/validations';
import { handleApiError, getPaginated } from '@/lib/crud/helpers';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';

    const paisesAccesibles = getAccessiblesPaises(session);

    if (isSuperAdmin(session)) {
      const results = await Promise.all(
        getAllDbs().map(async ({ pais, db }) => {
          const data = await db
            .selectFrom('medicamento')
            .selectAll()
            .where('pais', '=', pais)
            .orderBy('id_medicamento', 'desc')
            .offset((page - 1) * pageSize)
            .fetch(pageSize)
            .execute();
          return { pais, data };
        })
      );

      const allData = results.flatMap((r) => r.data);
      return NextResponse.json({
        data: allData,
        page,
        pageSize,
        total: allData.length,
      });
    }

    const db = getDbForCountry(paisesAccesibles[0]);
    let query = db
      .selectFrom('medicamento')
      .selectAll()
      .where('pais', '=', paisesAccesibles[0])
      .orderBy('id_medicamento', 'desc')
      .offset((page - 1) * pageSize)
      .fetch(pageSize);

    if (search) {
      query = query.where(sql`LOWER(nombre)`, 'like', `%${search.toLowerCase()}%`);
    }

    const data = await query.execute();

    return NextResponse.json({ data, page, pageSize });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = medicamentoSchema.parse(body);

    let targetPais = session.user.pais;
    if (isSuperAdmin(session)) {
      targetPais = body.pais;
    }
    if (!targetPais) return NextResponse.json({ error: 'País no especificado' }, { status: 400 });

    const db = getDbForCountry(targetPais);
    const result = await db
      .insertInto('medicamento')
      .values({
        pais: targetPais,
        nombre: parsed.nombre,
        principio_activo: parsed.principio_activo ?? null,
        presentacion: parsed.presentacion ?? null,
        categoria: parsed.categoria ?? null,
        unidad_medida: parsed.unidad_medida ?? null,
        requiere_receta: parsed.requiere_receta,
      })
      .executeTakeFirst();

    return NextResponse.json({ success: true, id: Number(result.insertId) });
  } catch (e) {
    return handleApiError(e);
  }
}export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const { id_medicamento, pais, ...data } = body;
    if (!id_medicamento || !pais) return NextResponse.json({ error: 'ID o pas faltante' }, { status: 400 });

    if (!isSuperAdmin(session) && session.user.pais !== pais) {
      return NextResponse.json({ error: 'No tienes permiso para editar en este nodo' }, { status: 403 });
    }

    const parsed = medicamentoSchema.parse(data);
    const db = getDbForCountry(pais);
    
    await db.updateTable('medicamento')
      .set(parsed)
      .where('id_medicamento', '=', id_medicamento)
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
    await db.deleteFrom('medicamento')
      .where('id_medicamento', '=', id)
      .where('pais', '=', pais as any)
      .executeTakeFirst();

    return NextResponse.json({ success: true });
  } catch (e) { return handleApiError(e); }
}
