import { z } from 'zod';
import type { Pais, Moneda } from '@/types/database';

// === COMMON ===
const PaisEnum = z.enum(['BO', 'PE', 'CL']);
const MonedaEnum = z.enum(['BOB', 'PEN', 'CLP']);

// === MEDICAMENTOS ===
export const medicamentoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(200),
  principio_activo: z.string().max(200).nullable().optional(),
  presentacion: z.string().max(100).nullable().optional(),
  categoria: z.string().max(100).nullable().optional(),
  unidad_medida: z.string().max(50).nullable().optional(),
  requiere_receta: z.boolean().default(false),
});

export type MedicamentoInput = z.infer<typeof medicamentoSchema>;

// === EMPLEADOS ===
export const empleadoSchema = z.object({
  id_sucursal: z.number().positive(),
  nombre: z.string().min(1).max(100),
  apellido: z.string().min(1).max(100),
  email: z.string().email().max(150).nullable().optional(),
  rol: z.string().max(100).nullable().optional(),
  fecha_ingreso: z.string().nullable().optional(),
});

export type EmpleadoInput = z.infer<typeof empleadoSchema>;

// === CLIENTES ===
export const clienteSchema = z.object({
  nombre: z.string().min(1).max(100),
  apellido: z.string().min(1).max(100),
  ci: z.string().max(50).nullable().optional(),
  telefono: z.string().max(50).nullable().optional(),
  email: z.string().email().max(150).nullable().optional(),
  direccion: z.string().max(255).nullable().optional(),
  ciudad: z.string().max(100).nullable().optional(),
  fecha_registro: z.string().optional(),
});

export type ClienteInput = z.infer<typeof clienteSchema>;

// === STOCK ===
export const stockSchema = z.object({
  id_sucursal: z.number().positive(),
  id_medicamento: z.number().positive(),
  cantidad_disponible: z.number().int().min(0),
  precio_local: z.number().positive(),
  moneda: MonedaEnum.default('BOB'),
  stock_minimo: z.number().int().min(0).default(0),
});

export type StockInput = z.infer<typeof stockSchema>;

// === VENTAS ===
export const ventaSchema = z.object({
  id_sucursal: z.number().positive(),
  id_empleado: z.number().positive().nullable().optional(),
  id_cliente: z.number().positive().nullable().optional(),
  id_medicamento: z.number().positive(),
  cantidad: z.number().int().positive(),
  moneda: MonedaEnum,
  monto_total: z.number().positive(),
});

export type VentaInput = z.infer<typeof ventaSchema>;

export const detalleVentaSchema = z.object({
  id_medicamento: z.number().positive(),
  cantidad: z.number().int().positive(),
  precio_unitario: z.number().positive(),
  subtotal: z.number().positive(),
});

export type DetalleVentaInput = z.infer<typeof detalleVentaSchema>;

// === SUCURSALES ===
export const sucursalSchema = z.object({
  nombre: z.string().min(1).max(100),
  pais: PaisEnum,
  ciudad: z.string().min(1).max(100),
  direccion: z.string().max(255).nullable().optional(),
  motor_bd: z.enum(['sqlserver', 'postgresql']),
  activo: z.boolean().default(true),
});

export type SucursalInput = z.infer<typeof sucursalSchema>;

// === TASAS CAMBIO ===
export const tasaCambioSchema = z.object({
  moneda_origen: MonedaEnum,
  moneda_destino: MonedaEnum,
  tasa: z.number().positive(),
  fecha_actualizacion: z.string().optional(),
});

export type TasaCambioInput = z.infer<typeof tasaCambioSchema>;