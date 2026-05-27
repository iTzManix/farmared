import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/helpers';
import { checkAllNodesHealth } from '@/lib/db';
import { CurrencyProvider } from '@/lib/contexts/CurrencyContext';
import { getAllRates } from '@/lib/currency/rates';
import type { Moneda } from '@/types/database';
import { DEFAULT_RATES } from '@/lib/currency/converter';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  let nodeStatuses;
  try {
    nodeStatuses = await checkAllNodesHealth();
  } catch {
    nodeStatuses = {
      BO: { healthy: false, error: 'No disponible' },
      PE: { healthy: false, error: 'No disponible' },
      CL: { healthy: false, error: 'No disponible' },
    };
  }

  const nodeStatusArray = Object.entries(nodeStatuses).map(([pais, status]) => ({
    pais: pais as 'BO' | 'PE' | 'CL',
    ...status,
  }));

  let initialRates = { ...DEFAULT_RATES };
  try {
    const dbRates = await getAllRates();
    const ratesMap = { ...DEFAULT_RATES };
    dbRates.forEach((r) => {
      if (!ratesMap[r.moneda_origen]) ratesMap[r.moneda_origen] = {} as Record<Moneda, number>;
      ratesMap[r.moneda_origen][r.moneda_destino] = r.tasa;
    });
    initialRates = ratesMap;
  } catch {
    // Keep default
  }

  return (
    <CurrencyProvider initialRates={initialRates}>
      {/* ── Canvas ── */}
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--canvas)' }}>

        {/* ── Sidebar — floating panel ── */}
        <Sidebar session={session} />

        {/* ── Right column ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Topbar — floating pill ── */}
          <div className="px-4 pt-4 pb-0 flex-shrink-0">
            <Header nodeStatuses={nodeStatusArray} />
          </div>

          {/* ── Scrollable content ── */}
          <main className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 lg:px-8 lg:py-8 max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>
    </CurrencyProvider>
  );
}
