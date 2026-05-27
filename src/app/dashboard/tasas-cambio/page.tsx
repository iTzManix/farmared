import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getSession, isSuperAdmin } from '@/lib/auth/helpers';
import { redirect } from 'next/navigation';

export default async function TasasCambioPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  if (!isSuperAdmin(session)) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-rose-500">Acceso Denegado</h1>
        <p className="text-slate-400">Solo los Super Administradores pueden acceder a las tasas de cambio.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Tasas de Cambio</h1>
          <p className="text-slate-400 mt-1">Gestión de conversión de monedas globales</p>
        </div>
        <Badge variant="info">En Construcción</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Tasas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-400">
            <p>Esta sección permitirá:</p>
            <ul className="mt-4 space-y-2 text-sm">
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
