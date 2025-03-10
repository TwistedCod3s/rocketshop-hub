
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataSyncButtonProps {
  reloadAllAdminData: (autoDeployAfterSync?: boolean) => Promise<boolean>;
  onSyncComplete?: () => void;
}

const DataSyncButton = ({ 
  reloadAllAdminData,
  onSyncComplete
}: DataSyncButtonProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  
  const handleSyncData = async () => {
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
  
  return (
    <Button
      variant="outline"
      onClick={handleSyncData}
      disabled={isSyncing}
      className="w-full sm:w-auto"
    >
      {isSyncing ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : (
        <>Sync Changes</>
      )}
    </Button>
  );
};

export default DataSyncButton;
