'use client'

import Link from 'next/link'
import LoginForm from '@/components/login-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-8">
          <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
        </Link>
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
