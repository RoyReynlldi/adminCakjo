import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gzekkwbtrnzzlyssdiug.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6ZWtrd2J0cm56emx5c3NkaXVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU2NzM1OCwiZXhwIjoyMDY1MTQzMzU4fQ.8x98IlC_nrEDHgYGCucXGd84BgFy7bul0KycvRlpkMg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// For demo purposes, we'll use a mock client if no real Supabase credentials are provided
export const isUsingMockData = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;