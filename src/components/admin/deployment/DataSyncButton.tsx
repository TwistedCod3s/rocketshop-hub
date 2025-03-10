
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Database, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  
  // Check database connection on mount
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        // Check if Supabase URL is configured - first by trying to get a client
        const client = getSupabaseClient();
        if (!client) {
          setIsDbConnected(false);
          setDbError("Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
          return;
        }
        
        // Try to ping the database
        const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });
        
        if (error) {
          setIsDbConnected(false);
          setDbError(`Database connection error: ${error.message}`);
          console.error("Database connection error:", error);
        } else {
          setIsDbConnected(true);
          setDbError(null);
          console.log("Successfully connected to Supabase database");
        }
      } catch (error) {
        setIsDbConnected(false);
        setDbError(`Database connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error("Database check error:", error);
      }
    };
    
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
          <AlertDescription>
            {dbError || "Database connection error. Please check your configuration."}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto"
        >
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
