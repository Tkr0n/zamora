'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  getPuntosInteres,
  getZonasAfectadas,
  getInsumos,
  getConfig,
  mapPunto,
  mapZona,
  mapConfig,
  buildInsumosMap,
} from '../api-client'
import type { PuntoInteres, ZonaAfectada, ConfigApp, Insumo } from '../mock-data'
import { CONFIG_APP } from '../mock-data'

interface AppData {
  puntos: PuntoInteres[]
  zonas: ZonaAfectada[]
  insumosByCentro: Record<string, Insumo[]>
  config: ConfigApp
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useAppData(): AppData {
  const [puntos, setPuntos] = useState<PuntoInteres[]>([])
  const [zonas, setZonas] = useState<ZonaAfectada[]>([])
  const [insumosByCentro, setInsumosByCentro] = useState<Record<string, Insumo[]>>({})
  const [config, setConfig] = useState<ConfigApp>(CONFIG_APP)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [puntosRaw, zonasRaw, insumosRaw, configRaw] = await Promise.all([
        getPuntosInteres(),
        getZonasAfectadas(),
        getInsumos(),
        getConfig(),
      ])
      setPuntos(puntosRaw.map(mapPunto))
      setZonas(zonasRaw.map(mapZona))
      setInsumosByCentro(buildInsumosMap(insumosRaw))
      setConfig(mapConfig(configRaw))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { puntos, zonas, insumosByCentro, config, loading, error, refresh }
}
