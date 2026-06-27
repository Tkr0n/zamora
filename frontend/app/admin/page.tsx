'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminNavbar from '@/components/admin-navbar'
import StatisticsPanel from '@/components/statistics-panel'
import CentrosTable from '@/components/centros-table'
import CentroFormDialog from '@/components/centro-form-dialog'
import { LoadingState, ErrorState } from '@/components/loading-state'
import { useAppData } from '@/lib/hooks/use-app-data'
import { useState } from 'react'
import { PuntoInteres } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Plus, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { puntos, insumosByCentro, config, loading, error, refresh } = useAppData()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar currentPage="dashboard" />
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar currentPage="dashboard" />
        <ErrorState message={error} onRetry={refresh} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar currentPage="dashboard" />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Panel de control — {config.municipio}, {config.estado}</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Centro
          </Button>
        </div>

        <StatisticsPanel centros={puntos} />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Centros de Acopio</h2>
          <CentrosTable centros={puntos} insumosByCentro={insumosByCentro} readOnly />
        </div>
      </main>

      <CentroFormDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        onSaved={refresh}
        defaultConfig={config}
      />
    </div>
  )
}
