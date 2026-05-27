import { getSession, getAccessiblesPaises, isSuperAdmin } from '@/lib/auth/helpers';
import { getDbForCountry, getAllDbs } from '@/lib/db';
import { convertCurrency } from '@/lib/currency/converter';
import type { Moneda } from '@/types/database';

export async function getDashboardChartsData() {
  const session = await getSession();
  if (!session) return { ventasSemana: [], topMedicamentos: [] };

  const paises = getAccessiblesPaises(session);
  const isSA = isSuperAdmin(session);

  let allVentas: any[] = [];
  let allDetalles: any[] = [];
  let allMedicamentos: any[] = [];

  const dbs = isSA ? getAllDbs() : [{ pais: paises[0], db: getDbForCountry(paises[0]) }];

  // Fecha límite: últimos 7 días
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  for (const { db } of dbs) {
    // Ventas de los últimos 7 días
    const ventas = await db
      .selectFrom('venta')
      .select(['fecha_local'])
      .where('fecha_local', '>=', sevenDaysAgo)
      .execute();
    allVentas.push(...ventas);

    // Top medicamentos (usaremos todos los detalles recientes para simplificar)
    const detalles = await db
      .selectFrom('detalle_venta')
      .select(['id_medicamento', 'cantidad'])
      .execute();
    allDetalles.push(...detalles);

    const medicamentos = await db
      .selectFrom('medicamento')
      .select(['id_medicamento', 'nombre'])
      .execute();
    allMedicamentos.push(...medicamentos);
  }

  // --- Procesar Ventas de la Semana ---
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const ventasPorDiaMap = new Map<string, number>();

  // Inicializar últimos 7 días en 0 (para mantener el orden cronológico)
  const sortedDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = daysOfWeek[d.getDay()];
    ventasPorDiaMap.set(dayName, 0);
    sortedDays.push(dayName);
  }

  allVentas.forEach((v) => {
    const d = new Date(v.fecha_local);
    const dayName = daysOfWeek[d.getDay()];
    if (ventasPorDiaMap.has(dayName)) {
      ventasPorDiaMap.set(dayName, ventasPorDiaMap.get(dayName)! + 1);
    }
  });

  // Asegurarnos de que el array respete el orden cronológico
  const ventasSemana = sortedDays.map((dia) => ({
    dia,
    ventas: ventasPorDiaMap.get(dia) || 0,
  }));

  // --- Procesar Top Medicamentos ---
  const medMap = new Map<number, string>();
  allMedicamentos.forEach((m) => medMap.set(m.id_medicamento, m.nombre));

  const topMap = new Map<string, number>();
  allDetalles.forEach((d) => {
    const nombre = medMap.get(d.id_medicamento) || 'Desconocido';
    topMap.set(nombre, (topMap.get(nombre) || 0) + d.cantidad);
  });

  const topMedicamentos = Array.from(topMap.entries())
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return { ventasSemana, topMedicamentos };
}
export async function getDashboardMetricsData() {
  const session = await getSession();
  if (!session) return { totalVentas: 0, medicamentosConStockBajo: 0, clientesRegistrados: 0, ventasHoy: 0, montoVentasHoy: 0 };

  const paises = getAccessiblesPaises(session);
  const isSA = isSuperAdmin(session);
  const dbs = isSA ? getAllDbs() : [{ pais: paises[0], db: getDbForCountry(paises[0]) }];

  let totalVentas = 0;
  let medicamentosConStockBajo = 0;
  let clientesRegistrados = 0;
  let ventasHoy = 0;
  let montoVentasHoy = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monedaBase: Moneda = isSA ? 'BOB' : (paises[0] === 'PE' ? 'PEN' : (paises[0] === 'CL' ? 'CLP' : 'BOB'));

  for (const { db } of dbs) {
    const clientesRes = await db.selectFrom('cliente').select(({ fn }) => fn.count('id_cliente').as('count')).executeTakeFirst();
    clientesRegistrados += Number(clientesRes?.count || 0);

    const stockRes = await db.selectFrom('stock').whereRef('cantidad_disponible', '<=', 'stock_minimo').select(({ fn }) => fn.count('id_stock').as('count')).executeTakeFirst();
    medicamentosConStockBajo += Number(stockRes?.count || 0);

    const ventasMesRes = await db.selectFrom('venta')
      .where('fecha_local', '>=', startOfMonth)
      .select(['moneda', ({ fn }) => fn.sum('monto_total').as('total')])
      .groupBy('moneda')
      .execute();
    
    for (const v of ventasMesRes) {
      if (v.moneda && v.total) {
        totalVentas += await convertCurrency(Number(v.total), v.moneda as Moneda, monedaBase);
      }
    }

    const ventasHoyCountRes = await db.selectFrom('venta')
      .where('fecha_local', '>=', today)
      .select(({ fn }) => fn.count('id_venta').as('count'))
      .executeTakeFirst();
    ventasHoy += Number(ventasHoyCountRes?.count || 0);

    const ventasHoyRes = await db.selectFrom('venta')
      .where('fecha_local', '>=', today)
      .select(['moneda', ({ fn }) => fn.sum('monto_total').as('total')])
      .groupBy('moneda')
      .execute();

    for (const v of ventasHoyRes) {
      if (v.moneda && v.total) {
        montoVentasHoy += await convertCurrency(Number(v.total), v.moneda as Moneda, monedaBase);
      }
    }
  }

  return { totalVentas, medicamentosConStockBajo, clientesRegistrados, ventasHoy, montoVentasHoy };
}
