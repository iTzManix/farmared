-- ============================================================
-- FARMARED - Datos de prueba (MOCK DATA) para Nodo Perú (SQL Server)
-- ============================================================

USE farmared;
GO

-- Opcional: limpiar tablas antes de insertar (descomentar si se requiere reiniciar)
-- DELETE FROM detalle_venta; DELETE FROM venta; DELETE FROM stock; 
-- DELETE FROM cliente; DELETE FROM empleado; DELETE FROM medicamento; DELETE FROM sucursal;
-- DBCC CHECKIDENT ('sucursal', RESEED, 0); ... etc.

-- 1. SUCURSALES (Perú)
-- Asumiendo que la tabla está vacía y los IDs empezarán en 1, 2, 3...
INSERT INTO sucursal (nombre, pais, ciudad, direccion, motor_bd, activo) VALUES
('Farmared Lima Centro', 'PE', 'Lima', 'Av. Garcilaso de la Vega 1337', 'sqlserver', 1),
('Farmared Miraflores', 'PE', 'Lima', 'Av. José Pardo 450', 'sqlserver', 1),
('Farmared Arequipa', 'PE', 'Arequipa', 'Calle Mercaderes 115', 'sqlserver', 1),
('Farmared Cusco', 'PE', 'Cusco', 'Av. El Sol 340', 'sqlserver', 1);
GO

-- 2. MEDICAMENTOS (Fragmentados por Perú)
INSERT INTO medicamento (pais, nombre, principio_activo, presentacion, categoria, unidad_medida, requiere_receta) VALUES
('PE', 'Paracetamol 500mg', 'Paracetamol', 'Caja 100 tabletas', 'Analgésico', 'Caja', 0),
('PE', 'Ibuprofeno 400mg', 'Ibuprofeno', 'Caja 50 tabletas', 'Antiinflamatorio', 'Caja', 0),
('PE', 'Amoxicilina 500mg', 'Amoxicilina', 'Caja 50 cápsulas', 'Antibiótico', 'Caja', 1),
('PE', 'Losartán 50mg', 'Losartán Potásico', 'Caja 30 tabletas', 'Antihipertensivo', 'Caja', 1),
('PE', 'Omeprazol 20mg', 'Omeprazol', 'Caja 30 cápsulas', 'Antiácido', 'Caja', 0),
('PE', 'Cetirizina 10mg', 'Cetirizina', 'Caja 10 tabletas', 'Antihistamínico', 'Caja', 0),
('PE', 'Diclofenaco 50mg', 'Diclofenaco Sódico', 'Caja 20 grageas', 'Analgésico', 'Caja', 1),
('PE', 'Metformina 850mg', 'Metformina', 'Caja 30 tabletas', 'Antidiabético', 'Caja', 1),
('PE', 'Naproxeno 550mg', 'Naproxeno', 'Caja 20 tabletas', 'Antiinflamatorio', 'Caja', 1),
('PE', 'Loratadina 10mg', 'Loratadina', 'Caja 20 tabletas', 'Antihistamínico', 'Caja', 0);
GO

-- 3. EMPLEADOS (Perú)
-- Asumiendo id_sucursal generados (1: Lima Centro, 2: Miraflores, 3: Arequipa)
INSERT INTO empleado (id_sucursal, pais, nombre, apellido, rol, email, fecha_ingreso, activo) VALUES
(1, 'PE', 'Carlos', 'Mendoza', 'Gerente', 'cmendoza@farmared.pe', '2023-01-10', 1),
(1, 'PE', 'Lucía', 'Quispe', 'Farmacéutico', 'lquispe@farmared.pe', '2023-02-15', 1),
(1, 'PE', 'Jorge', 'Flores', 'Vendedor', 'jflores@farmared.pe', '2023-05-20', 1),
(2, 'PE', 'Carmen', 'Rojas', 'Gerente', 'crojas@farmared.pe', '2022-11-01', 1),
(2, 'PE', 'Miguel', 'Huamán', 'Vendedor', 'mhuaman@farmared.pe', '2023-06-10', 1),
(3, 'PE', 'Rosa', 'Mamani', 'Farmacéutico', 'rmamani@farmared.pe', '2024-01-05', 1),
(4, 'PE', 'Luis', 'Chávez', 'Gerente', 'lchavez@farmared.pe', '2022-09-12', 1);
GO

-- 4. CLIENTES (Perú)
INSERT INTO cliente (pais, nombre, apellido, ci, telefono, email, direccion, ciudad, fecha_registro) VALUES
('PE', 'José', 'García', '45678912', '+51987654321', 'jgarcia@gmail.com', 'Av. Arequipa 1234', 'Lima', '2023-10-15'),
('PE', 'María', 'Fernández', '76543210', '+51987123456', 'mfernandez@hotmail.com', 'Jirón de la Unión 450', 'Lima', '2023-11-25'),
('PE', 'Julio', 'Sánchez', '12345678', '+51912345678', 'jsanchez@yahoo.com', 'Calle Mercaderes 200', 'Arequipa', '2024-01-10'),
('PE', 'Ana', 'Pérez', '87654321', '+51923456789', 'aperez@gmail.com', 'Av. El Sol 500', 'Cusco', '2024-02-20'),
('PE', 'David', 'Ramírez', '43218765', '+51934567890', 'dramirez@empresa.pe', 'Av. Javier Prado 4000', 'Lima', '2024-03-05');
GO

-- 5. STOCK (Perú)
-- Asignando inventario a la Sucursal 1 (Lima Centro)
INSERT INTO stock (id_sucursal, id_medicamento, pais, cantidad_disponible, precio_local, moneda, stock_minimo) VALUES
(1, 1, 'PE', 120, 2.50, 'PEN', 30),
(1, 2, 'PE', 80, 5.00, 'PEN', 20),
(1, 3, 'PE', 60, 15.00, 'PEN', 15),
(1, 4, 'PE', 45, 12.00, 'PEN', 10),
(1, 5, 'PE', 100, 1.50, 'PEN', 40);

-- Asignando inventario a la Sucursal 2 (Miraflores)
INSERT INTO stock (id_sucursal, id_medicamento, pais, cantidad_disponible, precio_local, moneda, stock_minimo) VALUES
(2, 1, 'PE', 200, 3.00, 'PEN', 50),
(2, 6, 'PE', 90, 8.50, 'PEN', 25),
(2, 7, 'PE', 55, 10.00, 'PEN', 20),
(2, 8, 'PE', 40, 25.00, 'PEN', 15),
(2, 10, 'PE', 70, 6.00, 'PEN', 20);
GO

-- 6. VENTAS (Perú)
-- Ventas recientes (fechas restadas para simular el pasado reciente en SQL Server)
INSERT INTO venta (id_sucursal, id_empleado, id_cliente, pais, moneda, monto_total, fecha_local) VALUES
(1, 3, 1, 'PE', 'PEN', 10.00, DATEADD(day, -2, GETDATE())),
(1, 3, 2, 'PE', 'PEN', 37.00, DATEADD(day, -1, GETDATE())),
(2, 5, 5, 'PE', 'PEN', 25.50, DATEADD(hour, -5, GETDATE())),
(2, 5, 3, 'PE', 'PEN', 12.00, GETDATE());
GO

-- 7. DETALLE VENTAS (Perú)
-- Detalles Venta 1
INSERT INTO detalle_venta (id_venta, id_medicamento, pais, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 'PE', 2, 2.50, 5.00),
(1, 2, 'PE', 1, 5.00, 5.00);

-- Detalles Venta 2
INSERT INTO detalle_venta (id_venta, id_medicamento, pais, cantidad, precio_unitario, subtotal) VALUES
(2, 3, 'PE', 1, 15.00, 15.00),
(2, 4, 'PE', 1, 12.00, 12.00),
(2, 7, 'PE', 1, 10.00, 10.00);

-- Detalles Venta 3
INSERT INTO detalle_venta (id_venta, id_medicamento, pais, cantidad, precio_unitario, subtotal) VALUES
(3, 6, 'PE', 3, 8.50, 25.50);

-- Detalles Venta 4
INSERT INTO detalle_venta (id_venta, id_medicamento, pais, cantidad, precio_unitario, subtotal) VALUES
(4, 10, 'PE', 2, 6.00, 12.00);
GO

PRINT 'Datos de prueba (MOCK DATA) insertados correctamente para Perú';
GO
