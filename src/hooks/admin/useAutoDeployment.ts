
import { useState, useCallback, useEffect } from "react";
import { useToast } from "../use-toast";

export function useAutoDeployment(
  reloadAllAdminData: (triggerDeploy?: boolean) => Promise<boolean>
) {
  const { toast } = useToast();
  const [autoDeployEnabled, setAutoDeployEnabled] = useState<boolean>(
    localStorage.getItem('AUTO_DEPLOY_ENABLED') === 'true'
  );

  // Function to toggle auto-deployment
  const toggleAutoDeploy = useCallback((enabled: boolean) => {
    setAutoDeployEnabled(enabled);
    localStorage.setItem('AUTO_DEPLOY_ENABLED', enabled.toString());
    console.log(`Auto-deploy ${enabled ? 'enabled' : 'disabled'}`);
    
    // If enabling and there are pending changes, trigger a deployment
    if (enabled && localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING') === 'true') {
      toast({
        title: "Pending changes detected",
        description: "Triggering deployment for previously made changes"
      });
      setTimeout(() => reloadAllAdminData(true), 1000);
    }
  }, [toast, reloadAllAdminData]);

  return {
    autoDeployEnabled,
    toggleAutoDeploy
  };
}
