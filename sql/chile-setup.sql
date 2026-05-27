-- ============================================================
-- FARMARED - Setup para Nodo Chile (PostgreSQL)
-- Nodo Fragmentado - Tablas fragmentadas + tablas replicadas
-- ============================================================

\c farmared;

-- Tabla maestra replicada: sucursal
CREATE TABLE sucursal (
    id_sucursal SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    ciudad VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    motor_bd VARCHAR(20) NOT NULL CHECK (motor_bd IN ('sqlserver', 'postgresql')),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: medicamento (fragmentada)
CREATE TABLE medicamento (
    id_medicamento SERIAL PRIMARY KEY,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    nombre VARCHAR(200) NOT NULL,
    principio_activo VARCHAR(200),
    presentacion VARCHAR(100),
    categoria VARCHAR(100),
    unidad_medida VARCHAR(50),
    requiere_receta BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medicamento_pais ON medicamento(pais);

-- Tabla: empleado (fragmentada)
CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol VARCHAR(100),
    email VARCHAR(150),
    fecha_ingreso DATE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id_sucursal)
);

CREATE INDEX idx_empleado_pais ON empleado(pais);

-- Tabla: cliente (fragmentada)
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    ci VARCHAR(50),
    telefono VARCHAR(50),
    email VARCHAR(150),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cliente_pais ON cliente(pais);

-- Tabla: stock (fragmentada)
CREATE TABLE stock (
    id_stock SERIAL PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    id_medicamento INTEGER NOT NULL,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    cantidad_disponible INTEGER NOT NULL DEFAULT 0,
    precio_local DECIMAL(18,2) NOT NULL,
    moneda CHAR(3) NOT NULL CHECK (moneda IN ('BOB', 'PEN', 'CLP')),
    stock_minimo INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id_sucursal)
);

CREATE INDEX idx_stock_pais ON stock(pais);

-- Tabla: venta (fragmentada)
CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    id_empleado INTEGER,
    id_cliente INTEGER,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    moneda CHAR(3) NOT NULL CHECK (moneda IN ('BOB', 'PEN', 'CLP')),
    monto_total DECIMAL(18,2) NOT NULL,
    fecha_local TIMESTAMP NOT NULL,
    fecha_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id_sucursal),
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE INDEX idx_venta_pais ON venta(pais);
CREATE INDEX idx_venta_fecha ON venta(fecha_local);

-- Tabla: detalle_venta (fragmentada)
CREATE TABLE detalle_venta (
    id_detalle SERIAL PRIMARY KEY,
    id_venta INTEGER NOT NULL,
    id_medicamento INTEGER NOT NULL,
    pais CHAR(2) NOT NULL CHECK (pais IN ('BO', 'PE', 'CL')),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(18,2) NOT NULL,
    subtotal DECIMAL(18,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
);

CREATE INDEX idx_detalle_venta ON detalle_venta(id_venta);
CREATE INDEX idx_detalle_pais ON detalle_venta(pais);

-- Tabla replicada: usuario (sistema de autenticación)
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'superadmin')),
    pais CHAR(2) CHECK (pais IN ('BO', 'PE', 'CL')),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_usuario_username ON usuario(username);

-- Tabla: tasa_cambio (sincronizada desde nodo central)
CREATE TABLE tasa_cambio (
    id SERIAL PRIMARY KEY,
    moneda_origen CHAR(3) NOT NULL CHECK (moneda_origen IN ('BOB', 'PEN', 'CLP')),
    moneda_destino CHAR(3) NOT NULL CHECK (moneda_destino IN ('BOB', 'PEN', 'CLP')),
    tasa DECIMAL(18,6) NOT NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (moneda_origen, moneda_destino)
);

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Tablas creadas exitosamente en Nodo Chile';
END $$;
