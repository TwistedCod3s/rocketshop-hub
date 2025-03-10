
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Database, Save, Link, CheckCircle } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

const DatabaseSettings = () => {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load current values from environment
  useEffect(() => {
    // Try to get values from localStorage first (we store them there after initial setting)
    const storedUrl = localStorage.getItem('ROCKETRY_DB_URL');
    const storedKey = localStorage.getItem('ROCKETRY_DB_KEY');
    
    // If not in localStorage, try environment variables (only available in dev mode)
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    setSupabaseUrl(storedUrl || envUrl || "");
    setSupabaseKey(storedKey || envKey || "");
    
    // If we have values, test the connection
    if ((storedUrl || envUrl) && (storedKey || envKey)) {
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
      
      // Reset any existing client instance
      window.supabaseClientInstance = null;
      
      // Make sure environment variables are available for the current session
      if (import.meta.env) {
        import.meta.env.VITE_SUPABASE_URL = supabaseUrl;
        import.meta.env.VITE_SUPABASE_ANON_KEY = supabaseKey;
      }
      
      console.log("Testing connection with URL:", supabaseUrl.substring(0, 15) + "...");
      
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
      toast({
        title: "Database connected",
        description: "Successfully connected to Supabase database"
      });
      
      // Reload the page after a delay to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
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
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Database Configuration
        </CardTitle>
        <CardDescription>
          Configure your Supabase database connection for data persistence
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {connectionStatus === 'success' && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Connected</AlertTitle>
            <AlertDescription>
              Successfully connected to your Supabase database
            </AlertDescription>
          </Alert>
        )}
        
        {connectionStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>
              {errorMessage || "Failed to connect to database with the provided credentials"}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="supabase-url">Supabase URL</Label>
            <Input
              id="supabase-url"
              placeholder="https://your-project.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="supabase-key">Supabase Anon Key</Label>
            <Input
              id="supabase-key"
              type="password"
              placeholder="eyJhbGciOiJIUzI1N..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <Button
              onClick={testConnection}
              disabled={isTesting || !supabaseUrl || !supabaseKey}
            >
              {isTesting ? (
                <>Connecting...</>
              ) : connectionStatus === 'success' ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Connected
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open('https://app.supabase.com', '_blank')}
            >
              Go to Supabase Dashboard
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mt-4 border-t pt-4">
          <p className="mb-2"><strong>Need help?</strong></p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Create a Supabase account at <a href="https://supabase.com" target="_blank" className="text-blue-500 underline">supabase.com</a></li>
            <li>Create a new project</li>
            <li>Find your API credentials in Project Settings &gt; API</li>
            <li>Copy the URL and anon key into the fields above</li>
            <li>Make sure the necessary tables exist in your database</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseSettings;
