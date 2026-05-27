import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getSession, isSuperAdmin } from '@/lib/auth/helpers';
import { redirect } from 'next/navigation';

export default async function TasasCambioPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  if (!isSuperAdmin(session)) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Acceso Denegado</h1>
        <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Solo los Super Administradores pueden acceder a las tasas de cambio.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Tasas de Cambio</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Gestión de conversión de monedas globales</p>
        </div>
        <Badge variant="info">En Construcción</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Tasas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12" style={{ color: 'var(--foreground-subtle)' }}>
            <p className="text-sm">Esta sección permitirá:</p>
            <ul className="mt-4 space-y-2 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              <li>✓ Ver tasas de cambio actuales entre BOB, PEN y CLP</li>
              <li>✓ Editar tasas manualmente (solo Super Admin)</li>
              <li>✓ Sincronizar tasas desde una API externa</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
