'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import AdminNavbar from '@/components/admin-navbar'
import SuppliesPanel from '@/components/supplies-panel'
import { LoadingState, ErrorState } from '@/components/loading-state'
import { useAppData } from '@/lib/hooks/use-app-data'
import { PuntoInteres } from '@/lib/mock-data'
import { X, Phone, MapPin } from 'lucide-react'

const InteractiveMap = dynamic(() => import('@/components/interactive-map'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-secondary animate-pulse" />,
})

function AdminMapContent() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { puntos, zonas, insumosByCentro, config, loading, error, refresh } = useAppData()
  const [selectedPoi, setSelectedPoi] = useState<PuntoInteres | null>(null)
  const [showSupplies, setShowSupplies] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  useEffect(() => {
    const centroId = searchParams.get('centro')
    if (centroId && puntos.length > 0) {
      const found = puntos.find((p) => p.id === centroId)
      if (found) setSelectedPoi(found)
    }
  }, [searchParams, puntos])

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar currentPage="map" />
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar currentPage="map" />
        <ErrorState message={error} onRetry={refresh} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar currentPage="map" />

      <div className="relative h-[calc(100vh-80px)]">
        <InteractiveMap puntos={puntos} zonas={zonas} config={config} onPoiClick={setSelectedPoi} />

        {selectedPoi && (
          <div className="absolute right-4 top-4 w-96 bg-card rounded-lg border border-border shadow-lg max-h-[90vh] z-50 flex flex-col">
            <div className="flex items-center justify-between px-4 pt-4 border-b border-border mb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSupplies(false)}
                  className={`pb-2 px-2 font-medium text-sm transition-colors border-b-2 ${
                    !showSupplies ? 'text-accent border-accent' : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  Info
                </button>
                {selectedPoi.tipo === 'centro_acopio' && (
                  <button
                    onClick={() => setShowSupplies(true)}
                    className={`pb-2 px-2 font-medium text-sm transition-colors border-b-2 ${
                      showSupplies ? 'text-accent border-accent' : 'text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    Insumos
                  </button>
                )}
              </div>
              <button
                onClick={() => { setSelectedPoi(null); setShowSupplies(false) }}
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!showSupplies ? (
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-foreground">{selectedPoi.nombre}</h2>
                  <div className="border-t border-border pt-4 space-y-3">
                    <p className="text-sm flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-accent mt-0.5" />
                      {selectedPoi.direccion}
                    </p>
                    <p className="text-sm font-semibold">{selectedPoi.responsable}</p>
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-accent" />
                      {selectedPoi.telefono}
                    </p>
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
    </div>
  )
}

export default function AdminMapPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AdminMapContent />
    </Suspense>
  )
}
