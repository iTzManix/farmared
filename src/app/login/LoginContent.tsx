'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Server,
  Database,
  Globe,
  AlertCircle,
} from 'lucide-react';

const NODOS = [
  {
    value: 'BO', label: 'Bolivia', desc: 'SQL Server', icon: Server,
    activeStyle: { borderColor: 'rgba(59,130,246,0.6)', background: 'rgba(59,130,246,0.1)', color: '#93C5FD', boxShadow: '0 0 0 2px rgba(59,130,246,0.2)' },
  },
  {
    value: 'PE', label: 'Perú', desc: 'SQL Server', icon: Server,
    activeStyle: { borderColor: 'rgba(239,68,68,0.6)', background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', boxShadow: '0 0 0 2px rgba(239,68,68,0.2)' },
  },
  {
    value: 'CL', label: 'Chile', desc: 'PostgreSQL', icon: Database,
    activeStyle: { borderColor: 'rgba(16,185,129,0.6)', background: 'rgba(16,185,129,0.1)', color: '#6EE7B7', boxShadow: '0 0 0 2px rgba(16,185,129,0.2)' },
  },
] as const;

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

  const inputStyle: React.CSSProperties = {
    display: 'block', width: '100%', height: '44px',
    paddingLeft: '16px', paddingRight: '16px',
    fontSize: '14px', borderRadius: '12px',
    background: 'var(--surface-hover)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--foreground)',
    outline: 'none',
    transition: 'border 0.15s, box-shadow 0.15s',
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = '1px solid var(--border-focus)';
    e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.06)';
  };
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = '1px solid var(--border-subtle)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        background: 'var(--canvas)',
        backgroundImage:
          'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(34,211,238,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 50% 110%, rgba(96,165,250,0.05) 0%, transparent 70%)',
      }}
    >
      <div className="w-full max-w-[400px]">

        {/* Card */}
        <div
          className="rounded-3xl p-8 mb-6"
          style={{
            background: 'var(--surface-0)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-panel)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-9">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(96,165,250,0.15) 100%)',
                border: '1px solid rgba(34,211,238,0.3)',
                boxShadow: '0 0 30px rgba(34,211,238,0.1)',
              }}
            >
              <Globe className="w-7 h-7" style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">FARMARED</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
              Red Distribuida de Farmacias
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Node selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>
                Nodo de conexión
              </label>
              <div className="grid grid-cols-3 gap-2">
                {NODOS.map((n) => {
                  const active = nodo === n.value;
                  return (
                    <button
                      key={n.value}
                      type="button"
                      onClick={() => setNodo(n.value)}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-150 cursor-pointer"
                      style={active
                        ? n.activeStyle
                        : { borderColor: 'var(--border-subtle)', color: 'var(--foreground-muted)', background: 'transparent' }
                      }
                    >
                      <n.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                      <span className="text-xs font-semibold">{n.label}</span>
                      <span className="text-[10px] opacity-60">{n.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>
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
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>
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
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                style={{ background: 'var(--danger-dim, rgba(251,113,133,0.08))', border: '1px solid rgba(251,113,133,0.2)', color: '#FCA5A5' }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isLoading
                  ? 'rgba(34,211,238,0.6)'
                  : 'linear-gradient(135deg, #22D3EE 0%, #38BDF8 100%)',
                color: '#0B1528',
                boxShadow: '0 0 20px rgba(34,211,238,0.15), 0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Conectando...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs" style={{ color: 'var(--foreground-subtle)' }}>
          UMSA · Base de Datos Distribuidas · 2026
        </p>
      </div>
    </div>
  );
}
