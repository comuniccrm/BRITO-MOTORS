import { createClient } from '@supabase/supabase-js';

// Hardcoded for absolute reliability as requested by user
const supabaseUrl = 'https://dnelmpusdnqnearaeykg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZWxtcHVzZG5xbmVhcmFleWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4ODE3ODUsImV4cCI6MjA4OTQ1Nzc4NX0.ME0FHijV2CWlERyMZs5DTULaKwGuQiLCw_8Y0mRQOpI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
