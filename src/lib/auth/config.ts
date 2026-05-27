import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import type { RolUsuario, Pais } from '@/types/database';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      username: string;
      nombre: string;
      rol: RolUsuario;
      pais: Pais | null;
    };
  }

  interface User {
    id: number;
    username: string;
    nombre: string;
    rol: RolUsuario;
    pais: Pais | null;
  }

  interface JWT {
    id: number;
    username: string;
    nombre: string;
    rol: RolUsuario;
    pais: Pais | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
        nodo: { label: 'Nodo', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const { boliviaDb, peruDb, chileDb } = await import('../db');

        const username = credentials.username as string;
        const password = credentials.password as string;
        const nodo = (credentials as Record<string, string>).nodo || 'ALL';

        // Mapeo de nodo a base de datos
        const dbMap: Record<string, typeof boliviaDb[]> = {
          BO: [boliviaDb, peruDb, chileDb],
          PE: [peruDb, boliviaDb, chileDb],
          CL: [chileDb, boliviaDb, peruDb],
          ALL: [boliviaDb, peruDb, chileDb],
        };

        // Priorizar la DB del nodo seleccionado para evitar timeouts
        const dbs = dbMap[nodo] || dbMap.ALL;
        let user = null;

        for (const db of dbs) {
          try {
            user = await db
              .selectFrom('usuario')
              .select(['id_usuario', 'username', 'password_hash', 'nombre', 'rol', 'pais', 'activo'])
              .where('username', '=', username)
              .executeTakeFirst();
            
            if (user) break;
          } catch {
            console.error('Fallo conexión a nodo durante login, intentando el siguiente...');
            continue;
          }
        }

        if (!user || !user.activo) {
          return null;
        }

        const passwordMatch = await compare(password, user.password_hash);
        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id_usuario,
          username: user.username,
          nombre: user.nombre,
          rol: user.rol as RolUsuario,
          pais: user.pais as Pais | null,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.nombre = user.nombre;
        token.rol = user.rol;
        token.pais = user.pais;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as number;
        session.user.username = token.username as string;
        session.user.nombre = token.nombre as string;
        session.user.rol = token.rol as RolUsuario;
        session.user.pais = token.pais as Pais | null;
      }
      return session;
    },
  },
};
