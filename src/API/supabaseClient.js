import { createClient } from '@supabase/supabase-js';

// Use process.env.REACT_APP_... for Create React App
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Error checking to make sure the variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'Supabase URL or Anon Key is missing. Make sure to set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

