'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Server,
  Database,
  Globe,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NODOS = [
  { value: 'BO' as const, label: 'Bolivia', desc: 'SQL Server', icon: Server },
  { value: 'PE' as const, label: 'Perú',    desc: 'SQL Server', icon: Server },
  { value: 'CL' as const, label: 'Chile',   desc: 'PostgreSQL', icon: Database },
];

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nodo, setNodo] = useState<'BO' | 'PE' | 'CL'>('CL');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        username, password, nodo, redirect: false,
      });
      if (result?.error) { setError('Usuario o contraseña incorrectos.'); return; }
      if (result?.ok) router.push(callbackUrl);
    } catch {
      setError('No se pudo conectar al nodo. Verifica que esté en línea.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-slate-50">
      <div className="w-full max-w-[400px]">

        {/* Card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-8 mb-6">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">FARMARED</h1>
            <p className="text-sm text-slate-400 mt-1">Red Distribuida de Farmacias</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Node selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Nodo de conexión
              </label>
              <div className="grid grid-cols-3 gap-2">
                {NODOS.map((n) => (
                  <button
                    key={n.value}
                    type="button"
                    onClick={() => setNodo(n.value)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-150 cursor-pointer',
                      nodo === n.value
                        ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    <n.icon className="w-4 h-4" />
                    <span className="text-xs font-semibold">{n.label}</span>
                    <span className="text-[10px] opacity-60">{n.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej. admin_cl"
                required
                autoComplete="username"
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm bg-red-50 border border-red-100 text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Conectando...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          UMSA · Base de Datos Distribuidas · 2026
        </p>
      </div>
    </div>
  );
}
