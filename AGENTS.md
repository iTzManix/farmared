# FARMARED - Guía de Desarrollo

## Estructura del Proyecto

```
farmared/
├── sql/                          # Scripts SQL de base de datos
│   ├── bolivia-setup.sql         # Setup para nodo Bolivia (SQL Server)
│   ├── peru-setup.sql            # Setup para nodo Perú (SQL Server)
│   ├── chile-setup.sql           # Setup para nodo Chile (PostgreSQL)
│   └── seed-data.sql             # Datos iniciales (sucursales, usuarios, tasas)
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │   │   └── salud/route.ts    # Health check de nodos
│   │   ├── login/                 # Página de login
│   │   └── dashboard/             # Páginas del dashboard
│   │
│   ├── lib/
│   │   ├── auth/                  # Autenticación
│   │   │   ├── config.ts          # Configuración NextAuth v4
│   │   │   └── helpers.ts         # Helpers: getSession, requireAuth
│   │   ├── db/                    # Conexiones a bases de datos
│   │   │   ├── index.ts           # Export: boliviaDb, peruDb, chileDb, getDbForCountry
│   │   │   ├── bolivia.ts         # Kysely + MssqlDialect (SQL Server)
│   │   │   ├── peru.ts            # Kysely + MssqlDialect (SQL Server)
│   │   │   └── chile.ts           # Kysely + PostgresDialect (PostgreSQL)
│   │   └── currency/              # Conversión de monedas
│   │       ├── converter.ts       # Funciones convertCurrency, formatCurrency
│   │       └── rates.ts           # CRUD de tasas de cambio
│   │
│   ├── components/
│   │   ├── ui/                    # Componentes base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── layout/                # Layout del dashboard
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── NodeStatusIndicator.tsx
│   │   └── shared/                # Componentes compartidos
│   │       ├── DataTable.tsx
│   │       ├── ConfirmDialog.tsx
│   │       └── CountryFlag.tsx
│   │
│   ├── types/
│   │   └── database.ts            # Tipos de tablas Kysely
│   │
│   └── middleware.ts              # Middleware de autenticación
│
├── .env.example                   # Template de variables
├── .env.local                     # Credenciales (gitignored)
└── README.md                      # Documentación principal
```

## Tareas Pendientes

### 1. Completar CRUD APIs y Páginas
- `/api/medicamentos/*` + página
- `/api/empleados/*` + página
- `/api/clientes/*` + página
- `/api/stock/*` + página
- `/api/ventas/*` + página
- `/api/sucursales/*` + página
- `/api/reportes/*` (solo superadmin)
- `/api/tasas-cambio/*` + página

### 2. Generar Password Hashes
Los usuarios iniciales están definidos en `sql/seed-data.sql`. Necesitas generar los hashes bcrypt:

```javascript
// Ejecutar en Node.js:
const bcrypt = require('bcryptjs');
const passwords = {
  superadmin: 'FarmaredSuper2026!',
  admin_bo: 'BoliviaAdmin123!',
  admin_pe: 'PeruAdmin123!',
  admin_cl: 'ChileAdmin123!'
};
Object.entries(passwords).forEach(([user, pass]) => {
  console.log(user + ':', bcrypt.hashSync(pass, 10));
});
```

### 3. Ejecutar Scripts SQL
1. Ejecutar `bolivia-setup.sql` en el nodo Bolivia
2. Ejecutar `peru-setup.sql` en el nodo Perú
3. Ejecutar `chile-setup.sql` en el nodo Chile
4. Ejecutar `seed-data.sql` (con los password_hash actualizados)

### 4. Variables de Entorno
Asegúrate de que `.env.local` tenga:
```env
DB_BOLIVIA_HOST=26.221.13.33
DB_BOLIVIA_PORT=1433
DB_BOLIVIA_USER=sa
DB_BOLIVIA_PASSWORD=123456
DB_BOLIVIA_NAME=farmared

DB_PERU_HOST=26.134.31.38
DB_PERU_PORT=1433
DB_PERU_USER=sa
DB_PERU_PASSWORD=123456
DB_PERU_NAME=farmared

DB_CHILE_HOST=26.132.12.209
DB_CHILE_PORT=5432
DB_CHILE_USER=postgres
DB_CHILE_PASSWORD=alvaro1234
DB_CHILE_NAME=farmared

NEXTAUTH_SECRET=farmared-super-secret-key-2026
NEXTAUTH_URL=http://localhost:3000
```

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Auth**: NextAuth.js v4
- **Database**: Kysely Query Builder
  - SQL Server: tedious + tarn
  - PostgreSQL: pg
- **UI**: TailwindCSS v4, Lucide React (Icons), Floating Panel UI System
