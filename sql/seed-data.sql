-- ============================================================
-- FARMARED - Datos Iniciales (Seed)
-- ============================================================

-- IMPORTANTE: Los password_hash deben ser generados usando bcrypt con 10 rounds.
-- Usa el script de node o una herramienta online para generar los hashes.
-- Ejemplo: bcrypt.hashSync('TuPassword123!', 10)

-- ============================================================
-- 1. SUCURSALES (Tabla Maestra Replicada)
-- ============================================================

-- SQL Server (Bolivia y Perú)
INSERT INTO sucursal (nombre, pais, ciudad, direccion, motor_bd, activo) VALUES
('Farmared La Paz', 'BO', 'La Paz', 'Av. 16 de Julio #1234', 'sqlserver', 1),
('Farmared Cochabamba', 'BO', 'Cochabamba', 'Av. Heroínas #567', 'sqlserver', 1),
('Farmared Lima Centro', 'PE', 'Lima', 'Av. Arequipa #890', 'sqlserver', 1),
('Farmared Cusco', 'PE', 'Cusco', 'Av. El Sol #456', 'sqlserver', 1),
('Farmared Santiago Centro', 'CL', 'Santiago', 'Av. Libertador Bernardo O''Higgins #1200', 'postgresql', 1),
('Farmared Valparaíso', 'CL', 'Valparaíso', 'Av. Brasil #789', 'postgresql', 1);

-- PostgreSQL (Chile) - sintaxis alternativa
-- INSERT INTO sucursal (nombre, pais, ciudad, direccion, motor_bd, activo) VALUES
-- ('Farmared Santiago Centro', 'CL', 'Santiago', 'Av. Libertador Bernardo O''Higgins #1200', 'postgresql', true),
-- ('Farmared Valparaíso', 'CL', 'Valparaíso', 'Av. Brasil #789', 'postgresql', true);

-- ============================================================
-- 2. USUARIOS DEL SISTEMA (Tabla Replicada)
-- ============================================================

-- IMPORTANTE: Reemplaza los password_hash con los valores generados por bcrypt

-- SQL Server
-- CONTRASEÑAS A USAR (genera los hashes bcrypt):
-- superadmin:  password = FarmaredSuper2026!
-- admin_bo:    password = BoliviaAdmin123!
-- admin_pe:    password = PeruAdmin123!
-- admin_cl:    password = ChileAdmin123!

/*
-- Ejemplo de como generar los hashes desde Node.js:
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
*/

-- INSERT SQL Server (reemplaza los valores de password_hash):
INSERT INTO usuario (username, password_hash, nombre, rol, pais, activo) VALUES
('superadmin', '$2b$10$REPLACE_WITH_BCRYPT_HASH', 'Super Administrador', 'superadmin', NULL, 1),
('admin_bo', '$2b$10$REPLACE_WITH_BCRYPT_HASH', 'Admin Bolivia', 'admin', 'BO', 1),
('admin_pe', '$2b$10$REPLACE_WITH_BCRYPT_HASH', 'Admin Perú', 'admin', 'PE', 1),
('admin_cl', '$2b$10$REPLACE_WITH_BCRYPT_HASH', 'Admin Chile', 'admin', 'CL', 1);

-- PostgreSQL sintaxis:
/*
INSERT INTO usuario (username, password_hash, nombre, rol, pais, activo) VALUES
('superadmin', '$2b$10$...', 'Super Administrador', 'superadmin', NULL, true),
('admin_bo', '$2b$10$...', 'Admin Bolivia', 'admin', 'BO', true),
('admin_pe', '$2b$10$...', 'Admin Perú', 'admin', 'PE', true),
('admin_cl', '$2b$10$...', 'Admin Chile', 'admin', 'CL', true);
*/

-- ============================================================
-- 3. TASAS DE CAMBIO (Solo Nodo Bolivia Central)
-- ============================================================

-- Tasas de cambio aproximadas (actualizar según mercado)
-- SQL Server:
INSERT INTO tasa_cambio (moneda_origen, moneda_destino, tasa) VALUES
('BOB', 'BOB', 1.000000),
('BOB', 'PEN', 0.550000),
('BOB', 'CLP', 120.000000),
('PEN', 'BOB', 1.820000),
('PEN', 'PEN', 1.000000),
('PEN', 'CLP', 218.000000),
('CLP', 'BOB', 0.008300),
('CLP', 'PEN', 0.004600),
('CLP', 'CLP', 1.000000);

-- PostgreSQL:
/*
INSERT INTO tasa_cambio (moneda_origen, moneda_destino, tasa) VALUES
('BOB', 'BOB', 1.000000),
('BOB', 'PEN', 0.550000),
('BOB', 'CLP', 120.000000),
('PEN', 'BOB', 1.820000),
('PEN', 'PEN', 1.000000),
('PEN', 'CLP', 218.000000),
('CLP', 'BOB', 0.008300),
('CLP', 'PEN', 0.004600),
('CLP', 'CLP', 1.000000);
*/

PRINT 'Datos iniciales insertados. Recuerda generar los password_hash con bcrypt!';
