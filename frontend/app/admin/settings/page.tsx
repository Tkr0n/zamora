'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminNavbar from '@/components/admin-navbar'
import { LoadingState, ErrorState } from '@/components/loading-state'
import { useAppData } from '@/lib/hooks/use-app-data'
import { updateConfig } from '@/lib/api-client'
import { CONFIG_APP } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, MapPin, Globe, Map } from 'lucide-react'

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { config: apiConfig, loading, error, refresh } = useAppData()
  const [config, setConfig] = useState(CONFIG_APP)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  useEffect(() => {
    if (!loading && apiConfig) setConfig(apiConfig)
  }, [apiConfig, loading])

  const handleSaveConfig = async () => {
    setSaving(true)
    setSaveError('')
    try {
      await updateConfig({
        latitudDefault: config.ubicacion_predeterminada.latitud,
        longitudDefault: config.ubicacion_predeterminada.longitud,
        zoomDefault: config.ubicacion_predeterminada.zoom,
        municipio: config.municipio,
        estado: config.estado,
        pais: config.pais,
      })
      setSaved(true)
      await refresh()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar currentPage="settings" />
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar currentPage="settings" />
        <ErrorState message={error} onRetry={refresh} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar currentPage="settings" />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground">Personaliza los parámetros de la aplicación</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold text-foreground">Ubicación Predeterminada</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Latitud</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={config.ubicacion_predeterminada.latitud}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ubicacion_predeterminada: {
                        ...config.ubicacion_predeterminada,
                        latitud: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Longitud</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={config.ubicacion_predeterminada.longitud}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ubicacion_predeterminada: {
                        ...config.ubicacion_predeterminada,
                        longitud: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Zoom Predeterminado</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={config.ubicacion_predeterminada.zoom}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ubicacion_predeterminada: {
                        ...config.ubicacion_predeterminada,
                        zoom: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold text-foreground">Información Regional</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">País</label>
                <Input value={config.pais} onChange={(e) => setConfig({ ...config, pais: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Estado</label>
                <Input value={config.estado} onChange={(e) => setConfig({ ...config, estado: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Municipio</label>
                <Input value={config.municipio} onChange={(e) => setConfig({ ...config, municipio: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg border border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <Map className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Ubicación Actual</h3>
              <p className="text-sm text-muted-foreground">
                Centro: <strong>{config.ubicacion_predeterminada.latitud}, {config.ubicacion_predeterminada.longitud}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Región: <strong>{config.municipio}, {config.estado}, {config.pais}</strong>
              </p>
            </div>
          </div>
        </div>

        {saveError && <p className="text-sm text-destructive">{saveError}</p>}

        <div className="flex gap-4">
          <Button onClick={handleSaveConfig} disabled={saving} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {saved ? 'Configuración Guardada' : saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button variant="outline" onClick={() => setConfig(apiConfig)}>
            Restaurar
          </Button>
        </div>
      </main>
    </div>
  )
}
