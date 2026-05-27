-- ==============================================================================
-- SCRIPT DE CONFIGURACIÓN DE LINKED SERVERS (Desde el nodo Bolivia - SQL Server)
-- ==============================================================================
-- Este script se ejecuta en el SQL Server de Bolivia para permitir consultas 
-- directas hacia Perú (SQL Server) y Chile (PostgreSQL).

-- ------------------------------------------------------------------------------
-- 1. LINKED SERVER: BOLIVIA -> PERÚ (SQL Server a SQL Server)
-- ------------------------------------------------------------------------------
-- Reemplazar 'IP_DEL_SERVIDOR_PERU' con la IP real o 'localhost,puerto'
EXEC sp_addlinkedserver   
   @server=N'NODO_PERU', 
   @srvproduct=N'',
   @provider=N'SQLNCLI', -- Puedes usar 'MSOLEDBSQL' si SQLNCLI está deprecado
   @datasrc=N'IP_DEL_SERVIDOR_PERU'; 

-- Configurar las credenciales para el Linked Server hacia Perú
-- Reemplazar 'tu_password_peru' con la contraseña real del usuario 'sa'
EXEC sp_addlinkedsrvlogin 
   @rmtsrvname=N'NODO_PERU', 
   @useself=N'False', 
   @locallogin=NULL, 
   @rmtuser=N'sa', 
   @rmtpassword=N'tu_password_peru';
GO

-- Ejemplo de consulta de prueba:
-- SELECT * FROM NODO_PERU.farmared.dbo.sucursales;

-- ------------------------------------------------------------------------------
-- 2. LINKED SERVER: BOLIVIA -> CHILE (SQL Server a PostgreSQL)
-- ------------------------------------------------------------------------------
-- REQUISITO PREVIO MUY IMPORTANTE PARA CHILE:
-- 1. Instalar el driver psqlODBC en el servidor de Windows donde corre Bolivia.
-- 2. Abrir "Orígenes de datos ODBC (64 bits)" en Windows.
-- 3. Crear un "DSN de Sistema" usando el driver PostgreSQL ANSI/Unicode.
-- 4. Nombrar el DSN como 'DSN_CHILE_PG' (y colocar allí la IP de Chile, puerto 5432, base 'farmared').

-- Crear el Linked Server usando el proveedor OLE DB para ODBC (MSDASQL)
EXEC sp_addlinkedserver 
   @server = 'NODO_CHILE', 
   @srvproduct = 'PostgreSQL', 
   @provider = 'MSDASQL', 
   @datasrc = 'DSN_CHILE_PG'; -- Este nombre debe coincidir EXACTAMENTE con el DSN de Windows

-- Configurar las credenciales para conectarse a PostgreSQL
-- Reemplazar 'tu_password_chile' con la contraseña real del usuario 'postgres'
EXEC sp_addlinkedsrvlogin 
   @rmtsrvname = 'NODO_CHILE', 
   @useself = 'False', 
   @locallogin = NULL, 
   @rmtuser = 'postgres', 
   @rmtpassword = 'tu_password_chile';
GO

-- Habilitar RPC para poder hacer ciertas consultas (opcional pero recomendado)
EXEC sp_serveroption @server='NODO_CHILE', @optname='rpc', @optvalue='true';
EXEC sp_serveroption @server='NODO_CHILE', @optname='rpc out', @optvalue='true';
GO

-- Ejemplo de consulta de prueba usando OPENQUERY (Recomendado para Postgres):
-- SELECT * FROM OPENQUERY(NODO_CHILE, 'SELECT * FROM sucursales');
