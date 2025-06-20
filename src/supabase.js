import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ppakjdgfzuvirtrjfnwg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYWtqZGdmenV2aXJ0cmpmbndnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM3NTU4MSwiZXhwIjoyMDY1OTUxNTgxfQ.WHYaa1g-Y-53Xn8PzPJkrmO4b3vw6nRtopfbvdJj0hM'
export const supabase = createClient(supabaseUrl, supabaseKey)