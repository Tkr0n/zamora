// Mock data for Phase 1 - Will be replaced with Supabase in Phase 2

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

// Keep CENTROS_ACOPIO for backward compat (admin dashboard stats, centros table)
export const CENTROS_ACOPIO = [
  {
    id: '1',
    nombre: 'Centro Comunitario Guatire',
    latitud: 10.5964,
    longitud: -66.3215,
    direccion: 'Avenida Principal, Guatire',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Juan García',
    telefono: '0424-1234567',
    capacidad: 500,
    donacionesRecibidas: 350,
    beneficiarios: 420,
    estado_operativo: 'activo' as const,
    ultima_actualizacion: '2025-06-26T10:30:00Z',
    tipos_donacion: ['alimentos', 'medicinas', 'ropa'],
  },
  {
    id: '2',
    nombre: 'Iglesia San José',
    latitud: 10.5980,
    longitud: -66.3180,
    direccion: 'Calle 5, Guatire Centro',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'María López',
    telefono: '0416-9876543',
    capacidad: 300,
    donacionesRecibidas: 280,
    beneficiarios: 350,
    estado_operativo: 'activo' as const,
    ultima_actualizacion: '2025-06-26T09:15:00Z',
    tipos_donacion: ['alimentos', 'agua', 'higiene'],
  },
  {
    id: '3',
    nombre: 'Centro Médico Comunitario',
    latitud: 10.5945,
    longitud: -66.3245,
    direccion: 'Sector Los Pinos, Guatire',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Dr. Carlos Ruiz',
    telefono: '0412-5555555',
    capacidad: 200,
    donacionesRecibidas: 150,
    beneficiarios: 180,
    estado_operativo: 'parcial' as const,
    ultima_actualizacion: '2025-06-25T14:45:00Z',
    tipos_donacion: ['medicinas', 'suministros medicos'],
  },
  {
    id: '4',
    nombre: 'Escuela Primaria Bolívar',
    latitud: 10.6000,
    longitud: -66.3200,
    direccion: 'Carrera 2, Sector Este',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Prof. Andrea Martín',
    telefono: '0414-7777777',
    capacidad: 400,
    donacionesRecibidas: 320,
    beneficiarios: 500,
    estado_operativo: 'activo' as const,
    ultima_actualizacion: '2025-06-26T11:00:00Z',
    tipos_donacion: ['alimentos', 'ropa', 'libros'],
  },
]

// New: unified Puntos de Interes with types
export const PUNTOS_INTERES: PuntoInteres[] = [
  {
    id: '1',
    tipo: 'centro_acopio',
    nombre: 'Centro Comunitario Guatire',
    latitud: 10.4709,
    longitud: -66.5485,
    direccion: 'Avenida Principal, Guatire',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Juan García',
    telefono: '0424-1234567',
    capacidad: 500,
    donacionesRecibidas: 350,
    beneficiarios: 420,
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T10:30:00Z',
    tipos_donacion: ['alimentos', 'medicinas', 'ropa'],
  },
  {
    id: '2',
    tipo: 'centro_acopio',
    nombre: 'Iglesia San José',
    latitud: 10.4800,
    longitud: -66.5450,
    direccion: 'Calle 5, Guatire Centro',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'María López',
    telefono: '0416-9876543',
    capacidad: 300,
    donacionesRecibidas: 280,
    beneficiarios: 350,
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T09:15:00Z',
    tipos_donacion: ['alimentos', 'agua', 'higiene'],
  },
  {
    id: '3',
    tipo: 'centro_medico',
    nombre: 'Ambulatorio Dr. Francisco Risquez',
    latitud: 10.4680,
    longitud: -66.5520,
    direccion: 'Sector Los Pinos, Guatire',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Dr. Carlos Ruiz',
    telefono: '0412-5555555',
    capacidad: 200,
    donacionesRecibidas: 150,
    beneficiarios: 180,
    estado_operativo: 'parcial',
    ultima_actualizacion: '2025-06-25T14:45:00Z',
    tipos_donacion: ['medicinas', 'suministros medicos'],
  },
  {
    id: '4',
    tipo: 'institucion',
    nombre: 'Escuela Primaria Bolívar',
    latitud: 10.4750,
    longitud: -66.5420,
    direccion: 'Carrera 2, Sector Este',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Prof. Andrea Martín',
    telefono: '0414-7777777',
    capacidad: 400,
    donacionesRecibidas: 320,
    beneficiarios: 500,
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T11:00:00Z',
    tipos_donacion: ['alimentos', 'ropa', 'libros'],
  },
  {
    id: '5',
    tipo: 'centro_medico',
    nombre: 'CDI Valle Verde',
    latitud: 10.4820,
    longitud: -66.5400,
    direccion: 'Calle Principal, Sector Valle Verde',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Dra. Elena Martínez',
    telefono: '0424-1112233',
    capacidad: 150,
    donacionesRecibidas: 90,
    beneficiarios: 200,
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T08:00:00Z',
    tipos_donacion: ['medicinas', 'higiene'],
  },
  {
    id: '6',
    tipo: 'albergue',
    nombre: 'Refugio Municipal Zamora',
    latitud: 10.4650,
    longitud: -66.5450,
    direccion: 'Calle Bolívar, Sector Centro',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Luis Fernández',
    telefono: '0416-9988776',
    capacidad: 300,
    donacionesRecibidas: 180,
    beneficiarios: 250,
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T07:30:00Z',
    tipos_donacion: ['alimentos', 'agua', 'ropa', 'higiene'],
  },
  {
    id: '7',
    tipo: 'institucion',
    nombre: 'Alcaldía de Zamora',
    latitud: 10.4720,
    longitud: -66.5500,
    direccion: 'Plaza Bolívar, Guatire Centro',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Oficina de Atención Ciudadana',
    telefono: '0212-3000000',
    capacidad: 0,
    donacionesRecibidas: 0,
    beneficiarios: 0,
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T12:00:00Z',
    tipos_donacion: [],
  },
  {
    id: '8',
    tipo: 'zona_segura',
    nombre: 'Zona Segura Parque Guatire',
    latitud: 10.4780,
    longitud: -66.5350,
    direccion: 'Parque Central, Av. Intercomunal',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Protección Civil Zamora',
    telefono: '0424-5551122',
    capacidad: 1000,
    donacionesRecibidas: 0,
    beneficiarios: 0,
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T06:00:00Z',
    tipos_donacion: [],
  },
  {
    id: '9',
    tipo: 'punto_agua',
    nombre: 'Punto de Agua Comunidad El Rodeo',
    latitud: 10.4640,
    longitud: -66.5500,
    direccion: 'Sector El Rodeo, vía principal',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Comité de Agua El Rodeo',
    telefono: '0412-3344556',
    capacidad: 5000,
    donacionesRecibidas: 2000,
    beneficiarios: 800,
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T09:00:00Z',
    tipos_donacion: ['agua'],
  },
  {
    id: '10',
    tipo: 'punto_distribucion',
    nombre: 'Punto de Distribución Mercal Guatire',
    latitud: 10.4730,
    longitud: -66.5380,
    direccion: 'Av. Principal, frente a la plaza',
    ciudad: 'Guatire',
    municipio: 'Zamora',
    estado: 'Miranda',
    responsable: 'Coordinación CLAP Zamora',
    telefono: '0426-7788990',
    capacidad: 2000,
    donacionesRecibidas: 1200,
    beneficiarios: 1500,
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T10:00:00Z',
    tipos_donacion: ['alimentos', 'higiene'],
  },
]

export const ZONAS_AFECTADAS: ZonaAfectada[] = [
  { latitud: 10.4709, longitud: -66.5485, intensidad: 0.9, radio_km: 0.8, descripcion: 'Zona centro - alta densidad de afectados' },
  { latitud: 10.4800, longitud: -66.5450, intensidad: 0.7, radio_km: 0.5, descripcion: 'Casco histórico - daños moderados' },
  { latitud: 10.4680, longitud: -66.5520, intensidad: 1.0, radio_km: 0.6, descripcion: 'Los Pinos - zona severamente afectada' },
  { latitud: 10.4750, longitud: -66.5420, intensidad: 0.5, radio_km: 0.4, descripcion: 'Sector Este - afectación leve' },
  { latitud: 10.4820, longitud: -66.5400, intensidad: 0.6, radio_km: 0.5, descripcion: 'Valle Verde - afectación moderada' },
  { latitud: 10.4650, longitud: -66.5450, intensidad: 0.8, radio_km: 0.7, descripcion: 'Zona sur - alta afectación' },
  { latitud: 10.4720, longitud: -66.5500, intensidad: 0.4, radio_km: 0.3, descripcion: 'Plaza Bolívar - daños leves' },
  { latitud: 10.4640, longitud: -66.5500, intensidad: 0.95, radio_km: 0.9, descripcion: 'El Rodeo - zona crítica' },
  { latitud: 10.4780, longitud: -66.5350, intensidad: 0.3, radio_km: 0.4, descripcion: 'Parque Central - zona de concentración' },
  { latitud: 10.4730, longitud: -66.5380, intensidad: 0.75, radio_km: 0.5, descripcion: 'Zona comercial - afectación considerable' },
]

export const INSUMOS_POR_CENTRO: Record<string, Insumo[]> = {
  '1': [
    { id: '1-1', nombre: 'Arroz blanco', categoria: 'alimentos', prioridad: 'critica', cantidad_necesaria: 500, cantidad_disponible: 120, unidad: 'kg' },
    { id: '1-2', nombre: 'Agua potable', categoria: 'agua', prioridad: 'critica', cantidad_necesaria: 1000, cantidad_disponible: 300, unidad: 'L' },
    { id: '1-3', nombre: 'Paracetamol', categoria: 'medicinas', prioridad: 'alta', cantidad_necesaria: 100, cantidad_disponible: 45, unidad: 'cajas' },
    { id: '1-4', nombre: 'Pañales infantiles', categoria: 'higiene', prioridad: 'alta', cantidad_necesaria: 200, cantidad_disponible: 80, unidad: 'paquetes' },
    { id: '1-5', nombre: 'Camisetas', categoria: 'ropa', prioridad: 'media', cantidad_necesaria: 150, cantidad_disponible: 90, unidad: 'prendas' },
  ],
  '2': [
    { id: '2-1', nombre: 'Harina de maíz', categoria: 'alimentos', prioridad: 'critica', cantidad_necesaria: 300, cantidad_disponible: 200, unidad: 'kg' },
    { id: '2-2', nombre: 'Botellas de agua', categoria: 'agua', prioridad: 'critica', cantidad_necesaria: 500, cantidad_disponible: 100, unidad: 'botellas' },
    { id: '2-3', nombre: 'Jabón antibacterial', categoria: 'higiene', prioridad: 'alta', cantidad_necesaria: 100, cantidad_disponible: 60, unidad: 'barras' },
    { id: '2-4', nombre: 'Vendajes', categoria: 'medicinas', prioridad: 'media', cantidad_necesaria: 200, cantidad_disponible: 120, unidad: 'rollos' },
  ],
  '3': [
    { id: '3-1', nombre: 'Aceite comestible', categoria: 'alimentos', prioridad: 'alta', cantidad_necesaria: 200, cantidad_disponible: 50, unidad: 'L' },
    { id: '3-2', nombre: 'Gasas estériles', categoria: 'medicinas', prioridad: 'critica', cantidad_necesaria: 500, cantidad_disponible: 100, unidad: 'paquetes' },
    { id: '3-3', nombre: 'Toallas de mano', categoria: 'higiene', prioridad: 'media', cantidad_necesaria: 100, cantidad_disponible: 40, unidad: 'piezas' },
  ],
  '4': [
    { id: '4-1', nombre: 'Atún enlatado', categoria: 'alimentos', prioridad: 'media', cantidad_necesaria: 150, cantidad_disponible: 70, unidad: 'latas' },
    { id: '4-2', nombre: 'Ibuprofeno', categoria: 'medicinas', prioridad: 'alta', cantidad_necesaria: 200, cantidad_disponible: 80, unidad: 'cajas' },
    { id: '4-3', nombre: 'Pantalones', categoria: 'ropa', prioridad: 'baja', cantidad_necesaria: 100, cantidad_disponible: 30, unidad: 'prendas' },
  ],
  '6': [
    { id: '6-1', nombre: 'Colchonetas', categoria: 'ropa', prioridad: 'critica', cantidad_necesaria: 150, cantidad_disponible: 40, unidad: 'unidades' },
    { id: '6-2', nombre: 'Sábanas', categoria: 'ropa', prioridad: 'alta', cantidad_necesaria: 200, cantidad_disponible: 60, unidad: 'juegos' },
    { id: '6-3', nombre: 'Agua embotellada', categoria: 'agua', prioridad: 'critica', cantidad_necesaria: 800, cantidad_disponible: 200, unidad: 'L' },
  ],
}

export const ESTADISTICAS = {
  centros_activos: 3,
  centros_parciales: 1,
  centros_inactivos: 0,
  donaciones_totales: 1100,
  beneficiarios_totales: 1450,
  capacidad_total: 1400,
}
