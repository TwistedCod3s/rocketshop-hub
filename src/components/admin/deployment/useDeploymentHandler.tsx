
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseDeploymentHandlerProps {
  triggerDeployment: () => Promise<boolean>;
  reloadAllAdminData: (autoDeployAfterSync?: boolean) => Promise<boolean>;
  setHasPendingChanges: (value: boolean) => void;
}

export const useDeploymentHandler = ({
  triggerDeployment,
  reloadAllAdminData,
  setHasPendingChanges
}: UseDeploymentHandlerProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastDeploymentTime, setLastDeploymentTime] = useState<string | null>(
    localStorage.getItem('LAST_DEPLOYMENT_TIME')
  );
  const { toast } = useToast();
  
  const handleDeploy = async (): Promise<boolean> => {
    // First, ensure all data is properly synchronized
    try {
      setIsSyncing(true);
      await reloadAllAdminData(false); // Sync without auto-deploying
      setIsSyncing(false);
      
      // Now deploy
      if (triggerDeployment) {
        const success = await triggerDeployment();
        if (success) {
          // Set last deployment time
          const now = new Date().toISOString();
          localStorage.setItem('LAST_DEPLOYMENT_TIME', now);
          setLastDeploymentTime(now);
          
          toast({
            title: "Deployment successful",
            description: "Your changes are being deployed and will be visible to all users shortly"
          });
          
          // Clear pending changes flag
          localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'false');
          setHasPendingChanges(false);
          
          return true;
        } else {
          toast({
            title: "Deployment error",
            description: "There was a problem starting the deployment",
            variant: "destructive"
          });
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error("Error during deployment:", error);
      toast({
        title: "Deployment error",
        description: "Failed to sync data before deployment",
        variant: "destructive"
      });
      setIsSyncing(false);
      return false;
    }
  };

  return {
    isSyncing,
    lastDeploymentTime,
    handleDeploy
  };
};
