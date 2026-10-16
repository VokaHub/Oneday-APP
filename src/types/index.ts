import { SolicitudData, EmprendedorData, ResenaData, CatalogoItemData } from '../services/firebaseDataService';

export type { SolicitudData, EmprendedorData, ResenaData, CatalogoItemData };

export type ProductoEmprendedor = CatalogoItemData;

export interface PerfilClienteData {
  ID_Cliente: string;
  Nombre: string;
  Correo: string;
  Telefono: string;
  Foto?: string;
  ID_cliente?: string;
  nombre?: string;
  correo?: string;
  telefono?: string;
  foto?: string;
}

export interface SolicitudEnProceso {
  ID_solicitud: string;
  ID_cliente: string;
  servicio_buscado: string;
  detalles_necesidad: string;
  detalle_necesidad?: string;
  presupuesto: string;
  ubicacion_servicios: string;
  fecha_estimado: string;
  ID_emprendedor_asignado: string;
  emprendedor_asignado: string;
  estado: string;
  ID_Solicitud?: string;
  ID_Cliente?: string;
  Servicio_Buscado?: string;
  Detalles_Necesidad?: string;
  Presupuesto?: string;
  Ubicacion_Servicio?: string;
  Fecha_Estimada?: string;
  Estado?: string;
}

export interface CategoriaConfig {
  id: string;
  nombre: string;
}

export const CATEGORIAS_CONFIG: CategoriaConfig[] = [
  { id: 'profesionales', nombre: 'Profesionales' },
  { id: 'creativos', nombre: 'Creativos' },
  { id: 'espacios', nombre: 'Espacios' },
  { id: 'marcas', nombre: 'Marcas' },
];

export const RANGOS_PRESUPUESTO = [
  'Menos de Q150',
  'Q150 - Q350',
  'Q350 - Q750',
  'Q750 - Q1,500',
  'Q1,500 - Q3,000',
  'Q3,000+',
];

export type ScreenType =
  | 'principal'
  | 'solicitud_en_proceso'
  | 'terminos'
  | 'perfil'
  | 'perfil_publico'
  | 'verificacion'
  | 'terminos_impulso';

export type NavTabType =
  | 'inicio'
  | 'actividad'
  | 'favoritos'
  | 'perfil_emprendedor'
  | 'categorias';
