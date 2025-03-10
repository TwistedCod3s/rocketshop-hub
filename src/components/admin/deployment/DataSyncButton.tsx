
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Database, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSupabaseClient } from "@/lib/supabase";

interface DataSyncButtonProps {
  reloadAllAdminData: (autoDeployAfterSync?: boolean) => Promise<boolean>;
  onSyncComplete?: () => void;
}

const DataSyncButton = ({ 
  reloadAllAdminData,
  onSyncComplete
}: DataSyncButtonProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const checkDbConnection = async () => {
    try {
      setIsDbConnected(null); 
      setDbError(null);
      
      // Log complete environment variable values for debugging
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log("Checking Supabase connection with URL:", supabaseUrl);
      if (supabaseAnonKey) {
        console.log("Anon Key length:", supabaseAnonKey.length);
        console.log("Anon Key starts with:", supabaseAnonKey.substring(0, 4) + "...");
      } else {
        console.log("Anon Key is undefined or empty");
      }
      
      // Validate URL format
      const isValidUrl = (url: string) => {
        try {
          return url.startsWith('https://') && new URL(url).hostname.length > 0;
        } catch (e) {
          return false;
        }
      };
      
      // Check if credentials are valid
      if (!supabaseUrl || !supabaseAnonKey) {
        const error = `Missing Supabase credentials. URL: ${supabaseUrl ? "✓" : "✗"}, Key: ${supabaseAnonKey ? "✓" : "✗"}`;
        console.error(error);
        setIsDbConnected(false);
        setDbError(error);
        return;
      }
      
      if (!isValidUrl(supabaseUrl)) {
        const error = `Invalid Supabase URL format: ${supabaseUrl}. URL must start with https://`;
        console.error(error);
        setIsDbConnected(false);
        setDbError(error);
        return;
      }
      
      // Try to get a client
      const client = getSupabaseClient();
      if (!client) {
        const error = "Failed to create Supabase client. Check console for details.";
        console.error(error);
        setIsDbConnected(false);
        setDbError(error);
        return;
      }
      
      console.log("Attempting database ping...");
      try {
        const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });
        
        if (error) {
          console.error("Database ping error:", error);
          setIsDbConnected(false);
          setDbError(`Database connection error: ${error.message}`);
        } else {
          console.log("Database ping successful:", data);
          setIsDbConnected(true);
          setDbError(null);
        }
      } catch (pingError) {
        console.error("Database ping exception:", pingError);
        setIsDbConnected(false);
        setDbError(`Database ping exception: ${pingError instanceof Error ? pingError.message : String(pingError)}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Database check error:", errorMessage, error);
      setIsDbConnected(false);
      setDbError(`Database connection error: ${errorMessage}`);
    }
  };
  
  useEffect(() => {
    checkDbConnection();
  }, []);
  
  const handleSyncData = async () => {
    if (!isDbConnected) {
      toast({
        title: "Database not connected",
        description: dbError || "Please check your database configuration",
        variant: "destructive"
      });
      return;
    }
    
    setIsSyncing(true);
    try {
      await reloadAllAdminData(false);
      toast({
        title: "Data synchronized",
        description: "All changes have been synchronized across all users"
      });
      
      // Check if there are still pending changes
      setTimeout(() => {
        const pendingChanges = localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING');
        if (onSyncComplete) {
          onSyncComplete();
        }
      }, 1000);
    } catch (error) {
      console.error("Error syncing data:", error);
      toast({
        title: "Sync failed",
        description: "There was a problem synchronizing your data",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  if (isDbConnected === false) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Connection Error</AlertTitle>
          <AlertDescription>
            {dbError || "Database connection error. Please check your configuration."}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={checkDbConnection}
          className="w-full sm:w-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }
  
  return (
    <Button
      variant="outline"
      onClick={handleSyncData}
      disabled={isSyncing || isDbConnected === null}
      className="w-full sm:w-auto"
    >
      {isSyncing ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : isDbConnected === null ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Checking database...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" />
          Sync Changes
        </>
      )}
    </Button>
  );
};

export default DataSyncButton;
