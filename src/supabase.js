import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ppakjdgfzuvirtrjfnwg.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYWtqZGdmenV2aXJ0cmpmbndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzU1ODEsImV4cCI6MjA2NTk1MTU4MX0.78nE19a-Hxtae6GAsl5I_WW6XIl8y-NvU3jfQK7nHe0';

export const supabase = createClient(supabaseUrl, supabaseKey);
