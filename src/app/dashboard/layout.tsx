import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/helpers';
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

  let initialRates = { ...DEFAULT_RATES };
  try {
    const dbRates = (await Promise.race([
      getAllRates(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
    ])) as any[];

    const ratesMap = { ...DEFAULT_RATES } as any;
    dbRates.forEach((r: any) => {
      if (!ratesMap[r.moneda_origen]) ratesMap[r.moneda_origen] = {};
      ratesMap[r.moneda_origen][r.moneda_destino] = r.tasa;
    });
    initialRates = ratesMap;
  } catch { }

  return (
    <CurrencyProvider initialRates={initialRates}>
      <div className="min-h-[100vh] bg-background flex">
        <Sidebar session={session} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </CurrencyProvider>
  );
}