-- ============================================================
-- FARMARED - Setup para Nodo Bolivia (SQL Server)
-- Nodo Central - Contiene todas las tablas
-- ============================================================

USE farmared;
GO

-- Tabla maestra: sucursal (replicada en todos los nodos)
CREATE TABLE sucursal (
    id_sucursal INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    ciudad VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    motor_bd VARCHAR(20) NOT NULL CHECK (motor_bd IN ('sqlserver', 'postgresql')),
    activo BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);

-- Tabla: medicamento (fragmentada horizontalmente por pais)
CREATE TABLE medicamento (
    id_medicamento INT PRIMARY KEY IDENTITY(1,1),
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    nombre VARCHAR(200) NOT NULL,
    principio_activo VARCHAR(200),
    presentacion VARCHAR(100),
    categoria VARCHAR(100),
    unidad_medida VARCHAR(50),
    requiere_receta BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    INDEX idx_medicamento_pais (pais)
);

-- Tabla: empleado (fragmentada horizontalmente por pais)
CREATE TABLE empleado (
    id_empleado INT PRIMARY KEY IDENTITY(1,1),
    id_sucursal INT NOT NULL,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol VARCHAR(100),
    email VARCHAR(150),
    fecha_ingreso DATE,
    activo BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id_sucursal),
    INDEX idx_empleado_pais (pais)
);

-- Tabla: cliente (fragmentada horizontalmente por pais)
CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY IDENTITY(1,1),
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    ci VARCHAR(50),
    telefono VARCHAR(50),
    email VARCHAR(150),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    fecha_registro DATE DEFAULT GETDATE(),
    created_at DATETIME DEFAULT GETDATE(),
    INDEX idx_cliente_pais (pais)
);

-- Tabla: stock (fragmentada horizontalmente por pais)
CREATE TABLE stock (
    id_stock INT PRIMARY KEY IDENTITY(1,1),
    id_sucursal INT NOT NULL,
    id_medicamento INT NOT NULL,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    cantidad_disponible INT NOT NULL DEFAULT 0,
    precio_local DECIMAL(18,2) NOT NULL,
    moneda CHAR(3) NOT NULL CHECK (moneda IN ('BOB', 'PEN', 'CLP')),
    stock_minimo INT DEFAULT 0,
    updated_at DATETIME DEFAULT GETDATE(),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id_sucursal),
    INDEX idx_stock_pais (pais)
);

-- Tabla: venta (fragmentada horizontalmente por pais)
CREATE TABLE venta (
    id_venta INT PRIMARY KEY IDENTITY(1,1),
    id_sucursal INT NOT NULL,
    id_empleado INT,
    id_cliente INT,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    moneda CHAR(3) NOT NULL CHECK (moneda IN ('BOB', 'PEN', 'CLP')),
    monto_total DECIMAL(18,2) NOT NULL,
    fecha_local DATETIME NOT NULL,
    fecha_utc DATETIME NOT NULL DEFAULT GETUTCDATE(),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id_sucursal),
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    INDEX idx_venta_pais (pais),
    INDEX idx_venta_fecha (fecha_local)
);

-- Tabla: detalle_venta (fragmentada horizontalmente por pais)
CREATE TABLE detalle_venta (
    id_detalle INT PRIMARY KEY IDENTITY(1,1),
    id_venta INT NOT NULL,
    id_medicamento INT NOT NULL,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(18,2) NOT NULL,
    subtotal DECIMAL(18,2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    INDEX idx_detalle_venta (id_venta),
    INDEX idx_detalle_pais (pais)
);

-- Tabla: usuario (replicada - sistema de autenticación)
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'superadmin')),
    pais CHAR(2) NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tabla: tasa_cambio (solo en nodo central Bolivia)
CREATE TABLE tasa_cambio (
    id INT PRIMARY KEY IDENTITY(1,1),
    moneda_origen CHAR(3) NOT NULL CHECK (moneda_origen IN ('BOB', 'PEN', 'CLP')),
    moneda_destino CHAR(3) NOT NULL CHECK (moneda_destino IN ('BOB', 'PEN', 'CLP')),
    tasa DECIMAL(18,6) NOT NULL,
    fecha_actualizacion DATETIME DEFAULT GETDATE(),
    UNIQUE (moneda_origen, moneda_destino)
);

PRINT 'Tablas creadas exitosamente en Nodo Bolivia';
