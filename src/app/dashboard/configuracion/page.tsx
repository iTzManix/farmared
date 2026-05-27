import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getSession, isSuperAdmin } from '@/lib/auth/helpers';
import { checkAllNodesHealth } from '@/lib/db';
import { redirect } from 'next/navigation';
import { CountryFlag } from '@/components/shared/CountryFlag';

export default async function ConfiguracionPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  if (!isSuperAdmin(session)) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Acceso Denegado</h1>
        <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Solo los Super Administradores pueden acceder a la configuración.</p>
      </div>
    );
  }

  let nodeStatuses;
  try {
    nodeStatuses = await checkAllNodesHealth();
  } catch {
    nodeStatuses = {
      BO: { healthy: false, error: 'Fallo general' },
      PE: { healthy: false, error: 'Fallo general' },
      CL: { healthy: false, error: 'Fallo general' },
    };
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Configuración del Sistema</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Estado de conexión a la base de datos distribuida</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de los Nodos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(['BO', 'PE', 'CL'] as const).map(pais => {
              const status = nodeStatuses[pais];
              return (
                <div
                  key={pais}
                  className="flex items-center justify-between p-5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <div className="flex items-center gap-4">
                    <CountryFlag pais={pais} />
                    <div>
                      <h3 className="font-medium text-white">{pais === 'BO' ? 'Bolivia' : pais === 'PE' ? 'Perú' : 'Chile'}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--foreground-subtle)' }}>
                        {pais === 'CL' ? 'PostgreSQL (ODBC Linked Server)' : 'SQL Server (Linked Server nativo)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {status.latencyMs && <span className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>{status.latencyMs} ms</span>}
                    <Badge variant={status.healthy ? 'success' : 'danger'}>
                      {status.healthy ? 'En línea' : 'Desconectado'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
