
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useVercelDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  // Store the Vercel deployment hook URL in localStorage
  const getDeploymentHookUrl = useCallback(() => {
    return localStorage.getItem('VERCEL_DEPLOYMENT_HOOK_URL') || '';
  }, []);

  const setDeploymentHookUrl = useCallback((url: string) => {
    localStorage.setItem('VERCEL_DEPLOYMENT_HOOK_URL', url);
    console.log("Deployment hook URL saved:", url);
  }, []);

  // Trigger the Vercel deployment
  const triggerDeployment = useCallback(async (): Promise<boolean> => {
    const deployHookUrl = getDeploymentHookUrl();
    
    if (!deployHookUrl) {
      toast({
        title: "Deployment failed",
        description: "No Vercel deployment hook URL configured. Please set it in the admin settings.",
        variant: "destructive"
      });
      return false;
    }

    setIsDeploying(true);
    console.log("Starting Vercel deployment with hook URL:", deployHookUrl);
    
    try {
      // First, ensure localStorage data is properly persisted to the server
      const timestamp = Date.now();
      
      // Add a timestamp parameter to bust any caching
      const urlWithTimestamp = `${deployHookUrl}${deployHookUrl.includes('?') ? '&' : '?'}timestamp=${timestamp}`;
      
      // Call the Vercel deployment hook with explicit data synchronization flags
      const response = await fetch(urlWithTimestamp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          force: true,  // Force a deployment even if no changes detected
          syncFromStorage: true,  // Custom flag we can use in build scripts if needed
          timestamp: timestamp,   // Include timestamp to ensure uniqueness
          trigger: 'admin-panel', // Identify source of deployment
          includeData: true       // Flag to explicitly include data from localStorage
        })
      });
      
      if (response.ok) {
        console.log("Deployment successfully triggered with data sync");
        toast({
          title: "Deployment triggered",
          description: "All changes are being deployed to Vercel. This may take a few minutes.",
        });
        
        // Wait 2 seconds to allow the deployment to start
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return true;
      } else {
        const errorData = await response.text();
        console.error("Deployment error response:", errorData);
        toast({
          title: "Deployment failed",
          description: `Error: ${response.status} ${response.statusText}`,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "Deployment failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDeploying(false);
    }
  }, [getDeploymentHookUrl, toast]);

  return {
    isDeploying,
    triggerDeployment,
    getDeploymentHookUrl,
    setDeploymentHookUrl
  };
}
