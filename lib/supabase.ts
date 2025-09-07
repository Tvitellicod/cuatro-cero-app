import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client for development when env vars are not set
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: { message: "Supabase not configured" } }),
    signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured" } }),
    signOut: async () => ({ error: { message: "Supabase not configured" } }),
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    resetPasswordForEmail: async () => ({ data: null, error: { message: "Supabase not configured" } }),
    updateUser: async () => ({ data: null, error: { message: "Supabase not configured" } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        order: () => ({
          limit: async () => ({ data: [], error: null }),
        }),
      }),
      order: () => ({
        limit: async () => ({ data: [], error: null }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: { message: "Supabase not configured" } }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        }),
      }),
    }),
    delete: () => ({
      eq: async () => ({ error: { message: "Supabase not configured" } }),
    }),
  }),
})

// Export the client (real or mock)
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createMockClient()

// Server-side client
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return createMockClient()
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}
