
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
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  
  const checkDbConnection = async () => {
    try {
      setIsChecking(true);
      setIsDbConnected(null); 
      setDbError(null);
      
      // Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        const missing = [];
        if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
        if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
        
        const error = `Missing environment variable(s): ${missing.join(', ')}`;
        console.error(error);
        
        setIsDbConnected(false);
        setDbError(error);
        setIsChecking(false);
        return;
      }
      
      // Validate URL format
      if (!supabaseUrl.startsWith('https://')) {
        const error = `Invalid Supabase URL format: ${supabaseUrl}. URL must start with https://`;
        console.error(error);
        setIsDbConnected(false);
        setDbError(error);
        setIsChecking(false);
        return;
      }
      
      // Try to get a client
      const client = getSupabaseClient();
      if (!client) {
        const error = "Failed to create Supabase client. Check console for details.";
        console.error(error);
        setIsDbConnected(false);
        setDbError(error);
        setIsChecking(false);
        return;
      }
      
      // Test connection with a simple query
      console.log("Testing database connection...");
      try {
        const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });
        
        if (error) {
          console.error("Database connection test failed:", error);
          setIsDbConnected(false);
          setDbError(`Database connection error: ${error.message}`);
        } else {
          console.log("Database connection test successful");
          setIsDbConnected(true);
          setDbError(null);
        }
      } catch (pingError) {
        console.error("Database connection test exception:", pingError);
        setIsDbConnected(false);
        setDbError(`Connection test failed: ${pingError instanceof Error ? pingError.message : String(pingError)}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Database check error:", errorMessage);
      setIsDbConnected(false);
      setDbError(`Database connection error: ${errorMessage}`);
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    checkDbConnection();
  }, []);
  
  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      // If database is not connected, try to reconnect first
      if (!isDbConnected) {
        await checkDbConnection();
        if (!isDbConnected) {
          toast({
            title: "Database not connected",
            description: "Will try using local data only. Check your database configuration.",
            variant: "warning"
          });
        }
      }
      
      // Attempt to sync data anyway - it will use local fallbacks if needed
      const success = await reloadAllAdminData(false);
      
      if (success) {
        toast({
          title: "Data synchronized",
          description: "All changes have been synchronized successfully"
        });
      } else {
        toast({
          title: "Sync completed with issues",
          description: "Used local data only. Database operations may have failed.",
          variant: "warning"
        });
      }
      
      // Notify parent component about sync completion
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error("Error syncing data:", error);
      toast({
        title: "Sync failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {isDbConnected === false && dbError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Connection Error</AlertTitle>
          <AlertDescription>
            {dbError}
            <div className="mt-2 text-sm">
              Make sure your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are set correctly.
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleSyncData}
          disabled={isSyncing || isChecking}
          className="w-full sm:w-auto"
        >
          {isSyncing ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : isChecking ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              {isDbConnected === true ? "Sync Data" : "Sync Local Data"}
            </>
          )}
        </Button>
        
        {isDbConnected === false && (
          <Button
            variant="outline"
            onClick={checkDbConnection}
            disabled={isChecking}
            size="icon"
            title="Retry connection"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataSyncButton;
