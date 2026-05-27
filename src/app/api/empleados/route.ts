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
        db.selectFrom('empleado').selectAll().where('pais', '=', pais)
          .orderBy('id_empleado', 'desc').offset((page - 1) * pageSize).fetch(pageSize).execute()
      ));
      return NextResponse.json({ data: results.flat(), page, pageSize });
    }

    const db = getDbForCountry(paises[0]);
    const data = await db.selectFrom('empleado').selectAll()
      .where('pais', '=', paises[0])
      .orderBy('id_empleado', 'desc')
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
    const pais = session.user.pais;
    if (!pais) return NextResponse.json({ error: 'Sin país' }, { status: 403 });

    const db = getDbForCountry(pais);
    await db.insertInto('empleado').values({ pais, ...parsed }).executeTakeFirst();
    return NextResponse.json({ success: true });
  } catch (e) { return handleApiError(e); }
}