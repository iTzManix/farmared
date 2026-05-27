import type { Generated } from 'kysely';

export type Pais = 'BO' | 'PE' | 'CL';
export type RolUsuario = 'admin' | 'superadmin';
export type Moneda = 'BOB' | 'PEN' | 'CLP';
export type MotorBD = 'sqlserver' | 'postgresql';

export interface SucursalTable {
  id_sucursal: Generated<number>;
  nombre: string;
  pais: Pais;
  ciudad: string;
  direccion: string | null;
  motor_bd: MotorBD;
  activo: Generated<boolean>;
}

export interface MedicamentoTable {
  id_medicamento: Generated<number>;
  pais: Pais;
  nombre: string;
  principio_activo: string | null;
  presentacion: string | null;
  categoria: string | null;
  unidad_medida: string | null;
  requiere_receta: boolean;
}

export interface EmpleadoTable {
  id_empleado: Generated<number>;
  id_sucursal: number;
  pais: Pais;
  nombre: string;
  apellido: string;
  rol: string | null;
  email: string | null;
  fecha_ingreso: Generated<Date | null>;
  activo: Generated<boolean>;
}

export interface ClienteTable {
  id_cliente: Generated<number>;
  pais: Pais;
  nombre: string;
  apellido: string;
  ci: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  ciudad: string | null;
  fecha_registro: Generated<Date>;
}

export interface StockTable {
  id_stock: Generated<number>;
  id_sucursal: number;
  id_medicamento: number;
  pais: Pais;
  cantidad_disponible: number;
  precio_local: number;
  moneda: Moneda;
  stock_minimo: number;
}

export interface VentaTable {
  id_venta: Generated<number>;
  id_sucursal: number;
  id_empleado: number | null;
  id_cliente: number | null;
  id_medicamento: number;
  cantidad: number;
  pais: Pais;
  moneda: Moneda;
  monto_total: number;
  fecha_local: Generated<Date>;
  fecha_utc: Generated<Date>;
}

export interface DetalleVentaTable {
  id_detalle: Generated<number>;
  id_venta: number;
  id_medicamento: number;
  pais: Pais;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface UsuarioTable {
  id_usuario: Generated<number>;
  username: string;
  password_hash: string;
  nombre: string;
  rol: RolUsuario;
  pais: Pais | null;
  activo: Generated<boolean>;
  fecha_creacion: Generated<Date>;
}

export interface TasaCambioTable {
  id: Generated<number>;
  moneda_origen: Moneda;
  moneda_destino: Moneda;
  tasa: number;
  fecha_actualizacion: Generated<Date>;
}

export interface FarmaredDB {
  sucursal: SucursalTable;
  medicamento: MedicamentoTable;
  empleado: EmpleadoTable;
  cliente: ClienteTable;
  stock: StockTable;
  venta: VentaTable;
  detalle_venta: DetalleVentaTable;
  usuario: UsuarioTable;
  tasa_cambio: TasaCambioTable;
}
