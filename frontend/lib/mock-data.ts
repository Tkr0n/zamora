// Tipos y constantes compartidos — los datos vienen de la API

export type PrioridadInsumo = 'critica' | 'alta' | 'media' | 'baja'
export type CategoriaInsumo = 'alimentos' | 'medicinas' | 'agua' | 'higiene' | 'ropa'

export interface Insumo {
  id: string
  nombre: string
  categoria: CategoriaInsumo
  prioridad: PrioridadInsumo
  cantidad_necesaria: number
  cantidad_disponible: number
  unidad: string
}

export type TipoPuntoInteres =
  | 'centro_acopio'
  | 'centro_medico'
  | 'institucion'
  | 'albergue'
  | 'zona_segura'
  | 'punto_agua'
  | 'punto_distribucion'

export interface PuntoInteres {
  id: string
  tipo: TipoPuntoInteres
  nombre: string
  latitud: number
  longitud: number
  direccion: string
  ciudad: string
  municipio: string
  estado: string
  responsable: string
  telefono: string
  capacidad: number
  donacionesRecibidas: number
  beneficiarios: number
  estado_operativo: 'activo' | 'inactivo' | 'parcial'
  ultima_actualizacion: string
  tipos_donacion: string[]
}

export interface ZonaAfectada {
  latitud: number
  longitud: number
  intensidad: number
  radio_km: number
  descripcion: string
  reportado_por?: string
  fecha_reporte?: string
}

export interface ConfigApp {
  ubicacion_predeterminada: {
    latitud: number
    longitud: number
    zoom: number
  }
  municipio: string
  estado: string
  pais: string
}

export const CONFIG_APP: ConfigApp = {
  ubicacion_predeterminada: {
    latitud: 10.4709,
    longitud: -66.5485,
    zoom: 13,
  },
  municipio: 'Zamora',
  estado: 'Miranda',
  pais: 'Venezuela',
}

export const POI_COLORS: Record<TipoPuntoInteres, string> = {
  centro_acopio: '#22c55e',
  centro_medico: '#ef4444',
  institucion: '#3b82f6',
  albergue: '#f97316',
  zona_segura: '#06b6d4',
  punto_agua: '#14b8a6',
  punto_distribucion: '#a855f7',
}

export const POI_LABELS: Record<TipoPuntoInteres, string> = {
  centro_acopio: 'Centro de Acopio',
  centro_medico: 'Centro Médico',
  institucion: 'Institución',
  albergue: 'Albergue',
  zona_segura: 'Zona Segura',
  punto_agua: 'Punto de Agua',
  punto_distribucion: 'Punto de Distribución',
}

export const POI_ICONS: Record<TipoPuntoInteres, string> = {
  centro_acopio: '📦',
  centro_medico: '🏥',
  institucion: '🏛️',
  albergue: '🏠',
  zona_segura: '🛡️',
  punto_agua: '💧',
  punto_distribucion: '🚚',
}

export const categoriaColores: Record<CategoriaInsumo, string> = {
  alimentos: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  medicinas: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  agua: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  higiene: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  ropa: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
}

export const categoriaNombres: Record<CategoriaInsumo, string> = {
  alimentos: 'Alimentos',
  medicinas: 'Medicinas',
  agua: 'Agua',
  higiene: 'Higiene',
  ropa: 'Ropa',
}

export const prioridadColores: Record<PrioridadInsumo, string> = {
  critica: 'bg-red-500',
  alta: 'bg-orange-500',
  media: 'bg-yellow-500',
  baja: 'bg-green-500',
}

export const prioridadNombres: Record<PrioridadInsumo, string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export const TIPOS_POI: TipoPuntoInteres[] = [
  'centro_acopio',
  'centro_medico',
  'institucion',
  'albergue',
  'zona_segura',
  'punto_agua',
  'punto_distribucion',
]

export const ESTADOS_OPERATIVOS = ['activo', 'parcial', 'inactivo'] as const
