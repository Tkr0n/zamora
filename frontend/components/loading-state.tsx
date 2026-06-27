interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Cargando datos...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
      <p className="text-destructive font-medium">{message}</p>
      <p className="text-sm text-muted-foreground">Verifica que la API esté en ejecución.</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm text-accent hover:underline">
          Reintentar
        </button>
      )}
    </div>
  )
}
