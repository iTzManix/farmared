# Conexión y Consultas a Bases de Datos — Farmared

Este documento describe cómo se gestionan las conexiones a las bases de datos
distribuidas (Bolivia = SQL Server, Perú = SQL Server, Chile = PostgreSQL) y
qué archivos del proyecto se encargan de ejecutarlas, filtrar por país y
orquestar las consultas multi-nodo del superadministrador.

---

## 1. Arquitectura general

| Rol                | Base de datos que usa                                                     | Cómo se determina                              |
| ------------------ | ------------------------------------------------------------------------- | ---------------------------------------------- |
| Admin de Bolivia   | `boliviaDb` (SQL Server)                                                  | `session.user.pais === 'BO'`                   |
| Admin de Perú      | `peruDb` (SQL Server)                                                     | `session.user.pais === 'PE'`                   |
| Admin de Chile     | `chileDb` (PostgreSQL)                                                    | `session.user.pais === 'CL'`                   |
| Superadministrador | Puede consultar **todas** las anteriores (nunca “una” propia).            | `session.user.rol === 'superadmin'`            |

La **capa central** (el backend Next.js) reusa los mismos clientes definidos en
`src/lib/db/`. Desde ahí se hacen las conexiones SQL Server ↔ SQL Server
(entre Bolivia y Perú) y SQL Server ↔ PostgreSQL (de Bolivia/Perú a Chile) a
través del módulo `getAllDbs()` y de las funciones de sincronización o reporte.

---

## 2. Archivos donde se **definen** las conexiones

Ruta: `src/lib/db/`

| Archivo                              | Responsabilidad                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `src/lib/db/bolivia.ts`              | Crea un cliente Kysely con `MssqlDialect` (SQL Server) usando `DB_BOLIVIA_*`. Exporta `boliviaDb`.           |
| `src/lib/db/peru.ts`                 | Crea un cliente Kysely con `MssqlDialect` (SQL Server) usando `DB_PERU_*`. Exporta `peruDb`.                 |
| `src/lib/db/chile.ts`                | Crea un cliente Kysely con `PostgresDialect` (PostgreSQL) usando `DB_CHILE_*`. Exporta `chileDb`.            |
| `src/lib/db/index.ts`                | Reexporta los tres clientes y provee los resolvers: `getDbForCountry(pais)`, `getAllDbs()`, `checkNodeHealth`, `checkAllNodesHealth`. |

Ejemplo de `getDbForCountry` (resumen):

```ts
// src/lib/db/index.ts
export function getDbForCountry(pais: Pais): Kysely<FarmaredDB> {
  switch (pais) {
    case 'BO': return boliviaDb;
    case 'PE': return peruDb;
    case 'CL': return chileDb;
  }
}
```

`getAllDbs()` devuelve `[{ pais: 'BO', db: boliviaDb }, { pais: 'PE', db: peruDb }, { pais: 'CL', db: chileDb }]`,
que es lo que consume el superadmin para iterar sobre los tres nodos.

---

## 3. Autenticación y filtros por país

Ruta: `src/lib/auth/`

| Archivo                       | Responsabilidad                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/lib/auth/config.ts`      | Define `authOptions` de NextAuth. En `authorize()` importa `boliviaDb`, `peruDb`, `chileDb` y consulta la tabla `usuario` priorizando el nodo seleccionado (BO/PE/CL) y luego los demás. |
| `src/lib/auth/helpers.ts`     | `getSession()`, `isSuperAdmin()`, `getAccessiblesPaises(session)`, `getCountryFilter(session)`. Determina **qué país(es) puede ver** el usuario actual. |

Flujo de login (resumen):

1. El usuario envía credenciales y un nodo (`BO`, `PE`, `CL` o `ALL`).
2. `config.ts` arma un orden de DBs con el nodo seleccionado primero.
3. Recorre las DBs consultando `usuario` hasta encontrar el registro.
4. Valida el `password_hash` con bcrypt y devuelve un usuario con `rol` y `pais`.
5. El JWT guarda `rol` y `pais`, que después consulta cada endpoint.

`getAccessiblesPaises(session)` retorna:

- `['BO', 'PE', 'CL']` si es **superadmin**.
- `[session.user.pais]` si es un **admin de sucursal**.
- `[]` si no tiene país asignado.

---

## 4. Endpoints que ejecutan queries (CRUD)

Todas las rutas siguen el mismo patrón:

- **Admin de sucursal** → toma `getAccessiblesPaises(session)[0]` y usa `getDbForCountry(...)` con `where('pais', '=', pais)` como salvaguarda.
- **Superadmin** → itera `getAllDbs()` con `Promise.all` y concatena resultados.

| Archivo                                       | Tabla(s)              | Notas                                                                          |
| --------------------------------------------- | --------------------- | ------------------------------------------------------------------------------ |
| `src/app/api/medicamentos/route.ts`           | `medicamento`         | GET/POST/PUT/DELETE. Superadmin agrega desde los 3 nodos.                      |
| `src/app/api/medicamentos/[id]/route.ts`      | `medicamento`         | GET/PUT/DELETE por id. PUT/DELETE usan `session.user.pais`.                    |
| `src/app/api/stock/route.ts`                  | `stock` (+`sucursal`, `medicamento`) | Listado con joins; mismo patrón.                              |
| `src/app/api/stock/[id]/route.ts`             | `stock`               | GET/PUT/DELETE por id.                                                         |
| `src/app/api/empleados/route.ts`              | `empleado` (+`sucursal`)          | Mismo patrón, join con `sucursal`.                            |
| `src/app/api/empleados/[id]/route.ts`         | `empleado`                          | GET/PUT/DELETE por id.                                       |
| `src/app/api/clientes/route.ts`               | `cliente`                           | Mismo patrón.                                                |
| `src/app/api/clientes/[id]/route.ts`          | `cliente`                           | GET/PUT/DELETE por id.                                       |
| `src/app/api/ventas/route.ts`                 | `venta` (+`sucursal`, `cliente`, `medicamento`) | POST además inserta en `detalle_venta`.         |
| `src/app/api/ventas/[id]/route.ts`            | `venta`, `detalle_venta`            | GET devuelve venta + detalles.                               |
| `src/app/api/sucursales/route.ts`             | `sucursal`                          | GET siempre consulta los 3 nodos. POST/PUT/DELETE solo superadmin. |
| `src/app/api/salud/route.ts`                  | `sucursal` (ping)                   | Usa `checkAllNodesHealth()` desde `src/lib/db/index.ts`.       |
| `src/app/api/tasas-cambio/route.ts`           | `tasa_cambio`                       | (ver `src/lib/currency/rates.ts` para el CRUD real).           |
| `src/app/api/auth/[...nextauth]/route.ts`     | `usuario`                           | Handler de NextAuth que reusa `authOptions`.                   |

---

## 5. Reportes globales (solo superadmin)

Ruta: `src/app/api/reportes/`

Todos usan `getAllDbs()` y `Promise.all` para traer datos de los tres nodos.

| Archivo                                            | Tabla(s) que consulta             |
| -------------------------------------------------- | --------------------------------- |
| `src/app/api/reportes/stock-global/route.ts`       | `stock`                           |
| `src/app/api/reportes/empleados-red/route.ts`      | `empleado`                        |
| `src/app/api/reportes/comparativa-precios/route.ts`| `medicamento`                     |
| `src/app/api/reportes/ventas-globales/route.ts`    | `venta`                           |

---

## 6. Lógica de negocio adicional (consultas puntuales)

Ruta: `src/lib/`

| Archivo                          | Responsabilidad                                                                                    |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/lib/currency/rates.ts`      | CRUD sobre `tasa_cambio` usando **solo** `boliviaDb` (la tabla maestra de tasas vive en Bolivia). Si la consulta falla, hace fallback a `DEFAULT_RATES`. |
| `src/lib/hooks/useNodeHealth.ts` | Hook cliente que hace `fetch('/api/salud')` cada 30 s para refrescar el estado de los nodos.       |
| `src/lib/validations/index.ts`   | Schemas Zod; **no** consulta la DB, solo valida payloads.                                         |
| `src/lib/crud/helpers.ts`        | Helpers (`handleApiError`, `getPaginated`); **no** abre conexiones.                               |
| `src/lib/currency/converter.ts`  | Conversión de moneda en memoria; **no** toca la DB.                                               |
| `src/middleware.ts`              | Middleware de NextAuth: solo chequea sesión, no consulta la DB.                                    |

---

## 7. Cómo funciona el filtrado por país

El proyecto usa **dos** mecanismos de filtrado (defensa en profundidad):

1. **Selección de la base de datos correcta**:
   - Admin de sucursal → `getDbForCountry(session.user.pais)`.
   - Superadmin → `getAllDbs()` para iterar sobre las 3 DBs.

2. **Filtro en la cláusula `WHERE`**:
   - Cada tabla de negocio (`medicamento`, `stock`, `empleado`, `cliente`, `venta`, etc.) tiene una columna `pais`.
   - En casi todas las queries se agrega `.where('tabla.pais', '=', pais)` para evitar filtraciones accidentales si dos países comparten el mismo id.

Ejemplo de un GET de medicamentos (admin de sucursal):

```ts
// src/app/api/medicamentos/route.ts
const db = getDbForCountry(paisesAccesibles[0]);
const data = await db
  .selectFrom('medicamento')
  .selectAll()
  .where('pais', '=', paisesAccesibles[0])
  .orderBy('id_medicamento', 'desc')
  .offset((page - 1) * pageSize)
  .fetch(pageSize)
  .execute();
```

Ejemplo de un GET de medicamentos (superadmin):

```ts
if (isSuperAdmin(session)) {
  const results = await Promise.all(
    getAllDbs().map(async ({ pais, db }) => {
      const data = await db
        .selectFrom('medicamento')
        .selectAll()
        .where('pais', '=', pais)
        .orderBy('id_medicamento', 'desc')
        .offset((page - 1) * pageSize)
        .fetch(pageSize)
        .execute();
      return { pais, data };
    }),
  );
  const allData = results.flatMap((r) => r.data);
  // ...
}
```

---

## 8. Resumen visual

```
            ┌────────────────────────────┐
            │      Frontend (Next.js)    │
            └──────────────┬─────────────┘
                           │
            ┌──────────────▼─────────────┐
            │  src/lib/auth/helpers.ts   │  ← getAccessiblesPaises
            │  src/lib/auth/config.ts    │  ← authorize() + login
            └──────────────┬─────────────┘
                           │
            ┌──────────────▼─────────────┐
            │   src/lib/db/index.ts      │  ← getDbForCountry, getAllDbs
            └────┬─────────────┬─────────┘
                 │             │
   ┌─────────────▼──┐   ┌──────▼─────────┐   ┌────────────────┐
   │ bolivia.ts     │   │ peru.ts        │   │ chile.ts       │
   │ MssqlDialect   │   │ MssqlDialect   │   │ PostgresDialect│
   └────────────┬───┘   └────────┬───────┘   └────────┬───────┘
                │                │                    │
        ┌───────▼───────┐  ┌─────▼──────┐  ┌───────────▼─────┐
        │  SQL Server   │  │ SQL Server │  │   PostgreSQL    │
        │   Bolivia     │  │   Perú     │  │     Chile       │
        └───────────────┘  └────────────┘  └─────────────────┘
```

- **Capa central** (este backend) habla **directo** con los tres motores. La
  sincronización entre SQL Server ↔ SQL Server (Bolivia ↔ Perú) y
  SQL Server ↔ PostgreSQL (Bolivia/Perú ↔ Chile) se hace reutilizando los
  mismos clientes y disparando `Promise.all(getAllDbs().map(...))` o jobs
  puntuales (tasas de cambio, reportes globales, etc.).
- La columna `pais` en cada tabla asegura que, aunque el enrutamiento elija la
  DB correcta, las consultas queden además restringidas a su nodo.
