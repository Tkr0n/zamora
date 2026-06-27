'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminNavbar from '@/components/admin-navbar'
import CentrosTable from '@/components/centros-table'
import { PUNTOS_INTERES, PuntoInteres } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function CentrosPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCentros, setFilteredCentros] = useState<PuntoInteres[]>(PUNTOS_INTERES)
  const [selectedCentro, setSelectedCentro] = useState<PuntoInteres | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const filtered = PUNTOS_INTERES.filter(
      (centro) =>
        centro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        centro.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        centro.responsable.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCentros(filtered)
  }, [searchTerm])

  if (!isAuthenticated) {
    return null
  }

  const handleEdit = (centro: PuntoInteres) => {
    setSelectedCentro(centro)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este centro?')) {
      console.log('Eliminar centro:', id)
    }
  }

  const handleViewMap = (centro: PuntoInteres) => {
    router.push(`/admin/map?centro=${centro.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar currentPage="centros" />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Centros</h1>
            <p className="text-muted-foreground">Administra los centros de acopio activos</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 w-fit">
            <Plus className="w-4 h-4" />
            Nuevo Centro
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, ciudad o responsable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary text-foreground placeholder-muted-foreground border-border h-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total de Centros</p>
            <p className="text-2xl font-bold text-foreground">{PUNTOS_INTERES.length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Activos</p>
            <p className="text-2xl font-bold text-green-500">{PUNTOS_INTERES.filter((c) => c.estado_operativo === 'activo').length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Beneficiarios Totales</p>
            <p className="text-2xl font-bold text-foreground">{PUNTOS_INTERES.reduce((sum, c) => sum + c.beneficiarios, 0)}</p>
          </div>
        </div>

        {/* Table */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mostrando <strong>{filteredCentros.length}</strong> de <strong>{PUNTOS_INTERES.length}</strong> centros
          </p>
          <CentrosTable centros={filteredCentros} onEdit={handleEdit} onDelete={handleDelete} onViewMap={handleViewMap} />
        </div>

        {filteredCentros.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No se encontraron centros con ese término de búsqueda</p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Limpiar búsqueda
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
