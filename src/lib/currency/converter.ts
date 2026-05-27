import type { Moneda } from '@/types/database';
import { boliviaDb } from '../db';

export interface TasaCambio {
  moneda_origen: Moneda;
  moneda_destino: Moneda;
  tasa: number;
  fecha_actualizacion: Date;
}

export const DEFAULT_RATES: Record<Moneda, Record<Moneda, number>> = {
  BOB: { BOB: 1, PEN: 0.55, CLP: 120 },
  PEN: { BOB: 1.82, PEN: 1, CLP: 218 },
  CLP: { BOB: 0.0083, PEN: 0.0046, CLP: 1 },
};

const currencyNames: Record<Moneda, string> = {
  BOB: 'Boliviano',
  PEN: 'Sol Peruano',
  CLP: 'Peso Chileno',
};

const currencySymbols: Record<Moneda, string> = {
  BOB: 'Bs.',
  PEN: 'S/',
  CLP: '$',
};

export function getCurrencySymbol(moneda: Moneda): string {
  return currencySymbols[moneda];
}

export function getCurrencyName(moneda: Moneda): string {
  return currencyNames[moneda];
}

export async function getExchangeRate(
  from: Moneda,
  to: Moneda
): Promise<number> {
  if (from === to) return 1;

  try {
    const tasa = await boliviaDb
      .selectFrom('tasa_cambio')
      .select('tasa')
      .where('moneda_origen', '=', from)
      .where('moneda_destino', '=', to)
      .executeTakeFirst();

    if (tasa) {
      return tasa.tasa;
    }

    const tasaInversa = await boliviaDb
      .selectFrom('tasa_cambio')
      .select('tasa')
      .where('moneda_origen', '=', to)
      .where('moneda_destino', '=', from)
      .executeTakeFirst();

    if (tasaInversa && tasaInversa.tasa > 0) {
      return 1 / tasaInversa.tasa;
    }
  } catch {
    // Si hay error, usar tasas por defecto
  }

  return DEFAULT_RATES[from][to];
}

export async function convertCurrency(
  amount: number,
  from: Moneda,
  to: Moneda
): Promise<number> {
  if (from === to || amount === 0) return amount;

  const rate = await getExchangeRate(from, to);
  return amount * rate;
}

export function formatCurrency(
  amount: number,
  moneda: Moneda,
  decimals: number = 2
): string {
  const symbol = getCurrencySymbol(moneda);

  if (moneda === 'CLP') {
    const rounded = Math.round(amount);
    return `${symbol} ${rounded.toLocaleString('es-CL')}`;
  }

  return `${symbol} ${amount.toLocaleString('es-BO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export async function convertAndFormat(
  amount: number,
  from: Moneda,
  to: Moneda
): Promise<string> {
  const converted = await convertCurrency(amount, from, to);
  return formatCurrency(converted, to);
}
