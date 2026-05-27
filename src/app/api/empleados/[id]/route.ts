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
    const item = await db.selectFrom('empleado').selectAll()
      .where('id_empleado', '=', Number(id)).executeTakeFirst();

    if (!item) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(item);
  } catch (e) { return handleApiError(e); }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const db = getDbForCountry(session.user.pais!);
    await db.updateTable('empleado').set(body)
      .where('id_empleado', '=', Number(id)).execute();
    return NextResponse.json({ success: true });
  } catch (e) { return handleApiError(e); }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const db = getDbForCountry(session.user.pais!);
    await db.deleteFrom('empleado').where('id_empleado', '=', Number(id)).execute();
    return NextResponse.json({ success: true });
  } catch (e) { return handleApiError(e); }
}