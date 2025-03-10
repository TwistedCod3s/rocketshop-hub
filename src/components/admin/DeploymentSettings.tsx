
import { useState, useEffect } from "react";
import { useShopContext } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UploadCloud, Link, RefreshCw, Save } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [autoDeploy, setAutoDeploy] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (getDeploymentHookUrl) {
      setDeployUrl(getDeploymentHookUrl());
    }
  }, [getDeploymentHookUrl]);
  
  useEffect(() => {
    if (autoDeployEnabled !== undefined) {
      setAutoDeploy(autoDeployEnabled);
    }
  }, [autoDeployEnabled]);
  
  const handleSaveUrl = () => {
    if (setDeploymentHookUrl) {
      setDeploymentHookUrl(deployUrl);
      setIsEditing(false);
      toast({
        title: "Deployment URL saved",
        description: "Your Vercel deployment webhook URL has been saved"
      });
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
  
  const handleDeploy = async () => {
    // First, ensure all data is properly synchronized
    try {
      setIsSyncing(true);
      await reloadAllAdminData(false); // Sync without auto-deploying
      setIsSyncing(false);
      
      // Now deploy
      if (triggerDeployment) {
        const success = await triggerDeployment();
        if (!success) {
          toast({
            title: "Deployment error",
            description: "There was a problem starting the deployment",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error during deployment:", error);
      toast({
        title: "Deployment error",
        description: "Failed to sync data before deployment",
        variant: "destructive"
      });
      setIsSyncing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-6">Deployment Settings</h3>
      
      <div className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="deployment-url">Vercel Deployment Webhook URL</Label>
          <div className="flex gap-2">
            <Input
              id="deployment-url"
              type="url"
              value={deployUrl}
              onChange={(e) => setDeployUrl(e.target.value)}
              disabled={!isEditing}
              placeholder="https://api.vercel.com/v1/integrations/deploy/..."
            />
            {isEditing ? (
              <Button onClick={handleSaveUrl}>Save</Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            <Link className="h-3 w-3 inline-block mr-1" />
            <a 
              href="https://vercel.com/docs/git/deploy-hooks" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Learn how to create a Vercel deploy hook
            </a>
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-deploy"
            checked={autoDeploy}
            onCheckedChange={handleToggleAutoDeploy}
          />
          <Label htmlFor="auto-deploy">Auto-deploy when content changes</Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            onClick={handleSyncData} 
            disabled={isSyncing}
            variant="outline"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing Data...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Sync Data Only
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleDeploy} 
            disabled={isDeploying || isSyncing || !deployUrl}
            variant="default"
          >
            {isDeploying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Deploy Now
              </>
            )}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
          <p><strong>Important:</strong> To ensure your changes are visible to all users:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>First sync your data to update all users</li>
            <li>Then deploy to Vercel to update the live site</li> 
            <li>Or enable auto-deploy to handle this automatically</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DeploymentSettings;
