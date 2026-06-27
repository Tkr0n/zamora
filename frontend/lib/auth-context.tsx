'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { login as apiLogin, ApiError } from './api-client'

interface AuthContextType {
  isAuthenticated: boolean
  userEmail: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const email = localStorage.getItem('auth_user')
    if (token && email) {
      setUserEmail(email)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await apiLogin(email, password)
      localStorage.setItem('auth_token', res.token)
      localStorage.setItem('auth_user', res.email)
      setUserEmail(res.email)
      setIsAuthenticated(true)
    } catch (err) {
      if (err instanceof ApiError) throw new Error(err.message)
      throw new Error('Error al iniciar sesión')
    }
  }

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUserEmail(null)
    setIsAuthenticated(false)
  }, [])

  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout, getToken }}>
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

export function useRequireAuth(redirectTo = '/login') {
  const auth = useAuth()
  useEffect(() => {
    if (!auth.isAuthenticated && typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
  }, [auth.isAuthenticated, redirectTo])
  return auth
}
