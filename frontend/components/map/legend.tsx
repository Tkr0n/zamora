'use client'

import { POI_COLORS, POI_ICONS, POI_LABELS, TipoPuntoInteres } from '@/lib/mock-data'

const TIPOS: TipoPuntoInteres[] = [
  'centro_acopio',
  'centro_medico',
  'institucion',
  'albergue',
  'zona_segura',
  'punto_agua',
  'punto_distribucion',
]

export default function Legend() {
  return (
    <div className="absolute bottom-20 left-4 bg-card/95 backdrop-blur rounded-lg border border-border shadow-lg p-3 z-30 max-w-[200px]">
      <p className="text-xs font-semibold text-foreground mb-2">Leyenda</p>
      <div className="space-y-1.5">
        {TIPOS.map((tipo) => (
          <div key={tipo} className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] flex-shrink-0"
              style={{ backgroundColor: POI_COLORS[tipo] }}
            >
              {POI_ICONS[tipo]}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">{POI_LABELS[tipo]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
