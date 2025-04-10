
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseClient, resetSupabaseClient } from "@/lib/supabase";
import { updateSyncTimestamp } from "@/utils/schemaUtils";

export function useDatabaseConnection() {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Load current values from localStorage
  useEffect(() => {
    const storedUrl = localStorage.getItem('ROCKETRY_DB_URL');
    const storedKey = localStorage.getItem('ROCKETRY_DB_KEY');
    
    setSupabaseUrl(storedUrl || "");
    setSupabaseKey(storedKey || "");
    
    // If we have values, test the connection
    if (storedUrl && storedKey) {
      testConnection();
    }
  }, []);
  
  const testConnection = async () => {
    setIsTesting(true);
    setErrorMessage(null);
    
    try {
      // Basic validation
      if (!supabaseUrl || !supabaseKey) {
        setErrorMessage("Both URL and API Key are required");
        setConnectionStatus('error');
        setIsTesting(false);
        return;
      }
      
      if (!supabaseUrl.startsWith('https://')) {
        setErrorMessage("Supabase URL must start with https://");
        setConnectionStatus('error');
        setIsTesting(false);
        return;
      }
      
      // Store values in localStorage for persistence
      localStorage.setItem('ROCKETRY_DB_URL', supabaseUrl);
      localStorage.setItem('ROCKETRY_DB_KEY', supabaseKey);
      
      // Reset any existing client instance - CRUCIAL to prevent multiple instances
      resetSupabaseClient();
      
      console.log("Testing connection with URL:", supabaseUrl.substring(0, 15) + "...");
      
      // Add a small delay to ensure any previous connections are closed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Test connection directly with a simple query
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Failed to create Supabase client");
      }
      
      // Simple check to see if we can connect at all
      const { data, error } = await client
        .from('products')
        .select('count', { count: 'exact', head: true })
        .limit(0);
      
      if (error) {
        console.error("Database connection test error:", error);
        throw error;
      }
      
      // Connection successful
      setConnectionStatus('success');
      
      // Update sync timestamp to force data refresh on next operation
      updateSyncTimestamp();
      
      // Set a flag to trigger synchronization after connection
      localStorage.setItem('ROCKETRY_SYNC_NEEDED', 'true');
      
      // Dispatch a sync event to notify all components
      window.dispatchEvent(new CustomEvent('rocketry-sync-trigger-v7', { 
        detail: { 
          timestamp: new Date().toISOString(),
          action: 'connection-established'
        } 
      }));
      
      toast({
        title: "Database connected",
        description: "Successfully connected to Supabase database"
      });
    } catch (error) {
      console.error("Connection test error:", error);
      setConnectionStatus('error');
      
      // Enhanced error handling for specific error codes
      if (error && typeof error === 'object' && 'code' in error) {
        const err = error as { code: string; message: string };
        
        if (err.code === '42P01') {
          setErrorMessage("Table 'products' does not exist. Please create the required tables in your Supabase project.");
        } else if (err.code === 'PGRST204') {
          setErrorMessage("Schema mismatch: The table structure doesn't match what the app expects. Check the required column names.");
        } else if (err.code === 'AuthApiError') {
          setErrorMessage("Authentication error: Invalid API key or URL.");
        } else if (err.code === 'AuthRetryableFetchError' || err.message?.includes('fetch')) {
          setErrorMessage("Network error: Could not reach the Supabase server. Check your URL and internet connection.");
        } else if (err.message?.includes('404')) {
          setErrorMessage("404 Not Found: The Supabase URL is invalid or the service endpoint doesn't exist.");
        } else {
          setErrorMessage(err.message || "Unknown error occurred");
        }
      } else {
        setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      }
    } finally {
      setIsTesting(false);
    }
  };

  return {
    supabaseUrl,
    setSupabaseUrl,
    supabaseKey,
    setSupabaseKey,
    isTesting,
    connectionStatus,
    errorMessage,
    testConnection
  };
}
