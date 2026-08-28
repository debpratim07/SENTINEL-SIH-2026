const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

export const environment = {
  supabaseUrl,
  supabaseAnonKey,
  apiUrl: (import.meta.env.VITE_API_URL?.trim() || 'http://localhost:3001').replace(/\/$/, ''),
  supabaseConfigured:
    /^https:\/\//.test(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.startsWith('your-'),
  demoAuthEnabled: import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false',
  roleSimulationEnabled: import.meta.env.VITE_ENABLE_ROLE_SIMULATION !== 'false',
}
