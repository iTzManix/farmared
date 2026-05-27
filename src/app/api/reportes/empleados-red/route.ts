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
        const empleados = await db.selectFrom('empleado')
          .select(['id_empleado', 'nombre', 'apellido', 'email', 'rol'])
          .execute();
        return { pais, empleados };
      })
    );

    return NextResponse.json({ data: results });
  } catch {
    return NextResponse.json({ error: 'Error al consultar' }, { status: 500 });
  }
}