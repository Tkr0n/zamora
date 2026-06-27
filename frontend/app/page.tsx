'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import PublicNavbar from '@/components/public-navbar'
import SuppliesPanel from '@/components/supplies-panel'
import ReporteDialog from '@/components/reporte-dialog'
import { LoadingState, ErrorState } from '@/components/loading-state'
import { useAppData } from '@/lib/hooks/use-app-data'
import { PuntoInteres } from '@/lib/mock-data'
import { X, Phone, MapPin, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const InteractiveMap = dynamic(() => import('@/components/interactive-map'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-secondary animate-pulse" />,
})

export default function Page() {
  const { puntos, zonas, insumosByCentro, config, loading, error, refresh } = useAppData()
  const [selectedPoi, setSelectedPoi] = useState<PuntoInteres | null>(null)
  const [showSupplies, setShowSupplies] = useState(false)
  const [showReporte, setShowReporte] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNavbar currentPage="mapa" />
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNavbar currentPage="mapa" />
        <ErrorState message={error} onRetry={refresh} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar currentPage="mapa" />

      <div className="relative h-[calc(100vh-80px)]">
        <InteractiveMap
          puntos={puntos}
          zonas={zonas}
          config={config}
          onPoiClick={setSelectedPoi}
        />

        <Button
          onClick={() => setShowReporte(true)}
          className="absolute left-4 top-4 z-40 bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 shadow-lg"
        >
          <AlertTriangle className="w-4 h-4" />
          Reportar zona
        </Button>

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
                  insumos={insumosByCentro[selectedPoi.id] || []}
                  centroNombre={selectedPoi.nombre}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <ReporteDialog
        open={showReporte}
        onClose={() => setShowReporte(false)}
        onReported={refresh}
        latitud={config.ubicacion_predeterminada.latitud}
        longitud={config.ubicacion_predeterminada.longitud}
      />
    </div>
  )
}
