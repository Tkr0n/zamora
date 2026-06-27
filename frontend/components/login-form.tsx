'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Mail } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">FuerzaCivil</h1>
        <p className="text-muted-foreground">Gestión de Centros de Acopio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-accent" />
            Correo Electrónico
          </label>
          <Input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="bg-secondary text-foreground placeholder-muted-foreground border-border"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            Contraseña
          </label>
          <Input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
            className="bg-secondary text-foreground placeholder-muted-foreground border-border"
          />
        </div>

        {error && <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">{error}</div>}

        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-base">
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        <div className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Demo: usa cualquier correo y contraseña (min 6 caracteres)
          </p>
        </div>
      </form>
    </div>
  )
}
