# FARMARED - Sistema de Red de Farmacias

Sistema distribuido para gestión de farmacias en Bolivia, Perú y Chile. Caso de estudio para la Universidad Mayor de San Andrés.

## Arquitectura

```
┌─────────────────────────────────────────┐
│         Aplicación Next.js (Central)    │
│  ┌─────────┐ ┌────────┐ ┌───────────┐  │
│  │ NextAuth│ │ API    │ │  Kysely   │  │
│  │   Auth  │ │ Routes │ │  Query    │  │
│  └─────────┘ └────────┘ └───────────┘  │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ Bolivia  │ │   Perú   │ │  Chile   │
   │ SQL Server│ │SQL Server│ │PostgreSQL│
   └──────────┘ └──────────┘ └──────────┘
```

## Credenciales de Usuarios

| Usuario       | Rol           | País   | Contraseña                 |
|---------------|---------------|--------|----------------------------|
| `superadmin`  | Super Admin   | Global | `FarmaredSuper2026!`      |
| `admin_bo`    | Admin         | BO     | `BoliviaAdmin123!`         |
| `admin_pe`    | Admin         | PE     | `PeruAdmin123!`            |
| `admin_cl`    | Admin         | CL     | `ChileAdmin123!`           |

### Generar Password Hashes

Antes de ejecutar los scripts SQL, debes generar los hashes bcrypt para las contraseñas.

Crea un script `generate-hashes.js`:

```javascript
const bcrypt = require('bcryptjs');

const passwords = {
  superadmin: 'FarmaredSuper2026!',
  admin_bo: 'BoliviaAdmin123!',
  admin_pe: 'PeruAdmin123!',
  admin_cl: 'ChileAdmin123!'
};

console.log('=== Generando Password Hashes (bcrypt 10 rounds) ===\n');

Object.entries(passwords).forEach(([user, pass]) => {
  const hash = bcrypt.hashSync(pass, 10);
  console.log(`${user}:`);
  console.log(`  Password: ${pass}`);
  console.log(`  Hash: ${hash}\n`);
});
```

Ejecuta:
```bash
node generate-hashes.js
```

Luego reemplaza los valores en `sql/seed-data.sql`.

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno (ya está creado .env.local)
# cp .env.example .env.local

# Desarrollo
npm run dev

# Build
npm run build
```

## Configuración de Base de Datos

### Paso 1: Ejecutar Scripts de Tablas

**Nodo Bolivia (SQL Server):**
```sql
-- Ejecutar en orden:
sql/bolivia-setup.sql
sql/seed-data.sql  (después de actualizar password_hash)
```

**Nodo Perú (SQL Server):**
```sql
sql/peru-setup.sql
sql/seed-data.sql  (solo las secciones de sucursal y usuario)
```

**Nodo Chile (PostgreSQL):**
```sql
\i sql/chile-setup.sql
```

### Paso 2: Variables de Entorno

El archivo `.env.local` ya está configurado con:

```env
# Nodo Bolivia
DB_BOLIVIA_HOST=26.221.13.33
DB_BOLIVIA_PORT=1433
DB_BOLIVIA_USER=sa
DB_BOLIVIA_PASSWORD=123456
DB_BOLIVIA_NAME=farmared

# Nodo Perú
DB_PERU_HOST=26.134.31.38
DB_PERU_PORT=1433
DB_PERU_USER=sa
DB_PERU_PASSWORD=123456
DB_PERU_NAME=farmared

# Nodo Chile
DB_CHILE_HOST=26.132.12.209
DB_CHILE_PORT=5432
DB_CHILE_USER=postgres
DB_CHILE_PASSWORD=alvaro1234
DB_CHILE_NAME=farmared

# Auth
NEXTAUTH_SECRET=farmared-super-secret-key-2026
NEXTAUTH_URL=http://localhost:3000
```

## Funcionalidades Implementadas

### ✅ Base
- [x] Configuración NextAuth v4 con CredentialsProvider
- [x] Conexiones Kysely a 3 nodos (SQL Server ×2 + PostgreSQL)
- [x] Middleware de protección de rutas
- [x] Sistema de roles (admin / superadmin)
- [x] Componentes UI base (Button, Input, Card, Badge, Table, Modal, Pagination)
- [x] Layout Dashboard con Sidebar + Header (Floating Panel UI)
- [x] Contexto de moneda global (selector BOB/PEN/CLP)
- [x] Página de login (Rediseño Premium)
- [x] API Health Check de nodos

### 🚧 Pendientes
- [ ] CRUD APIs (medicamentos, empleados, clientes, stock, ventas, sucursales)
- [ ] Páginas de CRUD
- [ ] Reportes federados (solo superadmin)
- [ ] Gestión de tasas de cambio

## Roles y Permisos

| Rol           | Permisos                                                              |
|---------------|-----------------------------------------------------------------------|
| **Admin**     | Ve y gestiona solo los datos de su país. No ve Reportes, Tasas ni Configuración. |
| **SuperAdmin**| Ve y gestiona TODO. Acceso a reportes federados, tasas de cambio y configuración del sistema. |

## Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Autenticación**: NextAuth.js v4
- **ORM/Query Builder**: Kysely
- **Bases de Datos**:
  - SQL Server: tedious + tarn
  - PostgreSQL: pg
- **UI**: TailwindCSS v4, Lucide React (Icons), Floating Panel UI System
- **Validación**: Zod

## Estructura de Tablas

### Tablas Replicadas (todos los nodos)
- `sucursal` - Datos de sucursales
- `usuario` - Usuarios del sistema

### Tablas Fragmentadas (por país)
- `medicamento` - Catálogo de medicamentos
- `empleado` - Empleados de sucursales
- `cliente` - Clientes
- `stock` - Inventario por sucursal
- `venta` - Ventas registradas
- `detalle_venta` - Líneas de venta

### Solo Nodo Central (Bolivia)
- `tasa_cambio` - Tasas de cambio entre monedas

## Ejecutar el Proyecto

```bash
# Desarrollo
npm run dev

# El servidor estará en http://localhost:3000
```

## Verificación

1. **Build**: `npm run build`
2. **Test Login**: Navegar a `http://localhost:3000`
3. **Test Conexiones**: Login como superadmin → Dashboard → Ver estado de nodos
