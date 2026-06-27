'use client'

import { useState, Fragment } from 'react'
import { PuntoInteres, POI_LABELS, INSUMOS_POR_CENTRO, Insumo, prioridadColores, prioridadNombres, categoriaNombres } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, MapPin, Phone, ChevronDown, AlertCircle } from 'lucide-react'

interface CentrosTableProps {
  centros: PuntoInteres[]
  onEdit?: (centro: PuntoInteres) => void
  onDelete?: (id: string) => void
  onViewMap?: (centro: PuntoInteres) => void
  readOnly?: boolean
}

const PRIORIDAD_ORDER: Record<string, number> = { critica: 0, alta: 1, media: 2, baja: 3 }

export default function CentrosTable({ centros, onEdit, onDelete, onViewMap, readOnly = false }: CentrosTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getStatusColor = (estado: string) => {
    if (estado === 'activo') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (estado === 'parcial') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const getCapacityPercentage = (recibidas: number, capacidad: number) => {
    if (capacidad === 0) return 0
    return Math.round((recibidas / capacidad) * 100)
  }

  const getSortedInsumos = (id: string): Insumo[] => {
    const insumos = INSUMOS_POR_CENTRO[id] || []
    return [...insumos].sort((a, b) => PRIORIDAD_ORDER[a.prioridad] - PRIORIDAD_ORDER[b.prioridad])
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead className="bg-primary/5 border-b border-border">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground w-10"></th>
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
          {centros.map((centro) => {
            const isExpanded = expandedId === centro.id
            const insumos = getSortedInsumos(centro.id)
            const tieneCriticos = insumos.some((i) => i.prioridad === 'critica')
            const colCount = readOnly ? 7 : 8

            return (
              <Fragment key={centro.id}>
                <tr key={centro.id} className={`hover:bg-secondary/50 transition-colors ${isExpanded ? 'bg-secondary/30' : ''}`}>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : centro.id)}
                      className="p-1 hover:bg-secondary rounded transition-transform"
                      title="Ver insumos"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : centro.id)}
                      className="text-left hover:underline"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{centro.nombre}</p>
                        <p className="text-sm text-muted-foreground">{centro.ciudad}, {centro.municipio}</p>
                      </div>
                    </button>
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
                          onClick={(e) => { e.stopPropagation(); onViewMap?.(centro) }}
                          className="hover:bg-secondary"
                          title="Ver en mapa"
                        >
                          <MapPin className="w-4 h-4 text-accent" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); onEdit?.(centro) }}
                          className="hover:bg-secondary"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); onDelete?.(centro.id) }}
                          className="hover:bg-secondary"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
                {isExpanded && (
                  <tr key={`${centro.id}-insumos`}>
                    <td colSpan={colCount} className="px-0 py-0 bg-secondary/20">
                      {insumos.length === 0 ? (
                        <div className="px-12 py-6 text-center text-sm text-muted-foreground">
                          No hay insumos registrados para este punto.
                        </div>
                      ) : (
                        <div className="px-12 py-4">
                          {tieneCriticos && (
                            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded text-xs font-semibold text-red-700 dark:text-red-300">
                              <AlertCircle className="w-4 h-4" />
                              Necesidades críticas
                            </div>
                          )}
                          <div className="space-y-2">
                            {insumos.map((insumo) => {
                              const porcentaje = insumo.cantidad_necesaria === 0 ? 0 : Math.round((insumo.cantidad_disponible / insumo.cantidad_necesaria) * 100)
                              const esCritico = porcentaje < 50
                              return (
                                <div key={insumo.id} className="flex items-center gap-4 p-2 rounded hover:bg-secondary/50">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{insumo.nombre}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {insumo.cantidad_disponible} / {insumo.cantidad_necesaria} {insumo.unidad}
                                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-muted">{categoriaNombres[insumo.categoria]}</span>
                                    </p>
                                  </div>
                                  <div className="w-28 h-2 bg-muted rounded-full overflow-hidden flex-shrink-0">
                                    <div
                                      className={`h-full transition-all ${porcentaje >= 75 ? 'bg-green-500' : porcentaje >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                      style={{ width: `${Math.min(porcentaje, 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground w-10 text-right flex-shrink-0">{porcentaje}%</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 ${prioridadColores[insumo.prioridad]} text-white`}>
                                    {prioridadNombres[insumo.prioridad]}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
