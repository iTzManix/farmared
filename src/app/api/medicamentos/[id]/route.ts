import { NextRequest, NextResponse } from 'next/server';
import { getSession, isSuperAdmin, getAccessiblesPaises } from '@/lib/auth/helpers';
import { getDbForCountry, getAllDbs } from '@/lib/db';
import { medicamentoSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/crud/helpers';
import { z } from 'zod';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const paises = getAccessiblesPaises(session);

    if (isSuperAdmin(session)) {
      for (const { db } of getAllDbs()) {
        const item = await db
          .selectFrom('medicamento')
          .selectAll()
          .where('id_medicamento', '=', Number(id))
          .executeTakeFirst();
        if (item) {
          return NextResponse.json(item);
        }
      }
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    const db = getDbForCountry(paises[0]);
    const item = await db
      .selectFrom('medicamento')
      .selectAll()
      .where('id_medicamento', '=', Number(id))
      .executeTakeFirst();

    if (!item) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      .updateTable('medicamento')
      .set({
        nombre: parsed.nombre,
        principio_activo: parsed.principio_activo ?? null,
        presentacion: parsed.presentacion ?? null,
        categoria: parsed.categoria ?? null,
        unidad_medida: parsed.unidad_medida ?? null,
        requiere_receta: parsed.requiere_receta,
      })
      .where('id_medicamento', '=', Number(id))
      .execute();

    if (result.length === 0) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const pais = session.user.pais;
    if (!pais) {
      return NextResponse.json({ error: 'No tiene país asignado' }, { status: 403 });
    }

    const db = getDbForCountry(pais);
    const result = await db
      .deleteFrom('medicamento')
      .where('id_medicamento', '=', Number(id))
      .execute();

    if (result.length === 0) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}