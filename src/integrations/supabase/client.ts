// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rxhtscpueyqphcgxcmba.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4aHRzY3B1ZXlxcGhjZ3hjbWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MTY0MjYsImV4cCI6MjA1NTM5MjQyNn0.iWVyoKvMjB-cWOirUhpnYzMQ8LAv7Ejwx1ZnZ2_Hy1Y";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);