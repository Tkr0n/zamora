'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  userEmail: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('auth_user')
    if (stored) {
      setUserEmail(stored)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication - in Phase 2, this will connect to Supabase
    if (email && password.length >= 6) {
      localStorage.setItem('auth_user', email)
      setUserEmail(email)
      setIsAuthenticated(true)
    } else {
      throw new Error('Email o contraseña inválidos')
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    setUserEmail(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
