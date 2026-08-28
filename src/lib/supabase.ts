import { createClient } from '@supabase/supabase-js'
import { environment } from './environment'

export const supabase = environment.supabaseConfigured
  ? createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
