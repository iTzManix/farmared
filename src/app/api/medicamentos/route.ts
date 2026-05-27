import { NextRequest, NextResponse } from 'next/server';
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
            .limit(pageSize)
            .offset((page - 1) * pageSize)
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
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (search) {
      query = query.where('nombre', 'ilike', `%${search}%`);
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

    const pais = session.user.pais;
    if (!pais) {
      return NextResponse.json({ error: 'No tiene país asignado' }, { status: 403 });
    }

    const db = getDbForCountry(pais);
    const result = await db
      .insertInto('medicamento')
      .values({
        pais,
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
}