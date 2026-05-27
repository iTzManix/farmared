import { NextRequest, NextResponse } from 'next/server';
import { getSession, isSuperAdmin } from '@/lib/auth/helpers';
import { getAllRates, updateRate } from '@/lib/currency/rates';
import { handleApiError } from '@/lib/crud/helpers';
import type { Moneda } from '@/types/database';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
    }

    const rates = await getAllRates();
    return NextResponse.json(rates);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
    }

    const body = await request.json();
    const success = await updateRate(
      body.moneda_origen as Moneda,
      body.moneda_destino as Moneda,
      body.tasa
    );

    if (!success) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}