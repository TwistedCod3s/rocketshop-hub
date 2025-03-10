
import { createClient } from '@supabase/supabase-js';

// Create a global variable to store the client instance
let supabaseClientInstance: any = null;

// Initialize Supabase client
export const getSupabaseClient = () => {
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }

  // Get credentials from localStorage first (more reliable)
  const supabaseUrl = localStorage.getItem('ROCKETRY_DB_URL') || import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = localStorage.getItem('ROCKETRY_DB_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key missing. Check localStorage or environment variables.");
    return null;
  }

  try {
    console.log("Initializing Supabase client with URL:", supabaseUrl.substring(0, 15) + "...");
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClientInstance;
  } catch (e) {
    console.error("Error initializing Supabase client:", e);
    return null;
  }
};

// Reset client instance (useful when updating URL/key)
export const resetSupabaseClient = () => {
  console.log("Resetting Supabase client instance");
  supabaseClientInstance = null;
};
