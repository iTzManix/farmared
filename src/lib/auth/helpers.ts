import { getServerSession } from 'next-auth/next';
import { authOptions } from './config';
import { Pais, RolUsuario } from '@/types/database';
import type { Session } from 'next-auth';

export interface AuthSession extends Session {
  user: {
    id: number;
    username: string;
    nombre: string;
    rol: RolUsuario;
    pais: Pais | null;
  };
}

export async function getSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions);
  return session as AuthSession | null;
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error('No autorizado');
  }
  return session;
}

export function isSuperAdmin(session: AuthSession): boolean {
  return session.user.rol === 'superadmin';
}

export async function requireSuperAdmin(): Promise<AuthSession> {
  const session = await requireAuth();
  if (!isSuperAdmin(session)) {
    throw new Error('Se requiere rol de SuperAdmin');
  }
  return session;
}

export function getUserPais(session: AuthSession): Pais | null {
  return session.user.pais;
}

export type CountryFilterResult =
  | { type: 'all' }
  | { type: 'single'; pais: Pais }
  | { type: 'none' };

export function getCountryFilter(session: AuthSession): CountryFilterResult {
  if (isSuperAdmin(session)) {
    return { type: 'all' };
  }
  const pais = session.user.pais;
  if (!pais) {
    return { type: 'none' };
  }
  return { type: 'single', pais };
}

export function getAccessiblesPaises(session: AuthSession): Pais[] {
  if (isSuperAdmin(session)) {
    return ['BO', 'PE', 'CL'];
  }
  const pais = session.user.pais;
  return pais ? [pais] : [];
}
