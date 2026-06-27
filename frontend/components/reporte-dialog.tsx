'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { reportarZona } from '@/lib/api-client'
import { AlertTriangle, X } from 'lucide-react'

interface ReporteDialogProps {
  open: boolean
  onClose: () => void
  onReported: () => void
  latitud?: number
  longitud?: number
}

export default function ReporteDialog({
  open,
  onClose,
  onReported,
  latitud: initialLat,
  longitud: initialLng,
}: ReporteDialogProps) {
  const [latitud, setLatitud] = useState(initialLat?.toString() ?? '')
  const [longitud, setLongitud] = useState(initialLng?.toString() ?? '')
  const [intensidad, setIntensidad] = useState('0.7')
  const [radioKm, setRadioKm] = useState('0.5')
  const [descripcion, setDescripcion] = useState('')
  const [reportadoPor, setReportadoPor] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await reportarZona({
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        intensidad: parseFloat(intensidad),
        radioKm: parseFloat(radioKm),
        descripcion,
        reportadoPor,
      })
      setSuccess(true)
      setTimeout(() => {
        onReported()
        onClose()
        setSuccess(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar reporte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold">Reportar Zona Afectada</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Ayuda a la comunidad reportando zonas que necesitan ayuda. Máximo 5 reportes por minuto.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Latitud</label>
              <Input required type="number" step="0.0001" value={latitud} onChange={(e) => setLatitud(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Longitud</label>
              <Input required type="number" step="0.0001" value={longitud} onChange={(e) => setLongitud(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Intensidad (0-1)</label>
              <Input required type="number" step="0.1" min="0" max="1" value={intensidad} onChange={(e) => setIntensidad(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Radio (km)</label>
              <Input required type="number" step="0.1" min="0.1" value={radioKm} onChange={(e) => setRadioKm(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <Input required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Falta agua y alimentos" />
          </div>
          <div>
            <label className="text-sm font-medium">Tu nombre</label>
            <Input required value={reportadoPor} onChange={(e) => setReportadoPor(e.target.value)} placeholder="Nombre o comunidad" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">¡Reporte enviado! Gracias por ayudar.</p>}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading || success} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              {loading ? 'Enviando...' : 'Enviar Reporte'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
