
import { useShopContext } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Save, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface DeploymentActionsProps {
  triggerDeployment: () => Promise<boolean>;
  isDeploying: boolean;
}

const DeploymentActions = ({
  triggerDeployment,
  isDeploying
}: DeploymentActionsProps) => {
  const [lastDeployTime, setLastDeployTime] = useState<string | null>(
    localStorage.getItem('LAST_DEPLOYMENT_TIME')
  );
  const [pendingChanges, setPendingChanges] = useState(
    localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING') === 'true'
  );
  const { toast } = useToast();
  
  // Keep track of pending changes
  useEffect(() => {
    const checkPendingChanges = () => {
      const hasPending = localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING') === 'true';
      setPendingChanges(hasPending);
    };
    
    // Check immediately
    checkPendingChanges();
    
    // Also check when storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ROCKETRY_SHOP_CHANGES_PENDING') {
        checkPendingChanges();
      } else if (e.key === 'LAST_DEPLOYMENT_TIME') {
        setLastDeployTime(localStorage.getItem('LAST_DEPLOYMENT_TIME'));
      }
    };
    
    // Set up an interval to regularly check for pending changes
    const interval = setInterval(checkPendingChanges, 2000);
    
    window.addEventListener('storage', handleStorage);
    
    // Listen for custom event indicating deployment success
    const handleDeploymentSuccess = (e: CustomEvent) => {
      if (e.detail && e.detail.timestamp) {
        setLastDeployTime(e.detail.timestamp);
        setPendingChanges(false);
      }
    };
    
    window.addEventListener('deployment-success', handleDeploymentSuccess as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('deployment-success', handleDeploymentSuccess as EventListener);
    };
  }, []);
  
  const formatDeployTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch (e) {
      return 'Unknown';
    }
  };
  
  const handleDeploy = async () => {
    try {
      console.log("Starting deployment process...");
      const success = await triggerDeployment();
      
      if (success) {
        const newTime = new Date().toISOString();
        localStorage.setItem('LAST_DEPLOYMENT_TIME', newTime);
        setLastDeployTime(newTime);
        
        // Clear the pending changes flag
        localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'false');
        setPendingChanges(false);
        
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new CustomEvent('deployment-success', {
          detail: { timestamp: newTime }
        }));
        
        toast({
          title: "Database sync successful",
          description: "All changes have been saved to the database and will be visible to all users"
        });
      } else {
        toast({
          title: "Database sync failed",
          description: "There was a problem syncing your changes to the database",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during deployment:", error);
      toast({
        title: "Database sync error",
        description: "An unexpected error occurred during synchronization",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Button
            onClick={handleDeploy}
            disabled={isDeploying || (!pendingChanges && lastDeployTime !== null)}
            className="w-full sm:w-auto"
          >
            {isDeploying ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes to Database
              </>
            )}
          </Button>
          
          {!pendingChanges && lastDeployTime && (
            <p className="text-xs text-gray-500 mt-2">
              Last saved: {formatDeployTime(lastDeployTime)}
            </p>
          )}
        </div>
        
        {pendingChanges && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-md text-sm flex items-center">
            You have unsaved changes
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentActions;
