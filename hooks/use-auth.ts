"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { auth, type AuthUser } from "@/lib/auth"
import { isSupabaseConfigured } from "@/lib/supabase"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signOut: () => Promise<any>
  resetPassword: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn("Supabase is not configured. Using mock authentication.")
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      const session = await auth.getSession()
      if (session?.user) {
        const currentUser = await auth.getCurrentUser()
        setUser(currentUser)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const currentUser = await auth.getCurrentUser()
        setUser(currentUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await auth.signIn(email, password)
    return result
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const result = await auth.signUp(email, password, fullName)
    return result
  }

  const signOut = async () => {
    const result = await auth.signOut()
    if (!result.error) {
      setUser(null)
    }
    return result
  }

  const resetPassword = async (email: string) => {
    const result = await auth.resetPassword(email)
    return result
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
