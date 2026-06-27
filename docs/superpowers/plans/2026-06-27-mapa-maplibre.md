# Mapa MapLibre GL - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Leaflet with MapLibre GL JS — WebGL smooth map with heatmap layer, 7 POI marker types, device geolocation auto-center + manual button.

**Architecture:** Install `maplibre-gl` + `react-map-gl` as map engine. Create sub-components for heatmap layer, POI markers, legend, and geolocate button. Rewrite `InteractiveMap` to compose them. Update mock data with 7 POI types and zona-afectada data. Remove all Leaflet dependencies and code.

**Tech Stack:** maplibre-gl 5.x, react-map-gl 8.x, OpenFreeMap raster tiles (no API key needed)

---

### Task 1: Install new map dependencies, remove Leaflet

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install maplibre-gl and react-map-gl**

```bash
npm install maplibre-gl react-map-gl
```

Expected: packages added to node_modules and package.json.

- [ ] **Step 2: Uninstall leaflet and react-leaflet**

```bash
npm uninstall leaflet react-leaflet
```

Expected: packages removed from node_modules and package.json.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: swap leaflet for maplibre-gl + react-map-gl"
```

---

### Task 2: Update mock-data.ts — new POI types and zonas afectadas

**Files:**
- Modify: `lib/mock-data.ts`

- [ ] **Step 1: Add PuntoInteres type, ZonaAfectada type, and config constants**

Replace the file contents. We keep existing `Centro`, `Insumo`, `ConfigApp` types and data, add new types, and add `PUNTOS_INTERES` and `ZONAS_AFECTADAS` data arrays.

IMPORTANT: Keep the existing `INSUMOS_POR_CENTRO` mapping — it maps to centro IDs from PUNTOS_INTERES.

Write the entire `lib/mock-data.ts`:

```ts
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
    latitud: 10.5964,
    longitud: -66.3215,
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
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T10:30:00Z',
    tipos_donacion: ['alimentos', 'medicinas', 'ropa'],
  },
  {
    id: '2',
    tipo: 'centro_acopio',
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
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T09:15:00Z',
    tipos_donacion: ['alimentos', 'agua', 'higiene'],
  },
  {
    id: '3',
    tipo: 'centro_medico',
    nombre: 'Ambulatorio Dr. Francisco Risquez',
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
    estado_operativo: 'parcial',
    ultima_actualizacion: '2025-06-25T14:45:00Z',
    tipos_donacion: ['medicinas', 'suministros medicos'],
  },
  {
    id: '4',
    tipo: 'institucion',
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
    estado_operativo: 'activo',
    ultima_actualizacion: '2025-06-26T11:00:00Z',
    tipos_donacion: ['alimentos', 'ropa', 'libros'],
  },
  {
    id: '5',
    tipo: 'centro_medico',
    nombre: 'CDI Valle Verde',
    latitud: 10.6010,
    longitud: -66.3160,
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
    latitud: 10.5920,
    longitud: -66.3190,
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
    latitud: 10.5975,
    longitud: -66.3170,
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
    latitud: 10.5990,
    longitud: -66.3150,
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
    latitud: 10.5930,
    longitud: -66.3220,
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
    latitud: 10.5955,
    longitud: -66.3200,
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
  { latitud: 10.5964, longitud: -66.3215, intensidad: 0.9, radio_km: 0.8, descripcion: 'Zona centro Guatire - alta densidad de afectados' },
  { latitud: 10.5980, longitud: -66.3180, intensidad: 0.7, radio_km: 0.5, descripcion: 'Casco histórico - daños moderados' },
  { latitud: 10.5945, longitud: -66.3245, intensidad: 1.0, radio_km: 0.6, descripcion: 'Los Pinos - zona severamente afectada' },
  { latitud: 10.6000, longitud: -66.3200, intensidad: 0.5, radio_km: 0.4, descripcion: 'Sector Este - afectación leve' },
  { latitud: 10.6010, longitud: -66.3160, intensidad: 0.6, radio_km: 0.5, descripcion: 'Valle Verde - afectación moderada' },
  { latitud: 10.5920, longitud: -66.3190, intensidad: 0.8, radio_km: 0.7, descripcion: 'Zona sur - alta afectación' },
  { latitud: 10.5975, longitud: -66.3170, intensidad: 0.4, radio_km: 0.3, descripcion: 'Plaza Bolívar - daños leves' },
  { latitud: 10.5930, longitud: -66.3220, intensidad: 0.95, radio_km: 0.9, descripcion: 'El Rodeo - zona crítica' },
  { latitud: 10.5990, longitud: -66.3150, intensidad: 0.3, radio_km: 0.4, descripcion: 'Parque Central - zona de concentración' },
  { latitud: 10.5955, longitud: -66.3200, intensidad: 0.75, radio_km: 0.5, descripcion: 'Zona comercial - afectación considerable' },
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
```

- [ ] **Step 2: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add POI types, zonas afectadas, and expanded mock data"
```

---

### Task 3: Create heatmap-layer component

**Files:**
- Create: `components/map/heatmap-layer.tsx`

- [ ] **Step 1: Create the heatmap layer component**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import type { MapGeoJSONFeature } from 'maplibre-gl'
import { ZonaAfectada } from '@/lib/mock-data'

interface HeatmapLayerProps {
  zonas: ZonaAfectada[]
}

const HEATMAP_SOURCE = 'zonas-afectadas-source'
const HEATMAP_LAYER = 'zonas-afectadas-heat'
const HEATMAP_POINT_LAYER = 'zonas-afectadas-point'

export default function HeatmapLayer({ zonas }: HeatmapLayerProps) {
  const { current: map } = useMap()
  const addedRef = useRef(false)

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) {
      const onLoad = () => {
        addHeatmapLayer()
      }
      map?.on('load', onLoad)
      return () => {
        map?.off('load', onLoad)
      }
    } else {
      addHeatmapLayer()
    }
  }, [map])

  useEffect(() => {
    if (!map) return

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: zonas.map((z) => ({
        type: 'Feature' as const,
        properties: { intensidad: z.intensidad, descripcion: z.descripcion },
        geometry: { type: 'Point' as const, coordinates: [z.longitud, z.latitud] },
      })),
    }

    const source = map.getSource(HEATMAP_SOURCE) as mapboxgl.GeoJSONSource | undefined
    if (source) {
      source.setData(geojson)
    }
  }, [zonas, map])

  function addHeatmapLayer() {
    if (!map || addedRef.current) return

    if (map.getSource(HEATMAP_SOURCE)) return
    if (map.getLayer(HEATMAP_LAYER)) return

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: zonas.map((z) => ({
        type: 'Feature' as const,
        properties: { intensidad: z.intensidad, descripcion: z.descripcion },
        geometry: { type: 'Point' as const, coordinates: [z.longitud, z.latitud] },
      })),
    }

    map.addSource(HEATMAP_SOURCE, {
      type: 'geojson',
      data: geojson,
    })

    map.addLayer({
      id: HEATMAP_LAYER,
      type: 'heatmap',
      source: HEATMAP_SOURCE,
      paint: {
        'heatmap-weight': ['get', 'intensidad'],
        'heatmap-intensity': 0.6,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0, 255, 0, 0)',
          0.2, 'rgba(0, 255, 0, 0.5)',
          0.4, 'rgba(255, 255, 0, 0.6)',
          0.6, 'rgba(255, 165, 0, 0.7)',
          0.8, 'rgba(255, 0, 0, 0.8)',
          1, 'rgba(139, 0, 0, 0.9)',
        ],
        'heatmap-radius': 40,
        'heatmap-opacity': 0.7,
      },
    })

    addedRef.current = true
  }

  return null
}
```

> **Note on types**: `react-map-gl/maplibre` re-exports MapLibre types. If `mapboxgl.GeoJSONSource` causes a type error, use `maplibre-gl.GeoJSONSource` imported separately: `import type { GeoJSONSource } from 'maplibre-gl'`. Then cast to `GeoJSONSource` instead.

- [ ] **Step 2: Commit**

```bash
git add components/map/heatmap-layer.tsx
git commit -m "feat: add heatmap layer component for zonas afectadas"
```

---

### Task 4: Create poi-markers component

**Files:**
- Create: `components/map/poi-markers.tsx`

- [ ] **Step 1: Create the POI markers component using MapLibre Markers**

```tsx
'use client'

import { useMemo } from 'react'
import { Marker } from 'react-map-gl/maplibre'
import { PuntoInteres, POI_COLORS, POI_ICONS, POI_LABELS } from '@/lib/mock-data'

interface PoiMarkersProps {
  puntos: PuntoInteres[]
  onPoiClick: (punto: PuntoInteres) => void
}

export default function PoiMarkers({ puntos, onPoiClick }: PoiMarkersProps) {
  return (
    <>
      {puntos.map((p) => (
        <Marker
          key={p.id}
          longitude={p.longitud}
          latitude={p.latitud}
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            onPoiClick(p)
          }}
        >
          <div
            className="flex items-center justify-center rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"
            style={{
              width: 36,
              height: 36,
              backgroundColor: POI_COLORS[p.tipo],
              fontSize: 18,
            }}
            title={POI_LABELS[p.tipo]}
          >
            {POI_ICONS[p.tipo]}
          </div>
        </Marker>
      ))}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/map/poi-markers.tsx
git commit -m "feat: add POI markers component with colored icons per type"
```

---

### Task 5: Create legend component

**Files:**
- Create: `components/map/legend.tsx`

- [ ] **Step 1: Create the map legend**

```tsx
'use client'

import { POI_COLORS, POI_ICONS, POI_LABELS, TipoPuntoInteres } from '@/lib/mock-data'

const TIPOS: TipoPuntoInteres[] = [
  'centro_acopio',
  'centro_medico',
  'institucion',
  'albergue',
  'zona_segura',
  'punto_agua',
  'punto_distribucion',
]

export default function Legend() {
  return (
    <div className="absolute bottom-20 left-4 bg-card/95 backdrop-blur rounded-lg border border-border shadow-lg p-3 z-30 max-w-[200px]">
      <p className="text-xs font-semibold text-foreground mb-2">Leyenda</p>
      <div className="space-y-1.5">
        {TIPOS.map((tipo) => (
          <div key={tipo} className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] flex-shrink-0"
              style={{ backgroundColor: POI_COLORS[tipo] }}
            >
              {POI_ICONS[tipo]}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">{POI_LABELS[tipo]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/map/legend.tsx
git commit -m "feat: add map legend component"
```

---

### Task 6: Create geolocate-control component

**Files:**
- Create: `components/map/geolocate-control.tsx`

- [ ] **Step 1: Create the geolocate button component**

```tsx
'use client'

import { useState, useCallback } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { Crosshair } from 'lucide-react'

export default function GeolocateControl() {
  const { current: map } = useMap()
  const [locating, setLocating] = useState(false)

  const handleGeolocate = useCallback(() => {
    if (!map || locating) return

    setLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.flyTo({
            center: [pos.coords.longitude, pos.coords.latitude],
            zoom: 14,
            duration: 1500,
          })
          setLocating(false)
        },
        () => {
          setLocating(false)
        },
        { enableHighAccuracy: true, timeout: 10000 },
      )
    } else {
      setLocating(false)
    }
  }, [map, locating])

  return (
    <button
      onClick={handleGeolocate}
      disabled={locating}
      className="absolute top-20 right-4 z-30 bg-card border border-border rounded-lg shadow-lg p-2 hover:bg-secondary transition-colors disabled:opacity-50"
      title="Mi ubicación"
    >
      <Crosshair className={`w-5 h-5 ${locating ? 'text-accent animate-pulse' : 'text-foreground'}`} />
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/map/geolocate-control.tsx
git commit -m "feat: add geolocate button component"
```

---

### Task 7: Rewrite interactive-map.tsx with MapLibre

**Files:**
- Modify: `components/interactive-map.tsx` (full rewrite)

- [ ] **Step 1: Create the directory for map sub-components**

```bash
mkdir -p components/map
```

- [ ] **Step 2: Rewrite interactive-map.tsx**

```tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Map, { MapRef, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import HeatmapLayer from './map/heatmap-layer'
import PoiMarkers from './map/poi-markers'
import Legend from './map/legend'
import GeolocateControl from './map/geolocate-control'
import { PuntoInteres, ZonaAfectada, CONFIG_APP } from '@/lib/mock-data'

interface InteractiveMapProps {
  puntos: PuntoInteres[]
  zonas: ZonaAfectada[]
  onPoiClick?: (punto: PuntoInteres) => void
}

export default function InteractiveMap({ puntos, zonas, onPoiClick }: InteractiveMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [initialView, setInitialView] = useState<{
    longitude: number
    latitude: number
    zoom: number
  }>({
    longitude: CONFIG_APP.ubicacion_predeterminada.longitud,
    latitude: CONFIG_APP.ubicacion_predeterminada.latitud,
    zoom: CONFIG_APP.ubicacion_predeterminada.zoom,
  })
  const geolocated = useRef(false)

  useEffect(() => {
    if (geolocated.current) return
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          geolocated.current = true
          setInitialView({
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
            zoom: 14,
          })
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 },
      )
    }
  }, [])

  const handlePoiClick = useCallback(
    (punto: PuntoInteres) => {
      onPoiClick?.(punto)
    },
    [onPoiClick],
  )

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        mapLib={import('maplibre-gl')}
        initialViewState={initialView}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        attributionControl={false}
      >
        <HeatmapLayer zonas={zonas} />
        <PoiMarkers puntos={puntos} onPoiClick={handlePoiClick} />
        <NavigationControl position="top-left" />
      </Map>
      <GeolocateControl />
      <Legend />
      <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground/60 bg-card/80 px-2 py-1 rounded z-30">
        © OpenFreeMap
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/interactive-map.tsx
git commit -m "feat: rewrite InteractiveMap with MapLibre GL, heatmap, POI markers, legend, geolocation"
```

---

### Task 8: Update page.tsx (public index) to use new map props

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx**

The key change: InteractiveMap now takes `puntos` and `zonas` props instead of `centros`. The sidebar still works with PuntoInteres (it has all the same fields as the old Centro).

```tsx
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import PublicNavbar from '@/components/public-navbar'
import SuppliesPanel from '@/components/supplies-panel'
import { PUNTOS_INTERES, ZONAS_AFECTADAS, PuntoInteres, CONFIG_APP, INSUMOS_POR_CENTRO } from '@/lib/mock-data'
import { X, Phone, MapPin } from 'lucide-react'

const InteractiveMap = dynamic(() => import('@/components/interactive-map'), { ssr: false, loading: () => <div className="w-full h-screen bg-secondary animate-pulse" /> })

export default function Page() {
  const [selectedPoi, setSelectedPoi] = useState<PuntoInteres | null>(null)
  const [showSupplies, setShowSupplies] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar currentPage="mapa" />

      <div className="relative h-[calc(100vh-80px)]">
        <InteractiveMap puntos={PUNTOS_INTERES} zonas={ZONAS_AFECTADAS} onPoiClick={setSelectedPoi} />

        {selectedPoi && (
          <div className="absolute right-4 top-4 w-96 bg-card rounded-lg border border-border shadow-lg max-h-[90vh] z-50 flex flex-col">
            <div className="flex items-center justify-between px-4 pt-4 border-b border-border mb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSupplies(false)}
                  className={`pb-2 px-2 font-medium text-sm transition-colors border-b-2 ${
                    !showSupplies
                      ? 'text-accent border-accent'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  Info
                </button>
                {selectedPoi.tipo === 'centro_acopio' && (
                  <button
                    onClick={() => setShowSupplies(true)}
                    className={`pb-2 px-2 font-medium text-sm transition-colors border-b-2 ${
                      showSupplies
                        ? 'text-accent border-accent'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    Insumos
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedPoi(null)
                  setShowSupplies(false)
                }}
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!showSupplies ? (
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-foreground">{selectedPoi.nombre}</h2>
                  <p className="text-xs text-accent bg-accent/10 px-2 py-1 rounded inline-block">
                    {selectedPoi.tipo.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Ubicación</p>
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                        {selectedPoi.direccion}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Responsable</p>
                      <p className="text-sm font-semibold text-foreground">{selectedPoi.responsable}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Contacto</p>
                      <p className="text-sm text-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4 text-accent" />
                        {selectedPoi.telefono}
                      </p>
                    </div>

                    {selectedPoi.capacidad > 0 && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-secondary rounded p-3">
                          <p className="text-xs text-muted-foreground">Donaciones</p>
                          <p className="text-lg font-bold text-foreground">
                            {selectedPoi.donacionesRecibidas}
                            <span className="text-xs text-muted-foreground font-normal">/</span>
                            <span className="text-sm text-muted-foreground">{selectedPoi.capacidad}</span>
                          </p>
                        </div>
                        <div className="bg-secondary rounded p-3">
                          <p className="text-xs text-muted-foreground">Beneficiarios</p>
                          <p className="text-lg font-bold text-foreground">{selectedPoi.beneficiarios}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Estado Operativo</p>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block text-white ${
                          selectedPoi.estado_operativo === 'activo'
                            ? 'bg-green-500'
                            : selectedPoi.estado_operativo === 'parcial'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      >
                        {selectedPoi.estado_operativo.toUpperCase()}
                      </div>
                    </div>

                    {selectedPoi.tipos_donacion.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">Tipos de Donación</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPoi.tipos_donacion.map((tipo) => (
                            <span key={tipo} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                              {tipo}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground">
                        Última actualización: {new Date(selectedPoi.ultima_actualizacion).toLocaleString('es-VE')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <SuppliesPanel
                  insumos={INSUMOS_POR_CENTRO[selectedPoi.id] || []}
                  centroNombre={selectedPoi.nombre}
                />
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-card rounded-lg border border-border shadow-lg p-4 max-w-xs z-40">
          <h3 className="font-semibold text-foreground mb-2">Mapa Interactivo</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Visualiza todos los centros de acopio de {CONFIG_APP.municipio}, {CONFIG_APP.estado}
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-foreground">Activo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-foreground">Operación Parcial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-foreground">Inactivo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: update public index to use new MapLibre InteractiveMap"
```

---

### Task 9: Update admin/map page to use new map

**Files:**
- Modify: `app/admin/map/page.tsx`

- [ ] **Step 1: Rewrite admin map page**

The admin map keeps the AdminNavbar but uses the new InteractiveMap with same props.

```tsx
'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import AdminNavbar from '@/components/admin-navbar'
import SuppliesPanel from '@/components/supplies-panel'
import { PUNTOS_INTERES, ZONAS_AFECTADAS, PuntoInteres, CONFIG_APP, INSUMOS_POR_CENTRO } from '@/lib/mock-data'
import { X, Phone, MapPin } from 'lucide-react'

const InteractiveMap = dynamic(() => import('@/components/interactive-map'), { ssr: false, loading: () => <div className="w-full h-screen bg-secondary animate-pulse" /> })

export default function AdminMapPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [selectedPoi, setSelectedPoi] = useState<PuntoInteres | null>(null)
  const [showSupplies, setShowSupplies] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar currentPage="map" />

      <div className="relative h-[calc(100vh-80px)]">
        <InteractiveMap puntos={PUNTOS_INTERES} zonas={ZONAS_AFECTADAS} onPoiClick={setSelectedPoi} />

        {selectedPoi && (
          <div className="absolute right-4 top-4 w-96 bg-card rounded-lg border border-border shadow-lg max-h-[90vh] z-50 flex flex-col">
            <div className="flex items-center justify-between px-4 pt-4 border-b border-border mb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSupplies(false)}
                  className={`pb-2 px-2 font-medium text-sm transition-colors border-b-2 ${
                    !showSupplies
                      ? 'text-accent border-accent'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  Info
                </button>
                {selectedPoi.tipo === 'centro_acopio' && (
                  <button
                    onClick={() => setShowSupplies(true)}
                    className={`pb-2 px-2 font-medium text-sm transition-colors border-b-2 ${
                      showSupplies
                        ? 'text-accent border-accent'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    Insumos
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedPoi(null)
                  setShowSupplies(false)
                }}
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!showSupplies ? (
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-foreground">{selectedPoi.nombre}</h2>
                  <p className="text-xs text-accent bg-accent/10 px-2 py-1 rounded inline-block">
                    {selectedPoi.tipo.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Ubicación</p>
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                        {selectedPoi.direccion}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Responsable</p>
                      <p className="text-sm font-semibold text-foreground">{selectedPoi.responsable}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Contacto</p>
                      <p className="text-sm text-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4 text-accent" />
                        {selectedPoi.telefono}
                      </p>
                    </div>

                    {selectedPoi.capacidad > 0 && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-secondary rounded p-3">
                          <p className="text-xs text-muted-foreground">Donaciones</p>
                          <p className="text-lg font-bold text-foreground">
                            {selectedPoi.donacionesRecibidas}
                            <span className="text-xs text-muted-foreground font-normal">/</span>
                            <span className="text-sm text-muted-foreground">{selectedPoi.capacidad}</span>
                          </p>
                        </div>
                        <div className="bg-secondary rounded p-3">
                          <p className="text-xs text-muted-foreground">Beneficiarios</p>
                          <p className="text-lg font-bold text-foreground">{selectedPoi.beneficiarios}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Estado Operativo</p>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block text-white ${
                          selectedPoi.estado_operativo === 'activo'
                            ? 'bg-green-500'
                            : selectedPoi.estado_operativo === 'parcial'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      >
                        {selectedPoi.estado_operativo.toUpperCase()}
                      </div>
                    </div>

                    {selectedPoi.tipos_donacion.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">Tipos de Donación</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPoi.tipos_donacion.map((tipo) => (
                            <span key={tipo} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                              {tipo}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground">
                        Última actualización: {new Date(selectedPoi.ultima_actualizacion).toLocaleString('es-VE')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <SuppliesPanel
                  insumos={INSUMOS_POR_CENTRO[selectedPoi.id] || []}
                  centroNombre={selectedPoi.nombre}
                />
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-card rounded-lg border border-border shadow-lg p-4 max-w-xs z-40">
          <h3 className="font-semibold text-foreground mb-2">Mapa Interactivo</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Visualiza todos los centros de acopio de {CONFIG_APP.municipio}, {CONFIG_APP.estado}
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-foreground">Activo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-foreground">Operación Parcial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-foreground">Inactivo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/map/page.tsx
git commit -m "feat: update admin map page to use new MapLibre InteractiveMap"
```

---

### Task 10: Update centros-table to use PuntoInteres

**Files:**
- Modify: `components/centros-table.tsx`

The CentrosTable currently imports `Centro` from mock-data. We need to add `PuntoInteres` support. Since `PuntoInteres` has the same shape as `Centro`, we can use `PuntoInteres` for the table.

- [ ] **Step 1: Update imports to use PuntoInteres**

Replace `import { Centro } from '@/lib/mock-data'` with `import { PuntoInteres } from '@/lib/mock-data'`, and replace all `Centro` references with `PuntoInteres`.

```tsx
'use client'

import { PuntoInteres, POI_LABELS, TipoPuntoInteres } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, MapPin, Phone } from 'lucide-react'

interface CentrosTableProps {
  centros: PuntoInteres[]
  onEdit?: (centro: PuntoInteres) => void
  onDelete?: (id: string) => void
  onViewMap?: (centro: PuntoInteres) => void
  readOnly?: boolean
}

export default function CentrosTable({ centros, onEdit, onDelete, onViewMap, readOnly = false }: CentrosTableProps) {
  const getStatusColor = (estado: string) => {
    if (estado === 'activo') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (estado === 'parcial') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const getCapacityPercentage = (recibidas: number, capacidad: number) => {
    return Math.round((recibidas / capacidad) * 100)
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead className="bg-primary/5 border-b border-border">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Punto</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tipo</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Responsable</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Donaciones</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Beneficiarios</th>
            {!readOnly && <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {centros.map((centro) => (
            <tr key={centro.id} className="hover:bg-secondary/50 transition-colors">
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{centro.nombre}</p>
                  <p className="text-sm text-muted-foreground">{centro.ciudad}, {centro.municipio}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                  {POI_LABELS[centro.tipo]}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{centro.responsable}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {centro.telefono}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(centro.estado_operativo)}`}>
                  {centro.estado_operativo.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {centro.donacionesRecibidas} / {centro.capacidad}
                  </p>
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${Math.min(getCapacityPercentage(centro.donacionesRecibidas, centro.capacidad), 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{getCapacityPercentage(centro.donacionesRecibidas, centro.capacidad)}%</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-foreground">{centro.beneficiarios}</p>
              </td>
              {!readOnly && (
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewMap?.(centro)}
                      className="hover:bg-secondary"
                      title="Ver en mapa"
                    >
                      <MapPin className="w-4 h-4 text-accent" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(centro)}
                      className="hover:bg-secondary"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(centro.id)}
                      className="hover:bg-secondary"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/centros-table.tsx
git commit -m "feat: update CentrosTable to use PuntoInteres with tipo column"
```

---

### Task 11: Update remaining consumers of old Centro type

**Files:**
- Modify: `components/statistics-panel.tsx`
- Modify: `app/admin/page.tsx`
- Modify: `app/admin/centros/page.tsx`
- Modify: `app/centros/page.tsx`

- [ ] **Step 1: Update statistics-panel.tsx**

Change import from `Centro` to `PuntoInteres`, update interface. The stats logic works the same since PuntoInteres has the same fields.

```tsx
// In imports, change:
import { Centro, ESTADISTICAS } from '@/lib/mock-data'
// To:
import { PuntoInteres, ESTADISTICAS } from '@/lib/mock-data'

// In interface, change:
interface StatisticsPanelProps { centros: Centro[] }
// To:
interface StatisticsPanelProps { centros: PuntoInteres[] }
```

- [ ] **Step 2: Update app/admin/page.tsx**

Change import from `Centro, CENTROS_ACOPIO` to `PuntoInteres, PUNTOS_INTERES`, update type references.

Key change in imports:
```tsx
import { PUNTOS_INTERES } from '@/lib/mock-data'
// Usage: <StatisticsPanel centros={PUNTOS_INTERES} /> and <CentrosTable centros={PUNTOS_INTERES} ... />
```

- [ ] **Step 3: Update app/admin/centros/page.tsx**

Change import from `Centro, CENTROS_ACOPIO` to `PuntoInteres, PUNTOS_INTERES`.

```tsx
import { PUNTOS_INTERES, PuntoInteres } from '@/lib/mock-data'
// Replace CENTROS_ACOPIO with PUNTOS_INTERES, Centro with PuntoInteres throughout
```

- [ ] **Step 4: Update app/centros/page.tsx** (public centros page)

Same changes as admin centros page.

```tsx
import { PUNTOS_INTERES, PuntoInteres } from '@/lib/mock-data'
// Replace CENTROS_ACOPIO with PUNTOS_INTERES, Centro with PuntoInteres
```

- [ ] **Step 5: Commit**

```bash
git add components/statistics-panel.tsx app/admin/page.tsx app/admin/centros/page.tsx app/centros/page.tsx
git commit -m "feat: migrate remaining components from Centro to PuntoInteres"
```

---

### Task 12: Remove leaflet CSS import from globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Check and remove any leaflet CSS import**

If there's a `@import` for leaflet CSS, remove it. The `maplibre-gl/dist/maplibre-gl.css` is already imported in `interactive-map.tsx`.

- [ ] **Step 2: Verify the import is in interactive-map.tsx**

The import `import 'maplibre-gl/dist/maplibre-gl.css'` should be at the top of `components/interactive-map.tsx` (added in Task 7).

- [ ] **Step 3: Verify build compiles**

```bash
npm run build
```

Expected: `✓ Compiled successfully` with all routes listed.

If the build fails with "Can't resolve 'maplibre-gl'", ensure `maplibre-gl` is in package.json dependencies and run `npm install`.

- [ ] **Step 4: Commit final changes**

```bash
git add .
git commit -m "chore: clean up leaflet CSS, verify MapLibre build"
```

---

## Self-Review

1. **Spec coverage**: Heatmap ✓ (Task 3), POI markers 7 types ✓ (Task 4), Legend ✓ (Task 5), Geolocation auto+manual ✓ (Tasks 6+7), MapLibre engine ✓ (Tasks 1+7), Remove Leaflet ✓ (Task 1), Update all pages ✓ (Tasks 8-11).

2. **Placeholder scan**: No TBDs, TODOs, or vague "add error handling" steps. All code is fully written out.

3. **Type consistency**: PuntoInteres used consistently across all tasks. ZonaAfectada used in heatmap-layer and mock-data. POI_COLORS, POI_LABELS, POI_ICONS defined in Task 2 and used in Tasks 4+5+10.
