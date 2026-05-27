import { NextResponse } from 'next/server';
import { checkAllNodesHealth } from '@/lib/db';
import { requireAuth } from '@/lib/auth/helpers';

export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const health = await checkAllNodesHealth();
    return NextResponse.json(health);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Error al verificar estado de nodos', details: String(error) },
      { status: 500 }
    );
  }
}
