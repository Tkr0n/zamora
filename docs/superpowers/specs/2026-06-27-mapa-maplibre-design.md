# Nuevo Mapa Interactivo - Cambio a MapLibre GL

**Fecha**: 2026-06-27
**Estado**: Diseño aprobado

## Resumen

Reemplazar el mapa Leaflet actual por MapLibre GL JS (WebGL, gratuito, sin API key) para lograr un mapa más fluido y navegable que soporte: mapa de calor de zonas afectadas, 7 tipos de puntos de interés con marcadores de colores, y geolocalización automática + botón manual.

## Stack

- `maplibre-gl` — motor WebGL tiles vectoriales
- `react-map-gl` v8 — wrapper React para MapLibre GL
- Tiles gratuitos: OpenFreeMap (`https://tiles.openfreemap.org/planet`)
- Eliminar: `leaflet`, `react-leaflet`

## Estructura de archivos

```
components/
├── interactive-map.tsx           ← REWRITE: mapa principal con capas
├── map/
│   ├── heatmap-layer.tsx          ← NEW: capa de calor nativa
│   ├── poi-markers.tsx            ← NEW: marcadores por tipo POI
│   ├── legend.tsx                 ← NEW: leyenda de tipos
│   └── geolocate-control.tsx      ← NEW: botón geolocalización
lib/
├── mock-data.ts                   ← UPDATE: nuevos tipos POI + zonas afectadas
app/
├── page.tsx                       ← UPDATE: usar nuevo InteractiveMap
├── admin/map/page.tsx             ← UPDATE: usar nuevo InteractiveMap
```

## Modelo de datos

### Tipos de POI (7)

| Tipo | Color | Ícono |
|------|-------|-------|
| `centro_acopio` | Verde `#22c55e` | 📦 |
| `centro_medico` | Rojo `#ef4444` | 🏥 |
| `institucion` | Azul `#3b82f6` | 🏛️ |
| `albergue` | Naranja `#f97316` | 🏠 |
| `zona_segura` | Cian `#06b6d4` | 🛡️ |
| `punto_agua` | Aguamarina `#14b8a6` | 💧 |
| `punto_distribucion` | Púrpura `#a855f7` | 🚚 |

### Zonas afectadas (heatmap)

```ts
interface ZonaAfectada {
  latitud: number
  longitud: number
  intensidad: number       // 0.0 - 1.0
  radio_km: number
  descripcion?: string     // futuro: reporte ciudadano
  reportado_por?: string
  fecha_reporte?: string
}
```

## Comportamiento

1. **Carga inicial**: intenta geolocalizar → centra en usuario (zoom 14). Si falla → centra en Guatire (zoom 13).
2. **Botón "Mi ubicación"**: flotante siempre visible, esquina superior derecha.
3. **Capas**: tiles base → heatmap (debajo) → marcadores POI (encima).
4. **Clic en POI**: sidebar lateral con pestañas Info / Insumos (si es centro_acopio).
5. **Leyenda**: flotante en esquina inferior izquierda con los 7 tipos.
