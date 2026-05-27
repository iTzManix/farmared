-- ============================================================
-- FARMARED - Datos de prueba (MOCK DATA) para Nodo Chile (PostgreSQL)
-- ============================================================

\c farmared;

-- 1. SUCURSALES (Chile)
INSERT INTO sucursal (nombre, pais, ciudad, direccion, motor_bd, activo) VALUES
('Farmared Santiago Centro', 'CL', 'Santiago', 'Av. Libertador Bernardo O''Higgins 1050', 'postgresql', TRUE),
('Farmared Providencia', 'CL', 'Santiago', 'Av. Providencia 2000', 'postgresql', TRUE),
('Farmared Viña del Mar', 'CL', 'Viña del Mar', 'Av. Libertad 134', 'postgresql', TRUE),
('Farmared Concepción', 'CL', 'Concepción', 'Caupolicán 501', 'postgresql', TRUE);

-- 2. MEDICAMENTOS (Fragmentados por Chile)
INSERT INTO medicamento (pais, nombre, principio_activo, presentacion, categoria, unidad_medida, requiere_receta) VALUES
('CL', 'Paracetamol 500mg', 'Paracetamol', 'Caja 20 comprimidos', 'Analgésico', 'Caja', FALSE),
('CL', 'Ibuprofeno 400mg', 'Ibuprofeno', 'Caja 10 cápsulas', 'Antiinflamatorio', 'Caja', FALSE),
('CL', 'Losartán 50mg', 'Losartán Potásico', 'Caja 30 comprimidos', 'Antihipertensivo', 'Caja', TRUE),
('CL', 'Amoxicilina 500mg', 'Amoxicilina', 'Caja 21 cápsulas', 'Antibiótico', 'Caja', TRUE),
('CL', 'Omeprazol 20mg', 'Omeprazol', 'Caja 30 cápsulas', 'Antiácido', 'Caja', FALSE),
('CL', 'Clorfenamina 4mg', 'Clorfenamina', 'Caja 20 comprimidos', 'Antihistamínico', 'Caja', FALSE),
('CL', 'Metformina 850mg', 'Metformina', 'Caja 60 comprimidos', 'Antidiabético', 'Caja', TRUE),
('CL', 'Ketorolaco 10mg', 'Ketorolaco Trometamol', 'Caja 10 comprimidos', 'Analgésico', 'Caja', TRUE),
('CL', 'Loratadina 10mg', 'Loratadina', 'Caja 10 comprimidos', 'Antihistamínico', 'Caja', FALSE),
('CL', 'Azitromicina 500mg', 'Azitromicina', 'Caja 3 comprimidos', 'Antibiótico', 'Caja', TRUE);

-- 3. EMPLEADOS (Chile)
INSERT INTO empleado (id_sucursal, pais, nombre, apellido, rol, email, fecha_ingreso, activo) VALUES
(1, 'CL', 'Pedro', 'Soto', 'Gerente', 'psoto@farmared.cl', '2023-01-15', TRUE),
(1, 'CL', 'María', 'González', 'Farmacéutico', 'mgonzalez@farmared.cl', '2023-03-10', TRUE),
(1, 'CL', 'Diego', 'Tapia', 'Vendedor', 'dtapia@farmared.cl', '2023-06-22', TRUE),
(2, 'CL', 'Camila', 'Silva', 'Gerente', 'csilva@farmared.cl', '2022-11-05', TRUE),
(2, 'CL', 'Javier', 'Contreras', 'Farmacéutico', 'jcontreras@farmared.cl', '2023-02-18', TRUE),
(3, 'CL', 'Valentina', 'Rojas', 'Vendedor', 'vrojas@farmared.cl', '2024-01-10', TRUE),
(4, 'CL', 'Matías', 'Muñoz', 'Gerente', 'mmunoz@farmared.cl', '2022-08-30', TRUE);

-- 4. CLIENTES (Chile)
INSERT INTO cliente (pais, nombre, apellido, ci, telefono, email, direccion, ciudad, fecha_registro) VALUES
('CL', 'Juan', 'Pérez', '18.456.789-K', '+56912345678', 'jperez@gmail.com', 'Av. Apoquindo 4500', 'Santiago', '2023-10-12'),
('CL', 'Ana', 'Martínez', '19.123.456-7', '+56923456789', 'amartinez@yahoo.com', 'Calle Los Leones 234', 'Santiago', '2023-11-20'),
('CL', 'Carlos', 'López', '17.890.123-4', '+56934567890', 'clopez@hotmail.com', 'Av. 1 Norte 1020', 'Viña del Mar', '2024-01-05'),
('CL', 'Sofía', 'Fernández', '20.345.678-9', '+56945678901', 'sfernandez@gmail.com', 'O''Higgins 450', 'Concepción', '2024-02-15'),
('CL', 'Luis', 'García', '16.567.890-1', '+56956789012', 'lgarcia@empresa.cl', 'San Diego 1234', 'Santiago', '2024-03-01');

-- 5. STOCK (Chile)
-- Asignando inventario a la Sucursal 1 (Santiago Centro)
INSERT INTO stock (id_sucursal, id_medicamento, pais, cantidad_disponible, precio_local, moneda, stock_minimo) VALUES
(1, 1, 'CL', 150, 1500.00, 'CLP', 50),
(1, 2, 'CL', 120, 2200.00, 'CLP', 40),
(1, 3, 'CL', 80, 4500.00, 'CLP', 30),
(1, 4, 'CL', 45, 6800.00, 'CLP', 20),
(1, 5, 'CL', 90, 3200.00, 'CLP', 30);

-- Asignando inventario a la Sucursal 2 (Providencia)
INSERT INTO stock (id_sucursal, id_medicamento, pais, cantidad_disponible, precio_local, moneda, stock_minimo) VALUES
(2, 1, 'CL', 200, 1600.00, 'CLP', 50),
(2, 6, 'CL', 85, 2100.00, 'CLP', 25),
(2, 7, 'CL', 110, 5500.00, 'CLP', 40),
(2, 8, 'CL', 60, 3800.00, 'CLP', 20),
(2, 10, 'CL', 40, 8900.00, 'CLP', 15);

-- 6. VENTAS (Chile)
-- Ventas recientes en Sucursal 1 (Santiago Centro)
INSERT INTO venta (id_sucursal, id_empleado, id_cliente, pais, moneda, monto_total, fecha_local) VALUES
(1, 3, 1, 'CL', 'CLP', 3000.00, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 3, 2, 'CL', 'CLP', 11300.00, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, 5, 5, 'CL', 'CLP', 16000.00, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
(2, 5, 3, 'CL', 'CLP', 5500.00, CURRENT_TIMESTAMP);

-- 7. DETALLE VENTAS (Chile)
-- Detalles Venta 1
INSERT INTO detalle_venta (id_venta, id_medicamento, pais, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 'CL', 2, 1500.00, 3000.00);

-- Detalles Venta 2
INSERT INTO detalle_venta (id_venta, id_medicamento, pais, cantidad, precio_unitario, subtotal) VALUES
(2, 3, 'CL', 1, 4500.00, 4500.00),
(2, 4, 'CL', 1, 6800.00, 6800.00);

-- Detalles Venta 3
INSERT INTO detalle_venta (id_venta, id_medicamento, pais, cantidad, precio_unitario, subtotal) VALUES
(3, 7, 'CL', 2, 5500.00, 11000.00),
(3, 1, 'CL', 1, 1600.00, 1600.00),
(3, 8, 'CL', 1, 3400.00, 3400.00);

-- Detalles Venta 4
INSERT INTO detalle_venta (id_venta, id_medicamento, pais, cantidad, precio_unitario, subtotal) VALUES
(4, 7, 'CL', 1, 5500.00, 5500.00);

DO $$
BEGIN
    RAISE NOTICE 'Datos de prueba (MOCK DATA) insertados correctamente para Chile';
END $$;
