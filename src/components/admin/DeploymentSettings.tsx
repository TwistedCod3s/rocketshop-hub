
import { useState, useEffect } from "react";
import { useShopContext } from "@/context/ShopContext";
import DeploymentStatusAlert from "./deployment/DeploymentStatusAlert";
import DeploymentUrlInput from "./deployment/DeploymentUrlInput";
import AutoDeployToggle from "./deployment/AutoDeployToggle";
import DeploymentActions from "./deployment/DeploymentActions";
import DeploymentInfo from "./deployment/DeploymentInfo";
import DataSyncButton from "./deployment/DataSyncButton";
import { useDeploymentHandler } from "./deployment/useDeploymentHandler";
import { useToast } from "@/hooks/use-toast";

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
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const { toast } = useToast();
  
  // Set up the deployment handler
  const { handleDeploy } = useDeploymentHandler({
    triggerDeployment,
    reloadAllAdminData,
    setHasPendingChanges
  });
  
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
  
  const handleSyncComplete = () => {
    const pendingChanges = localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING');
    setHasPendingChanges(pendingChanges === 'true');
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
          <DataSyncButton 
            reloadAllAdminData={reloadAllAdminData}
            onSyncComplete={handleSyncComplete}
          />
          
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
