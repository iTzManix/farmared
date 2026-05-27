import { boliviaDb } from '../db';
import type { Moneda } from '@/types/database';
import { DEFAULT_RATES } from './converter';

export interface TasaCambioData {
  id: number;
  moneda_origen: Moneda;
  moneda_destino: Moneda;
  tasa: number;
  fecha_actualizacion: Date;
}

export async function getAllRates(): Promise<TasaCambioData[]> {
  try {
    return (await boliviaDb.selectFrom('tasa_cambio').selectAll().execute()) as TasaCambioData[];
  } catch {
    return Object.entries(DEFAULT_RATES).flatMap(([from, rates]) =>
      Object.entries(rates).map(([to, tasa]) => ({
        id: 0,
        moneda_origen: from as Moneda,
        moneda_destino: to as Moneda,
        tasa: tasa,
        fecha_actualizacion: new Date(),
      }))
    );
  }
}

export async function updateRate(
  moneda_origen: Moneda,
  moneda_destino: Moneda,
  nueva_tasa: number
): Promise<boolean> {
  try {
    const existing = await boliviaDb
      .selectFrom('tasa_cambio')
      .select('id')
      .where('moneda_origen', '=', moneda_origen)
      .where('moneda_destino', '=', moneda_destino)
      .executeTakeFirst();

    const now = new Date();

    if (existing) {
      await boliviaDb
        .updateTable('tasa_cambio')
        .set({ tasa: nueva_tasa, fecha_actualizacion: now })
        .where('id', '=', existing.id)
        .execute();
    } else {
      await boliviaDb
        .insertInto('tasa_cambio')
        .values({
          moneda_origen,
          moneda_destino,
          tasa: nueva_tasa,
          fecha_actualizacion: now,
        })
        .execute();
    }

    return true;
  } catch {
    return false;
  }
}
