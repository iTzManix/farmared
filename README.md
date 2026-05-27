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
| `superadmin`  | Super Admin   | Global | *(Configurar en seed-data)*|
| `admin_bo`    | Admin         | BO     | *(Configurar en seed-data)*|
| `admin_pe`    | Admin         | PE     | *(Configurar en seed-data)*|
| `admin_cl`    | Admin         | CL     | *(Configurar en seed-data)*|

### Generar Password Hashes

Antes de ejecutar los scripts SQL, debes generar los hashes bcrypt para las contraseñas.

Crea un script `generate-hashes.js`:

```javascript
const bcrypt = require('bcryptjs');

const passwords = {
  superadmin: 'TU_PASSWORD_SUPERADMIN',
  admin_bo: 'TU_PASSWORD_BOLIVIA',
  admin_pe: 'TU_PASSWORD_PERU',
  admin_cl: 'TU_PASSWORD_CHILE'
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
DB_BOLIVIA_HOST=127.0.0.1
DB_BOLIVIA_PORT=1433
DB_BOLIVIA_USER=sa
DB_BOLIVIA_PASSWORD=tu_password_aqui
DB_BOLIVIA_NAME=farmared

# Nodo Perú
DB_PERU_HOST=127.0.0.1
DB_PERU_PORT=1433
DB_PERU_USER=sa
DB_PERU_PASSWORD=tu_password_aqui
DB_PERU_NAME=farmared

# Nodo Chile
DB_CHILE_HOST=127.0.0.1
DB_CHILE_PORT=5432
DB_CHILE_USER=postgres
DB_CHILE_PASSWORD=tu_password_aqui
DB_CHILE_NAME=farmared

# Auth
NEXTAUTH_SECRET=tu-secreto-aleatorio-aqui
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
- **UI**: TailwindCSS v4, Lucide React (Icons), shadcn-like pattern (clsx, tailwind-merge, cva)
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
