import { useState, useEffect } from "react";
import { useShopContext } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import DeploymentStatusAlert from "./deployment/DeploymentStatusAlert";
import DeploymentUrlInput from "./deployment/DeploymentUrlInput";
import AutoDeployToggle from "./deployment/AutoDeployToggle";
import DeploymentActions from "./deployment/DeploymentActions";
import DeploymentInfo from "./deployment/DeploymentInfo";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const DeploymentSettings = () => {
  const { 
    isDeploying, 
    triggerDeployment, 
    getDeploymentHookUrl, 
    setDeploymentHookUrl,
    autoDeployEnabled,
    toggleAutoDeploy,
    reloadAllAdminData
  } = useShopContext();
  
  const [deployUrl, setDeployUrl] = useState("");
  const [autoDeploy, setAutoDeploy] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [lastDeploymentTime, setLastDeploymentTime] = useState<string | null>(
    localStorage.getItem('LAST_DEPLOYMENT_TIME')
  );
  const { toast } = useToast();
  
  useEffect(() => {
    if (getDeploymentHookUrl) {
      setDeployUrl(getDeploymentHookUrl());
    }
    
    // Check for pending changes
    const pendingChanges = localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING');
    setHasPendingChanges(pendingChanges === 'true');
    
    // Set up a listener to check for pending changes
    const checkInterval = setInterval(() => {
      const pendingChanges = localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING');
      setHasPendingChanges(pendingChanges === 'true');
    }, 5000);
    
    return () => clearInterval(checkInterval);
  }, [getDeploymentHookUrl]);
  
  useEffect(() => {
    if (autoDeployEnabled !== undefined) {
      setAutoDeploy(autoDeployEnabled);
    }
  }, [autoDeployEnabled]);
  
  const handleSaveUrl = () => {
    if (setDeploymentHookUrl) {
      setDeploymentHookUrl(deployUrl);
      
      // If there are pending changes and auto-deploy is enabled, trigger a deployment
      if (hasPendingChanges && autoDeploy) {
        toast({
          title: "Pending changes detected",
          description: "Triggering deployment with new webhook URL"
        });
        setTimeout(() => handleDeploy(), 1000);
      }
    }
  };
  
  const handleToggleAutoDeploy = (checked: boolean) => {
    setAutoDeploy(checked);
    if (toggleAutoDeploy) {
      toggleAutoDeploy(checked);
      toast({
        title: checked ? "Auto-deploy enabled" : "Auto-deploy disabled",
        description: checked 
          ? "Changes will automatically trigger a deployment" 
          : "Changes will need to be manually deployed"
      });
      
      // If enabling auto-deploy and there are pending changes, trigger deployment
      if (checked && hasPendingChanges && deployUrl) {
        toast({
          title: "Pending changes detected",
          description: "Triggering deployment for previously made changes"
        });
        setTimeout(() => handleDeploy(), 1000);
      }
    }
  };
  
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
        setHasPendingChanges(pendingChanges === 'true');
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
  
  const formatLastDeploymentTime = () => {
    if (!lastDeploymentTime) return "Never deployed";
    
    try {
      const date = new Date(lastDeploymentTime);
      return date.toLocaleString();
    } catch (e) {
      return "Unknown";
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-6">Deployment Settings</h3>
      
      <DeploymentStatusAlert deployHookUrl={deployUrl} />
      
      <div className="space-y-6 mt-6">
        <DeploymentUrlInput 
          deployUrl={deployUrl}
          setDeployUrl={setDeployUrl}
          onSave={handleSaveUrl}
        />
        
        <AutoDeployToggle 
          autoDeploy={autoDeploy}
          onToggle={handleToggleAutoDeploy}
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
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
          
          <DeploymentActions 
            triggerDeployment={handleDeploy}
            isDeploying={isDeploying}
          />
        </div>
        
        <DeploymentInfo />
      </div>
    </div>
  );
};

export default DeploymentSettings;
