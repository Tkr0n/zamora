'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminNavbar from '@/components/admin-navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CONFIG_APP } from '@/lib/mock-data'
import { Settings, MapPin, Globe, Map } from 'lucide-react'

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [config, setConfig] = useState(CONFIG_APP)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleSaveConfig = () => {
    // In Phase 2, this will save to Supabase
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar currentPage="settings" />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground">Personaliza los parámetros de la aplicación</p>
          </div>
        </div>

        {/* Configuration Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Location Settings */}
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
                  className="bg-secondary text-foreground border-border"
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
                  className="bg-secondary text-foreground border-border"
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
                  className="bg-secondary text-foreground border-border"
                />
              </div>
            </div>
          </div>

          {/* Regional Information */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold text-foreground">Información Regional</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">País</label>
                <Input
                  type="text"
                  value={config.pais}
                  onChange={(e) => setConfig({ ...config, pais: e.target.value })}
                  className="bg-secondary text-foreground border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Estado</label>
                <Input
                  type="text"
                  value={config.estado}
                  onChange={(e) => setConfig({ ...config, estado: e.target.value })}
                  className="bg-secondary text-foreground border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Municipio</label>
                <Input
                  type="text"
                  value={config.municipio}
                  onChange={(e) => setConfig({ ...config, municipio: e.target.value })}
                  className="bg-secondary text-foreground border-border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
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
              <p className="text-xs text-muted-foreground mt-2">
                Estos parámetros se utilizan para centrar el mapa y filtrar centros por región.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleSaveConfig} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {saved ? 'Configuración Guardada' : 'Guardar Cambios'}
          </Button>
          <Button variant="outline" onClick={() => setConfig(CONFIG_APP)}>
            Restaurar Predeterminados
          </Button>
        </div>
      </main>
    </div>
  )
}
