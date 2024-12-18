import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fsymfimuqnfpnkljsczl.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzeW1maW11cW5mcG5rbGpzY3psIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjA0MzcwMSwiZXhwIjoyMDQ3NjE5NzAxfQ.HS09LwonCcgmMR79OK02CIP3dod2jSWWhKlm2amtbNk'

// Initialize the Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  },
})
